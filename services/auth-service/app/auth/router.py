from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.schemas import LoginRequest, RegisterRequest, TokenResponse, UserResponse, UserUpdate
from app.auth.service import login_user, register_user
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=TokenResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register user baru dengan email itk.ac.id dan password.
    """
    access_token = register_user(db, request.email, request.password, request.name)
    return TokenResponse(access_token=access_token)

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Login dengan email dan password.
    """
    access_token = login_user(db, request.email, request.password)
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

@router.get("/users/admins", response_model=list[UserResponse], include_in_schema=False)
def get_admins(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """
    Mendapatkan daftar seluruh admin dan superadmin.
    Auth wajib: hanya user yang login (siapa pun) yang boleh akses.
    Endpoint ini dipanggil oleh engagement-service untuk fan-out notifikasi
    klaim baru ke admin. Caller wajib forward JWT bearer.
    """
    admins = db.query(User).filter(User.role.in_(["admin", "superadmin"])).all()
    return admins

@router.get("/users/{user_id}", response_model=UserResponse, include_in_schema=False)
def get_user_by_id(
    user_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """
    Mendapatkan profil user berdasarkan ID.
    Auth wajib: hanya user yang login (siapa pun) yang boleh akses.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

