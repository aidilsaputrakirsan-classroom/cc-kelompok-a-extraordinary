import logging
import time
import uuid

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from app.utils.logging_config import correlation_id_ctx
from app.utils.metrics import track_error, track_request

logger = logging.getLogger("request_logger")

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # 1. Ambil atau buat Correlation ID
        corr_id = request.headers.get("X-Correlation-ID")
        if not corr_id:
            # Generate 12-char UUID jika tidak ada
            corr_id = uuid.uuid4().hex[:12]

        # 2. Simpan di contextvar
        token = correlation_id_ctx.set(corr_id)

        # 3. Catat waktu mulai
        start_time = time.perf_counter()

        try:
            response = await call_next(request)

            # Catat durasi
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)

            # Log response
            logger.info(
                f"Request finished: {request.method} {request.url.path} -> Status {response.status_code}",
                extra={
                    "method": request.method,
                    "path": request.url.path,
                    "status_code": response.status_code,
                    "duration_ms": duration_ms
                }
            )

            # Track Prometheus metrics
            track_request(request.method, request.url.path, response.status_code, duration_ms / 1000.0)

            # Tambahkan correlation ID ke response header
            response.headers["X-Correlation-ID"] = corr_id
            return response

        except Exception as exc:
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            logger.error(
                f"Request failed: {request.method} {request.url.path} -> Exception {str(exc)}",
                exc_info=True,
                extra={
                    "method": request.method,
                    "path": request.url.path,
                    "status_code": 500,
                    "duration_ms": duration_ms
                }
            )

            # Track Prometheus metrics for error
            track_error(type(exc).__name__)
            track_request(request.method, request.url.path, 500, duration_ms / 1000.0)

            raise exc
        finally:
            # Reset contextvar
            correlation_id_ctx.reset(token)
