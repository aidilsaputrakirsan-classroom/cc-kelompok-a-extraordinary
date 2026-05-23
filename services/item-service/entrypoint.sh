#!/bin/sh
set -e

echo "=== Temuin Item Service Starting ==="

# --- Wait for PostgreSQL ---
echo "Waiting for PostgreSQL..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if pg_isready -h "${DB_HOST:-temuin-db}" -p "${DB_PORT:-5432}" -U "${DB_USER:-postgres}" > /dev/null 2>&1; then
        echo "PostgreSQL is ready!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "  Waiting for PostgreSQL... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "WARNING: PostgreSQL not ready after $MAX_RETRIES retries. Starting anyway..."
fi

# --- Seed Master Data ---
echo "Seeding master data (if empty)..."
if python -m app.utils.seed; then
    echo "Master data seed check completed."
else
    echo "WARNING: Seed script failed. Starting app anyway..."
fi

# --- Start Uvicorn ---
echo "Starting uvicorn on 0.0.0.0:8002..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8002
