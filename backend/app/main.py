from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
import firebase_admin
from firebase_admin import credentials
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
    allow_origins=["*"], # TODO: Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin
if not firebase_admin._apps:
    try:
        if settings.FIREBASE_CREDENTIALS_FILE:
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_FILE)
            firebase_admin.initialize_app(cred)
            print("Firebase Admin initialized with credentials file.")
        else:
            firebase_admin.initialize_app()
            print("Firebase Admin initialized with default credentials.")
    except Exception as e:
        print(f"Error initializing Firebase Admin: {e}")


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
        return {"status": "unhealthy", "database": str(e)}
