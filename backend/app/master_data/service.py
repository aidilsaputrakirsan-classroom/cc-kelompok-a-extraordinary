from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.master_data import Category, Building, Location, SecurityOfficer
from app.master_data.schemas import MasterDataCreate

MODEL_MAP = {
    "categories": Category,
    "buildings": Building,
    "locations": Location,
    "security-officers": SecurityOfficer
}

def get_all(db: Session, entity_type: str):
    model = MODEL_MAP.get(entity_type)
    if not model:
        raise HTTPException(status_code=400, detail="Invalid entity type")
    return db.query(model).all()

def create(db: Session, entity_type: str, data: MasterDataCreate):
    model = MODEL_MAP.get(entity_type)
    if not model:
        raise HTTPException(status_code=400, detail="Invalid entity type")
    new_item = model(name=data.name)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

def update(db: Session, entity_type: str, item_id: str, data: MasterDataCreate):
    model = MODEL_MAP.get(entity_type)
    if not model:
        raise HTTPException(status_code=400, detail="Invalid entity type")
    item = db.query(model).filter(model.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item.name = data.name
    db.commit()
    db.refresh(item)
    return item

def delete(db: Session, entity_type: str, item_id: str):
    model = MODEL_MAP.get(entity_type)
    if not model:
        raise HTTPException(status_code=400, detail="Invalid entity type")
    item = db.query(model).filter(model.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
