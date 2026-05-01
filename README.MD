# ☁️ Cloud App - Temuin (Lost & Found Platform)

Deskripsi Singkat : 
Temuin adalah platform Lost & Found berbasis web yang dirancang untuk membantu civitas kampus dalam melaporkan dan menemukan barang hilang atau barang temuan secara terpusat dan transparan. Aplikasi ini memungkinkan pengguna untuk membuat laporan kehilangan atau penemuan barang, melakukan pencarian berdasarkan kategori dan lokasi, serta melacak status barang hingga kembali ke pemiliknya.  

Platform ini ditujukan untuk mahasiswa, dosen, dan seluruh civitas kampus agar proses pencarian barang menjadi lebih cepat, terorganisir, dan terdokumentasi dengan baik dibandingkan metode manual seperti bertanya langsung atau menyebar informasi melalui grup chat.  

## 🎯 Latar Belakang Masalah
Kehilangan barang di lingkungan kampus merupakan kejadian yang sering terjadi, baik di ruang kelas, laboratorium, perpustakaan, maupun area umum lainnya. Saat ini proses pencarian barang hilang masih dilakukan secara manual, seperti bertanya kepada teman, menghubungi satpam, atau memposting di media sosial yang informasinya tidak terstruktur dan sulit dilacak.

Tidak adanya sistem terpusat menyebabkan:
- Informasi barang hilang dan ditemukan tersebar dan tidak terdokumentasi dengan baik.
- Sulitnya memverifikasi status barang apakah sudah dikembalikan atau belum.
- Kurangnya transparansi dalam proses klaim dan pengembalian barang.

Oleh karena itu, diperlukan sebuah platform digital yang dapat mengelola laporan lost & found secara terstruktur, transparan, dan mudah diakses oleh seluruh civitas kampus.

## 🎯 Tujuan Pengembangan
Tujuan pengembangan aplikasi Temuin adalah:  

- Membangun sistem terpusat untuk pelaporan barang hilang dan barang ditemukan.
- Mempermudah proses pencarian dan pencocokan barang lost & found.
- Menyediakan fitur pelacakan status barang secara transparan.
- Meningkatkan efisiensi dan kecepatan pengembalian barang kepada pemiliknya.
- Mengimplementasikan arsitektur cloud-native menggunakan containerization dan CI/CD sebagai bagian dari pembelajaran Cloud Computing.

## 🚀 Target Pengguna 
Aplikasi Temuin ditujukan untuk:

- Mahasiswa
- Dosen
- Staff dan tenaga kependidikan
- Petugas keamanan kampus

Secara umum, seluruh civitas kampus yang beraktivitas di lingkungan kampus dan berpotensi mengalami kehilangan atau menemukan barang.

## 👥 Tim Pengembang

| Nama | NIM | Peran |
|------|-----|-------|
| Raisha Alika Irwandira | 10231077 | Lead Backend |
| Nicholas Christian Samuel Manurung | 10231069 | Lead Frontend |
| Pangeran Borneo Silaen | 10231073 | Lead DevOps |
| Rani Ayu Dewi | 10231079 | Lead QA & Docs |

---

## 🛠️ Tech Stack

| Teknologi | Fungsi |
|-----------|--------|
| FastAPI | Backend REST API |
| React + Vite | Frontend SPA |
| PostgreSQL | Database laporan barang |
| Docker | Containerization |
| GitHub Actions | CI/CD Pipeline |
| Railway / Render | Cloud Deployment |

---

## 🏗️ Arsitektur Sistem (Week 1)
```
[Client / User - Civitas Kampus]
           │
        (HTTPS)
           │
           ▼
[React Frontend (Vite)]
           │
    REST API (HTTP)
           │
           ▼
[Python Backend (FastAPI)]
           │
           ▼
[Database (PostgreSQL)]
```

**Penjelasan Arsitektur**

Client/user (civitas kampus) dapat mengakses aplikasi Temuin melalui browser menggunakan protokol HTTPS agar memastikan komunikasi aman.

