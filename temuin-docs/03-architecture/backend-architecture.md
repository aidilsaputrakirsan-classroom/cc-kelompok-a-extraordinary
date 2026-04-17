# Backend Architecture - Temuin

## Stack

- Python 3.12+
- FastAPI
- SQLAlchemy
- Pydantic
- PostgreSQL

## Auth Architecture

Temuin memakai **email + password** untuk autentikasi dan **PostgreSQL untuk penyimpanan data internal aplikasi**.

Artinya:
- User mendaftar dan login dengan email kampus (`itk.ac.id`) dan password
- Backend memverifikasi password dengan bcrypt (via `passlib`)
- Backend menyimpan `password_hash` di tabel `users` di PostgreSQL
- Backend mengeluarkan JWT internal aplikasi untuk request selanjutnya

PostgreSQL adalah satu-satunya source of truth untuk data user dan seluruh data domain Temuin.

## Auth Flow Singkat

1. User register via form dengan email `itk.ac.id`, password, dan nama
2. Backend validasi domain email dan password policy
3. Backend hash password dengan bcrypt dan simpan user di PostgreSQL
4. Backend mengembalikan JWT internal ke frontend
5. Untuk login, user kirim email + password
6. Backend verifikasi password terhadap hash di database
7. Backend mengembalikan JWT internal ke frontend
8. Frontend memakai JWT internal untuk semua request API berikutnya

## Struktur Monolith Awal

```text
backend/
└── app/
    ├── main.py
    ├── config.py
    ├── database.py
    ├── dependencies.py
    ├── auth/
    │   ├── router.py
    │   ├── service.py
    │   └── schemas.py
    ├── items/
    │   ├── router.py
    │   ├── service.py
    │   └── schemas.py
    ├── claims/
    │   ├── router.py
    │   ├── service.py
    │   └── schemas.py
    ├── master_data/
    │   ├── router.py
    │   └── service.py
    ├── notifications/
    │   ├── router.py
    │   └── service.py
    ├── models/
    └── utils/
```

## Boundary Per Modul

- `auth` menangani register, login email+password, dan JWT internal
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
- Autentikasi ditangani langsung oleh backend (email+password dengan bcrypt), tanpa dependency eksternal

## Dokumen Terkait

- [database-design.md](./database-design.md)
- [../02-prd/prd-user-flows.md](../02-prd/prd-user-flows.md)
- [../05-roles/backend.md](../05-roles/backend.md)
