"""Shared test fixtures for engagement-service smoke tests."""
import contextlib
import os

os.environ.setdefault("DATABASE_URL", "sqlite:///./_test_engagement.db")
os.environ.setdefault("SECRET_KEY", "test-secret-key-for-pytest-only-not-prod")
os.environ.setdefault("ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
os.environ.setdefault("CORS_ORIGINS", '["http://localhost"]')
os.environ.setdefault("AUTH_SERVICE_URL", "http://localhost:8001")
os.environ.setdefault("ITEM_SERVICE_URL", "http://localhost:8002")

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from jose import jwt  # noqa: E402
from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402

from app.config import settings  # noqa: E402
from app.database import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402

engine = create_engine("sqlite:///./_test_engagement.db", connect_args={"check_same_thread": False})
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
    if os.path.exists("./_test_engagement.db"):
        with contextlib.suppress(OSError):
            os.remove("./_test_engagement.db")


@pytest.fixture()
def client():
    return TestClient(app)


@pytest.fixture()
def user_token():
    payload = {"sub": "user@itk.ac.id", "role": "user", "id": "user-uuid-1"}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
