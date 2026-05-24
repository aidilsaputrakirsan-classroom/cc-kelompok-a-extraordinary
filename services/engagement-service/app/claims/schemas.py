from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class ClaimCreate(BaseModel):
    item_id: str
    ownership_answer: str

class ClaimStatusUpdate(BaseModel):
    status: Literal["approved", "rejected", "completed", "cancelled"]

class ClaimResponse(BaseModel):
    id: str
    item_id: str
    user_id: str
    status: str
    ownership_answer: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
