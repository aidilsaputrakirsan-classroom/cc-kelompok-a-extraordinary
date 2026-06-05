from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.auth.router import router as auth_router
from app.config import settings
from app.database import Base, engine, get_db
from app.utils.logging_config import setup_logging
from app.utils.logging_middleware import RequestLoggingMiddleware
from app.utils.metrics import get_prometheus_metrics

# Inisialisasi logging terstruktur
setup_logging()

# Inisialisasi tabel otomatis saat startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Temuin Auth Service",
    description="Identity and Auth Service for Temuin",
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

# Register Request logging middleware
app.add_middleware(RequestLoggingMiddleware)

@app.get("/")
def read_root():
    return {"message": "Welcome to Temuin Auth Service"}

app.include_router(auth_router)

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

@app.get("/metrics", response_class=PlainTextResponse)
def metrics():
    return get_prometheus_metrics()
