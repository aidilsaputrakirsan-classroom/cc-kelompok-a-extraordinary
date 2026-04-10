from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.schemas import LoginRequest, TokenResponse, UserResponse, UserUpdate
from app.auth.service import sync_user
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Login endpoint. 
    Menerima token id dari login klien Firebase dan mengembalikan JWT internal.
    """
    access_token = sync_user(db, request.id_token)
    return TokenResponse(access_token=access_token)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Mendapatkan profil user yang sedang login.
    """
    return current_user

@router.put("/me", response_model=UserResponse)
def update_me(update_data: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Mengupdate profil user yang sedang login (seperti nama atau no HP).
    """
    current_user.name = update_data.name
    if update_data.phone is not None:
        current_user.phone = update_data.phone
        
    db.commit()
    db.refresh(current_user)
    return current_user

