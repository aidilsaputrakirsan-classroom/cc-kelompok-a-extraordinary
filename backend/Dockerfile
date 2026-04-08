# ============================================================
# Multi-Stage Build: Optimized Production Image with Alpine
# ============================================================
# Stage 1: Builder - Install dependencies dengan Alpine
# Stage 2: Production - Copy hanya runtime files
# Target: Image size < 150 MB
# ============================================================

# ============================================================
# Stage 1: Builder
# ============================================================
FROM python:3.12-alpine AS builder

# Install build dependencies untuk compile Python packages
# gcc, musl-dev, libffi-dev: untuk cryptography
# postgresql-dev: untuk psycopg
RUN apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    postgresql-dev

# Set working directory
WORKDIR /app

# Copy requirements.txt
COPY requirements.txt .

# Buat virtual environment dan install dependencies
RUN python -m venv /opt/venv

# Aktifkan venv
ENV PATH="/opt/venv/bin:$PATH"

# Install dependencies dengan optimasi
RUN pip install --no-cache-dir --no-compile -r requirements.txt

# Cleanup: hapus pip, setuptools, wheel
# Hapus __pycache__, .pyc files, tests, dan docs
RUN pip uninstall -y pip setuptools wheel && \
    find /opt/venv -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true && \
    find /opt/venv -type f -name "*.pyc" -delete && \
    find /opt/venv -type d -name "tests" -exec rm -rf {} + 2>/dev/null || true && \
    find /opt/venv -type d -name "test" -exec rm -rf {} + 2>/dev/null || true && \
    find /opt/venv -type d -name "*.dist-info" -exec rm -rf {}/RECORD {} + 2>/dev/null || true && \
    find /opt/venv -type f -name "*.md" -delete 2>/dev/null || true && \
    find /opt/venv -type f -name "*.txt" ! -name "requirements.txt" -delete 2>/dev/null || true

# ============================================================
# Stage 2: Production
# ============================================================
FROM python:3.12-alpine

# Install runtime dependencies saja (tidak perlu build tools)
# libpq: untuk psycopg PostgreSQL driver
RUN apk add --no-cache libpq

# Set working directory
WORKDIR /app

# Copy virtual environment dari builder
COPY --from=builder /opt/venv /opt/venv

# Set PATH untuk venv
ENV PATH="/opt/venv/bin:$PATH"

# Disable Python bytecode generation
ENV PYTHONDONTWRITEBYTECODE=1

# Copy kode aplikasi
COPY . .

# Security: jalankan sebagai non-root user
RUN adduser -D appuser && chown -R appuser:appuser /app
USER appuser

# Dokumentasikan port
EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health', timeout=3)"

# Command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
