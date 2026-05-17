"""Tests for app.claims — service-layer notifications + HTTP claim flow.

Refactored to pytest function style + fixtures per BE-5.1.
HTTP-level tests for claim flow (create -> approve, unauthorized) per BE-5.2.
"""

import pytest

from app.claims.schemas import ClaimCreate, ClaimStatusUpdate
from app.claims.service import create_claim, update_claim_status
from app.models.item import Item
from app.models.master_data import SecurityOfficer
from app.models.notification import Notification
from app.models.user import User


# ------------------------------------------------------------------
# Fixtures specific to claim service tests
# ------------------------------------------------------------------


@pytest.fixture
def claim_setup(db_session):
    """Seed: owner, claimant, admin, superadmin, security officer, found item."""
    owner = User(email="owner@itk.ac.id", name="Owner", role="user")
    claimant = User(email="claimant@itk.ac.id", name="Claimant", role="user")
    admin = User(email="admin@itk.ac.id", name="Admin", role="admin")
    superadmin = User(email="superadmin@itk.ac.id", name="Superadmin", role="superadmin")
    security_officer = SecurityOfficer(name="Pak Budi")

    db_session.add_all([owner, claimant, admin, superadmin, security_officer])
    db_session.commit()

    item = Item(
        type="found",
        status="open",
        title="Dompet Hitam",
        description="Dompet hitam di lobby",
        security_officer_id=security_officer.id,
        created_by=owner.id,
    )
    db_session.add(item)
    db_session.commit()
    db_session.refresh(item)

    return {
        "owner": owner,
        "claimant": claimant,
        "admin": admin,
        "superadmin": superadmin,
        "security_officer": security_officer,
        "item": item,
    }


def _messages_for_user(db_session, user_id):
    return db_session.query(Notification).filter(Notification.user_id == user_id).all()


# ------------------------------------------------------------------
# Notification logic tests (existing, refactored)
# ------------------------------------------------------------------


def test_create_claim_creates_notifications_for_owner_and_admins(db_session, claim_setup):
    create_claim(
        db_session,
        user_id=claim_setup["claimant"].id,
        claim_in=ClaimCreate(
            item_id=claim_setup["item"].id,
            ownership_answer="Ciri dompet saya ada kartu kampus",
        ),
    )

    owner_notifications = _messages_for_user(db_session, claim_setup["owner"].id)
    admin_notifications = _messages_for_user(db_session, claim_setup["admin"].id)
    superadmin_notifications = _messages_for_user(db_session, claim_setup["superadmin"].id)
    claimant_notifications = _messages_for_user(db_session, claim_setup["claimant"].id)

    assert len(owner_notifications) == 1
    assert owner_notifications[0].title == "Klaim Baru pada Barang Anda"
    assert len(admin_notifications) == 1
    assert admin_notifications[0].title == "Klaim Baru Masuk"
    assert len(superadmin_notifications) == 1
    assert superadmin_notifications[0].title == "Klaim Baru Masuk"
    assert len(claimant_notifications) == 0


def test_update_claim_status_creates_notifications_for_claim_owner_and_item_owner(
    db_session, claim_setup
):
    claim = create_claim(
        db_session,
        user_id=claim_setup["claimant"].id,
        claim_in=ClaimCreate(
            item_id=claim_setup["item"].id,
            ownership_answer="Saya tahu isi dompetnya",
        ),
    )
    db_session.query(Notification).delete()
    db_session.commit()

    update_claim_status(
        db_session,
        claim_id=claim.id,
        payload=ClaimStatusUpdate(status="approved"),
        user_id=claim_setup["admin"].id,
    )

    owner_notifications = _messages_for_user(db_session, claim_setup["owner"].id)
    claimant_notifications = _messages_for_user(db_session, claim_setup["claimant"].id)
    admin_notifications = _messages_for_user(db_session, claim_setup["admin"].id)

    assert len(claimant_notifications) == 1
    assert claimant_notifications[0].title == "Klaim Disetujui"
    assert len(owner_notifications) == 1
    assert owner_notifications[0].title == "Update Status Klaim"
    assert len(admin_notifications) == 0


