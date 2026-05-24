"""Tests for app.auth — register, login, and /me endpoint.

Refactored from unittest.TestCase to pytest function style + fixtures
per BE-5.1 (Sprint 5).
"""

import pytest
from fastapi import HTTPException

from app.auth.service import login_user, register_user
from app.models.user import User


# ------------------------------------------------------------------
# register_user service-level tests
# ------------------------------------------------------------------


def test_register_user_returns_token_and_persists_hash(db_session):
    token = register_user(db_session, "Test@Student.ITK.AC.ID", "abc12345", "Test User")

    user = db_session.query(User).filter(User.email == "test@student.itk.ac.id").first()
    assert token is not None
    assert user is not None
    assert user.role == "user"
    assert user.password_hash is not None
    assert user.password_hash != "abc12345"


def test_register_rejects_non_itk_email(db_session):
    with pytest.raises(HTTPException) as exc_info:
        register_user(db_session, "user@gmail.com", "abc12345", "User")

    assert exc_info.value.status_code == 403


def test_register_rejects_weak_password(db_session):
    with pytest.raises(HTTPException) as exc_info:
        register_user(db_session, "user@itk.ac.id", "abcdefg", "User")

    assert exc_info.value.status_code == 400


def test_register_rejects_password_without_digit(db_session):
    with pytest.raises(HTTPException) as exc_info:
        register_user(db_session, "user@itk.ac.id", "abcdefghij", "User")

    assert exc_info.value.status_code == 400


def test_register_existing_user_with_hash_returns_conflict(db_session):
    register_user(db_session, "user@itk.ac.id", "abc12345", "User")

    with pytest.raises(HTTPException) as exc_info:
        register_user(db_session, "user@itk.ac.id", "abc12345", "Other User")

    assert exc_info.value.status_code == 409


def test_register_legacy_user_sets_first_password(db_session):
    legacy_user = User(
        email="legacy@itk.ac.id",
        name="Legacy Name",
        role="user",
        firebase_uid="legacy-firebase-id",
        password_hash=None,
    )
    db_session.add(legacy_user)
    db_session.commit()

    token = register_user(db_session, "legacy@itk.ac.id", "abc12345", "Updated Legacy")
    updated_user = db_session.query(User).filter(User.email == "legacy@itk.ac.id").first()

    assert token is not None
    assert updated_user.name == "Updated Legacy"
    assert updated_user.password_hash is not None


# ------------------------------------------------------------------
# login_user service-level tests
# ------------------------------------------------------------------


def test_login_user_returns_token_for_valid_credentials(db_session):
    register_user(db_session, "user@itk.ac.id", "abc12345", "User")

    token = login_user(db_session, "user@itk.ac.id", "abc12345")

    assert token is not None


def test_login_rejects_unknown_email(db_session):
    with pytest.raises(HTTPException) as exc_info:
        login_user(db_session, "missing@itk.ac.id", "abc12345")

    assert exc_info.value.status_code == 401


def test_login_rejects_wrong_password(db_session):
    register_user(db_session, "user@itk.ac.id", "abc12345", "User")

    with pytest.raises(HTTPException) as exc_info:
        login_user(db_session, "user@itk.ac.id", "wrong123")

    assert exc_info.value.status_code == 401


def test_login_rejects_legacy_user_without_password(db_session):
    legacy_user = User(
        email="legacy@itk.ac.id",
        name="Legacy User",
        role="user",
        firebase_uid="legacy-firebase-id",
        password_hash=None,
    )
    db_session.add(legacy_user)
    db_session.commit()

    with pytest.raises(HTTPException) as exc_info:
        login_user(db_session, "legacy@itk.ac.id", "abc12345")

    assert exc_info.value.status_code == 401
    assert "register" in exc_info.value.detail.lower()


# ------------------------------------------------------------------
# HTTP-level tests (TestClient): register, login, /me
# Added per BE-5.1 (Sprint 5) coverage of HTTP layer.
# ------------------------------------------------------------------


def test_register_endpoint_returns_token(client):
    response = client.post(
        "/auth/register",
        json={
            "email": "newuser@itk.ac.id",
            "password": "abc12345",
            "name": "New User",
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert body["access_token"]


def test_register_endpoint_rejects_invalid_email(client):
    response = client.post(
        "/auth/register",
        json={
            "email": "outsider@gmail.com",
            "password": "abc12345",
            "name": "Outsider",
        },
    )

    assert response.status_code == 403


def test_login_endpoint_returns_token(client):
    client.post(
        "/auth/register",
        json={"email": "login@itk.ac.id", "password": "abc12345", "name": "Login"},
    )

    response = client.post(
        "/auth/login",
        json={"email": "login@itk.ac.id", "password": "abc12345"},
    )

    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_endpoint_rejects_wrong_password(client):
    client.post(
        "/auth/register",
        json={"email": "login2@itk.ac.id", "password": "abc12345", "name": "Login"},
    )

    response = client.post(
        "/auth/login",
        json={"email": "login2@itk.ac.id", "password": "wrong123"},
    )

    assert response.status_code == 401


def test_get_me_returns_current_user_profile(client, auth_user, auth_headers):
    response = client.get("/auth/me", headers=auth_headers)

    assert response.status_code == 200
    body = response.json()
    assert body["email"] == auth_user.email
    assert body["name"] == auth_user.name
    assert body["role"] == "user"


def test_get_me_rejects_missing_token(client):
    response = client.get("/auth/me")

    # FastAPI HTTPBearer raises 403 when no Authorization header
    assert response.status_code in (401, 403)


def test_get_me_rejects_invalid_token(client):
    response = client.get(
        "/auth/me",
        headers={"Authorization": "Bearer not-a-real-token"},
    )

    assert response.status_code == 401


def test_update_me_changes_profile_fields(client, auth_user, auth_headers, db_session):
    response = client.put(
        "/auth/me",
        headers=auth_headers,
        json={"name": "Updated Name", "phone": "081234567890"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["name"] == "Updated Name"
    assert body["phone"] == "081234567890"

    db_session.refresh(auth_user)
    assert auth_user.name == "Updated Name"
    assert auth_user.phone == "081234567890"
