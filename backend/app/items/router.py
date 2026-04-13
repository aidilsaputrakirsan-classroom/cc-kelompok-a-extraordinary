from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.items import schemas, service

router = APIRouter(prefix="/items", tags=["Items"])

@router.post("/", response_model=schemas.ItemResponse)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.create_item(db=db, user_id=current_user.id, item_data=item)

@router.get("/", response_model=List[schemas.ItemResponse])
def list_items(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    type: Optional[str] = None,
    status: Optional[str] = None,
    category_id: Optional[str] = None,
    building_id: Optional[str] = None,
    location_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return service.get_items(
        db=db, skip=skip, limit=limit, search=search, 
        type=type, status=status, category_id=category_id, 
        building_id=building_id, location_id=location_id
    )

@router.get("/{item_id}", response_model=schemas.ItemResponse)
def get_item(item_id: str, db: Session = Depends(get_db)):
    item = service.get_item(db=db, item_id=item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.put("/{item_id}", response_model=schemas.ItemResponse)
def update_item(item_id: str, item_data: schemas.ItemUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.update_item(db=db, item_id=item_id, user_id=current_user.id, user_role=current_user.role, item_data=item_data)

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service.delete_item(db=db, item_id=item_id, user_id=current_user.id, user_role=current_user.role)
    return None
