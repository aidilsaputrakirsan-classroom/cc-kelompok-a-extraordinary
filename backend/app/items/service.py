from sqlalchemy.orm import Session
from app.models.item import Item, ItemImage
from app.items.schemas import ItemCreate, ItemUpdate
from fastapi import HTTPException, status
from datetime import datetime, timezone

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
        # Using a safer smaller bound = 2 * 1024 * 1024 * 1.37 roughly 2.8 million chars
        if len(img.image_data) > 2800000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Validasi gagal: Ukuran foto melewati batas 2 MB"
            )

    new_item = Item(
        type=item_data.type,
        title=item_data.title,
        description=item_data.description,
        category_id=item_data.category_id,
        building_id=item_data.building_id,
        location_id=item_data.location_id,
        security_officer_id=item_data.security_officer_id,
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

def get_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Item).filter(Item.deleted_at == None).offset(skip).limit(limit).all()

def get_item(db: Session, item_id: str):
    return db.query(Item).filter(Item.id == item_id, Item.deleted_at == None).first()

def update_item(db: Session, item_id: str, user_id: str, user_role: str, item_data: ItemUpdate):
    item = get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    if item.created_by != user_id and user_role not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this item")
        
    update_data_dict = item_data.model_dump(exclude_unset=True)
    for key, value in update_data_dict.items():
        setattr(item, key, value)
        
    # Check rule found
    if item.type == "found" and not item.security_officer_id:
        raise HTTPException(status_code=400, detail="Posting found wajib memilih security_officer_id")

    db.commit()
    db.refresh(item)
    return item

def delete_item(db: Session, item_id: str, user_id: str, user_role: str):
    item = get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    if item.created_by != user_id and user_role not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this item")
        
    item.deleted_at = datetime.now(timezone.utc)
    db.commit()
