# Setup Guide

Panduan ini ditujukan untuk menjalankan project practicum Modul 04 dari awal sampai auth flow di Swagger bisa dipakai.

## 1. Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL
- Git

## 2. Clone Repository

```bash
git clone <url-repository>
cd cc-kelompok-a-extraordinary
```

Jika kamu memakai worktree untuk branch practicum, pastikan bekerja dari folder worktree branch tersebut.

## 3. Setup Backend

Masuk ke folder backend:

```bash
cd backend
```

Install dependency:

```bash
python -m pip install -r requirements.txt
```

Atau gunakan script helper:

```bash
bash setup.sh
```

## 4. Setup Backend Environment

Salin template env:

```bash
cp .env.example .env
```

Isi minimal file `backend/.env` seperti berikut:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/cloudapp
SECRET_KEY=replace-with-random-secret-at-least-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

Catatan:
- `DATABASE_URL` harus menunjuk ke database PostgreSQL lokal yang valid.
- `SECRET_KEY` jangan di-commit ke Git.
- `ALLOWED_ORIGINS` bisa ditambah jika frontend dijalankan dari origin lain.

## 5. Setup Database

Pastikan PostgreSQL aktif, lalu buat database baru:

```sql
CREATE DATABASE cloudapp;
```

Table akan dibuat otomatis saat backend pertama kali dijalankan.

## 6. Run Backend

Jalankan dari folder `backend`:

```bash
uvicorn main:app --reload --port 8000
```

Endpoint penting:
- API base URL: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`

## 7. Setup Frontend

Masuk ke folder frontend:

```bash
cd ../frontend
npm install
```

Salin template env frontend:

```bash
cp .env.example .env
```

Pastikan `frontend/.env` berisi:

```env
VITE_API_URL=http://localhost:8000
```

Jalankan frontend:

```bash
npm run dev
```

Frontend biasanya tersedia di `http://localhost:5173`.

## 8. Test Auth Flow in Swagger

1. Buka `http://127.0.0.1:8000/docs`
2. Jalankan `POST /auth/register` untuk membuat user baru
3. Jalankan `POST /auth/login` jika ingin melihat response token langsung
4. Klik tombol `Authorize`
5. Isi field `username` dengan email user
6. Isi field `password` dengan password user
7. Klik `Authorize`
8. Coba akses endpoint protected seperti `GET /items`

Penting:
- Swagger OAuth2 password flow memang memakai field bernama `username`, tetapi pada project ini nilainya harus diisi email user.
- Endpoint login juga tetap menerima body JSON `{ "email": "...", "password": "..." }` untuk client yang sudah memakai format itu.

## 9. Manual Login Check

Contoh request form-encoded yang setara dengan flow Swagger:

```bash
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@student.itk.ac.id&password=password123"
```

Contoh request JSON yang masih didukung:

```bash
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@student.itk.ac.id","password":"password123"}'
```

Response sukses akan berisi `access_token`, `token_type`, dan data user.

## 10. Common Issues

- `422 Unprocessable Content` saat Swagger Authorize: pastikan login endpoint memakai versi terbaru dan field `username` diisi dengan email.
- `401 Unauthorized`: email/password salah atau token tidak valid.
- Error parsing form data: install ulang dependency backend dan pastikan `python-multipart` terpasang.
- CORS error di browser: cek `ALLOWED_ORIGINS` pada `backend/.env`.

## 11. Quick Verification Checklist

- `GET /health` -> `200 OK`
- `POST /auth/register` -> user berhasil dibuat
- `POST /auth/login` -> mendapat token
- Swagger `Authorize` tidak lagi `422`
- `GET /items` dengan token -> berhasil
- `GET /items` tanpa token -> `401`
