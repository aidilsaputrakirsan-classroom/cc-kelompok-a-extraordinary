from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.claim import Claim, ClaimStatusHistory
from app.models.item import Item, ItemStatusHistory
from app.claims.schemas import ClaimCreate, ClaimStatusUpdate

def create_claim(db: Session, user_id: str, claim_in: ClaimCreate) -> Claim:
    item = db.query(Item).filter(Item.id == claim_in.item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    
    if item.type != 'found':
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only 'found' items can be claimed")
        
    if item.status in ["returned", "closed"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Item is already returned or closed")
        
    if item.created_by == user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot claim an item you posted")
        
    active_statuses = ['pending', 'approved', 'completed']
    existing_claim = db.query(Claim).filter(
        Claim.item_id == claim_in.item_id,
        Claim.status.in_(active_statuses)
    ).first()
    
    if existing_claim:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This item already has an active claim")
        
    new_claim = Claim(
        item_id=claim_in.item_id,
        user_id=user_id,
        status="pending",
        ownership_answer=claim_in.ownership_answer
    )
    db.add(new_claim)
    db.commit()
    db.refresh(new_claim)
    
    history = ClaimStatusHistory(
        claim_id=new_claim.id,
        status="pending",
        changed_by=user_id
    )
    db.add(history)
    db.commit()
    
    return new_claim

def get_claims_by_user(db: Session, user_id: str):
    return db.query(Claim).filter(Claim.user_id == user_id).all()

def get_claim_by_id(db: Session, claim_id: str):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found")
    return claim

def get_claims_by_item(db: Session, item_id: str, user_id: str):
    # Retrieve claims for an item. The requester must be the item owner or an admin
    # For now, let's just return them, filtering in router if needed.
    return db.query(Claim).filter(Claim.item_id == item_id).all()

def update_claim_status(db: Session, claim_id: str, payload: ClaimStatusUpdate, user_id: str):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found")

    valid_statuses = ["pending", "approved", "rejected", "completed", "cancelled"]
    if payload.status not in valid_statuses:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status")
        
    item = db.query(Item).filter(Item.id == claim.item_id).first()
    
    # Update claim status
    claim.status = payload.status
    db.add(claim)
    
    # Log claim history
    history = ClaimStatusHistory(
        claim_id=claim.id,
        status=payload.status,
        changed_by=user_id
    )
    db.add(history)
    
    # Sync item status based on claim status
    new_item_status = None
    if payload.status == "approved":
        new_item_status = "in_claim"
    elif payload.status == "completed":
        new_item_status = "returned"
    elif payload.status in ["rejected", "cancelled"]:
        new_item_status = "open"
        
    if new_item_status and item and item.status != new_item_status:
        item.status = new_item_status
        db.add(item)
        item_history = ItemStatusHistory(
            item_id=item.id,
            status=new_item_status,
            changed_by=user_id
        )
        db.add(item_history)
        
    db.commit()
    db.refresh(claim)
    return claim
