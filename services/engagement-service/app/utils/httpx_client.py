import time
import httpx
import logging
from fastapi import HTTPException
from app.config import settings
from app.utils.logging_config import correlation_id_ctx

logger = logging.getLogger("httpx_client")

TIMEOUT = 5.0
CB_FAILURES_THRESHOLD = 5
CB_FAILURE_WINDOW = 30.0 # seconds
CB_COOLDOWN = 60.0 # seconds

class CircuitBreaker:
    def __init__(self, name: str):
        self.name = name
        self.state = "CLOSED" # CLOSED, OPEN, HALF_OPEN
        self.failures = [] # timestamps of failures
        self.last_state_change = time.time()
        
    def check_state(self):
        now = time.time()
        if self.state == "OPEN":
            if now - self.last_state_change > CB_COOLDOWN:
                self.state = "HALF_OPEN"
                self.last_state_change = now
                logger.info(f"Circuit Breaker [{self.name}] transitioned to HALF_OPEN")
        return self.state

    def record_success(self):
        if self.state == "HALF_OPEN":
            self.state = "CLOSED"
            self.failures = []
            self.last_state_change = time.time()
            logger.info(f"Circuit Breaker [{self.name}] transitioned to CLOSED")
            
    def record_failure(self):
        now = time.time()
        self.failures.append(now)
        # Filter failures within window
        self.failures = [t for t in self.failures if now - t <= CB_FAILURE_WINDOW]
        
        if self.state == "HALF_OPEN":
            self.state = "OPEN"
            self.last_state_change = now
            logger.warning(f"Circuit Breaker [{self.name}] transitioned to OPEN (failed in HALF_OPEN)")
        elif self.state == "CLOSED" and len(self.failures) >= CB_FAILURES_THRESHOLD:
            self.state = "OPEN"
            self.last_state_change = now
            logger.warning(f"Circuit Breaker [{self.name}] transitioned to OPEN (failures: {len(self.failures)})")

# Instansiasi circuit breaker untuk masing-masing downstream service
item_service_cb = CircuitBreaker("item-service")
auth_service_cb = CircuitBreaker("auth-service")

def request_with_retry_and_cb(cb: CircuitBreaker, method: str, url: str, **kwargs) -> httpx.Response:
    # 1. Periksa status circuit breaker
    state = cb.check_state()
    if state == "OPEN":
        logger.warning(f"Circuit Breaker [{cb.name}] is OPEN. Blocking request to {url}")
        raise httpx.HTTPError(f"Circuit Breaker [{cb.name}] is OPEN")

    # 2. Sisipkan X-Correlation-ID header
    if "headers" not in kwargs:
        kwargs["headers"] = {}
    
    corr_id = correlation_id_ctx.get()
    if corr_id and corr_id != "-":
        kwargs["headers"]["X-Correlation-ID"] = corr_id

    # 3. Retry configuration
    retries = 3
    backoff_factors = [0.5, 1.0, 2.0]
    
    for attempt in range(retries + 1):
        try:
            with httpx.Client(timeout=TIMEOUT) as client:
                response = client.request(method, url, **kwargs)
                
                # Check if status code is retryable (500, 502, 503, 504)
                if response.status_code in [500, 502, 503, 504]:
                    response.raise_for_status() # Trigger except block to retry
                
                # Request berhasil sepenuhnya
                cb.record_success()
                return response
                
        except (httpx.HTTPStatusError, httpx.RequestError) as exc:
            # Check if this status code is non-retryable (400, 401, 403, 404)
            if isinstance(exc, httpx.HTTPStatusError):
                status_code = exc.response.status_code
                if status_code in [400, 401, 403, 404]:
                    # Jangan di-retry, dan catat sebagai status error tapi bukan failure circuit breaker
                    raise exc
            
            # Jika di sini, berarti error retryable (5xx, timeout, atau connection error)
            logger.warning(f"Request to {url} failed (attempt {attempt+1}/{retries+1}): {exc}")
            
            if attempt < retries:
                time.sleep(backoff_factors[attempt])
            else:
                # Kehabisan attempt, catat failure pada Circuit Breaker dan lempar exception
                cb.record_failure()
                raise exc

def get_item(item_id: str, jwt_token: str) -> dict | None:
    headers = {"Authorization": f"Bearer {jwt_token}"}
    url = f"{settings.ITEM_SERVICE_URL}/items/{item_id}"
    try:
        response = request_with_retry_and_cb(item_service_cb, "GET", url, headers=headers)
        return response.json()
    except httpx.HTTPStatusError as exc:
        if exc.response.status_code == 404:
            return None
        raise HTTPException(
            status_code=502,
            detail=f"Gagal menghubungi item-service: {exc}"
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Gagal menghubungi item-service: {exc}"
        )

def update_item_status(item_id: str, new_status: str, jwt_token: str) -> bool:
    headers = {"Authorization": f"Bearer {jwt_token}"}
    url = f"{settings.ITEM_SERVICE_URL}/items/{item_id}/status"
    payload = {"status": new_status}
    try:
        response = request_with_retry_and_cb(item_service_cb, "PUT", url, json=payload, headers=headers)
        return True
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=exc.response.status_code,
            detail=exc.response.json().get("detail", "Gagal memperbarui status item")
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Gagal menghubungi item-service untuk pembaruan status: {exc}"
        )

def get_admins() -> list[dict]:
    url = f"{settings.AUTH_SERVICE_URL}/auth/users/admins"
    try:
        response = request_with_retry_and_cb(auth_service_cb, "GET", url)
        return response.json()
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Gagal menghubungi auth-service untuk daftar admin: {exc}"
        )