React Frontend (Vite) berfungsi sebagai antarmuka pengguna dengan menampilkan dashboard laporan, form input barang hilang/ditemukan, fitur pencarian, serta berkomunikasi dengan backend untuk mengambil dan mengirim data.

Python Backend (FastAPI) berfungsi dalam menjalankan logika bisnis aplikasi seperti autentikasi pengguna, CRUD laporan barang, pencarian dan pencocokan barang hilang-ditemukan, serta tracking status pengembalian barang.

PostgreSQL Database berfungsi untuk menyimpan data terstruktur seperti data pengguna, laporan barang hilang, laporan barang ditemukan, kategori, lokasi, dan riwayat aktivitas.

---

## 🚀 Getting Started

### Prasyarat

- Python 3.10+
- Node.js 20.19+
- Git
- PostgreSQL

### 1. Clone Repository

```bash
git clone <url-repository>
cd cc-kelompok-a-extraordinary
```

### 2. Setup Backend

**Cara cepat (gunakan script otomatis):**

```bash
cd backend
bash setup.sh
```

Script `setup.sh` akan otomatis:
- Memverifikasi Python & pip tersedia
- Menginstall semua dependencies dari `requirements.txt`
- Membuat file `.env` dari `.env.example` (jika belum ada)

**Setelah setup.sh selesai, edit file `.env`:**

```bash
# Isi DATABASE_URL dengan konfigurasi PostgreSQL kamu
DATABASE_URL=postgresql://postgres:PASSWORD_KAMU@localhost:5432/cloudapp
```

**Cara manual (alternatif):**

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # lalu edit .env
```

**Jalankan backend:**

```bash
uvicorn main:app --reload --port 8000
```

Swagger UI tersedia di: http://localhost:8000/docs

### 3. Setup Database

Pastikan PostgreSQL sudah berjalan di sistem kamu.

#### Masuk ke PostgreSQL

Buka terminal lalu masuk ke PostgreSQL menggunakan user `postgres`:

```bash
psql -U postgres
```

Jika PostgreSQL meminta password, masukkan password untuk user `postgres`.

Jika PostgreSQL berjalan di port atau host tertentu, kamu bisa menggunakan:

```bash
psql -U postgres -h localhost -p 5432
```

Jika berhasil masuk, prompt akan berubah menjadi seperti ini:

```bash
postgres=#
```

#### Membuat Database

Setelah berhasil masuk ke PostgreSQL, buat database `cloudapp`:

```sql
CREATE DATABASE cloudapp;
```

Untuk memastikan database berhasil dibuat:

```sql
\l
```

Jika `cloudapp` muncul di daftar database, berarti database sudah berhasil dibuat.

Keluar dari PostgreSQL dengan:

```sql
\q
```

Saat backend pertama kali dijalankan, tabel akan dibuat otomatis oleh SQLAlchemy.

### 4. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend tersedia di: http://localhost:5173

---

## 🐳 Docker Compose Quick Start (Modul 7)

Docker Compose menjalankan seluruh aplikasi Temuin dalam 3 container: PostgreSQL, FastAPI backend, dan React frontend yang diserve Nginx.

### Prasyarat

- Docker Desktop sudah running
- Port `3000`, `8000`, dan `5433` tidak sedang dipakai aplikasi lain

### Start Semua Services

```bash
# Build image backend + frontend, lalu start semua services
make build

# Atau tanpa Makefile:
docker compose up --build -d
```

### Cek Status

```bash
make ps

