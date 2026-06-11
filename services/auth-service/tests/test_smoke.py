"""Smoke tests untuk auth-service: bootstrap, health, register flow, B-7 fix."""


def test_health_check(client):
    """Bootstrap test: app starts dan /health respond 200."""
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "healthy"


def test_register_invalid_email_rejected(client):
    """B-7 fix: validate_itk_email tolak domain yang bukan itk.ac.id atau subdomain."""
    response = client.post(
        "/auth/register",
        json={"email": "user@notitk.ac.id", "password": "Password123", "name": "Test User"},
    )
    assert response.status_code in (403, 422)
    detail_str = str(response.json()["detail"]).lower()
    assert "itk.ac.id" in detail_str


def test_register_subdomain_email_accepted(client):
    """B-7 fix: subdomain student.itk.ac.id harus diterima (bug awalnya tolak)."""
    response = client.post(
        "/auth/register",
        json={
            "email": "mahasiswa@student.itk.ac.id",
            "password": "Password123",
            "name": "Mahasiswa Test",
        },
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_register_login_flow(client):
    """Smoke: register -> /auth/me returns user dengan role 'user'."""
    register_response = client.post(
        "/auth/register",
        json={
            "email": "smoke.test@itk.ac.id",
            "password": "Password123",
            "name": "Smoke Test",
        },
    )
    assert register_response.status_code == 200
    token = register_response.json()["access_token"]

    me_response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_response.status_code == 200
    body = me_response.json()
    assert body["email"] == "smoke.test@itk.ac.id"
    assert body["role"] == "user"


def test_users_admins_requires_auth(client):
    """B-1 fix: /auth/users/admins butuh auth."""
    response = client.get("/auth/users/admins")
    assert response.status_code in (401, 403)


def test_register_validation_rules(client):
    """Sprint 8 BE-8.1: Test validators for password strength and name length."""
    # Invalid password: short
    res = client.post("/auth/register", json={"email": "val@itk.ac.id", "password": "abc", "name": "Valid Name"})
    assert res.status_code == 422

    # Invalid password: no numbers
    res = client.post("/auth/register", json={"email": "val@itk.ac.id", "password": "abcdefgh", "name": "Valid Name"})
    assert res.status_code == 422

    # Invalid password: no letters
    res = client.post("/auth/register", json={"email": "val@itk.ac.id", "password": "12345678", "name": "Valid Name"})
    assert res.status_code == 422

    # Invalid name: too short
    res = client.post("/auth/register", json={"email": "val@itk.ac.id", "password": "Password123", "name": "A"})
    assert res.status_code == 422

    # Invalid name: too long
    res = client.post("/auth/register", json={"email": "val@itk.ac.id", "password": "Password123", "name": "A" * 201})
    assert res.status_code == 422

