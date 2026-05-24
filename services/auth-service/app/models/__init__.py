"""Auth-service models package.

Re-exports for SQLAlchemy metadata registration. Importing this module
ensures Base.metadata.create_all() picks up all tables.
"""
from app.database import Base
from app.models.user import User

__all__ = ["Base", "User"]
