from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


class NotificationCreate(BaseModel):
    user_id: str
    title: str
    message: str

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        if len(v.strip()) < 1:
            raise ValueError("Title tidak boleh kosong")
        if len(v) > 200:
            raise ValueError("Title maksimal 200 karakter")
        return v

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        if len(v.strip()) < 1:
            raise ValueError("Message tidak boleh kosong")
        if len(v) > 2000:
            raise ValueError("Message maksimal 2000 karakter")
        return v

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
