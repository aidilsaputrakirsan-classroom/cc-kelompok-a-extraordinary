import os
import sys
import tempfile
import time
import unittest
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
TEST_DB_PATH = Path(tempfile.gettempdir()) / f"test_auth_login_{os.getpid()}.db"
os.environ.setdefault("DATABASE_URL", f"sqlite:///{TEST_DB_PATH}")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi.testclient import TestClient
from main import app


class AuthLoginContractTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_oauth2_form_login_rejects_invalid_credentials_with_401(self):
        response = self.client.post(
            "/auth/login",
            data={
                "username": "user@student.itk.ac.id",
                "password": "wrong-password",
            },
        )

        self.assertEqual(response.status_code, 401)

    def test_json_login_rejects_invalid_credentials_with_401(self):
        response = self.client.post(
            "/auth/login",
            json={
                "email": "user@student.itk.ac.id",
                "password": "wrong-password",
            },
        )

        self.assertEqual(response.status_code, 401)

    def test_access_token_from_login_can_access_protected_items_endpoint(self):
        email = f"token-{time.time_ns()}@student.itk.ac.id"
        password = "password123"

        register_response = self.client.post(
            "/auth/register",
            json={
                "email": email,
                "name": "Token Test",
                "password": password,
            },
        )
        self.assertEqual(register_response.status_code, 201)

        login_response = self.client.post(
            "/auth/login",
            data={
                "username": email,
                "password": password,
            },
        )
        self.assertEqual(login_response.status_code, 200)

        token = login_response.json()["access_token"]
        items_response = self.client.get(
            "/items",
            headers={"Authorization": f"Bearer {token}"},
        )

        self.assertEqual(items_response.status_code, 200)


if __name__ == "__main__":
    unittest.main()
