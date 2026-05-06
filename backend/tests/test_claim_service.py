import os
import unittest

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("SECRET_KEY", "test-secret-key")

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.claims.schemas import ClaimCreate, ClaimStatusUpdate
from app.claims.service import create_claim, update_claim_status
from app.database import Base
from app.models.item import Item
from app.models.master_data import SecurityOfficer
from app.models.notification import Notification
from app.models.user import User


class ClaimServiceNotificationTest(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite+pysqlite:///:memory:")
        testing_session_local = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.engine,
        )
        Base.metadata.create_all(bind=self.engine)
        self.db = testing_session_local()

        self.owner = User(email="owner@itk.ac.id", name="Owner", role="user")
        self.claimant = User(email="claimant@itk.ac.id", name="Claimant", role="user")
        self.admin = User(email="admin@itk.ac.id", name="Admin", role="admin")
        self.superadmin = User(email="superadmin@itk.ac.id", name="Superadmin", role="superadmin")
        self.security_officer = SecurityOfficer(name="Pak Budi")

        self.db.add_all(
            [
                self.owner,
                self.claimant,
                self.admin,
                self.superadmin,
                self.security_officer,
            ]
        )
        self.db.commit()

        self.item = Item(
            type="found",
            status="open",
            title="Dompet Hitam",
            description="Dompet hitam di lobby",
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

    def _messages_for_user(self, user_id):
        return self.db.query(Notification).filter(Notification.user_id == user_id).all()

    def test_create_claim_creates_notifications_for_owner_and_admins(self):
        create_claim(
            self.db,
            user_id=self.claimant.id,
            claim_in=ClaimCreate(item_id=self.item.id, ownership_answer="Ciri dompet saya ada kartu kampus"),
        )

        owner_notifications = self._messages_for_user(self.owner.id)
        admin_notifications = self._messages_for_user(self.admin.id)
        superadmin_notifications = self._messages_for_user(self.superadmin.id)
        claimant_notifications = self._messages_for_user(self.claimant.id)

        self.assertEqual(len(owner_notifications), 1)
        self.assertEqual(owner_notifications[0].title, "Klaim Baru pada Barang Anda")
        self.assertEqual(len(admin_notifications), 1)
        self.assertEqual(admin_notifications[0].title, "Klaim Baru Masuk")
        self.assertEqual(len(superadmin_notifications), 1)
        self.assertEqual(superadmin_notifications[0].title, "Klaim Baru Masuk")
        self.assertEqual(len(claimant_notifications), 0)

    def test_update_claim_status_creates_notifications_for_claim_owner_and_item_owner(self):
        claim = create_claim(
            self.db,
            user_id=self.claimant.id,
            claim_in=ClaimCreate(item_id=self.item.id, ownership_answer="Saya tahu isi dompetnya"),
        )
        self.db.query(Notification).delete()
        self.db.commit()

        update_claim_status(
            self.db,
            claim_id=claim.id,
            payload=ClaimStatusUpdate(status="approved"),
            user_id=self.admin.id,
        )

        owner_notifications = self._messages_for_user(self.owner.id)
        claimant_notifications = self._messages_for_user(self.claimant.id)
        admin_notifications = self._messages_for_user(self.admin.id)

        self.assertEqual(len(claimant_notifications), 1)
        self.assertEqual(claimant_notifications[0].title, "Klaim Disetujui")
        self.assertEqual(len(owner_notifications), 1)
        self.assertEqual(owner_notifications[0].title, "Update Status Klaim")
        self.assertEqual(len(admin_notifications), 0)

    def test_create_claim_skips_duplicate_notification_when_admin_is_item_owner(self):
        """Admin yang juga item owner tidak boleh dapat 2 notif (owner + admin)."""
        admin_item = Item(
            type="found",
            status="open",
            title="Laptop di Perpustakaan",
            description="Laptop ditemukan di perpustakaan",
            security_officer_id=self.security_officer.id,
            created_by=self.admin.id,
        )
        self.db.add(admin_item)
        self.db.commit()
        self.db.refresh(admin_item)

        create_claim(
            self.db,
            user_id=self.claimant.id,
            claim_in=ClaimCreate(item_id=admin_item.id, ownership_answer="Laptop saya warna hitam"),
        )

        admin_notifications = self._messages_for_user(self.admin.id)
        # Admin sebagai item owner dapat 1 notif "Klaim Baru pada Barang Anda"
        # Tapi TIDAK dapat notif tambahan "Klaim Baru Masuk" sebagai admin
        self.assertEqual(len(admin_notifications), 1)
        self.assertEqual(admin_notifications[0].title, "Klaim Baru pada Barang Anda")

    def test_update_claim_status_skips_self_notification_for_item_owner(self):
        claim = create_claim(
            self.db,
            user_id=self.claimant.id,
            claim_in=ClaimCreate(item_id=self.item.id, ownership_answer="Ada gantungan kunci merah"),
        )
        self.db.query(Notification).delete()
        self.db.commit()

        update_claim_status(
            self.db,
            claim_id=claim.id,
            payload=ClaimStatusUpdate(status="approved"),
            user_id=self.owner.id,
        )

        owner_notifications = self._messages_for_user(self.owner.id)
        claimant_notifications = self._messages_for_user(self.claimant.id)

        self.assertEqual(len(claimant_notifications), 1)
        self.assertEqual(claimant_notifications[0].title, "Klaim Disetujui")
        self.assertEqual(len(owner_notifications), 0)


if __name__ == "__main__":
    unittest.main()
