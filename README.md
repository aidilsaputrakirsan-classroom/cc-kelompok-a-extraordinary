# 🔍 Temuin — Platform Lost & Found Institut Teknologi Kalimantan

> **Temuin** adalah platform manajemen barang hilang dan temuan (*Lost & Found*) berbasis web yang dirancang khusus untuk civitas akademika **Institut Teknologi Kalimantan (ITK)**. Sistem ini menjadi solusi terpusat yang menggantikan komunikasi informal (grup chat, pengumuman papan) dengan alur digital yang terstruktur, transparan, dan terdokumentasi.

---

## 📋 Daftar Isi

1. [Tentang Temuin](#-tentang-temuin)
2. [Fitur Sistem](#-fitur-sistem)
3. [Fitur Per Role](#-fitur-per-role)
4. [Arsitektur Sistem](#️-arsitektur-sistem)
5. [Desain Database (ERD)](#-desain-database-erd)
6. [Tech Stack](#-tech-stack)
7. [Dokumentasi API](#-dokumentasi-api)
8. [Panduan Menjalankan Sistem](#-panduan-menjalankan-sistem)
9. [Struktur Proyek](#-struktur-proyek)
10. [Roadmap Sprint](#-roadmap-sprint)
11. [Tim Pengembang](#-tim-pengembang)

---

## 🧩 Tentang Temuin

### Latar Belakang Masalah

Civitas kampus ITK belum memiliki sistem terpusat untuk mengelola barang hilang dan barang temuan. Informasi tersebar di grup WhatsApp, Instagram, dan komunikasi informal lainnya sehingga:

- Sulit ditelusuri siapa pelapor dan kapan barang ditemukan
- Tidak ada alur verifikasi kepemilikan yang jelas
- Tidak ada dokumentasi resmi mengenai status barang
- Rentan penyalahgunaan karena tidak ada kontrol identitas

### Solusi

Temuin menyediakan platform web terpusat dengan:

- **Autentikasi berbasis akun Google kampus** (`@itk.ac.id`) untuk memastikan identitas civitas ITK
- **Alur pelaporan barang** (lost/found) yang terstruktur dengan data lokasi dan kategori baku
- **Mekanisme klaim** dengan verifikasi kepemilikan melalui pertanyaan deskriptif
- **Panel admin** untuk moderasi dan pengambilan keputusan final
- **Notifikasi in-app** agar pengguna selalu mendapat info terkini

### Target Pengguna

| Segmen | Kebutuhan Utama |
|--------|-----------------|
| 🎓 Mahasiswa | Lapor barang hilang/temuan, cari barang, ajukan klaim |
| 👩‍🏫 Dosen & Staff | Lapor barang, cari informasi, verifikasi status |
| 🛡️ Satpam / Petugas | Menerima titipan barang temuan dari pelapor |
| ⚙️ Admin Sistem | Moderasi laporan, proses klaim, konfirmasi pengembalian |

---

## ✨ Fitur Sistem

Berikut adalah seluruh fitur MVP yang tersedia di dalam platform Temuin:

### 1. 🔐 Autentikasi & Akses
- Login menggunakan **Email & Password** dengan validasi domain `@itk.ac.id`
- Registrasi mandiri akun internal ITK
- Sistem **role-based access control**: `user`, `admin`, `superadmin`
- Pengamanan session berbasis **internal JWT** dan password hashing (Bcrypt)

### 2. 📦 Pelaporan Barang (Item Reporting)
- Buat laporan **barang hilang** (`lost`) dengan deskripsi lengkap
- Buat laporan **barang temuan** (`found`) dan pilih titik penitipan ke satpam
- Upload foto barang sebagai bukti visual
- Edit laporan yang sudah dibuat
- Hapus laporan (soft delete)

### 3. 🔎 Pencarian & Penemuan (Item Discovery)
- Daftar seluruh laporan barang hilang dan temuan
- Halaman detail per item
- **Pencarian dengan keyword** di seluruh dashboard
- **Filter** berdasarkan tipe (`lost`/`found`), kategori, lokasi, status

### 4. 🤝 Klaim & Pengembalian (Claim & Return Flow)
- Ajukan klaim kepemilikan untuk barang yang ditemukan (`found`)
- Jawab pertanyaan verifikasi deskriptif untuk membuktikan kepemilikan
- Admin memproses klaim: **approve** atau **reject**
- Admin mengonfirmasi pengembalian barang (`returned`)

### 5. 🔔 Notifikasi & Riwayat
- **Notifikasi in-app** otomatis saat status klaim atau barang berubah
- **Riwayat status item** (history perubahan status barang)
- **Riwayat status klaim** (history proses klaim dari pending hingga selesai)

### 6. 🗂️ Master Data
- Kelola data referensi: **Kategori Barang**, **Gedung**, **Ruangan/Lokasi**, **Petugas Keamanan**
- Master data digunakan pada form pelaporan untuk konsistensi data

### 7. 📋 Audit Log (Admin)
- Catatan aksi penting yang dilakukan admin
- Dapat ditelusuri untuk keperluan operasional dan akuntabilitas

---

## 👥 Fitur Per Role

### 👤 Role: User (Mahasiswa / Dosen / Staff)

| # | Fitur | Keterangan |
|---|-------|------------|
| 1 | Registrasi & Login akun ITK | Gunakan email @itk.ac.id dan password |
| 2 | Buat laporan barang hilang | Isi form dengan judul, deskripsi, kategori, lokasi, dan foto |
| 3 | Buat laporan barang temuan | Pilih titik titipan satpam yang bertugas |
| 4 | Lihat daftar & detail item | Browse seluruh laporan yang tercatat di sistem |
| 5 | Cari & filter barang | Gunakan pencarian keyword atau filter tipe/kategori/lokasi |
| 6 | Ajukan klaim kepemilikan | Jawab pertanyaan verifikasi untuk membuktikan barang milikmu |
| 7 | Pantau status klaim | Lihat apakah klaim `pending`, `approved`, `rejected`, atau `completed` |
| 8 | Terima notifikasi in-app | Pemberitahuan langsung di aplikasi saat ada update status |
| 9 | Lihat riwayat status | Jejak historis perubahan status item atau klaim |

---

### 🛡️ Role: Admin

| # | Fitur | Keterangan |
|---|-------|------------|
| 1 | Moderasi laporan | Edit atau hapus laporan yang tidak valid / menyalahi aturan |
| 2 | Proses klaim masuk | Tinjau jawaban verifikasi user dan bandingkan dengan deskripsi barang |
| 3 | Approve / Reject klaim | Setujui atau tolak klaim kepemilikan secara resmi |
| 4 | Konfirmasi pengembalian | Tandai barang telah dikembalikan ke pemilik (`returned`) |
| 5 | Kelola master data | Tambah, edit, hapus data Gedung, Lokasi, Kategori, dan Satpam |
| 6 | Lihat audit log | Monitoring aksi penting yang terjadi di dalam sistem |

---

### ⚡ Role: Superadmin

| # | Fitur | Keterangan |
|---|-------|------------|
| 1 | Semua fitur admin | Memiliki akses penuh ke seluruh fitur moderasi |
| 2 | Kelola role admin | Promosi atau demosi akun menjadi admin |
| 3 | Akses audit log lengkap | Menelusuri seluruh aksi penting di semua akun |

---

## 🛠️ Tech Stack Terintegrasi

Berikut adalah daftar lengkap teknologi yang digunakan dalam pengembangan sistem Temuin, mencakup frontend, backend, hingga infrastruktur.

| Kategori | Teknologi | Fungsi Utama | Penjelasan |
|:---------|:----------|:-------------|:-----------|
| **Frontend Core** | **React 19** | UI Framework | Mengelola antarmuka pengguna yang reaktif dan komponen *reusable*. |
| | **Vite 6** | Build Tool | Alat pengembangan frontend yang sangat cepat untuk *bundling* dan HMR. |
| | **React Router 7** | Routing | Mengelola navigasi antar halaman di sisi client secara dinamis. |
| **Frontend UI** | **Tailwind CSS 4** | Styling Engine | *Utility-first* CSS framework untuk desain cepat dan responsif. |
| | **shadcn/ui** | UI Component | Koleksi komponen UI siap pakai yang dibangun di atas Radix UI. |
| | **Lucide React** | Icon Pack | Set ikon vektor yang konsisten untuk mempermanis antarmuka. |
| | **Sonner** | Toast Notification | Memberikan *feedback* visual (pesan sukses/error) kepada pengguna. |
| **Backend Core** | **FastAPI** | API Framework | Framework Python berperforma tinggi untuk membangun REST API. |
| | **Python 3.12+** | Programming Language | Bahasa pemrograman utama untuk logika bisnis di sisi server. |
| | **Uvicorn** | ASGI Server | Web server yang menjalankan aplikasi FastAPI dengan mode *asynchronous*. |
| **Database/ORM** | **PostgreSQL 16** | Database Engine | Sistem manajemen database relasional untuk menyimpan seluruh data. |
| | **SQLAlchemy** | ORM | Memetakan objek Python ke tabel database untuk mempermudah kueri. |
| | **Alembic** | DB Migrations | Alat untuk melacak dan menerapkan perubahan skema database secara versi. |
| **Security & Logic** | **JWT (JSON Web Token)** | Authentication | Standar keamanan untuk pertukaran informasi identitas user antar client-server. |
| | **Pydantic v2** | Data Validation | Memastikan data yang masuk dan keluar API sesuai dengan skema yang ditentukan. |
| | **Bcrypt / Passlib** | Password Hashing | Mengamankan password user dengan algoritma *hashing* satu arah yang kuat. |
| **Infrastruktur** | **Docker** | Containerization | Membungkus aplikasi agar berjalan konsisten di lingkungan apapun. |
| | **Docker Compose** | Orchestration | Mengelola orkestrasi antar container (App, Database, Redis, dll). |
| | **PowerShell** | Automation | Scripting (`temuin.ps1`) untuk mempermudah otomasi tim pengembang. |
| **Version Control**| **Git & GitHub** | Versioning | Kolaborasi kode dan pelacakan versi. |

---

## 🏗️ Arsitektur Sistem

### 1. Overall System Architecture
Diagram tingkat tinggi yang menggambarkan interaksi antara pengguna, antarmuka web, server API, dan database.

```mermaid
graph LR
    User((User)) --> Frontend["Client (React App)"]
    Frontend <==> API["Server (FastAPI)"]
    API <==> DB[("Database (PostgreSQL)")]
```

### 2. Backend Architecture (FastAPI Modular)
Struktur internal backend yang memisahkan endpoint, validasi, keamanan, dan logika bisnis.

```mermaid
graph TD
    subgraph "Backend Server"
        Entry["🚀 main.py (Entry Point)"] --> Router["📡 API Routers"]
        Router --> Valid["📋 Pydantic Validation"]
        Router --> AuthS["🔐 JWT Auth Service"]
        Router --> Logic["🧠 CRUD/Business Logic"]
        Logic <--> Database[("🗄️ PostgreSQL")]
    end
```

### 3. Frontend Architecture (React + Vite)
Struktur antarmuka pengguna yang mencakup manajemen halaman, komponen UI, dan komunikasi ke server.

```mermaid
graph TD
    subgraph "Frontend Client"
        Pages["📄 Halaman (Auth, User, Admin)"] --> Components["🧩 Komponen (shadcn/ui)"]
        Components --> State["🔐 Auth Context & State"]
        State --> Service["📡 API Service (Axios Wrapper)"]
    end
    Service <==> Backend_API["🌐 Server API"]
```

---

### Detail Atribut Database (Data Dictionary)

#### 1. Tabel: `users`
Menyimpan informasi identitas pengguna dan kredensial login.
| Atribut | Tipe Data | Constraint | Keterangan |
|---------|-----------|------------|------------|
| `id` | UUID | PK | Identifier unik user. |
| `email` | String | UK, Not Null | Email institusi (@itk.ac.id). |
| `password_hash` | String | Not Null | Password yang sudah di-hash (Bcrypt). |
| `role` | String | Not Null | Peran user (`user`, `admin`, `superadmin`). |
| `name` | String | Not Null | Nama lengkap pengguna. |
| `phone` | String | Nullable | Nomor WhatsApp untuk koordinasi klaim. |
| `firebase_uid` | String | Nullable | (Legacy) ID dari Firebase Auth terdahulu. |
| `created_at` | DateTime | Default: Now | Waktu pendaftaran akun. |

#### 2. Tabel: `items`
Menyimpan data laporan barang hilang (`lost`) dan barang temuan (`found`).
| Atribut | Tipe Data | Constraint | Keterangan |
|---------|-----------|------------|------------|
| `id` | UUID | PK | Identifier unik item. |
| `type` | String | Not Null | Tipe laporan (`lost` atau `found`). |
| `status` | String | Not Null | Status: `open`, `in_claim`, `returned`, `closed`. |
| `title` | String | Not Null | Judul singkat barang. |
| `description` | Text | Not Null | Deskripsi detail ciri-ciri barang. |
| `category_id` | UUID | FK | Relasi ke tabel `categories`. |
| `building_id` | UUID | FK | Relasi ke tabel `buildings`. |
| `location_id` | UUID | FK | Relasi ke tabel `locations`. |
| `created_by` | UUID | FK | Relasi ke `users.id` (si pelapor). |
| `created_at` | DateTime | Default: Now | Waktu laporan dibuat. |
| `deleted_at` | DateTime | Nullable | Timestamp untuk fitur Soft Delete. |

#### 3. Tabel: `claims`
Menyimpan data pengajuan kepemilikan barang oleh pengguna.
| Atribut | Tipe Data | Constraint | Keterangan |
|---------|-----------|------------|------------|
| `id` | UUID | PK | Identifier unik klaim. |
| `item_id` | UUID | FK | Barang temuan yang diklaim. |
| `user_id` | UUID | FK | User yang mengajukan klaim. |
| `status` | String | Not Null | `pending`, `approved`, `rejected`, `completed`. |
| `ownership_answer` | Text | Not Null | Jawaban user untuk membuktikan kepemilikan. |
| `created_at` | DateTime | Default: Now | Waktu pengajuan klaim. |

#### 4. Tabel: `item_images`
Menyimpan data visual barang (maks 2MB per gambar).
| Atribut | Tipe Data | Constraint | Keterangan |
|---------|-----------|------------|------------|
| `id` | UUID | PK | Identifier unik gambar. |
| `item_id` | UUID | FK | Relasi ke `items.id`. |
| `image_data` | Text | Not Null | Data gambar dalam format Base64. |
| `display_order` | Integer | Default: 0 | Urutan tampilan gambar di galeri. |
| `created_at` | DateTime | Default: Now | Waktu upload gambar. |

#### 5. Tabel: `notifications`
Sistem notifikasi real-time untuk memberitahukan perubahan status klaim/barang.
| Atribut | Tipe Data | Constraint | Keterangan |
|---------|-----------|------------|------------|
| `id` | UUID | PK | Identifier unik notifikasi. |
| `user_id` | UUID | FK | Penerima notifikasi (`users.id`). |
| `title` | String | Not Null | Judul notifikasi. |
| `message` | Text | Not Null | Isi pesan notifikasi. |
| `is_read` | Boolean | Default: False| Status apakah sudah dibaca user. |
| `created_at` | DateTime | Default: Now | Waktu pengiriman notifikasi. |

#### 6. Tabel: `item_status_histories` / `claim_status_histories`
Audit trail untuk melacak setiap perpindahan status data.
| Atribut | Tipe Data | Constraint | Keterangan |
|---------|-----------|------------|------------|
| `id` | UUID | PK | Identifier unik riwayat. |
| `item_id` / `claim_id`| UUID | FK | Relasi ke entitas induk terkait. |
| `status` | String | Not Null | Status baru setelah perubahan dilakukan. |
| `changed_by` | UUID | FK | Pelaku perubahan status (`users.id`). |
| `created_at` | DateTime | Default: Now | Waktu kejadian perubahan. |

#### 7. Tabel: `audit_logs`
Mencatat aksi administratif krusial yang dilakukan oleh Admin/Superadmin.
| Atribut | Tipe Data | Constraint | Keterangan |
|---------|-----------|------------|------------|
| `id` | UUID | PK | Identifier unik log. |
| `user_id` | UUID | FK | Aktor yang melakukan aksi (`users.id`). |
| `action` | String | Not Null | Jenis aksi (misal: "DELETE_USER", "RESET_DB"). |
| `target_table`| String | Not Null | Tabel yang terdampak aksi tersebut. |
| `details` | JSON | Nullable | Detail teknis mengenai parameter aksi. |
| `created_at` | DateTime | Default: Now | Waktu eksekusi aksi. |

#### 8. Tabel Master Data (Support Tables)
Tabel referensi yang digunakan untuk drop-down menu pada form pelaporan.
*   **`categories`**: Daftar kategori barang (Elektronik, Dokumen, dll).
*   **`buildings`**: Daftar gedung di lingkungan ITK.
*   **`locations`**: Detail titik lokasi (Lobby, Lab, Kantin, dll).
*   **`security_officers`**: Daftar satpam yang berjaga di titik penitipan `found` items.
*(Setiap tabel master memiliki atribut minimal: `id` (PK) dan `name` (String, Not Null)).*

---

```mermaid
erDiagram
    USERS ||--o{ ITEMS : "dilaporkan oleh"
    USERS ||--o{ CLAIMS : "diajukan oleh"
    USERS ||--o{ NOTIFICATIONS : "menerima"
    USERS ||--o{ AUDIT_LOGS : "aksi (admin)"
    
    ITEMS ||--o{ CLAIMS : "memiliki"
    ITEMS ||--o{ ITEM_IMAGES : "memiliki foto"
    ITEMS ||--o{ ITEM_STATUS_HISTORIES : "riwayat status"
    
    CLAIMS ||--o{ CLAIM_STATUS_HISTORIES : "riwayat status"

    CATEGORIES ||--o{ ITEMS : "kategori"
    BUILDINGS ||--o{ ITEMS : "gedung"
    LOCATIONS ||--o{ ITEMS : "detail lokasi"
    SECURITY_OFFICERS ||--o{ ITEMS : "petugas penitipan"

    USERS {
        string id PK "UUID"
        string email UK "Email @itk.ac.id"
        string password_hash "Bcrypt Hash"
        string role "user / admin / superadmin"
        string firebase_uid "Legacy/Deprecated"
        string name
        datetime created_at
    }
    ITEMS {
        string id PK "UUID"
        string type "lost / found"
        string status "open / in_claim / returned / closed"
        string title
        string category_id FK
        string created_by FK
        datetime created_at
        datetime deleted_at "Soft Delete"
    }
    CLAIMS {
        string id PK "UUID"
        string item_id FK
        string user_id FK
        string status "pending / approved / rejected / completed"
        string ownership_answer
        datetime created_at
    }
    ITEM_IMAGES {
        string id PK "UUID"
        string item_id FK
        text image_data "Base64"
        datetime created_at
    }
    NOTIFICATIONS {
        string id PK
        string user_id FK
        string title
        string message
        boolean is_read
        datetime created_at
    }
    ITEM_STATUS_HISTORIES {
        string id PK
        string item_id FK
        string status "status terbaru"
        string changed_by FK "User ID"
        datetime created_at
    }
```

---

## 📡 Dokumentasi API

| Modul | Method | Endpoint | Deskripsi |
|-------|--------|----------|-----------|
| **Auth** | `POST` | `/auth/register` | Pendaftaran akun user baru |
| | `POST` | `/auth/login` | Autentikasi untuk mendapatkan JWT |
| | `GET` | `/auth/me` | Ambil profil user aktif |
| | `PUT` | `/auth/me` | Update profil (Nama/No HP) |
| **Items** | `GET` | `/items` | Daftar semua barang (filter & search) |
| | `POST` | `/items` | Buat laporan baru (lost / found) |
| | `GET` | `/items/me` | Daftar barang milik user aktif |
| | `GET` | `/items/{id}` | Detail informasi satu item |
| | `PUT` | `/items/{id}` | Edit laporan barang |
| | `DELETE` | `/items/{id}` | Hapus laporan (soft delete) |
| **Claims** | `POST` | `/claims` | Ajukan klaim kepemilikan |
| | `GET` | `/claims/me` | Riwayat klaim user aktif |
| | `GET` | `/claims/{id}` | Detail satu klaim |
| | `GET` | `/claims` | List klaim (Filter by item/Admin all) |
| | `PUT` | `/claims/{id}/status` | Admin proses klaim (approve/reject/completed) |
| **Notifications** | `GET` | `/notifications/me` | Notifikasi in-app user aktif |
| | `PUT` | `/notifications/read-all` | Tandai semua notifikasi terbaca |
| | `PUT` | `/notifications/{id}/read` | Tandai satu notifikasi terbaca |
| **Master Data** | `GET` | `/master-data/{type}` | Ambil data (categories/buildings/etc) |
| | `POST` | `/master-data/{type}` | Admin: Tambah data master baru |
| | `PUT` | `/master-data/{type}/{id}` | Admin: Edit data master |
| | `DELETE` | `/master-data/{type}/{id}` | Admin: Hapus data master |

> 📄 Dokumentasi interaktif tersedia di: `http://localhost:8000/docs` (Swagger UI)

---

## 🚀 Panduan Menjalankan Sistem

Pastikan Anda telah menginstal **Docker Desktop** (rekomendasi) atau **Python 3.12+** dan **Node.js** jika ingin menjalankan secara manual.

### 1. Inisialisasi Project (Clone)
```powershell
git clone https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary.git
cd cc-kelompok-a-extraordinary
```

### 2. Menjalankan via Docker (Rekomendasi)
Sistem ini menggunakan Docker untuk menyatukan Frontend, Backend, dan Database agar dapat berjalan secara konsisten di semua perangkat.

#### 🐳 Docker Compose Commands (Standard)
Jika Anda ingin menggunakan perintah Docker standar, berikut adalah tabel referensinya:
| Command | Keterangan |
|---------|------------|
| `docker compose up` | Menjalankan semua service di terminal (log terlihat). |
| `docker compose up -d` | Menjalankan service di background (*detached mode*). |
| `docker compose down` | Menghentikan dan menghapus seluruh container. |
| `docker compose logs -f` | Melihat log aktivitas dari seluruh service. |
| `docker compose ps` | Menampilkan status dan port seluruh container. |
| `docker compose up -d --build` | Membangun ulang image lalu menjalankan ulang service. |

#### 🚀 Temuin Orchestration Script (Automation)
Untuk mempermudah tim pengembang, kami telah menyediakan script **`temuin.ps1`** (Windows) dan **`temuin.sh`** (Linux/Mac). Script ini adalah *wrapper* cerdas yang membungkus perintah Docker di atas dengan fitur tambahan.

| Perintah | Fungsi Utama | Kelebihan dibanding Docker Standar |
|----------|--------------|------------------------------------|
| `.\scripts\temuin.ps1 start` | **Start System** | Otomatis cek `.env`, nyalakan Docker, dan tampilkan link akses URL. |
| `.\scripts\temuin.ps1 status` | **Check Health** | Menampilkan status container beserta URL Frontend/Backend/Docs. |
| `.\scripts\temuin.ps1 seed` | **Isi Data** | Menjalankan script pengisian data contoh ke dalam database. |
| `.\scripts\temuin.ps1 reset` | **Factory Reset** | Menghapus database, *pull* image terbaru, dan mulai dari nol. |
| `.\scripts\temuin.ps1 stop` | **Stop System** | Mematikan seluruh service dengan aman. |

> 💡 **Rekomendasi:** Selalu gunakan `.\scripts\temuin.ps1 start` sebagai pengganti `docker compose up` untuk menghindari kesalahan konfigurasi `.env`.

### 3. Menjalankan Secara Manual (Development Mode)
Jika Anda ingin melakukan pengembangan aktif, jalankan service secara terpisah:

**A. Backend (FastAPI):**
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

**B. Frontend (React):**
```powershell
cd frontend
npm install
npm run dev
```

### 4. Detail Akses URL
| Layanan | URL Akses | Deskripsi |
|---------|-----------|-----------|
| **Frontend UI** | `http://localhost:5173` | Antarmuka pengguna utama |
| **Backend API** | `http://localhost:8000` | Endpoint REST API |
| **Interactive Docs** | `http://localhost:8000/docs` | Dokumentasi Swagger/OpenAPI |
| **Redocly** | `http://localhost:8000/redoc` | Dokumentasi API alternatif |

---

## 📂 Struktur Proyek

```text
cc-kelompok-a-extraordinary/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── auth/             # Modul autentikasi (Login/Register)
│   │   ├── items/            # Modul item (Lost & Found CRUD)
│   │   ├── claims/           # Modul klaim & verifikasi kepemilikan
│   │   ├── notifications/    # Modul notifikasi in-app
│   │   ├── master_data/      # Modul data referensi (Gedung/Lokasi/etc)
│   │   └── models/           # Definisi tabel database (SQLAlchemy)
│   ├── alembic/              # Migrasi skema database
│   └── requirements.txt
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── pages/            # View utama (Dashboard, Login, Detail)
│   │   ├── components/       # UI Components (shadcn/ui)
│   │   └── lib/              # Konfigurasi Axios & API client
│   └── package.json
├── temuin-docs/              # Source of Truth (Arsitektur & Konsep)
├── docs/                     # Dokumentasi Teknis & Laporan Testing
│   ├── api-blackbox-testing.md      # Laporan pengujian backend
│   ├── frontend-blackbox-testing.md # Laporan pengujian UI/UX
│   ├── setup-guide.md               # Cara instalasi manual
│   └── docker-guide.md              # Cara penggunaan Docker
├── image/                    # Aset Visual & Bukti QA
│   ├── Testing Swagger/      # Bukti screenshot pengujian API
│   ├── sprint-01 s/d 04/     # Evidence pengerjaan per tahap
│   └── system-architecture.png
├── scripts/                  # Helper automation (Powershell/Bash)
├── docker-compose.yml        # Orchestration container
└── AGENTS.md                 # Dokumentasi untuk AI Assistant
```

---

## 🗺️ Roadmap Sprint & Bukti Pengerjaan

Berikut adalah progres pengerjaan tim per sprint beserta link cepat menuju laporan QA sebagai bukti pengerjaan.

| Sprint | Fokus Utama | Status | Bukti Laporan |
|:-------|:------------|:------:|:--------------|
| **Sprint 1** | Setup project, fondasi database, scaffold frontend | ✅ Done | [📄 Lihat Laporan](docs/sprint-01-qa-report.md) |
| **Sprint 2** | Auth (Google Login), core item flow (CRUD laporan) | ✅ Done | [📄 Lihat Laporan](docs/sprint-02-qa-report.md) |
| **Sprint 3** | Search & filter, klaim, notifikasi, master data | ✅ Done | [📄 Lihat Laporan](docs/sprint-03-qa-report.md) |
| **Sprint 4** | Dockerization & kesiapan demo UTS | ✅ Done | [📄 Lihat Laporan](docs/sprint-04-qa-report.md) |
| **Sprint 5** | CI/CD GitHub Actions & test automation backend | 🔄 Next | - |
| **Sprint 6** | Microservices split (auth-service & item-service) | 🔄 Next | - |
| **Sprint 7** | Nginx gateway, monitoring, audit log lanjut | 🔄 Next | - |
| **Sprint 8** | Security hardening & final polish | 🔄 Next | - |

**Status Fase UTS:** ✅ **Sprint 1–4 Stabil & Fully Dockerized**

---

## 👥 Tim Pengembang (Extraordinary)

Kami adalah kelompok mahasiswa dari program studi **Sistem Informasi**, Institut Teknologi Kalimantan yang berdedikasi membangun solusi digital untuk kampus.

| Profile | Nama | Role | Fokus Area |
|:-------:|------|------|------------|
| <img src="https://github.com/disnejy.png" width="60" style="border-radius:50%"/> | **Disne Jayaprana**<br/>[@disnejy](https://github.com/disnejy) | **Lead Backend** | Arsitektur API, Database Design, Service Logic, & JWT Security |
| <img src="https://github.com/nicholasmnrng.png" width="60" style="border-radius:50%"/> | **Nicholas Meinhard**<br/>[@nicholasmnrng](https://github.com/nicholasmnrng) | **Lead Frontend** | UI/UX Implementation, React Hooks, shadcn/ui, & API Integration |
| <img src="https://github.com/PangeranSilaen.png" width="60" style="border-radius:50%"/> | **Pangeran Silaen**<br/>[@PangeranSilaen](https://github.com/PangeranSilaen) | **Lead DevOps** | Dockerization, CI/CD Pipelines, Environment Setup, & Automation |
| <img src="https://github.com/raniayudewi.png" width="60" style="border-radius:50%"/> | **Rani Ayu Dewi**<br/>[@raniayudewi](https://github.com/raniayudewi) | **Lead QA & Docs** | Blackbox Testing, Sprint Reporting, Documentation, & Knowledge Management |

---

---

## 📚 Referensi Dokumentasi

### 🛠️ Panduan Teknis & Setup
- [**Setup Guide**](./docs/setup-guide.md) — Panduan instalasi awal dan konfigurasi environment.
- [**Docker Guide**](./docs/docker-guide.md) — Panduan lengkap menjalankan sistem menggunakan Docker.
- [**API Testing Guide**](./docs/api-testing-guide.md) — Instruksi cara menguji backend API secara manual.

### 🧪 Laporan Blackbox Testing (Lead QA & Docs)
- [**API Blackbox Testing Report**](./docs/api-blackbox-testing.md) — Laporan lengkap pengujian endpoint backend via Swagger.
- [**Frontend Blackbox Testing Report**](./docs/frontend-blackbox-testing.md) — Laporan lengkap pengujian antarmuka pengguna (UI/UX) dan alur sistem.

---

### 🗺️ Sumber Arsitektur (Source of Truth)
- [`temuin-docs/`](./temuin-docs/) — Dokumentasi arsitektur, PRD, sprint, dan role guide.
- [`AGENTS.md`](./AGENTS.md) — Entry point untuk AI coding agent.

---

