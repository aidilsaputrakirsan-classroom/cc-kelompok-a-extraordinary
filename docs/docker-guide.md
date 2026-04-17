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
# 1. Pull repo terbaru
git checkout master
git pull

# 2. Setup .env (lihat section "Setup Pertama Kali" di bawah)

# 3. Pull images terbaru dari Docker Hub
.\scripts\temuin.ps1 pull

# 4. Start semua service (migration + seed master data otomatis)
.\scripts\temuin.ps1 start

# 5. Buka browser, register akun di http://localhost:3000/register

# 6. (Opsional) Jadikan akun kamu admin:
.\scripts\temuin.ps1 make-admin emailkamu@student.itk.ac.id

# Akses:
#    Frontend:  http://localhost:3000
#    Backend:   http://localhost:8000
#    API Docs:  http://localhost:8000/docs
```

## Setup Pertama Kali

### Bagaimana `.env` bekerja

Docker Compose hanya membaca **root `.env`** (di folder utama project). File ini berisi config untuk semua service sekaligus (database, backend, frontend). Docker Compose **tidak** membaca `backend/.env` atau `frontend/.env` — itu hanya untuk dev lokal tanpa Docker.

### Langkah setup `.env`

**Kalau belum punya root `.env`:**
```powershell
copy .env.docker .env        # Windows
cp .env.docker .env          # Linux/Mac
```

**Kalau sudah punya root `.env` dari sebelumnya (masih ada `VITE_FIREBASE_*` dll):**
```powershell
# Hapus .env lama dan buat ulang dari template bersih
del .env                     # Windows
rm .env                      # Linux/Mac

copy .env.docker .env        # Windows
cp .env.docker .env          # Linux/Mac
```

> Firebase sudah dihapus dari project. Vars `VITE_FIREBASE_*` dan `FIREBASE_CREDENTIALS_FILE` di `.env` lama tidak akan menyebabkan error, tapi lebih bersih kalau di-regenerate dari template.

**Edit `.env`** — untuk dev lokal, default values sudah cukup. Untuk production, ganti `SECRET_KEY`:
```powershell
# Generate SECRET_KEY baru:
python -c "import secrets; print(secrets.token_hex(32))"
```

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
| `start`          | Buat `.env` jika belum ada, start db → backend → frontend |
| `stop`           | Stop semua container. Data **tetap tersimpan** di volume                                                          |
| `restart`        | Stop + start                                                                                                      |
| `reset`          | Full clean restart: stop, hapus volume DB, pull images terbaru, start ulang. **MENGHAPUS semua data!**            |
| `status`         | Lihat status container dan URL akses                                                                              |
| `logs [service]` | Tail logs (opsional: `db`, `backend`, `frontend`)                                                                 |
| `build`          | Build images lokal (hanya untuk DevOps)                                                                           |
| `pull`           | Pull images dari Docker Hub                                                                                       |
| `migrate`        | Jalankan Alembic migrations (sudah otomatis saat backend start)                                                   |
| `seed`           | Seed master data (sudah otomatis saat start, command ini untuk manual re-seed)                                    |
| `make-admin <email>` | Promote user yang sudah register menjadi admin                                                                |

## Catatan Penting

- **Database TIDAK di-reset** saat start/stop. Data tersimpan di Docker volume `temuin_pgdata`. Untuk reset total: jalankan `reset` command (atau manual: `docker compose down -v` lalu start ulang).
- **Migrations otomatis**: Backend container menjalankan `alembic upgrade head` saat start via `entrypoint.sh`. Command `migrate` hanya untuk manual run jika perlu.
- **Seed otomatis**: Master data (categories, buildings, locations, security officers) otomatis di-seed saat backend start. Hanya insert jika tabel kosong, aman dijalankan berulang.
- **Admin account**: Tidak ada akun admin default. Register dulu lewat UI, lalu promote via `make-admin` command.
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
- **DB connection error**: Tunggu beberapa detik setelah start, PostgreSQL butuh waktu init
- **Frontend env berubah**: Jalankan `build` ulang karena `VITE_*` di-bake saat build
- **Mau reset database**: Jalankan `.\scripts\temuin.ps1 reset` (akan hapus DB, pull images terbaru, dan start ulang)
- **`.env` lama masih ada Firebase vars**: Tidak akan error, tapi lebih bersih kalau regenerate dari `.env.docker` (lihat "Setup Pertama Kali")
- **`make-admin` tidak berhasil**: Pastikan user sudah register dulu lewat UI. Command ini hanya update role, tidak buat akun baru
