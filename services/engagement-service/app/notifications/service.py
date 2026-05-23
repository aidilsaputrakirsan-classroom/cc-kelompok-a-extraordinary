from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.notification import Notification
from app.notifications.schemas import NotificationCreate

def create_notification(db: Session, data: NotificationCreate):
    new_notif = Notification(user_id=data.user_id, title=data.title, message=data.message)
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)
    return new_notif

def get_my_notifications(db: Session, user_id: str):
    return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()

def mark_all_as_read(db: Session, user_id: str):
    db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()

def mark_as_read(db: Session, notif_id: str, user_id: str):
    notif = db.query(Notification).filter(Notification.id == notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    if notif.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif
