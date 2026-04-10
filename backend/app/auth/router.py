from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.schemas import LoginRequest, TokenResponse
from app.auth.service import sync_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Login endpoint. 
    Menerima token id dari login klien Firebase dan mengembalikan JWT internal.
    """
    access_token = sync_user(db, request.id_token)
    return TokenResponse(access_token=access_token)
