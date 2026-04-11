"""Align users table with Firebase auth schema

Revision ID: c3d4f1a9b2e7
Revises: 9b26892a2d29
Create Date: 2026-04-10 23:35:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c3d4f1a9b2e7"
down_revision: Union[str, Sequence[str], None] = "9b26892a2d29"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _get_column_names(bind):
    inspector = sa.inspect(bind)
    return {column["name"] for column in inspector.get_columns("users")}


def _get_indexes(bind):
    inspector = sa.inspect(bind)
    return {index["name"] for index in inspector.get_indexes("users")}


def upgrade() -> None:
    bind = op.get_bind()
    columns = _get_column_names(bind)
    indexes = _get_indexes(bind)

    if "id" in columns:
        op.execute("ALTER TABLE users ALTER COLUMN id TYPE VARCHAR USING id::varchar")

    if "firebase_uid" not in columns:
        op.add_column("users", sa.Column("firebase_uid", sa.String(), nullable=True))

    if "role" not in columns:
        op.add_column("users", sa.Column("role", sa.String(), nullable=True, server_default="user"))
        op.execute("UPDATE users SET role = 'user' WHERE role IS NULL")
        op.alter_column("users", "role", nullable=False, server_default=None)

    if "phone" not in columns:
        op.add_column("users", sa.Column("phone", sa.String(), nullable=True))

    if "ix_users_firebase_uid" not in indexes:
        op.create_index("ix_users_firebase_uid", "users", ["firebase_uid"], unique=True)


def downgrade() -> None:
    bind = op.get_bind()
    columns = _get_column_names(bind)
    indexes = _get_indexes(bind)

    if "ix_users_firebase_uid" in indexes:
        op.drop_index("ix_users_firebase_uid", table_name="users")

    if "phone" in columns:
        op.drop_column("users", "phone")

    if "role" in columns:
        op.drop_column("users", "role")

    if "firebase_uid" in columns:
        op.drop_column("users", "firebase_uid")

    if "id" in columns:
        op.execute("ALTER TABLE users ALTER COLUMN id TYPE INTEGER USING id::integer")
