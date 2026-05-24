import uuid
from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, ForeignKey, String, Text

from app.database import Base


class Claim(Base):
    __tablename__ = "claims"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    item_id = Column(String, nullable=False) # Referensi cross-service
    user_id = Column(String, nullable=False) # Referensi cross-service
    status = Column(String, nullable=False, default="pending")
    ownership_answer = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

class ClaimStatusHistory(Base):
    __tablename__ = "claim_status_histories"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    claim_id = Column(String, ForeignKey("claims.id"), nullable=False)
    status = Column(String, nullable=False)
    changed_by = Column(String, nullable=False) # Referensi cross-service
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
