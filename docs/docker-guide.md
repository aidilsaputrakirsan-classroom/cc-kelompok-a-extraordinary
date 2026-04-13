# Docker Guide — Temuin

Panduan lengkap Docker workflow untuk tim Temuin.

## Overview

Temuin menggunakan Docker Compose untuk menjalankan tiga service:
- **PostgreSQL** (database)
- **FastAPI Backend** (Python)
- **React Frontend** (Vite build, served via Nginx)

Images sudah tersedia di Docker Hub — kebanyakan anggota tim **tidak perlu build sendiri**.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (terbaru) sudah terinstall dan running

## Quick Start (Untuk Semua Anggota Tim)

```powershell
# 1. Pull images terbaru dari Docker Hub
.\scripts\temuin.ps1 pull

# 2. Start semua service
.\scripts\temuin.ps1 start

# 3. Buka browser
#    Frontend:  http://localhost:3000
#    Backend:   http://localhost:8000
#    API Docs:  http://localhost:8000/docs
```

## Setup Pertama Kali

1. **Copy environment template:**
   ```powershell
   copy .env.docker .env        # Windows
   cp .env.docker .env          # Linux/Mac
   ```

2. **Edit `.env`** — isi Firebase config dari Firebase Console (opsional, app tetap jalan tanpa ini tapi login tidak bisa)

3. **Firebase credentials** (opsional):
   Taruh `serviceAccountKey.json` di folder `backend/`. File ini sudah di-`.gitignore`. Jika tidak ada, script akan membuat placeholder kosong dan app tetap start (tapi Firebase auth tidak berfungsi).

## Workflow: Anggota Tim (Backend/Frontend Dev)

```
1. Pull images terbaru     →  .\scripts\temuin.ps1 pull
2. Start containers        →  .\scripts\temuin.ps1 start
3. Kerjakan code lokal     →  (dev server frontend/backend masing-masing)
4. Selesai? Push ke GitHub →  git push, buat PR
```

Kamu **tidak perlu build Docker images**. Cukup pull dan start. Docker di sini untuk menjalankan environment lengkap (database + backend + frontend) agar bisa testing integrasi.

## Workflow: DevOps (Build & Push Images)

Hanya DevOps lead (@PangeranSilaen) yang build dan push images ke Docker Hub.

```
1. Pastikan PR backend/frontend sudah merged ke master
2. Checkout master dan pull latest
3. Build images:
   .\scripts\temuin.ps1 build

4. Push ke Docker Hub:
   docker push pangeransilaen/temuin-backend:latest
   docker push pangeransilaen/temuin-frontend:latest

5. Tim bisa pull images terbaru
```

## Command Reference

| Command          | Fungsi                                                                                                            |
|------------------|-------------------------------------------------------------------------------------------------------------------|
| `start`          | Buat `.env` jika belum ada, buat placeholder `serviceAccountKey.json` jika belum ada, start db → backend → frontend |
| `stop`           | Stop semua container. Data **tetap tersimpan** di volume                                                          |
| `restart`        | Stop + start                                                                                                      |
| `status`         | Lihat status container dan URL akses                                                                              |
| `logs [service]` | Tail logs (opsional: `db`, `backend`, `frontend`)                                                                 |
| `build`          | Build images lokal (hanya untuk DevOps)                                                                           |
| `pull`           | Pull images dari Docker Hub                                                                                       |
| `migrate`        | Jalankan Alembic migrations (sudah otomatis saat backend start)                                                   |
| `seed`           | Seed master data (categories, buildings) — hanya perlu sekali                                                     |

## Catatan Penting

- **Database TIDAK di-reset** saat start/stop. Data tersimpan di Docker volume `temuin_pgdata`. Untuk reset total: `docker volume rm temuin_pgdata` lalu start ulang.
- **Migrations otomatis**: Backend container menjalankan `alembic upgrade head` saat start via `entrypoint.sh`. Command `migrate` hanya untuk manual run jika perlu.
- **Seed data**: Jalankan `seed` sekali setelah pertama kali start. Ini mengisi tabel `categories` dan `buildings` dengan data awal.
- **Frontend env berubah**: Jalankan `build` ulang karena `VITE_*` di-bake saat build.

## Akses

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000       |
| Backend  | http://localhost:8000       |
| API Docs | http://localhost:8000/docs  |
| Database | localhost:5434 (postgres)   |

## Docker Hub Images

- `pangeransilaen/temuin-backend:latest`
- `pangeransilaen/temuin-frontend:latest`

## Troubleshooting

- **Port conflict**: Edit `DB_PORT` di `.env` jika port 5434 sudah terpakai
- **Firebase error**: Pastikan `serviceAccountKey.json` ada di `backend/`. Tanpa file ini, login tidak bisa tapi endpoint lain tetap jalan
- **DB connection error**: Tunggu beberapa detik setelah start, PostgreSQL butuh waktu init
- **Frontend env berubah**: Jalankan `build` ulang karena `VITE_*` di-bake saat build
- **Mau reset database**: `docker volume rm temuin_pgdata` lalu `.\scripts\temuin.ps1 start` ulang
