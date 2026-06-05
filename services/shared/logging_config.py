import contextvars
import json
import logging
import os
from datetime import UTC, datetime

# Contextvar untuk menyimpan correlation ID secara request-safe/async-safe
correlation_id_ctx = contextvars.ContextVar("correlation_id", default="-")

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": datetime.now(UTC).isoformat(),
            "level": record.levelname,
            "service": os.getenv("SERVICE_NAME", "unknown-service"),
            "correlation_id": correlation_id_ctx.get(),
            "message": record.getMessage()
        }

        # Tambahkan exception traceback jika ada
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        # Tambahkan extra fields jika ada di record.__dict__
        # Tapi hindari built-in fields
        extra_fields = {
            k: v for k, v in record.__dict__.items()
            if k not in {
                "name", "msg", "args", "levelname", "levelno", "pathname", "filename",
                "module", "exc_info", "exc_text", "stack_info", "lineno", "funcName",
                "created", "msecs", "relativeCreated", "thread", "threadName",
                "processName", "process", "message"
            }
        }
        log_data.update(extra_fields)

        return json.dumps(log_data)

def setup_logging():
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    logger = logging.getLogger()

    # Hapus handler bawaan agar tidak double
    for handler in list(logger.handlers):
        logger.removeHandler(handler)

    handler = logging.StreamHandler()
    handler.setFormatter(JSONFormatter())
    logger.addHandler(handler)
    logger.setLevel(log_level)

    # Atur level logger uvicorn juga agar pakai formatter yang sama
    for logger_name in ("uvicorn", "uvicorn.access", "uvicorn.error", "fastapi"):
        logger_item = logging.getLogger(logger_name)
        logger_item.handlers = []
        logger_item.propagate = True
