# Setup Guide - Temuin

Panduan lengkap untuk menjalankan project Temuin di lokal.

## Prerequisites

| Tool           | Versi Minimum       | Cek Versi              |
| -------------- | ------------------- | ---------------------- |
| Python         | 3.12+               | `python --version`     |
| Node.js        | 20+                 | `node --version`       |
| Git            | 2.40+               | `git --version`        |
| PostgreSQL     | 15+ atau via Docker | `psql --version`       |

## 1. Clone dan Setup Branch

```bash
git clone <repo-url>
cd cc-kelompok-a-extraordinary
git checkout master
git pull origin master
```

## 2. Setup PostgreSQL

### Opsi A: PostgreSQL Lokal

1. Install PostgreSQL 15+ dari https://www.postgresql.org/download/
2. Buat database:

```bash
psql -U postgres
CREATE DATABASE temuin_db;
\q
```

3. Pastikan service PostgreSQL berjalan di port 5432

### Opsi B: PostgreSQL via Docker

```bash
docker run -d \
  --name temuin-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=temuin_db \
  -p 5432:5432 \
  postgres:15
```

Cek apakah sudah jalan:

```bash
docker ps
```

## 3. Setup Backend

```bash
cd backend

# Buat virtual environment
python -m venv .venv

# Aktivasi venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy env template dan isi nilai yang sesuai
cp .env.example .env
# Edit .env sesuai konfigurasi lokal kamu

# Jalankan migration
alembic upgrade head

# Jalankan backend
uvicorn app.main:app --reload
```

Backend akan jalan di `http://127.0.0.1:8000`.

### Verifikasi Backend

- Buka `http://127.0.0.1:8000` — harus muncul `{"message": "Welcome to Temuin API"}`
- Buka `http://127.0.0.1:8000/health` — harus muncul `{"status": "healthy", "database": "connected"}`
- Buka `http://127.0.0.1:8000/docs` — Swagger UI

> **Penting**: Gunakan `127.0.0.1`, bukan `localhost`. Di Windows, `localhost` bisa resolve ke IPv6 `::1` yang mengarah ke proses lain.

## 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy env template dan isi nilai yang sesuai
cp .env.example .env
# Edit .env sesuai konfigurasi frontend kamu

# Jalankan frontend
npm run dev
```

Frontend akan jalan di `http://localhost:5173`.

### Verifikasi Frontend

- Buka `http://localhost:5173` — halaman awal harus tampil tanpa error

## 5. Seed Master Data & Admin

```bash
cd backend

# Seed master data (categories, buildings, locations, security officers)
python -m app.utils.seed
```

> Master data harus di-seed sebelum bisa buat laporan barang temuan (dropdown kategori, gedung, lokasi, satpam).

### Membuat Akun Admin

1. Register akun biasa lewat UI (`/register`)
2. Promote ke admin via psql:
```bash
psql -U postgres -d temuin_db -c "UPDATE users SET role = 'admin' WHERE email = 'emailkamu@student.itk.ac.id';"
```
3. Login ulang — akun sekarang punya akses admin (Kelola Klaim, Master Data)

## 6. Catatan Auth

- Auth memakai email kampus `@itk.ac.id` + password (minimal 8 karakter, harus ada huruf dan angka)
- Backend menerbitkan internal JWT, tidak ada Firebase
- Tidak ada kebutuhan `serviceAccountKey.json` atau Firebase SDK

## 7. Env Vars Reference

### Backend (`backend/.env`)

| Variable                       | Wajib | Contoh                                                  |
| ------------------------------ | ----- | ------------------------------------------------------- |
| `DATABASE_URL`                 | Ya    | `postgresql://postgres:password@localhost:5432/temuin_db` |
| `SECRET_KEY`                   | Ya    | String random untuk JWT signing                         |
| `ALGORITHM`                    | Tidak | `HS256` (default)                                       |
| `ACCESS_TOKEN_EXPIRE_MINUTES`  | Tidak | `60` (default)                                          |
| `CORS_ORIGINS`                 | Tidak | `["http://localhost:5173"]`                             |

### Frontend (`frontend/.env`)

| Variable            | Wajib | Contoh                 |
| ------------------- | ----- | ---------------------- |
| `VITE_API_BASE_URL` | Ya    | `http://127.0.0.1:8000` |

## Troubleshooting

### Backend tidak bisa connect ke database
- Pastikan PostgreSQL jalan: `psql -U postgres -c "SELECT 1"`
- Cek `DATABASE_URL` di `.env` sudah benar
- Kalau pakai Docker: `docker ps` untuk cek container jalan

### Frontend error saat `npm run dev`
- Hapus `node_modules` dan install ulang: `rm -rf node_modules && npm install`
- Pastikan Node.js versi 20+

### CORS error di browser
- Pastikan backend diakses via `127.0.0.1:8000`, bukan `localhost:8000` (lihat catatan IPv6 di atas)
- Pastikan `CORS_ORIGINS` di backend `.env` mengandung URL frontend (`http://localhost:5173`)
- Restart backend setelah ubah `.env`
