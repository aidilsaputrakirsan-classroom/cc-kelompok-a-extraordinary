import logging

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from app.claims.schemas import ClaimCreate, ClaimStatusUpdate
from app.models.claim import Claim, ClaimStatusHistory
from app.models.audit import AuditLog
from app.notifications.schemas import NotificationCreate
from app.notifications.service import create_notification
from app.utils import httpx_client

logger = logging.getLogger(__name__)

def create_claim(db: Session, user_id: str, claim_in: ClaimCreate, jwt_token: str) -> Claim:
    # Mengambil detail item secara cross-service via HTTP
    item = httpx_client.get_item(claim_in.item_id, jwt_token)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    if item.get("type") != 'found':
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only 'found' items can be claimed")

    if item.get("status") in ["returned", "closed"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Item is already returned or closed")

    if item.get("created_by") == user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot claim an item you posted")

    active_statuses = ['pending', 'approved', 'completed']
    existing_claim = db.query(Claim).filter(
        Claim.item_id == claim_in.item_id,
        Claim.status.in_(active_statuses)
    ).first()

    if existing_claim:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This item already has an active claim")

    new_claim = Claim(
        item_id=claim_in.item_id,
        user_id=user_id,
        status="pending",
        ownership_answer=claim_in.ownership_answer
    )
    db.add(new_claim)
    db.flush()

    history = ClaimStatusHistory(
        claim_id=new_claim.id,
        status="pending",
        changed_by=user_id
    )
    db.add(history)
    db.commit()
    db.refresh(new_claim)

    item_created_by = item.get("created_by")
    if item_created_by and item_created_by != user_id:
        create_notification(
            db,
            NotificationCreate(
                user_id=item_created_by,
                title="Klaim Baru pada Barang Anda",
                message=f'Seseorang mengajukan klaim untuk "{item.get("title")}".',
            ),
        )

    # Mengambil daftar admin secara cross-service via HTTP
    try:
        admins = httpx_client.get_admins(jwt_token)
        for admin in admins:
            admin_id = admin.get("id")
            if not admin_id:
                continue
            if admin_id == user_id:
                continue
            if admin_id == item_created_by:
                continue
            create_notification(
                db,
                NotificationCreate(
                    user_id=admin_id,
                    title="Klaim Baru Masuk",
                    message=f'Ada pengajuan klaim baru untuk item "{item.get("title")}".',
                ),
            )
    except Exception as exc:
        # Jangan gagalkan klaim hanya karena notifikasi admin gagal terkirim
        logger.warning("Gagal mengirimkan notifikasi ke admin: %s", exc, exc_info=True)

    return new_claim

def get_claims_by_user(db: Session, user_id: str):
    return db.query(Claim).filter(Claim.user_id == user_id).all()

def get_claim_by_id(db: Session, claim_id: str, user_id: str, user_role: str, jwt_token: str):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found")

    # Mengambil detail item secara cross-service via HTTP
    try:
        item = httpx_client.get_item(claim.item_id, jwt_token)
    except Exception:
        item = None

    is_claim_owner = claim.user_id == user_id
    is_item_owner = item and item.get("created_by") == user_id
    is_admin = user_role in ["admin", "superadmin"]

    if not is_claim_owner and not is_item_owner and not is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this claim")

    return claim

def get_claims_by_item(db: Session, item_id: str | None, user_id: str, user_role: str, jwt_token: str):
    is_admin = user_role in ["admin", "superadmin"]

    if not item_id:
        if not is_admin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can view all claims without specifying an item_id")
        return db.query(Claim).all()

    # Mengambil detail item secara cross-service via HTTP
    try:
        item = httpx_client.get_item(item_id, jwt_token)
    except Exception:
        item = None
        
    if not item:
        if is_admin:
            return db.query(Claim).filter(Claim.item_id == item_id).all()
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Item service is currently unavailable. Cannot verify ownership.")

    is_item_owner = item.get("created_by") == user_id

    if not is_item_owner and not is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only item owner or admin can view claims for this item")

    return db.query(Claim).filter(Claim.item_id == item_id).all()

def update_claim_status(db: Session, claim_id: str, payload: ClaimStatusUpdate, user_id: str, user_role: str, jwt_token: str):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found")

    # Mengambil detail item secara cross-service via HTTP
    try:
        item = httpx_client.get_item(claim.item_id, jwt_token)
    except Exception:
        item = None

    is_item_owner = item and item.get("created_by") == user_id
    is_claim_owner = claim.user_id == user_id
    is_admin = user_role in ["admin", "superadmin"]

    if payload.status in ["approved", "rejected", "completed"]:
        if not is_item_owner and not is_admin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only item owner or admin can approve/reject/complete claims")
    elif payload.status == "cancelled" and not is_claim_owner and not is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only claim owner or admin can cancel a claim")

    # Update claim status
    claim.status = payload.status
    db.add(claim)

    # Log claim history
    history = ClaimStatusHistory(
        claim_id=claim.id,
        status=payload.status,
        changed_by=user_id
    )
    db.add(history)

    # Emit audit logs jika dilakukan oleh admin
    if is_admin:
        audit_entry = AuditLog(
            user_id=user_id,
            action=f"UPDATE_CLAIM_STATUS_{payload.status.upper()}",
            entity_type="claim",
            entity_id=claim.id,
            details=f"Admin updated claim status to {payload.status} for item_id {claim.item_id}"
        )
        db.add(audit_entry)

    # Sync item status berdasarkan status claim secara cross-service via HTTP
    new_item_status = None
    if payload.status == "approved":
        new_item_status = "in_claim"
    elif payload.status == "completed":
        new_item_status = "returned"
    elif payload.status in ["rejected", "cancelled"]:
        new_item_status = "open"

    if new_item_status and item and item.get("status") != new_item_status:
        try:
            # Melakukan cross-service status synchronization
            httpx_client.update_item_status(item.get("id"), new_item_status, jwt_token)
            
            # Emit audit log untuk item status change
            if is_admin:
                audit_item = AuditLog(
                    user_id=user_id,
                    action="SYNC_ITEM_STATUS",
                    entity_type="item",
                    entity_id=item.get("id"),
                    details=f"Synced item status to {new_item_status} due to claim status change to {payload.status}"
                )
                db.add(audit_item)
        except Exception as exc:
            logger.warning("Gagal menyelaraskan status item secara cross-service: %s", exc, exc_info=True)

    db.commit()
    db.refresh(claim)

    item_title = item.get("title") if item else "Barang"
    status_messages = {
        "approved": (
            "Klaim Disetujui",
            f'Klaim Anda untuk "{item_title}" telah disetujui. Silakan ambil barang Anda.',
        ),
        "rejected": (
            "Klaim Ditolak",
            f'Klaim Anda untuk "{item_title}" ditolak. Hubungi admin untuk informasi lebih lanjut.',
        ),
        "completed": (
            "Barang Dikembalikan",
            f'Proses klaim untuk "{item_title}" telah selesai. Barang telah dikembalikan.',
        ),
        "cancelled": (
            "Klaim Dibatalkan",
            f'Klaim untuk "{item_title}" telah dibatalkan.',
        ),
    }

    if payload.status in status_messages:
        title, message = status_messages[payload.status]

        if claim.user_id != user_id:
            create_notification(
                db,
                NotificationCreate(
                    user_id=claim.user_id,
                    title=title,
                    message=message,
                ),
            )

        if item and item.get("created_by") != user_id:
            create_notification(
                db,
                NotificationCreate(
                    user_id=item.get("created_by"),
                    title="Update Status Klaim",
                    message=f'Status klaim untuk "{item_title}" berubah menjadi {payload.status}.',
                ),
            )

    return claim
