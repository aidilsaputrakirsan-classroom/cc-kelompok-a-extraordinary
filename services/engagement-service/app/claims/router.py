
from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.claims import schemas, service
from app.database import get_db
from app.dependencies import CurrentUser, get_current_user, security

router = APIRouter(
    prefix="/claims",
    tags=["claims"]
)

@router.post("/", response_model=schemas.ClaimResponse, status_code=status.HTTP_201_CREATED)
def create_claim(
    claim_in: schemas.ClaimCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Buat claim baru untuk barang temuan (found item).
    Memastikan hanya ada satu claim aktif untuk item tersebut.
    """
    jwt_token = credentials.credentials
    return service.create_claim(db=db, user_id=current_user.id, claim_in=claim_in, jwt_token=jwt_token)

@router.get("/me", response_model=list[schemas.ClaimResponse])
def get_my_claims(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Ambil semua claim yang dibuat oleh user yang sedang login.
    """
    return service.get_claims_by_user(db=db, user_id=current_user.id)

@router.get("/{claim_id}", response_model=schemas.ClaimResponse)
def get_claim_detail(
    claim_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Ambil detail dari suatu claim berdasarkan ID.
    """
    jwt_token = credentials.credentials
    return service.get_claim_by_id(
        db=db, claim_id=claim_id, user_id=current_user.id,
        user_role=current_user.role, jwt_token=jwt_token
    )

@router.get("/", response_model=list[schemas.ClaimResponse])
def get_claims_for_item(
    item_id: str | None = None,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Ambil semua claim untuk suatu item (bila item_id disebutkan), atau ambil seluruh claim (jika admin).
    """
    jwt_token = credentials.credentials
    return service.get_claims_by_item(
        db=db, item_id=item_id, user_id=current_user.id,
        user_role=current_user.role, jwt_token=jwt_token
    )

@router.put("/{claim_id}/status", response_model=schemas.ClaimResponse)
def update_claim_status(
    claim_id: str,
    payload: schemas.ClaimStatusUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Ubah status klaim (misal: dirubah oleh pemilik item menjadi approved atau rejected).
    Ini juga akan mensinkronkan status item terkait.
    """
    jwt_token = credentials.credentials
    return service.update_claim_status(
        db=db, claim_id=claim_id, payload=payload, user_id=current_user.id,
        user_role=current_user.role, jwt_token=jwt_token
    )
