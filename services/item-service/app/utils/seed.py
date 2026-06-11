"""Master data seeder for item-service.

Dijalankan oleh entrypoint.sh saat container start dengan:
    python -m app.utils.seed

Working from /app (WORKDIR di Dockerfile), modul `app` resolve normal.
"""
import logging

from app.database import SessionLocal
from app.models import Building, Category, Location, SecurityOfficer

logger = logging.getLogger(__name__)


def seed_data():
    logger.info("Connecting to DB for seeding master data...")

    db = SessionLocal()
    try:
        if db.query(Category).count() == 0:
            logger.info("Seeding Categories...")
            for c in ["Elektronik", "Pakaian", "Dokumen", "Lainnya"]:
                db.add(Category(name=c))

        if db.query(Building).count() == 0:
            logger.info("Seeding Buildings...")
            for b in ["Gedung A", "Gedung B", "Gedung C", "Gedung D"]:
                db.add(Building(name=b))

        if db.query(Location).count() == 0:
            logger.info("Seeding Locations...")
            for loc in ["Lobi Utama", "Kantin", "Perpustakaan", "Laboratorium"]:
                db.add(Location(name=loc))

        if db.query(SecurityOfficer).count() == 0:
            logger.info("Seeding Security Officers...")
            for o in ["Pak Budi", "Pak Agus", "Bu Siti"]:
                db.add(SecurityOfficer(name=o))

        db.commit()
        logger.info("Master data seeding complete!")
    except Exception as e:
        logger.error("Error seeding master data: %s", e)
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
