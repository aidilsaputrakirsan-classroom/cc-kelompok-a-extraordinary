import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database import engine, Base, SessionLocal
from app.models import Category, Building, Location, SecurityOfficer

def seed_data():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # categories
        if db.query(Category).count() == 0:
            print("Seeding Categories...")
            categories = ["Elektronik", "Pakaian", "Dokumen", "Lainnya"]
            for c in categories:
                db.add(Category(name=c))
                
        # buildings
        if db.query(Building).count() == 0:
            print("Seeding Buildings...")
            buildings = ["Gedung A", "Gedung B", "Gedung C", "Gedung D"]
            for b in buildings:
                db.add(Building(name=b))
                
        # locations
        if db.query(Location).count() == 0:
            print("Seeding Locations...")
            locations = ["Lobi Utama", "Kantin", "Perpustakaan", "Laboratorium"]
            for l in locations:
                db.add(Location(name=l))
                
        # security officers
        if db.query(SecurityOfficer).count() == 0:
            print("Seeding Security Officers...")
            officers = ["Pak Budi", "Pak Agus", "Bu Siti"]
            for o in officers:
                db.add(SecurityOfficer(name=o))
                
        db.commit()
        print("Seeding complete!")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
