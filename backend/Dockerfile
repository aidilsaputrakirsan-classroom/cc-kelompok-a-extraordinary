# ============================================================
# Multi-Stage Build: Temuin Backend (FastAPI + PostgreSQL)
# ============================================================
# Stage 1: Builder - Install dependencies on Alpine
# Stage 2: Production - Copy only runtime files
# ============================================================

# ============================================================
# Stage 1: Builder
# ============================================================
FROM python:3.12-alpine AS builder

# Build dependencies for psycopg2-binary, cryptography, etc.
RUN apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    postgresql-dev

WORKDIR /app

COPY requirements.txt .

# Create venv and install dependencies
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN pip install --no-cache-dir --no-compile -r requirements.txt

# Cleanup: remove pip/setuptools/wheel, __pycache__, .pyc, tests, docs
RUN pip uninstall -y pip setuptools wheel 2>/dev/null || true && \
    find /opt/venv -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true && \
    find /opt/venv -type f -name "*.pyc" -delete 2>/dev/null || true && \
    find /opt/venv -type d -name "tests" -exec rm -rf {} + 2>/dev/null || true && \
    find /opt/venv -type d -name "test" -exec rm -rf {} + 2>/dev/null || true

# ============================================================
# Stage 2: Production
# ============================================================
FROM python:3.12-alpine

# Runtime dependencies only
RUN apk add --no-cache libpq postgresql-client

WORKDIR /app

# Copy venv from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Disable bytecode generation and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copy application code (includes entrypoint.sh)
COPY . .

# Make entrypoint executable
RUN chmod +x /app/entrypoint.sh

# Security: run as non-root user
RUN adduser -D appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health', timeout=3)"

ENTRYPOINT ["/app/entrypoint.sh"]
