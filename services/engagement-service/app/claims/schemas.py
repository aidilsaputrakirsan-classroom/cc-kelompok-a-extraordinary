from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, field_validator


class ClaimCreate(BaseModel):
    item_id: str
    ownership_answer: str

    @field_validator("ownership_answer")
    @classmethod
    def validate_ownership_answer(cls, v: str) -> str:
        if len(v.strip()) < 1:
            raise ValueError("Jawaban bukti kepemilikan tidak boleh kosong")
        return v

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
