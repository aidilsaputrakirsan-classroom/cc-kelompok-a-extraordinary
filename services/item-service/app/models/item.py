import uuid
from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    type = Column(String, nullable=False) # 'lost' or 'found'
    status = Column(String, nullable=False, default="open") # 'open', 'in_claim', 'returned', 'closed'
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    category_id = Column(String, ForeignKey("categories.id"))
    building_id = Column(String, ForeignKey("buildings.id"))
    location_id = Column(String, ForeignKey("locations.id"))
    security_officer_id = Column(String, ForeignKey("security_officers.id"), nullable=True)

    created_by = Column(String) # Referensi cross-service, tidak ada foreign key
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    deleted_at = Column(DateTime, nullable=True)
    images = relationship("ItemImage", backref="item", cascade="all, delete-orphan")

class ItemImage(Base):
    __tablename__ = "item_images"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    item_id = Column(String, ForeignKey("items.id"), nullable=False)
    image_data = Column(Text, nullable=False) # base64 encoded
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

class ItemStatusHistory(Base):
    __tablename__ = "item_status_histories"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    item_id = Column(String, ForeignKey("items.id"), nullable=False)
    status = Column(String, nullable=False)
    changed_by = Column(String, nullable=False) # Referensi cross-service
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
