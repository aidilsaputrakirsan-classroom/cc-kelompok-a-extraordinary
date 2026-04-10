from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

class ImageCreate(BaseModel):
    image_data: str
    display_order: int = 0

class ItemCreate(BaseModel):
    type: str = Field(..., pattern="^(lost|found)$")
    title: str
    description: Optional[str] = None
    category_id: Optional[str] = None
    building_id: Optional[str] = None
    location_id: Optional[str] = None
    security_officer_id: Optional[str] = None
    images: List[ImageCreate] = []

class ItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[str] = None
    building_id: Optional[str] = None
    location_id: Optional[str] = None
    security_officer_id: Optional[str] = None
    # Assuming update images can be complex, skipping image updates in basic CRUD
    
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
    description: Optional[str] = None
    category_id: Optional[str] = None
    building_id: Optional[str] = None
    location_id: Optional[str] = None
    security_officer_id: Optional[str] = None
    created_by: str
    created_at: datetime
    images: List[ImageResponse] = []
    
    model_config = ConfigDict(from_attributes=True)
