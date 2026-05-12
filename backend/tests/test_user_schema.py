import os
import unittest

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("SECRET_KEY", "test-secret-key")

from sqlalchemy import create_engine, inspect

from app.database import Base
from app.models.user import User


class UserSchemaTest(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite+pysqlite:///:memory:")
        Base.metadata.create_all(bind=self.engine)

    def tearDown(self):
        Base.metadata.drop_all(bind=self.engine)
        self.engine.dispose()

    def test_users_table_matches_temuin_auth_schema(self):
        inspector = inspect(self.engine)
        columns = {column["name"]: column for column in inspector.get_columns("users")}

        self.assertIn("id", columns)
        self.assertIn(columns["id"]["type"].__class__.__name__, {"VARCHAR", "String"})
        self.assertIn("firebase_uid", columns)
        self.assertIn("password_hash", columns)
        self.assertIn("role", columns)
        self.assertIn("phone", columns)
        self.assertFalse(columns["email"]["nullable"])
        self.assertFalse(columns["name"]["nullable"])
        self.assertFalse(columns["role"]["nullable"])
        self.assertTrue(columns["firebase_uid"]["nullable"])
        self.assertTrue(columns["password_hash"]["nullable"])

        user_columns = {column.name for column in User.__table__.columns}
        self.assertTrue({"id", "firebase_uid", "password_hash", "email", "name", "role", "phone", "created_at"}.issubset(user_columns))


if __name__ == "__main__":
    unittest.main()
