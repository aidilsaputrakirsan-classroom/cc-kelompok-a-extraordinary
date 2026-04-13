from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models.user import User
from app.master_data import schemas, service

router = APIRouter(prefix="/master-data", tags=["master_data"])


@router.get("/{entity_type}", response_model=List[schemas.MasterDataResponse])
def get_master_data(entity_type: str, db: Session = Depends(get_db)):
    """ Ambil semua master data untuk entity tertentu (categories, buildings, locations, security-officers) """
    return service.get_all(db, entity_type)

@router.post("/{entity_type}", response_model=schemas.MasterDataResponse, status_code=status.HTTP_201_CREATED)
def create_master_data(entity_type: str, data: schemas.MasterDataCreate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    return service.create(db, entity_type, data)

@router.put("/{entity_type}/{id}", response_model=schemas.MasterDataResponse)
def update_master_data(entity_type: str, id: str, data: schemas.MasterDataCreate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    return service.update(db, entity_type, id, data)

@router.delete("/{entity_type}/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_master_data(entity_type: str, id: str, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    service.delete(db, entity_type, id)
    return None
