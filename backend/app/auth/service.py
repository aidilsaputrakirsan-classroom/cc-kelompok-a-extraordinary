from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config import settings
from app.models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def validate_password(password: str) -> None:
    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password minimal 8 karakter"
        )

    if not any(char.isalpha() for char in password) or not any(char.isdigit() for char in password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password harus mengandung huruf dan angka"
        )

def validate_itk_email(email: str) -> str:
    normalized_email = email.strip().lower()
    if not normalized_email.endswith("itk.ac.id"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hanya email itk.ac.id yang diizinkan"
        )
    return normalized_email

def register_user(db: Session, email: str, password: str, name: str) -> str:
    normalized_email = validate_itk_email(email)
    validate_password(password)

    existing = db.query(User).filter(User.email == normalized_email).first()
    if existing:
        if existing.password_hash is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email sudah terdaftar"
            )

        existing.password_hash = hash_password(password)
        existing.name = name
        db.commit()
        db.refresh(existing)
        user = existing
    else:
        user = User(
            email=normalized_email,
            name=name,
            password_hash=hash_password(password),
            role="user"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return create_access_token(data={"sub": user.email, "role": user.role, "id": user.id})

def login_user(db: Session, email: str, password: str) -> str:
    normalized_email = email.strip().lower()
    user = db.query(User).filter(User.email == normalized_email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah"
        )

    if not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Akun ini belum memiliki password. Silakan register terlebih dahulu."
        )

    if not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah"
        )

    return create_access_token(data={"sub": user.email, "role": user.role, "id": user.id})