# Atau:
docker compose ps
```

Status yang diharapkan:

| Service | Container | Port | Status |
|---------|-----------|------|--------|
| Database | `cloudapp-db` | `localhost:5433` -> `5432` | `healthy` |
| Backend | `cloudapp-backend` | `localhost:8000` | `healthy` |
| Frontend | `cloudapp-frontend` | `localhost:3000` | `healthy` |

Images yang dipakai:

| Service | Image |
|---------|-------|
| Backend | `pangeransilaen/temuin-backend:latest` |
| Frontend | `pangeransilaen/temuin-frontend:latest` |
| Database | `postgres:16-alpine` |

### Akses Aplikasi

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### Compose Commands

| Command | Fungsi |
|---------|--------|
| `make up` | Start semua services tanpa rebuild |
| `make build` | Build ulang image lalu start semua services |
| `make push` | Push image backend dan frontend ke Docker Hub |
| `make down` | Stop dan remove containers/network, volume tetap ada |
| `make restart` | Restart semua services |
| `make logs` | Follow logs semua services |
| `make logs-backend` | Follow logs backend |
| `make ps` | Lihat status services |
| `make images` | Lihat ukuran image Temuin lokal |
| `make clean` | Stop services, hapus volume, dan prune Docker cache |

### Data Persistence

Database memakai named volume `cloudapp-pgdata`, sehingga data tetap ada setelah:

```bash
make down
make up
```

Data baru hilang jika menjalankan:

```bash
make clean
```

## 📁 Struktur Project

```
cc-kelompok-a-extraordinary/
│
├── docker-compose.yml       ← Orkestrasi 3 services (DB, backend, frontend)
├── Makefile                 ← Shortcut command Docker Compose
│
├── backend/
│   ├── main.py              ← Entry point FastAPI & semua endpoints (Updated)
│   ├── auth.py              ← JWT utilities (token, hash password)   ← BARU
│   ├── database.py          ← Koneksi PostgreSQL via SQLAlchemy
│   ├── models.py            ← Model tabel database (Item + User)     (Updated)
│   ├── schemas.py           ← Pydantic schemas (Updated: + auth schemas)
│   ├── crud.py              ← Operasi CRUD (Updated: + user CRUD)
│   ├── requirements.txt     ← Python dependencies (Updated: + jose, passlib, bcrypt)
│   ├── setup.sh             ← Script setup otomatis environment
│   ├── .env.example         ← Template konfigurasi (di-commit)
│   └── .env                 ← Konfigurasi lokal (TIDAK di-commit)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    ← Updated (auth integration)
│   │   ├── App.css
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── LoginPage.jsx          ← BARU
│   │   │   ├── Header.jsx             ← Updated (user info + logout)
│   │   │   ├── SearchBar.jsx
│   │   │   ├── ItemForm.jsx
│   │   │   ├── ItemList.jsx
│   │   │   ├── ItemCard.jsx
│   │   │   └── SortDropdown.jsx
│   │   └── services/
│   │       └── api.js                 ← Updated (auth + token management)
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── .env.example         ← Template konfigurasi frontend (di-commit)
│   └── package.json
│
├── docs/
│   ├── api-test-result.md   ← Hasil testing API (Swagger)
│   ├── ui-test-results.md   ← Hasil testing UI (frontend)
│   ├── setup-guide.md       ← Panduan setup lengkap dari clone hingga running
│   ├── member-raisha.md     ← Kontribusi Raisha
│   ├── member-nicholas.md   ← Kontribusi Nicholas
│   ├── member-pangeran.md   ← Kontribusi Pangeran
│   └── member-rani.md       ← Kontribusi Rani
│
├── image/
│   ├── delete-items-id.png
│   ├── get-items-id.png
│   ├── get-items.png
│   ├── get-team-info.png
│   ├── gethealth.png
│   ├── post-items.png
│   └── put-items-id.png
│
├── .gitignore
└── README.md
```
## 📅 Roadmap

| Minggu | Target | Status |
|--------|--------|--------|
| 1 | Setup & Hello World | ✅ |
| 2 | REST API + Database | ✅ |
| 3 | React Frontend | ✅ |
| 4 | Full-Stack Integration | ✅ |
| 5–7 | Docker & Compose | ✅ |
| 8 | UTS Demo | ⬜ |
| 9–11 | CI/CD Pipeline | ⬜ |
| 12–14 | Microservices | ⬜ |
| 15–16 | Final & UAS | ⬜ |

---

## 🔐 Authentication

Aplikasi ini menggunakan **JWT (JSON Web Token)** untuk autentikasi. Semua endpoint `/items` memerlukan token JWT yang valid.

### Alur Autentikasi

1. **Register** — Buat akun baru via `POST /auth/register`
2. **Login** — Login via `POST /auth/login`, simpan `access_token` dari response
3. **Gunakan Token** — Sertakan token di setiap request protected:
   ```
   Authorization: Bearer <access_token>
   ```
4. **Token Expired** — Jika token expired (default 60 menit), login ulang

### Contoh Register

**POST /auth/register**

Request body:
```json
{
  "email": "user@student.itk.ac.id",
  "name": "Nama Lengkap",
  "password": "Password123!"
}
```

Response `201 Created`:
```json
{
  "id": 1,
  "email": "user@student.itk.ac.id",
  "name": "Nama Lengkap",
  "is_active": true,
  "created_at": "2026-03-21T07:00:00"
}
```

### Contoh Login

**POST /auth/login**

Request body:
```json
{
  "email": "user@student.itk.ac.id",
  "password": "Password123!"
}
```

Response `200 OK`:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@student.itk.ac.id",
    "name": "Nama Lengkap",
    "is_active": true,
    "created_at": "2026-03-21T07:00:00"
  }
}
```