def test_create_claim_skips_duplicate_notification_when_admin_is_item_owner(
    db_session, claim_setup
):
    """Admin yang juga item owner tidak boleh dapat 2 notif (owner + admin)."""
    admin_item = Item(
        type="found",
        status="open",
        title="Laptop di Perpustakaan",
        description="Laptop ditemukan di perpustakaan",
        security_officer_id=claim_setup["security_officer"].id,
        created_by=claim_setup["admin"].id,
    )
    db_session.add(admin_item)
    db_session.commit()
    db_session.refresh(admin_item)

    create_claim(
        db_session,
        user_id=claim_setup["claimant"].id,
        claim_in=ClaimCreate(
            item_id=admin_item.id, ownership_answer="Laptop saya warna hitam"
        ),
    )

    admin_notifications = _messages_for_user(db_session, claim_setup["admin"].id)
    assert len(admin_notifications) == 1
    assert admin_notifications[0].title == "Klaim Baru pada Barang Anda"


def test_update_claim_status_skips_self_notification_for_item_owner(
    db_session, claim_setup
):
    claim = create_claim(
        db_session,
        user_id=claim_setup["claimant"].id,
        claim_in=ClaimCreate(
            item_id=claim_setup["item"].id,
            ownership_answer="Ada gantungan kunci merah",
        ),
    )
    db_session.query(Notification).delete()
    db_session.commit()

    update_claim_status(
        db_session,
        claim_id=claim.id,
        payload=ClaimStatusUpdate(status="approved"),
        user_id=claim_setup["owner"].id,
    )

    owner_notifications = _messages_for_user(db_session, claim_setup["owner"].id)
    claimant_notifications = _messages_for_user(db_session, claim_setup["claimant"].id)

    assert len(claimant_notifications) == 1
    assert claimant_notifications[0].title == "Klaim Disetujui"
    assert len(owner_notifications) == 0


# ------------------------------------------------------------------
# HTTP-level claim flow tests (BE-5.2)
# ------------------------------------------------------------------


def _bearer(user):
    """Inline JWT helper to avoid coupling to conftest._bearer_for."""
    from app.auth.service import create_access_token

    token = create_access_token(
        data={"sub": user.email, "role": user.role, "id": user.id}
    )
    return {"Authorization": f"Bearer {token}"}


def test_create_claim_endpoint_returns_201_and_persists(client, claim_setup):
    response = client.post(
        "/claims/",
        headers=_bearer(claim_setup["claimant"]),
        json={
            "item_id": claim_setup["item"].id,
            "ownership_answer": "Saya yakin itu punya saya, ada inisial AB",
        },
    )

    assert response.status_code == 201
    body = response.json()
    assert body["item_id"] == claim_setup["item"].id
    assert body["user_id"] == claim_setup["claimant"].id
    assert body["status"] == "pending"


def test_create_claim_rejected_when_unauthenticated(client, claim_setup):
    response = client.post(
        "/claims/",
        json={
            "item_id": claim_setup["item"].id,
            "ownership_answer": "test",
        },
    )

    assert response.status_code in (401, 403)


def test_admin_can_approve_claim_via_http(client, claim_setup, db_session):
    create_resp = client.post(
        "/claims/",
        headers=_bearer(claim_setup["claimant"]),
        json={
            "item_id": claim_setup["item"].id,
            "ownership_answer": "Saya yakin punya saya",
        },
    )
    assert create_resp.status_code == 201
    claim_id = create_resp.json()["id"]

    approve_resp = client.put(
        f"/claims/{claim_id}/status",
        headers=_bearer(claim_setup["admin"]),
        json={"status": "approved"},
    )

    assert approve_resp.status_code == 200
    assert approve_resp.json()["status"] == "approved"

    # Verify item status synced
    db_session.expire_all()
    item = db_session.query(Item).filter(Item.id == claim_setup["item"].id).first()
    assert item.status == "in_claim"


def test_get_my_claims_returns_only_users_own_claims(client, claim_setup):
    client.post(
        "/claims/",
        headers=_bearer(claim_setup["claimant"]),
        json={
            "item_id": claim_setup["item"].id,
            "ownership_answer": "test",
        },
    )

    response = client.get("/claims/me", headers=_bearer(claim_setup["claimant"]))
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["user_id"] == claim_setup["claimant"].id

    # Different user sees nothing
    response_owner = client.get(
        "/claims/me", headers=_bearer(claim_setup["owner"])
    )
    assert response_owner.status_code == 200
    assert len(response_owner.json()) == 0


def test_get_my_claims_rejected_when_unauthenticated(client):
    response = client.get("/claims/me")
    assert response.status_code in (401, 403)
