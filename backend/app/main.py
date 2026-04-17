from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.config import settings
from app.auth.router import router as auth_router
from app.items.router import router as items_router
from app.claims.router import router as claims_router
from app.master_data.router import router as master_data_router
from app.notifications.router import router as notifications_router

app = FastAPI(
    title="Temuin API",
    description="API for Temuin - Lost and Found System",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to Temuin API"}

app.include_router(auth_router)
app.include_router(items_router)
app.include_router(claims_router)
app.include_router(master_data_router)
app.include_router(notifications_router)

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Check DB connection
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"status": "unhealthy", "database": str(e)}
        )
