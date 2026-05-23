from pydantic import BaseModel, ConfigDict
from typing import Optional, Literal
from datetime import datetime

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
    ownership_answer: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
