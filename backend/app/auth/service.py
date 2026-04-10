from datetime import datetime, timedelta, timezone
from jose import jwt
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.config import settings
from app.models.user import User
from app.auth.firebase import verify_firebase_token

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def sync_user(db: Session, id_token: str) -> str:
    # Verify Firebase token
    decoded_token = verify_firebase_token(id_token)
    
    email = decoded_token.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email is required from identity provider"
        )
        
    # Validasi domain itk.ac.id
    if not email.endswith("itk.ac.id"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Hanya email itk.ac.id yang diizinkan"
        )
        
    firebase_uid = decoded_token.get("uid")
    # Nama biasanya ada di dalam token google sign in
    name = decoded_token.get("name", email.split("@")[0])
    
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
    if not user:
        # Check by email in case we want to support multiple providers linking 
        # or fixing past account states
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            # Create new user internal
            user = User(
                firebase_uid=firebase_uid,
                email=email,
                name=name,
                role="user"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Link existing email to this firebase UID
            user.firebase_uid = firebase_uid
            db.commit()
            db.refresh(user)
            
    # Generate internal JWT
    access_token = create_access_token(data={"sub": user.email, "role": user.role, "id": user.id})
    return access_token
