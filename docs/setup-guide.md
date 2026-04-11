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

# Jalankan migrasi database
alembic upgrade head

# Jalankan backend
uvicorn app.main:app --reload
```

Backend akan jalan di `http://localhost:8000`.

### Verifikasi Backend

- Buka `http://localhost:8000` — harus muncul `{"message": "Welcome to Temuin API"}`
- Buka `http://localhost:8000/health` — harus muncul `{"status": "healthy", "database": "connected"}`
- Buka `http://localhost:8000/docs` — Swagger UI

## 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy env template dan isi nilai yang sesuai
cp .env.example .env
# Edit .env sesuai konfigurasi Firebase kamu

# Jalankan frontend
npm run dev
```

Frontend akan jalan di `http://localhost:5173`.

### Verifikasi Frontend

- Buka `http://localhost:5173` — halaman awal harus tampil tanpa error

## 5. Setup Firebase

### 5.1 Buat Project Firebase

1. Buka https://console.firebase.google.com/
2. Buat project baru (atau pakai yang sudah ada)
3. Nama project: `temuin` (atau sesuai kesepakatan tim)

### 5.2 Aktifkan Authentication

1. Di Firebase Console, buka **Authentication** > **Sign-in method**
2. Enable **Google** sebagai provider
3. Isi support email
4. Save

### 5.3 Ambil Config Frontend (Firebase Client SDK)

1. Di Firebase Console, buka **Project Settings** (ikon gear)
2. Scroll ke **Your apps** > klik **Web app** (ikon `</>`)
3. Register app dengan nama `temuin-web`
4. Copy nilai `firebaseConfig` yang muncul
5. Isi ke `frontend/.env`:

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=temuin-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=temuin-xxx
VITE_FIREBASE_STORAGE_BUCKET=temuin-xxx.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 5.4 Ambil Service Account Key (Firebase Admin SDK untuk Backend)

1. Di Firebase Console, buka **Project Settings** > **Service accounts**
2. Klik **Generate new private key**
3. Download file JSON
4. Simpan file di `backend/serviceAccountKey.json` (sudah di-gitignore)
5. Isi path di `backend/.env`:

```
FIREBASE_CREDENTIALS_FILE=serviceAccountKey.json
```

> **PENTING**: Jangan commit file `serviceAccountKey.json` ke git. File ini sudah masuk `.gitignore`.

## 6. Env Vars Reference

### Backend (`backend/.env`)

| Variable                       | Wajib | Contoh                                                  |
| ------------------------------ | ----- | ------------------------------------------------------- |
| `DATABASE_URL`                 | Ya    | `postgresql://postgres:password@localhost:5432/temuin_db` |
| `SECRET_KEY`                   | Ya    | String random untuk JWT signing                         |
| `ALGORITHM`                    | Tidak | `HS256` (default)                                       |
| `ACCESS_TOKEN_EXPIRE_MINUTES`  | Tidak | `60` (default)                                          |
| `CORS_ORIGINS`                 | Tidak | `["http://localhost:5173"]`                             |
| `FIREBASE_CREDENTIALS_FILE`    | Ya*   | `serviceAccountKey.json`                                |

*Wajib mulai Sprint 02 saat auth flow aktif.

### Frontend (`frontend/.env`)

| Variable                            | Wajib | Contoh                              |
| ----------------------------------- | ----- | ----------------------------------- |
| `VITE_API_BASE_URL`                 | Ya    | `http://localhost:8000`             |
| `VITE_FIREBASE_API_KEY`             | Ya    | Dari Firebase Console               |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Ya    | `temuin-xxx.firebaseapp.com`        |
| `VITE_FIREBASE_PROJECT_ID`          | Ya    | `temuin-xxx`                        |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Ya    | `temuin-xxx.firebasestorage.app`    |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Ya    | `123456789`                         |
| `VITE_FIREBASE_APP_ID`             | Ya    | `1:123456789:web:abcdef`            |

## Troubleshooting

### Backend tidak bisa connect ke database
- Pastikan PostgreSQL jalan: `psql -U postgres -c "SELECT 1"`
- Cek `DATABASE_URL` di `.env` sudah benar
- Kalau pakai Docker: `docker ps` untuk cek container jalan

### Frontend error saat `npm run dev`
- Hapus `node_modules` dan install ulang: `rm -rf node_modules && npm install`
- Pastikan Node.js versi 20+

### CORS error di browser
- Pastikan `CORS_ORIGINS` di backend `.env` mengandung URL frontend (`http://localhost:5173`)
- Restart backend setelah ubah `.env`
