# Backend Architecture - Temuin

## Stack

- Python 3.12+
- FastAPI
- SQLAlchemy
- Pydantic
- PostgreSQL

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

## Dokumen Terkait

- [database-design.md](./database-design.md)
- [../02-prd/prd-user-flows.md](../02-prd/prd-user-flows.md)
- [../05-roles/backend.md](../05-roles/backend.md)
