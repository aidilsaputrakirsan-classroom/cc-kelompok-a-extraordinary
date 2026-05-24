"""Smoke tests untuk engagement-service."""


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200


def test_my_notifications_requires_auth(client):
    response = client.get("/notifications/me")
    assert response.status_code in (401, 403)


def test_my_notifications_authenticated_empty_list(client, user_token):
    response = client.get(
        "/notifications/me",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 200
    assert response.json() == []


def test_my_claims_requires_auth(client):
    response = client.get("/claims/me")
    assert response.status_code in (401, 403)


def test_my_claims_authenticated_empty_list(client, user_token):
    response = client.get(
        "/claims/me",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 200
    assert response.json() == []
