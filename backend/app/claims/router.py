from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.claims import schemas, service

router = APIRouter(
    prefix="/claims",
    tags=["claims"]
)

@router.post("/", response_model=schemas.ClaimResponse, status_code=status.HTTP_201_CREATED)
def create_claim(
    claim_in: schemas.ClaimCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Buat claim baru untuk barang temuan (found item).
    Memastikan hanya ada satu claim aktif untuk item tersebut.
    """
    return service.create_claim(db=db, user_id=current_user.id, claim_in=claim_in)

@router.get("/me", response_model=List[schemas.ClaimResponse])
def get_my_claims(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Ambil semua claim yang dibuat oleh user yang sedang login.
    """
    return service.get_claims_by_user(db=db, user_id=current_user.id)

@router.get("/{claim_id}", response_model=schemas.ClaimResponse)
def get_claim_detail(
    claim_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Ambil detail dari suatu claim berdasarkan ID.
    """
    return service.get_claim_by_id(db=db, claim_id=claim_id)

@router.get("/", response_model=List[schemas.ClaimResponse])
def get_claims_for_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Ambil semua claim untuk suatu item. Biasanya dipakai oleh pemilik item untuk me-review.
    """
    return service.get_claims_by_item(db=db, item_id=item_id, user_id=current_user.id)
