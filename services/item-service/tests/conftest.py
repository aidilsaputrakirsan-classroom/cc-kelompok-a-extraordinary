"""Shared test fixtures for item-service smoke tests."""
import os

os.environ.setdefault("DATABASE_URL", "sqlite:///./_test_item.db")
os.environ.setdefault("SECRET_KEY", "test-secret-key-for-pytest-only-not-prod")
os.environ.setdefault("ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
os.environ.setdefault("CORS_ORIGINS", '["http://localhost"]')

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from jose import jwt  # noqa: E402
from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402

from app.config import settings  # noqa: E402
from app.database import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402

engine = create_engine("sqlite:///./_test_item.db", connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session", autouse=True)
def _setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    engine.dispose()
    if os.path.exists("./_test_item.db"):
        try:
            os.remove("./_test_item.db")
        except OSError:
            pass


@pytest.fixture()
def client():
    return TestClient(app)


@pytest.fixture()
def user_token():
    """Generate JWT for a fake regular user (no DB lookup needed in item-service)."""
    payload = {"sub": "user@itk.ac.id", "role": "user", "id": "user-uuid-1"}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


@pytest.fixture()
def admin_token():
    payload = {"sub": "admin@itk.ac.id", "role": "admin", "id": "admin-uuid-1"}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
