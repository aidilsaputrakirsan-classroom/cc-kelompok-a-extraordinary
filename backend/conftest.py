"""
Temuin backend pytest configuration and shared fixtures.

Per DEC-020: backend coverage threshold 60%. Fixtures here provide:
- in-memory SQLite engine (per-test isolation)
- TestClient with `get_db` override
- Pre-seeded users (regular, admin, superadmin) and master data
- Helper to create JWT bearer tokens for authenticated requests

Tests should use these fixtures instead of unittest.TestCase setUp/tearDown.
"""

import os

# Ensure env vars are set BEFORE app modules import config.
os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("SECRET_KEY", "test-secret-key-do-not-use-in-prod")
os.environ.setdefault("ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
os.environ.setdefault("CORS_ORIGINS", '["http://testserver"]')

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.auth.service import create_access_token, hash_password
from app.database import Base, get_db
from app.main import app
from app.models.item import Item
from app.models.master_data import Building, Category, Location, SecurityOfficer
from app.models.user import User


@pytest.fixture
def engine():
    """In-memory SQLite engine, fresh per test (isolation).

    StaticPool keeps a single connection so the schema persists across
    sessions within the same test.
    """
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    try:
        yield engine
    finally:
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture
def db_session(engine):
    """SQLAlchemy session bound to the in-memory engine."""
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(engine, db_session):
    """FastAPI TestClient with `get_db` overridden to use the in-memory session.

    The override yields the SAME session as `db_session` fixture so tests can
    seed data via db_session and observe it through HTTP calls.
    """

    def override_get_db():
        try:
            yield db_session
        finally:
            pass  # session lifecycle handled by db_session fixture

    app.dependency_overrides[get_db] = override_get_db
    test_client = TestClient(app)
    try:
        yield test_client
    finally:
        app.dependency_overrides.clear()


# ------------------------------------------------------------------
# User fixtures: pre-seeded with bcrypt password "TestPass123" so
# tests can exercise both register and login flows without re-hashing.
# ------------------------------------------------------------------

DEFAULT_PASSWORD = "TestPass123"


def _make_user(db, email, name, role):
    user = User(
        email=email,
        name=name,
        role=role,
        password_hash=hash_password(DEFAULT_PASSWORD),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def auth_user(db_session):
    """Regular user with role=user."""
    return _make_user(db_session, "user@itk.ac.id", "Regular User", "user")


@pytest.fixture
def admin_user(db_session):
    return _make_user(db_session, "admin@itk.ac.id", "Admin User", "admin")


@pytest.fixture
def superadmin_user(db_session):
    return _make_user(db_session, "superadmin@itk.ac.id", "Super Admin", "superadmin")


@pytest.fixture
def auth_headers(auth_user):
    """Authorization header for `auth_user`."""
    return _bearer_for(auth_user)


@pytest.fixture
def admin_headers(admin_user):
    return _bearer_for(admin_user)


@pytest.fixture
def superadmin_headers(superadmin_user):
    return _bearer_for(superadmin_user)


def _bearer_for(user: User) -> dict:
    """Generate a valid JWT bearer header for a user."""
    token = create_access_token(
        data={"sub": user.email, "role": user.role, "id": user.id}
    )
    return {"Authorization": f"Bearer {token}"}


# ------------------------------------------------------------------
# Master data fixture - many tests need a SecurityOfficer to create
# `found` items, plus a Category/Building/Location for filtering.
# ------------------------------------------------------------------


@pytest.fixture
def master_data(db_session):
    """Seed minimal master data for item-related tests.

    Returns a dict with keys: category, building, location, security_officer.
    """
    category = Category(name="Elektronik")
    building = Building(name="Gedung A")
    location = Location(name="Lobby")
    security_officer = SecurityOfficer(name="Pak Budi")
    db_session.add_all([category, building, location, security_officer])
    db_session.commit()
    for obj in (category, building, location, security_officer):
        db_session.refresh(obj)
    return {
        "category": category,
        "building": building,
        "location": location,
        "security_officer": security_officer,
    }


@pytest.fixture
def sample_item(db_session, auth_user, master_data):
    """A persisted `found` Item owned by `auth_user`, status=open."""
    item = Item(
        type="found",
        status="open",
        title="Dompet Hitam",
        description="Dompet kulit hitam ditemukan di lobby",
        category_id=master_data["category"].id,
        building_id=master_data["building"].id,
        location_id=master_data["location"].id,
        security_officer_id=master_data["security_officer"].id,
        created_by=auth_user.id,
    )
    db_session.add(item)
    db_session.commit()
    db_session.refresh(item)
    return item
