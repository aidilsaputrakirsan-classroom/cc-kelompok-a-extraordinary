import unittest

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.auth.service import login_user, register_user
from app.models.user import User


class AuthServiceTest(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite+pysqlite:///:memory:")
        TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        Base.metadata.create_all(bind=self.engine)
        self.db = TestingSessionLocal()

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(bind=self.engine)
        self.engine.dispose()

    def test_register_user_returns_token_and_persists_hash(self):
        token = register_user(self.db, "Test@Student.ITK.AC.ID", "abc12345", "Test User")

        user = self.db.query(User).filter(User.email == "test@student.itk.ac.id").first()
        self.assertIsNotNone(token)
        self.assertIsNotNone(user)
        self.assertEqual(user.role, "user")
        self.assertIsNotNone(user.password_hash)
        self.assertNotEqual(user.password_hash, "abc12345")

    def test_register_rejects_non_itk_email(self):
        with self.assertRaises(HTTPException) as context:
            register_user(self.db, "user@gmail.com", "abc12345", "User")

        self.assertEqual(context.exception.status_code, 403)

    def test_register_rejects_weak_password(self):
        with self.assertRaises(HTTPException) as context:
            register_user(self.db, "user@itk.ac.id", "abcdefg", "User")

        self.assertEqual(context.exception.status_code, 400)

    def test_register_existing_user_with_hash_returns_conflict(self):
        register_user(self.db, "user@itk.ac.id", "abc12345", "User")

        with self.assertRaises(HTTPException) as context:
            register_user(self.db, "user@itk.ac.id", "abc12345", "Other User")

        self.assertEqual(context.exception.status_code, 409)

    def test_register_legacy_user_sets_first_password(self):
        legacy_user = User(
            email="legacy@itk.ac.id",
            name="Legacy Name",
            role="user",
            firebase_uid="legacy-firebase-id",
            password_hash=None,
        )
        self.db.add(legacy_user)
        self.db.commit()

        token = register_user(self.db, "legacy@itk.ac.id", "abc12345", "Updated Legacy")
        updated_user = self.db.query(User).filter(User.email == "legacy@itk.ac.id").first()

        self.assertIsNotNone(token)
        self.assertEqual(updated_user.name, "Updated Legacy")
        self.assertIsNotNone(updated_user.password_hash)

    def test_login_user_returns_token_for_valid_credentials(self):
        register_user(self.db, "user@itk.ac.id", "abc12345", "User")

        token = login_user(self.db, "user@itk.ac.id", "abc12345")

        self.assertIsNotNone(token)

    def test_login_rejects_unknown_email(self):
        with self.assertRaises(HTTPException) as context:
            login_user(self.db, "missing@itk.ac.id", "abc12345")

        self.assertEqual(context.exception.status_code, 401)

    def test_login_rejects_wrong_password(self):
        register_user(self.db, "user@itk.ac.id", "abc12345", "User")

        with self.assertRaises(HTTPException) as context:
            login_user(self.db, "user@itk.ac.id", "wrong123")

        self.assertEqual(context.exception.status_code, 401)

    def test_login_rejects_legacy_user_without_password(self):
        legacy_user = User(
            email="legacy@itk.ac.id",
            name="Legacy User",
            role="user",
            firebase_uid="legacy-firebase-id",
            password_hash=None,
        )
        self.db.add(legacy_user)
        self.db.commit()

        with self.assertRaises(HTTPException) as context:
            login_user(self.db, "legacy@itk.ac.id", "abc12345")

        self.assertEqual(context.exception.status_code, 401)
        self.assertIn("register", context.exception.detail.lower())


if __name__ == "__main__":
    unittest.main()
