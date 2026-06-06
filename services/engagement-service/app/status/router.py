import logging
import time

import httpx
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db

logger = logging.getLogger("status_aggregator")

router = APIRouter()

async def check_service_health(name: str, url: str) -> dict:
    start_time = time.perf_counter()
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            response = await client.get(url)
            latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

            if response.status_code == 200:
                return {
                    "name": name,
                    "status": "up",
                    "latency_ms": latency_ms
                }
            else:
                return {
                    "name": name,
                    "status": "down",
                    "latency_ms": latency_ms
                }
    except Exception as exc:
        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
        logger.error(f"Service {name} healthcheck failed: {exc}")
        return {
            "name": name,
            "status": "down",
            "latency_ms": latency_ms
        }

@router.get("/status")
async def get_all_services_status(db: Session = Depends(get_db)):
    # 1. Cek Auth Service
    auth_health_url = f"{settings.AUTH_SERVICE_URL}/health"
    auth_status = await check_service_health("auth", auth_health_url)

    # 2. Cek Item Service
    item_health_url = f"{settings.ITEM_SERVICE_URL}/health"
    item_status = await check_service_health("item", item_health_url)

    # 3. Cek Engagement Service (Self)
    start_time = time.perf_counter()
    try:
        db.execute(text("SELECT 1"))
        self_status = "up"
    except Exception:
        self_status = "down"
    latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

    engagement_status = {
        "name": "engagement",
        "status": self_status,
        "latency_ms": latency_ms
    }

    return {
        "services": [
            auth_status,
            item_status,
            engagement_status
        ]
    }

# Also support status under /api/status if Nginx passes it directly
@router.get("/api/status")
async def get_all_services_status_api(db: Session = Depends(get_db)):
    return await get_all_services_status(db)
