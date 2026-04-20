import os
import unittest

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("SECRET_KEY", "test-secret-key")

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.items.schemas import ItemUpdate
from app.items.service import update_item
from app.models.item import Item
from app.models.master_data import Building, Category, Location, SecurityOfficer
from app.models.user import User


class ItemServiceTest(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite+pysqlite:///:memory:")
        TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        Base.metadata.create_all(bind=self.engine)
        self.db = TestingSessionLocal()

        self.owner = User(email="owner@itk.ac.id", name="Owner", role="user")
        self.admin = User(email="admin@itk.ac.id", name="Admin", role="admin")
        self.security_officer = SecurityOfficer(name="Pak Budi")
        self.db.add_all([
            self.owner,
            self.admin,
            Category(name="Elektronik"),
            Building(name="Gedung A"),
            Location(name="Lobby"),
            self.security_officer,
        ])
        self.db.commit()

        self.item = Item(
            type="found",
            status="open",
            title="Dompet",
            description="Dompet hitam",
            security_officer_id=self.security_officer.id,
            created_by=self.owner.id,
        )
        self.db.add(self.item)
        self.db.commit()
        self.db.refresh(self.item)

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(bind=self.engine)
        self.engine.dispose()

    def test_owner_can_update_non_status_fields(self):
        updated_item = update_item(
            self.db,
            item_id=self.item.id,
            user_id=self.owner.id,
            user_role="user",
            item_data=ItemUpdate(title="Dompet Kulit"),
        )

        self.assertEqual(updated_item.title, "Dompet Kulit")
        self.assertEqual(updated_item.status, "open")

    def test_owner_cannot_update_status(self):
        with self.assertRaises(HTTPException) as context:
            update_item(
                self.db,
                item_id=self.item.id,
                user_id=self.owner.id,
                user_role="user",
                item_data=ItemUpdate(status="closed"),
            )

        self.assertEqual(context.exception.status_code, 403)

    def test_admin_can_update_status(self):
        updated_item = update_item(
            self.db,
            item_id=self.item.id,
            user_id=self.admin.id,
            user_role="admin",
            item_data=ItemUpdate(status="returned"),
        )

        self.assertEqual(updated_item.status, "returned")


if __name__ == "__main__":
    unittest.main()