### Testing Auth via Swagger UI

1. Buka `http://localhost:8000/docs`
2. `POST /auth/register` → buat akun baru
3. `POST /auth/login` → copy `access_token` dari response
4. Klik tombol **🔒 Authorize** → paste token → klik Authorize
5. Semua endpoint `/items` sekarang bisa diakses

---

## 🔌 API Endpoints

Base URL: `http://localhost:8000`  
Dokumentasi interaktif: `http://localhost:8000/docs`

> 🔒 = Membutuhkan token JWT di header: `Authorization: Bearer <token>`

### Auth Endpoints (Public)

| Method | Endpoint | Deskripsi | Status Code |
|--------|----------|-----------|-------------|
| `POST` | `/auth/register` | Registrasi user baru | 201 / 400 |
| `POST` | `/auth/login` | Login & dapatkan JWT token | 200 / 401 |
| `GET` | `/auth/me` 🔒 | Ambil profil user yang sedang login | 200 / 401 |

### General Endpoints

| Method | Endpoint | Deskripsi | Status Code |
|--------|----------|-----------|-------------|
| `GET` | `/health` | Health check API | 200 |
| `GET` | `/team` | Informasi anggota tim | 200 |

### Item Endpoints (Protected 🔒)

| Method | Endpoint | Deskripsi | Status Code |
|--------|----------|-----------|-------------|
| `POST` | `/items` 🔒 | Tambah item baru | 201 / 401 |
| `GET` | `/items` 🔒 | List semua item (pagination + search) | 200 / 401 |
| `GET` | `/items/{id}` 🔒 | Ambil item berdasarkan ID | 200 / 401 / 404 |
| `PUT` | `/items/{id}` 🔒 | Update item berdasarkan ID | 200 / 401 / 404 |
| `DELETE` | `/items/{id}` 🔒 | Hapus item berdasarkan ID | 204 / 401 / 404 |

### Contoh Request & Response

**POST /items** *(Membutuhkan token)*

Request body:
```json
{
  "name": "Laptop",
  "description": "Laptop untuk cloud computing",
  "price": 15000000,
  "quantity": 5
}
```

Response `201 Created`:
```json
{
  "id": 1,
  "name": "Laptop",
  "description": "Laptop untuk cloud computing",
  "price": 15000000,
  "quantity": 5,
  "created_at": "2026-03-07T10:00:00",
  "updated_at": null
}
```

**GET /items?search=laptop&skip=0&limit=20** *(Membutuhkan token)*

Response `200 OK`:
```json
{
  "total": 1,
  "items": [...]
}
```

---

## 🧪 Hasil Testing API (Modul 2)

