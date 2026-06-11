from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ImageCreate(BaseModel):
    image_data: str
    display_order: int = 0

class ItemCreate(BaseModel):
    type: str = Field(..., pattern="^(lost|found)$")
    title: str
    description: str | None = None
    category_id: str | None = None
    building_id: str | None = None
    location_id: str | None = None
    security_officer_id: str | None = None
    images: list[ImageCreate] = []

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        if len(v.strip()) < 1:
            raise ValueError("Title tidak boleh kosong")
        if len(v) > 200:
            raise ValueError("Title maksimal 200 karakter")
        return v

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str | None) -> str | None:
        if v is not None and len(v) > 2000:
            raise ValueError("Description maksimal 2000 karakter")
        return v

class ItemUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category_id: str | None = None
    building_id: str | None = None
    location_id: str | None = None
    security_officer_id: str | None = None
    status: str | None = Field(None, pattern="^(open|in_claim|returned|closed)$")

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str | None) -> str | None:
        if v is not None:
            if len(v.strip()) < 1:
                raise ValueError("Title tidak boleh kosong")
            if len(v) > 200:
                raise ValueError("Title maksimal 200 karakter")
        return v

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str | None) -> str | None:
        if v is not None and len(v) > 2000:
            raise ValueError("Description maksimal 2000 karakter")
        return v

class ItemStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(open|in_claim|returned|closed)$")

class ImageResponse(BaseModel):
    id: str
    image_data: str
    display_order: int

    model_config = ConfigDict(from_attributes=True)

class ItemResponse(BaseModel):
    id: str
    type: str
    status: str
    title: str
    description: str | None = None
    category_id: str | None = None
    building_id: str | None = None
    location_id: str | None = None
    security_officer_id: str | None = None
    created_by: str
    created_at: datetime
    images: list[ImageResponse] = []

    model_config = ConfigDict(from_attributes=True)
