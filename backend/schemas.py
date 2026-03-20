import re
from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional
from datetime import datetime


# === BASE SCHEMA ===
class ItemBase(BaseModel):
    """Base schema — field yang dipakai untuk create & update."""
    name: str = Field(..., min_length=1, max_length=100, examples=["Laptop"])
    description: Optional[str] = Field(None, examples=["Laptop untuk cloud computing"])
    price: float = Field(..., gt=0, examples=[15000000])
    quantity: int = Field(0, ge=0, examples=[10])


# === CREATE SCHEMA (untuk POST request) ===
class ItemCreate(ItemBase):
    """Schema untuk membuat item baru. Mewarisi semua field dari ItemBase."""
    pass


# === UPDATE SCHEMA (untuk PUT request) ===
class ItemUpdate(BaseModel):
    """
    Schema untuk update item. Semua field optional 
    karena user mungkin hanya ingin update sebagian field.
    """
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=0)


# === RESPONSE SCHEMA (untuk output) ===
class ItemResponse(ItemBase):
    """Schema untuk response. Termasuk id dan timestamp dari database."""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # Agar bisa convert dari SQLAlchemy model


# === LIST RESPONSE (dengan metadata) ===
class ItemListResponse(BaseModel):
    """Schema untuk response list items dengan total count."""
    total: int
    items: list[ItemResponse]


# ============================================================
# AUTH SCHEMAS
# ============================================================

class UserCreate(BaseModel):
    """Schema untuk registrasi user baru."""
    email: EmailStr = Field(..., examples=["user@student.itk.ac.id"])
    name: str = Field(..., min_length=2, max_length=100, examples=["Raisha Alika"])
    password: str = Field(..., min_length=8, examples=["Passw0rd!"])

    @field_validator("email")
    @classmethod
    def email_normalize(cls, v: str) -> str:
        """Normalisasi email ke lowercase."""
        return v.strip().lower()

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        """
        Validasi kekuatan password menggunakan regex:
        - Minimal 8 karakter
        - Harus mengandung minimal 1 huruf
        - Harus mengandung minimal 1 angka
        - Harus mengandung minimal 1 karakter spesial
        """
        if len(v) < 8:
            raise ValueError("Password harus minimal 8 karakter")
        if not re.search(r"[A-Za-z]", v):
            raise ValueError("Password harus mengandung minimal 1 huruf")
        if not re.search(r"\d", v):
            raise ValueError("Password harus mengandung minimal 1 angka")
        if not re.search(r"[@$!%*#?&]", v):
            raise ValueError("Password harus mengandung minimal 1 karakter spesial (@$!%*#?&)")
        return v

    @field_validator("name")
    @classmethod
    def name_sanitize(cls, v: str) -> str:
        """Trim spasi dan cegah karakter berbahaya di nama."""
        v = v.strip()
        if not v:
            raise ValueError("Nama tidak boleh kosong")
        if re.search(r"[<>\"\';]", v):
            raise ValueError("Nama mengandung karakter yang tidak diizinkan")
        return v


class UserResponse(BaseModel):
    """Schema untuk response user (tanpa password)."""
    id: int
    email: str
    name: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    """Schema untuk login request."""
    email: EmailStr = Field(..., examples=["user@student.itk.ac.id"])
    password: str = Field(..., min_length=1, examples=["Passw0rd!"])


class TokenResponse(BaseModel):
    """Schema untuk response setelah login berhasil."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse