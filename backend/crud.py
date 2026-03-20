from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Item, User
from schemas import ItemCreate, ItemUpdate, UserCreate
from auth import hash_password, verify_password


def create_item(db: Session, item_data: ItemCreate) -> Item:
    """Buat item baru di database."""
    db_item = Item(**item_data.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_items(db: Session, skip: int = 0, limit: int = 20, search: str = None):
    """
    Ambil daftar items dengan pagination & search.
    - skip: jumlah data yang di-skip (untuk pagination)
    - limit: jumlah data per halaman
    - search: cari berdasarkan nama atau deskripsi
    """
    query = db.query(Item)
    
    if search:
        query = query.filter(
            or_(
                Item.name.ilike(f"%{search}%"),
                Item.description.ilike(f"%{search}%")
            )
        )
    
    total = query.count()
    items = query.order_by(Item.created_at.desc()).offset(skip).limit(limit).all()
    
    return {"total": total, "items": items}


def get_item(db: Session, item_id: int) -> Item | None:
    """Ambil satu item berdasarkan ID."""
    return db.query(Item).filter(Item.id == item_id).first()


def update_item(db: Session, item_id: int, item_data: ItemUpdate) -> Item | None:
    """
    Update item berdasarkan ID.
    Hanya update field yang dikirim (bukan None).
    """
    db_item = db.query(Item).filter(Item.id == item_id).first()
    
    if not db_item:
        return None
    
    # Hanya update field yang dikirim (exclude_unset=True)
    update_data = item_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_item, field, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item


def delete_item(db: Session, item_id: int) -> bool:
    """Hapus item berdasarkan ID. Return True jika berhasil."""
    db_item = db.query(Item).filter(Item.id == item_id).first()
    
    if not db_item:
        return False
    
    db.delete(db_item)
    db.commit()
    return True

def get_items_stats(db: Session):
    """
    Hitung statistik inventory: total item, total nilai, item termahal & termurah.
    Handle edge cases: data kosong, price/quantity null.
    """
    items = db.query(Item).all()
    
    if not items:
        return {
            "total_items": 0,
            "total_value": 0.0,
            "most_expensive": None,
            "cheapest": None
        }

    # Filter hanya item yang price dan quantity valid (tidak None)
    valid_items = [item for item in items if item.price is not None and item.quantity is not None]

    if not valid_items:
        return {
            "total_items": len(items),  # tetap hitung semua item
            "total_value": 0.0,
            "most_expensive": None,
            "cheapest": None
        }

    total_items = len(valid_items)
    total_value = sum(item.price * item.quantity for item in valid_items)
    
    most_expensive_item = max(valid_items, key=lambda x: x.price)
    cheapest_item = min(valid_items, key=lambda x: x.price)

    return {
        "total_items": total_items,
        "total_value": float(total_value),
        "most_expensive": {
            "name": most_expensive_item.name,
            "price": float(most_expensive_item.price)
        },
        "cheapest": {
            "name": cheapest_item.name,
            "price": float(cheapest_item.price)
        }
    }


# ==================== USER CRUD ====================

def create_user(db: Session, user_data: UserCreate) -> User:
    """Buat user baru dengan password yang di-hash."""
    # Cek apakah email sudah terdaftar
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        return None  # Email sudah dipakai

    db_user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hash_password(user_data.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """Autentikasi user: cek email & password."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user