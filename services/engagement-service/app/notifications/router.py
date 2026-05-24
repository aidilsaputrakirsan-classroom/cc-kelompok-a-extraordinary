from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import CurrentUser, get_current_user
from app.notifications import schemas, service

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/me", response_model=list[schemas.NotificationResponse])
def get_my_notifications(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    return service.get_my_notifications(db, user.id)


@router.put("/read-all", status_code=status.HTTP_204_NO_CONTENT)
def mark_all_read(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    service.mark_all_as_read(db, user.id)
    return None


@router.put("/{notif_id}/read", response_model=schemas.NotificationResponse)
def mark_read(
    notif_id: str,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    return service.mark_as_read(db, notif_id, user.id)
