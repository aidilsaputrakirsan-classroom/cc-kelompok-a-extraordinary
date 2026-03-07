#!/bin/bash
# =============================================================
# setup.sh - Script setup environment backend
# Kelompok A Extraordinary - Cloud Computing ITK
# =============================================================
# Cara pakai (Linux/Mac):
#   chmod +x setup.sh
#   ./setup.sh
#
# Cara pakai (Windows Git Bash / WSL):
#   bash setup.sh
# =============================================================

set -e

echo "========================================"
echo "  Setup Backend - Cloud App"
echo "========================================"
echo ""

# --- Cek Python ---
if ! command -v python3 &>/dev/null && ! command -v python &>/dev/null; then
    echo "[ERROR] Python tidak ditemukan. Install Python 3.10+ terlebih dahulu."
    exit 1
fi

PYTHON=$(command -v python3 || command -v python)
echo "[OK] Python ditemukan: $($PYTHON --version)"

# --- Cek pip ---
if ! $PYTHON -m pip --version &>/dev/null; then
    echo "[ERROR] pip tidak ditemukan. Pastikan pip terinstall."
    exit 1
fi
echo "[OK] pip ditemukan"

echo ""
echo "--- Install dependencies dari requirements.txt ---"
$PYTHON -m pip install -r requirements.txt
echo "[OK] Semua dependencies terinstall"

echo ""
echo "--- Setup file .env ---"
if [ -f ".env" ]; then
    echo "[SKIP] File .env sudah ada, tidak ditimpa"
else
    cp .env.example .env
    echo "[OK] File .env dibuat dari .env.example"
    echo ""
    echo ">>> PENTING: Edit file .env dan isi DATABASE_URL dengan"
    echo ">>> konfigurasi PostgreSQL kamu sebelum menjalankan server!"
fi

echo ""
echo "========================================"
echo "  Setup selesai!"
echo "========================================"
echo ""
echo "Langkah selanjutnya:"
echo "  1. Edit backend/.env -> isi DATABASE_URL"
echo "  2. Jalankan server:"
echo "       uvicorn main:app --reload --port 8000"
echo "  3. Buka Swagger UI: http://localhost:8000/docs"
echo ""
