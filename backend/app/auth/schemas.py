from pydantic import BaseModel

class LoginRequest(BaseModel):
    id_token: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

from typing import Optional
from datetime import datetime
from pydantic import ConfigDict

class UserBase(BaseModel):
    name: str
    phone: Optional[str] = None

class UserUpdate(UserBase):
    pass

class UserResponse(UserBase):
    id: str
    email: str
    role: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

