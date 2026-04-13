from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models.user import User
from app.notifications import schemas, service

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/me", response_model=List[schemas.NotificationResponse])
def get_my_notifications(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return service.get_my_notifications(db, user.id)

@router.put("/{notif_id}/read", response_model=schemas.NotificationResponse)
def mark_read(notif_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return service.mark_as_read(db, notif_id, user.id)

@router.post("/", response_model=schemas.NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_test_notification(data: schemas.NotificationCreate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    """ Testing endpoint to trigger notifications via API """
    return service.create_notification(db, data)
