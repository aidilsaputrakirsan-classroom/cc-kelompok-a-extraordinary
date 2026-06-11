import re
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator


class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        email_regex = re.compile(r"^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9-]+\.)*itk\.ac\.id$", re.IGNORECASE)
        if not email_regex.match(v):
            raise ValueError("Hanya email dengan domain itk.ac.id yang diperbolehkan")
        return v.lower()

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password minimal 8 karakter")
        if not re.search(r"[a-zA-Z]", v) or not re.search(r"\d", v):
            raise ValueError("Password harus mengandung huruf dan angka")
        return v

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if len(v) < 2 or len(v) > 200:
            raise ValueError("Nama harus berukuran 2 sampai 200 karakter")
        return v


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        email_regex = re.compile(r"^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9-]+\.)*itk\.ac\.id$", re.IGNORECASE)
        if not email_regex.match(v):
            raise ValueError("Hanya email dengan domain itk.ac.id yang diperbolehkan")
        return v.lower()


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserBase(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if len(v) < 2 or len(v) > 200:
            raise ValueError("Nama harus berukuran 2 sampai 200 karakter")
        return v

    phone: str | None = None


class UserUpdate(UserBase):
    pass


class UserResponse(UserBase):
    id: str
    email: str
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
