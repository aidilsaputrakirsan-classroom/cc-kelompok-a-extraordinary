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
- Node.js 18+
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

## 📁 Struktur Project

```
cc-kelompok-a-extraordinary/
├── backend/
│   ├── main.py              ← Entry point FastAPI & semua endpoints
│   ├── database.py          ← Koneksi PostgreSQL via SQLAlchemy
│   ├── models.py            ← Model tabel database
│   ├── schemas.py           ← Pydantic schemas (validasi request/response)
│   ├── crud.py              ← Operasi CRUD
│   ├── requirements.txt     ← Python dependencies
│   ├── setup.sh             ← Script setup otomatis environment
│   ├── .env.example         ← Template konfigurasi (di-commit)
│   └── .env                 ← Konfigurasi lokal (TIDAK di-commit)
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── docs/
│   ├── member-raisha.md
│   ├── member-nicholas.md
│   ├── member-pangeran.md
│   └── member-rani.md
├── .gitignore
└── README.MD
```
## 📅 Roadmap

| Minggu | Target | Status |
|--------|--------|--------|
| 1 | Setup & Hello World | ✅ |
| 2 | REST API + Database | ✅ |
| 3 | React Frontend | ⬜ |
| 4 | Full-Stack Integration | ⬜ |
| 5–7 | Docker & Compose | ⬜ |
| 8 | UTS Demo | ⬜ |
| 9–11 | CI/CD Pipeline | ⬜ |
| 12–14 | Microservices | ⬜ |
| 15–16 | Final & UAS | ⬜ |

---

## 🔌 API Endpoints

Base URL: `http://localhost:8000`  
Dokumentasi interaktif: `http://localhost:8000/docs`

| Method | Endpoint | Deskripsi | Status Code |
|--------|----------|-----------|-------------|
| `GET` | `/health` | Health check API | 200 |
| `GET` | `/team` | Informasi anggota tim | 200 |
| `POST` | `/items` | Tambah item baru | 201 |
| `GET` | `/items` | List semua item (pagination + search) | 200 |
| `GET` | `/items/stats` | Statistik inventory | 200 |
| `GET` | `/items/{id}` | Ambil item berdasarkan ID | 200 / 404 |
| `PUT` | `/items/{id}` | Update item berdasarkan ID | 200 / 404 |
| `DELETE` | `/items/{id}` | Hapus item berdasarkan ID | 204 / 404 |

### Contoh Request & Response

**POST /items**

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

**GET /items?search=laptop&skip=0&limit=20**

Response `200 OK`:
```json
{
  "total": 1,
  "items": [...]
}
```

**GET /items/stats**

Response `200 OK`:
```json
{
  "total_items": 3,
  "total_value": 79250000,
  "most_expensive": { "name": "Laptop", "price": 15000000 },
  "cheapest": { "name": "Mouse Wireless", "price": 250000 }
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
| `GET /items/stats` | Statistik inventory | `200 OK` + JSON stats | `200 OK` + JSON stats | ✅ Pass |
| `GET /items/{id}` | ID terdaftar | `200 OK` + data item | `200 OK` + data item | ✅ Pass |
| `GET /items/{id}` | ID tidak ada | `404 Not Found` | `404 Not Found` | ✅ Pass |
| `PUT /items/{id}` | Update field | `200 OK` + data baru | `200 OK` + data baru | ✅ Pass |
| `DELETE /items/{id}` | Hapus item | `204 No Content` | `204 No Content` | ✅ Pass |
| `GET /team` | Info tim | `200 OK` + list anggota | `200 OK` + list anggota | ✅ Pass |

---

