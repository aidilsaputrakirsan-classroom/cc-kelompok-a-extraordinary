from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ClaimCreate(BaseModel):
    item_id: str
    ownership_answer: str

class ClaimStatusUpdate(BaseModel):
    status: str

class ClaimResponse(BaseModel):
    id: str
    item_id: str
    user_id: str
    status: str
    ownership_answer: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