Pengujian dilakukan via Swagger UI (`/docs`).

| Endpoint | Skenario | Expected | Actual | Status |
|----------|----------|----------|--------|--------|
| `GET /health` | Health check | `200 OK` | `200 OK` | ✅ Pass |
| `POST /items` | Input valid | `201 Created` | `201 Created` | ✅ Pass |
| `POST /items` | Harga < 0 | `422 Unprocessable Entity` | `422 Unprocessable Entity` | ✅ Pass |
| `GET /items` | Ambil semua item | `200 OK` + list | `200 OK` + list | ✅ Pass |
| `GET /items/{id}` | ID terdaftar | `200 OK` + data item | `200 OK` + data item | ✅ Pass |
| `GET /items/{id}` | ID tidak ada | `404 Not Found` | `404 Not Found` | ✅ Pass |
| `PUT /items/{id}` | Update field | `200 OK` + data baru | `200 OK` + data baru | ✅ Pass |
| `DELETE /items/{id}` | Hapus item | `204 No Content` | `204 No Content` | ✅ Pass |
| `GET /team` | Info tim | `200 OK` + list anggota | `200 OK` + list anggota | ✅ Pass |

---

## 🧪 Hasil Testing API (Modul 4 — Auth & Protected Endpoints)

Pengujian dilakukan via Swagger UI (`/docs`).

| Endpoint | Skenario | Expected | Actual | Status |
|----------|----------|----------|--------|--------|
| `POST /auth/register` | Data valid | `201 Created` + user data | `201 Created` | ✅ Pass |
| `POST /auth/register` | Email duplikat | `400 Bad Request` | `400 Bad Request` | ✅ Pass |
| `POST /auth/register` | Password < 8 karakter | `422 Unprocessable Content` | `422 Unprocessable Content` | ✅ Pass |
| `POST /auth/login` | Kredensial benar | `200 OK` + token | `200 OK` + token | ✅ Pass |
| `POST /auth/login` | Password salah | `401 Unauthorized` | `401 Unauthorized` | ✅ Pass |
| `POST /auth/login` | Email tidak terdaftar | `401 Unauthorized` | `401 Unauthorized` | ✅ Pass |
| `GET /auth/me` | Token valid | `200 OK` + user data | `200 OK` + user data | ✅ Pass |
| `GET /auth/me` | Tanpa token | `401 Unauthorized` | `401 Unauthorized` | ✅ Pass |
| `GET /items` | Tanpa token | `401 Unauthorized` | `401 Unauthorized` | ✅ Pass |
| `GET /items` | Token valid | `200 OK` + list items | `200 OK` + list items | ✅ Pass |
| `POST /items` | Token valid + data valid | `201 Created` | `201 Created` | ✅ Pass |
| `PUT /items/{id}` | Token valid + ID ada | `200 OK` + data baru | `200 OK` + data baru | ✅ Pass |
| `DELETE /items/{id}` | Token valid + ID ada | `204 No Content` | `204 No Content` | ✅ Pass |
| `GET /items/{id}` | Token expired/invalid | `401 Unauthorized` | `401 Unauthorized` | ✅ Pass |

---

## 🧪 Hasil Testing Docker (Modul 5 — Image Comparison)

Sebagai bagian dari optimasi containerization, dilakukan perbandingan ukuran base image Python 3.12:

| Image Variant | OS Base | Size | Status |
|---------------|---------|------|--------|
| `python:3.12` | Debian | 1.62 GB | ✅ Terverifikasi |
| `python:3.12-slim` | Debian Slim | 179 MB | ✅ Terverifikasi |
| `python:3.12-alpine` | Alpine | 75 MB | ✅ Terverifikasi |

**Kesimpulan QA:** Penggunaan `python:3.12-slim` direkomendasikan untuk menyeimbangkan antara ukuran image yang kecil dan kemudahan instalasi dependencies. Detail lengkap dapat dilihat di [docs/image-comparison.md](./docs/image-comparison.md).

---
