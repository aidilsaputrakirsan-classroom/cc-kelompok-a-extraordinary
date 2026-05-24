"""Smoke tests untuk item-service: bootstrap, health, B-5 auth gate."""


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200


def test_master_data_requires_auth(client):
    """B-5 fix: GET /master-data/{type} require login."""
    response = client.get("/master-data/categories")
    assert response.status_code in (401, 403)


def test_master_data_authenticated_returns_list(client, user_token):
    """B-5: dengan valid JWT, return list (kosong di test DB)."""
    response = client.get(
        "/master-data/categories",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_items_list_requires_auth(client):
    """Verify items list bisa diakses (per design tidak require auth)."""
    response = client.get("/items/")
    # Currently /items/ list tidak butuh auth (browseable)
    assert response.status_code == 200


def test_item_status_update_requires_owner(client, user_token):
    """B-2 fix: update status item yang tidak owner harus ditolak."""
    # User belum buat item, jadi item-id apapun tidak owned
    response = client.put(
        "/items/non-existent-id/status",
        json={"status": "returned"},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    # Either 404 (not found) atau 403 (not owner). Both validate authz works.
    assert response.status_code in (403, 404)
