import httpx
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.claims.router import router as claims_router
from app.config import settings
from app.database import Base, engine, get_db
from app.notifications.router import router as notifications_router
from app.status.router import router as status_router
from app.utils.logging_config import setup_logging
from app.utils.logging_middleware import RequestLoggingMiddleware
from app.utils.metrics import get_prometheus_metrics

# Inisialisasi logging terstruktur
setup_logging()

# Inisialisasi tabel otomatis saat startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Temuin Engagement Service",
    description="Claims, Notifications, and Audit Log Service for Temuin",
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

@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"
    if request.url.path in ("/docs", "/redoc", "/openapi.json"):
        # Swagger UI / ReDoc memuat aset dari cdn.jsdelivr.net; longgarkan CSP khusus path docs
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "img-src 'self' data: https://fastapi.tiangolo.com; "
            "script-src 'self' https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
            "worker-src 'self' blob:"
        )
    else:
        response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none';"
    return response


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    """Normalkan body 422 jadi {"detail": "<pesan>"} (string), konsisten dengan
    HTTPException lain dan kontrak yang dibaca frontend (response.data.detail)."""
    errors = exc.errors()
    if errors:
        msg = str(errors[0].get("msg", "Input tidak valid")).replace("Value error, ", "")
    else:
        msg = "Input tidak valid"
    return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content={"detail": msg})

@app.get("/")
def read_root():
    return {"message": "Welcome to Temuin Engagement Service"}

app.include_router(claims_router)
app.include_router(notifications_router)
app.include_router(status_router)

@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    # 1. Cek DB
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"status": "unhealthy", "database": str(e)}
        ) from e

    # 2. Cek downstream services (auth-service & item-service)
    # Gunakan timeout singkat agar healthcheck responsif
    auth_healthy = False
    try:
        async with httpx.AsyncClient(timeout=1.5) as client:
            res = await client.get(f"{settings.AUTH_SERVICE_URL}/health")
            if res.status_code == 200:
                auth_healthy = True
    except Exception:
        pass

    item_healthy = False
    try:
        async with httpx.AsyncClient(timeout=1.5) as client:
            res = await client.get(f"{settings.ITEM_SERVICE_URL}/health")
            if res.status_code == 200:
                item_healthy = True
    except Exception:
        pass

    # Tentukan status keseluruhan
    overall_status = "healthy" if auth_healthy and item_healthy else "degraded"

    return {
        "status": overall_status,
        "database": "connected",
        "dependencies": {
            "auth_service": "healthy" if auth_healthy else "unhealthy",
            "item_service": "healthy" if item_healthy else "unhealthy"
        }
    }

@app.get("/metrics", response_class=PlainTextResponse, include_in_schema=False)
def metrics():
    return get_prometheus_metrics()
