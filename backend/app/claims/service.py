from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.claim import Claim, ClaimStatusHistory
from app.models.item import Item, ItemStatusHistory
from app.models.user import User
from app.notifications.schemas import NotificationCreate
from app.notifications.service import create_notification
from typing import Optional
from app.claims.schemas import ClaimCreate, ClaimStatusUpdate

def create_claim(db: Session, user_id: str, claim_in: ClaimCreate) -> Claim:
    item = db.query(Item).filter(Item.id == claim_in.item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    
    if item.type != 'found':
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only 'found' items can be claimed")
        
    if item.status in ["returned", "closed"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Item is already returned or closed")
        
    if item.created_by == user_id:
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

    if item.created_by != user_id:
        create_notification(
            db,
            NotificationCreate(
                user_id=item.created_by,
                title="Klaim Baru pada Barang Anda",
                message=f'Seseorang mengajukan klaim untuk "{item.title}".',
            ),
        )

    admins = db.query(User).filter(User.role.in_(["admin", "superadmin"])).all()
    for admin in admins:
        if admin.id == user_id:
            continue
        if admin.id == item.created_by:
            continue
        create_notification(
            db,
            NotificationCreate(
                user_id=admin.id,
                title="Klaim Baru Masuk",
                message=f'Ada pengajuan klaim baru untuk item "{item.title}".',
            ),
        )
    
    return new_claim

def get_claims_by_user(db: Session, user_id: str):
    return db.query(Claim).filter(Claim.user_id == user_id).all()

def get_claim_by_id(db: Session, claim_id: str, user_id: str):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found")

    user = db.query(User).filter(User.id == user_id).first()
    item = db.query(Item).filter(Item.id == claim.item_id).first()

    is_claim_owner = claim.user_id == user_id
    is_item_owner = item and item.created_by == user_id
    is_admin = user and user.role in ["admin", "superadmin"]
    
    if not is_claim_owner and not is_item_owner and not is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this claim")
        
    return claim

def get_claims_by_item(db: Session, item_id: Optional[str], user_id: str):
    user = db.query(User).filter(User.id == user_id).first()
    is_admin = user and user.role in ["admin", "superadmin"]

    if not item_id:
        if not is_admin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can view all claims without specifying an item_id")
        return db.query(Claim).all()

    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    is_item_owner = item.created_by == user_id
    
    if not is_item_owner and not is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only item owner or admin can view claims for this item")
        
    return db.query(Claim).filter(Claim.item_id == item_id).all()

def update_claim_status(db: Session, claim_id: str, payload: ClaimStatusUpdate, user_id: str):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found")

    item = db.query(Item).filter(Item.id == claim.item_id).first()

    user = db.query(User).filter(User.id == user_id).first()
    is_item_owner = item and item.created_by == user_id
    is_claim_owner = claim.user_id == user_id
    is_admin = user and user.role in ["admin", "superadmin"]

    if payload.status in ["approved", "rejected", "completed"]:
        if not is_item_owner and not is_admin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only item owner or admin can approve/reject/complete claims")
    elif payload.status == "cancelled":
        if not is_claim_owner and not is_admin:
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
    
    # Sync item status based on claim status
    new_item_status = None
    if payload.status == "approved":
        new_item_status = "in_claim"
    elif payload.status == "completed":
        new_item_status = "returned"
    elif payload.status in ["rejected", "cancelled"]:
        new_item_status = "open"
        
    if new_item_status and item and item.status != new_item_status:
        item.status = new_item_status
        db.add(item)
        item_history = ItemStatusHistory(
            item_id=item.id,
            status=new_item_status,
            changed_by=user_id
        )
        db.add(item_history)
        
    db.commit()
    db.refresh(claim)

    status_messages = {
        "approved": (
            "Klaim Disetujui",
            f'Klaim Anda untuk "{item.title}" telah disetujui. Silakan ambil barang Anda.',
        ),
        "rejected": (
            "Klaim Ditolak",
            f'Klaim Anda untuk "{item.title}" ditolak. Hubungi admin untuk informasi lebih lanjut.',
        ),
        "completed": (
            "Barang Dikembalikan",
            f'Proses klaim untuk "{item.title}" telah selesai. Barang telah dikembalikan.',
        ),
        "cancelled": (
            "Klaim Dibatalkan",
            f'Klaim untuk "{item.title}" telah dibatalkan.',
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

        if item and item.created_by != user_id:
            create_notification(
                db,
                NotificationCreate(
                    user_id=item.created_by,
                    title="Update Status Klaim",
                    message=f'Status klaim untuk "{item.title}" berubah menjadi {payload.status}.',
                ),
            )

    return claim
