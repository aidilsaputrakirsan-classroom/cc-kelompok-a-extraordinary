from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

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
