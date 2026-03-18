# Backend Architecture - Temuin

## Stack

- Python 3.12+
- FastAPI
- SQLAlchemy
- Pydantic
- PostgreSQL

## Auth Architecture

Temuin memakai **Firebase untuk Google Sign-In** dan **PostgreSQL untuk penyimpanan data internal aplikasi**.

Artinya:
- Firebase dipakai untuk menjalankan login Google dan menghasilkan Firebase ID token
- Backend memverifikasi token itu dengan Firebase Admin SDK
- Setelah token valid, backend melakukan create atau sync user internal di PostgreSQL
- Backend lalu mengeluarkan JWT internal aplikasi untuk request selanjutnya

Firebase **bukan** source of truth untuk data domain Temuin. Data seperti items, claims, master data, notifications, audit log, dan role internal tetap berada di PostgreSQL.

## Auth Flow Singkat

1. Frontend login lewat Firebase Auth SDK
2. Frontend menerima Firebase ID token
3. Frontend mengirim token itu ke backend
4. Backend memverifikasi token dengan Firebase Admin SDK
5. Backend cek email kampus dan aturan internal
6. Backend create atau sync record user di PostgreSQL
7. Backend mengembalikan JWT internal ke frontend
8. Frontend memakai JWT internal untuk semua request API berikutnya

## Struktur Monolith Awal

```text
backend/
â””â”€â”€ app/
    â”œâ”€â”€ main.py
    â”œâ”€â”€ config.py
    â”œâ”€â”€ database.py
    â”œâ”€â”€ dependencies.py
    â”œâ”€â”€ auth/
    â”‚   â”œâ”€â”€ router.py
    â”‚   â”œâ”€â”€ service.py
    â”‚   â””â”€â”€ schemas.py
    â”œâ”€â”€ items/
    â”‚   â”œâ”€â”€ router.py
    â”‚   â”œâ”€â”€ service.py
    â”‚   â””â”€â”€ schemas.py
    â”œâ”€â”€ claims/
    â”‚   â”œâ”€â”€ router.py
    â”‚   â”œâ”€â”€ service.py
    â”‚   â””â”€â”€ schemas.py
    â”œâ”€â”€ master_data/
    â”‚   â”œâ”€â”€ router.py
    â”‚   â””â”€â”€ service.py
    â”œâ”€â”€ notifications/
    â”‚   â”œâ”€â”€ router.py
    â”‚   â””â”€â”€ service.py
    â”œâ”€â”€ models/
    â””â”€â”€ utils/
```

## Boundary Per Modul

- `auth` menangani login Google, user sync, dan JWT internal
- `items` menangani laporan lost/found dan item status
- `claims` menangani alur klaim
- `master_data` menangani kategori, gedung, lokasi, dan satpam
- `notifications` menangani notifikasi in-app

## Evolusi Ke Microservices

Pada Sprint 6:
- `auth` dipindah menjadi `auth-service`
- `items`, `claims`, `master_data`, dan `notifications` digabung dalam `item-service`
- Verifikasi token lintas service dilakukan lewat `auth_client`

## Aturan Backend

- Gunakan env vars untuk seluruh config
- Business rule utama wajib mengikuti `decision-log.md`
- Soft delete untuk item milik user
- History dan audit log tidak dicampur ke tabel utama
- Firebase hanya menangani external authentication, bukan penyimpanan data bisnis aplikasi

## Dokumen Terkait

- [database-design.md](./database-design.md)
- [../02-prd/prd-user-flows.md](../02-prd/prd-user-flows.md)
- [../05-roles/backend.md](../05-roles/backend.md)
