"""Regression test for soft-delete filter bug.

Bug history: ruff E711 auto-fix mengubah `Item.deleted_at == None`
menjadi `Item.deleted_at is None`. Pada SQLAlchemy filter, `is` operator
tidak overloadable jadi expression, sehingga filter dievaluasi sebagai
boolean `False` di Python. Akibatnya GET /items/ selalu mengembalikan [].

Fix: gunakan `Item.deleted_at.is_(None)` untuk menghasilkan SQL
`deleted_at IS NULL` yang benar.

Test ini memvalidasi bahwa item baru muncul di list dan bisa diambil
ulang via /items/{id} setelah create_item.
"""


def test_create_item_then_listed_and_fetchable(client, user_token):
    """POST /items/ lalu GET /items/ harus mengembalikan item yang baru dibuat."""
    payload = {
        "type": "lost",
        "title": "Regression Test Item",
        "description": "Item ini harus muncul setelah dibuat.",
        "images": [],
    }
    create_resp = client.post(
        "/items/",
        json=payload,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert create_resp.status_code == 200, create_resp.text
    item_id = create_resp.json()["id"]

    list_resp = client.get("/items/")
    assert list_resp.status_code == 200
    items = list_resp.json()
    assert isinstance(items, list)
    assert any(it["id"] == item_id for it in items), (
        "Item baru tidak muncul di GET /items/. "
        "Cek filter soft-delete (Item.deleted_at.is_(None) bukan `is None`)."
    )

    detail_resp = client.get(f"/items/{item_id}")
    assert detail_resp.status_code == 200
    assert detail_resp.json()["id"] == item_id


def test_my_items_returns_user_owned_items(client, user_token):
    """GET /items/me harus return item milik current user."""
    payload = {
        "type": "lost",
        "title": "My Item",
        "description": "Owned by user-uuid-1.",
        "images": [],
    }
    create_resp = client.post(
        "/items/",
        json=payload,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert create_resp.status_code == 200
    item_id = create_resp.json()["id"]

    me_resp = client.get(
        "/items/me",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert me_resp.status_code == 200
    my_items = me_resp.json()
    assert any(it["id"] == item_id for it in my_items), (
        "Item milik user tidak muncul di /items/me. "
        "Cek filter soft-delete di get_items_by_user."
    )
