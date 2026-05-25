from datetime import UTC, datetime

from fastapi import HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.items.schemas import ItemCreate, ItemUpdate
from app.models.item import Item, ItemImage, ItemStatusHistory


def create_item(db: Session, user_id: str, item_data: ItemCreate):
    if item_data.type == "found" and not item_data.security_officer_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Validasi gagal: Posting found wajib memilih security_officer_id"
        )

    if len(item_data.images) > 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Validasi gagal: Maksimal 4 foto per item"
        )

    for img in item_data.images:
        # Check base64 rough size estimate (2MB limit = ~2.66MB in base64 strings)
        if len(img.image_data) > 2800000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Validasi gagal: Ukuran foto melewati batas 2 MB"
            )

    new_item = Item(
        type=item_data.type,
        title=item_data.title,
        description=item_data.description,
        category_id=item_data.category_id or None,
        building_id=item_data.building_id or None,
        location_id=item_data.location_id or None,
        security_officer_id=item_data.security_officer_id or None,
        created_by=user_id,
        status="open"
    )
    db.add(new_item)
    db.flush() # flush to get new_item.id

    for img in item_data.images:
        new_img = ItemImage(
            item_id=new_item.id,
            image_data=img.image_data,
            display_order=img.display_order
        )
        db.add(new_img)

    db.commit()
    db.refresh(new_item)
    return new_item

def get_items_by_user(db: Session, user_id: str):
    return db.query(Item).filter(
        Item.created_by == user_id,
        Item.deleted_at.is_(None)
    ).order_by(Item.created_at.desc()).all()

def get_items(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
    type: str | None = None,
    status: str | None = None,
    category_id: str | None = None,
    building_id: str | None = None,
    location_id: str | None = None
):
    query = db.query(Item).filter(Item.deleted_at.is_(None))

    if search:
        escaped = search.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        query = query.filter(or_(Item.title.ilike(f"%{escaped}%", escape="\\"), Item.description.ilike(f"%{escaped}%", escape="\\")))
    if type:
        query = query.filter(Item.type == type)
    if status:
        query = query.filter(Item.status == status)
    if category_id:
        query = query.filter(Item.category_id == category_id)
    if building_id:
        query = query.filter(Item.building_id == building_id)
    if location_id:
        query = query.filter(Item.location_id == location_id)

    query = query.order_by(Item.created_at.desc())
    return query.offset(skip).limit(limit).all()

def get_item(db: Session, item_id: str):
    return db.query(Item).filter(Item.id == item_id, Item.deleted_at.is_(None)).first()

def update_item(db: Session, item_id: str, user_id: str, user_role: str, item_data: ItemUpdate):
    item = get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if item.created_by != user_id and user_role not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this item")

    update_data_dict = item_data.model_dump(exclude_unset=True)
    if "status" in update_data_dict and user_role not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not authorized to update item status")

    for key, value in update_data_dict.items():
        setattr(item, key, value)

    # Check rule found
    if item.type == "found" and not item.security_officer_id:
        raise HTTPException(status_code=400, detail="Posting found wajib memilih security_officer_id")

    db.commit()
    db.refresh(item)
    return item

def update_item_status(db: Session, item_id: str, new_status: str, changed_by: str, user_role: str):
    item = get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Authorization: hanya item owner atau admin/superadmin yang boleh ubah status.
    # Endpoint ini juga dipanggil oleh engagement-service saat update_claim_status,
    # dengan JWT bearer caller asli (yang sudah dicek sebagai item owner / admin
    # di engagement-service). Jadi di sini cukup re-validate berdasarkan JWT role.
    is_admin = user_role in ["admin", "superadmin"]
    is_owner = item.created_by == changed_by
    if not is_admin and not is_owner:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to update this item status",
        )

    if item.status != new_status:
        item.status = new_status
        db.add(item)

        item_history = ItemStatusHistory(
            item_id=item.id,
            status=new_status,
            changed_by=changed_by
        )
        db.add(item_history)
        db.commit()
        db.refresh(item)

    return item

def delete_item(db: Session, item_id: str, user_id: str, user_role: str):
    item = get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if item.created_by != user_id and user_role not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this item")

    item.deleted_at = datetime.now(UTC)
    db.commit()
