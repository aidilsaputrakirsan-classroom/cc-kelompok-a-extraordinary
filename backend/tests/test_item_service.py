"""Tests for app.items — service layer + HTTP CRUD.

Refactored to pytest function style + fixtures per BE-5.1.
HTTP-level CRUD tests added per BE-5.2 (Sprint 5).
"""

import pytest
from fastapi import HTTPException

from app.items.schemas import ItemUpdate
from app.items.service import update_item


# ------------------------------------------------------------------
# Service-layer authorization tests (existing, refactored)
# ------------------------------------------------------------------


def test_owner_can_update_non_status_fields(db_session, auth_user, sample_item):
    updated_item = update_item(
        db_session,
        item_id=sample_item.id,
        user_id=auth_user.id,
        user_role="user",
        item_data=ItemUpdate(title="Dompet Kulit"),
    )

    assert updated_item.title == "Dompet Kulit"
    assert updated_item.status == "open"


def test_owner_cannot_update_status(db_session, auth_user, sample_item):
    with pytest.raises(HTTPException) as exc_info:
        update_item(
            db_session,
            item_id=sample_item.id,
            user_id=auth_user.id,
            user_role="user",
            item_data=ItemUpdate(status="closed"),
        )

    assert exc_info.value.status_code == 403


def test_admin_can_update_status(db_session, admin_user, sample_item):
    updated_item = update_item(
        db_session,
        item_id=sample_item.id,
        user_id=admin_user.id,
        user_role="admin",
        item_data=ItemUpdate(status="returned"),
    )

    assert updated_item.status == "returned"


# ------------------------------------------------------------------
# HTTP-level CRUD tests (BE-5.2: list, create, detail, unauthorized)
# ------------------------------------------------------------------


def test_create_found_item_requires_security_officer(client, auth_headers):
    response = client.post(
        "/items/",
        headers=auth_headers,
        json={
            "type": "found",
            "title": "Dompet Tanpa Officer",
            "description": "Dompet di lobby",
            # security_officer_id missing -> service raises 400
        },
    )

    assert response.status_code == 400
    assert "security_officer_id" in response.json()["detail"]


def test_create_lost_item_does_not_require_security_officer(client, auth_headers):
    response = client.post(
        "/items/",
        headers=auth_headers,
        json={
            "type": "lost",
            "title": "Kunci Motor Hilang",
            "description": "Hilang di parkiran",
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["type"] == "lost"
    assert body["status"] == "open"
    assert body["title"] == "Kunci Motor Hilang"


def test_create_found_item_with_security_officer_succeeds(
    client, auth_headers, master_data
):
    response = client.post(
        "/items/",
        headers=auth_headers,
        json={
            "type": "found",
            "title": "Tas Ransel",
            "description": "Tas ransel hitam di kantin",
            "category_id": master_data["category"].id,
            "building_id": master_data["building"].id,
            "location_id": master_data["location"].id,
            "security_officer_id": master_data["security_officer"].id,
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["type"] == "found"
    assert body["security_officer_id"] == master_data["security_officer"].id


def test_create_item_rejected_when_unauthenticated(client):
    response = client.post(
        "/items/",
        json={"type": "lost", "title": "Test", "description": "Test"},
    )

    # Missing Authorization -> HTTPBearer rejects (401 or 403)
    assert response.status_code in (401, 403)


def test_list_items_returns_array(client, sample_item):
    response = client.get("/items/")

    assert response.status_code == 200
    body = response.json()
    assert isinstance(body, list)
    assert len(body) == 1
    assert body[0]["id"] == sample_item.id
    assert body[0]["title"] == "Dompet Hitam"


def test_list_items_supports_search(client, sample_item):
    response = client.get("/items/?search=dompet")

    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["id"] == sample_item.id


def test_list_items_filter_by_type(client, sample_item):
    # sample_item is type=found
    response_found = client.get("/items/?type=found")
    response_lost = client.get("/items/?type=lost")

    assert response_found.status_code == 200
    assert response_lost.status_code == 200
    assert len(response_found.json()) == 1
    assert len(response_lost.json()) == 0


def test_get_item_detail_returns_item(client, sample_item):
    response = client.get(f"/items/{sample_item.id}")

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == sample_item.id
    assert body["title"] == sample_item.title


def test_get_item_detail_returns_404_for_missing_id(client):
    response = client.get("/items/non-existent-id")

    assert response.status_code == 404


def test_list_my_items_returns_only_users_own_items(
    client, auth_user, auth_headers, sample_item
):
    response = client.get("/items/me", headers=auth_headers)

    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["id"] == sample_item.id
    assert body[0]["created_by"] == auth_user.id


def test_list_my_items_rejected_when_unauthenticated(client):
    response = client.get("/items/me")

    assert response.status_code in (401, 403)


def test_update_item_via_http_changes_title(
    client, auth_headers, sample_item, db_session
):
    response = client.put(
        f"/items/{sample_item.id}",
        headers=auth_headers,
        json={"title": "Dompet Baru"},
    )

    assert response.status_code == 200
    assert response.json()["title"] == "Dompet Baru"


def test_update_item_status_rejected_for_owner_role_user(
    client, auth_headers, sample_item
):
    response = client.put(
        f"/items/{sample_item.id}",
        headers=auth_headers,
        json={"status": "closed"},
    )

    assert response.status_code == 403


def test_update_item_status_succeeds_for_admin(
    client, admin_headers, sample_item
):
    response = client.put(
        f"/items/{sample_item.id}",
        headers=admin_headers,
        json={"status": "returned"},
    )

    assert response.status_code == 200
    assert response.json()["status"] == "returned"


def test_delete_item_by_owner_succeeds(client, auth_headers, sample_item):
    response = client.delete(f"/items/{sample_item.id}", headers=auth_headers)

    assert response.status_code == 204

    # Verify it's actually gone
    response = client.get(f"/items/{sample_item.id}")
    assert response.status_code == 404


def test_delete_item_rejected_when_unauthenticated(client, sample_item):
    response = client.delete(f"/items/{sample_item.id}")

    assert response.status_code in (401, 403)


def test_create_item_rejects_more_than_4_images(client, auth_headers, master_data):
    images = [{"image_data": "data:image/png;base64,iVBOR", "display_order": i} for i in range(5)]
    response = client.post(
        "/items/",
        headers=auth_headers,
        json={
            "type": "found",
            "title": "Dengan banyak foto",
            "description": "Test",
            "security_officer_id": master_data["security_officer"].id,
            "images": images,
        },
    )

    assert response.status_code == 400
    assert "4 foto" in response.json()["detail"]
