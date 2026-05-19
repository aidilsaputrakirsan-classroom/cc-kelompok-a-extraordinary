"""Schema verification: User table matches Temuin auth design.

Refactored to pytest function style per BE-5.1.
"""

from sqlalchemy import inspect

from app.models.user import User


def test_users_table_matches_temuin_auth_schema(engine):
    inspector = inspect(engine)
    columns = {column["name"]: column for column in inspector.get_columns("users")}

    assert "id" in columns
    assert columns["id"]["type"].__class__.__name__ in {"VARCHAR", "String"}
    assert "firebase_uid" in columns
    assert "password_hash" in columns
    assert "role" in columns
    assert "phone" in columns
    assert columns["email"]["nullable"] is False
    assert columns["name"]["nullable"] is False
    assert columns["role"]["nullable"] is False
    assert columns["firebase_uid"]["nullable"] is True
    assert columns["password_hash"]["nullable"] is True

    user_columns = {column.name for column in User.__table__.columns}
    expected = {
        "id",
        "firebase_uid",
        "password_hash",
        "email",
        "name",
        "role",
        "phone",
        "created_at",
    }
    assert expected.issubset(user_columns)
