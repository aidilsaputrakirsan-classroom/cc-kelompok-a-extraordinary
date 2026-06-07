# Docker Guide — Temuin

Panduan lengkap Docker workflow untuk tim Temuin.

## Overview

Temuin menggunakan Docker Compose untuk menjalankan stack microservices lokal:
- **PostgreSQL** (shared server dengan database `auth_db`, `item_db`, `engagement_db`)
- **Auth Service** (FastAPI, port 8001)
- **Item Service** (FastAPI, port 8002)
- **Engagement Service** (FastAPI, port 8003)
- **React Frontend** (Vite build, served via Nginx, port 3000)

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

# 4. Start semua service microservices
.\scripts\temuin.ps1 start

# 5. Buka browser, register akun di http://localhost:3000/register

# 6. (Opsional) Jadikan akun kamu admin:
.\scripts\temuin.ps1 make-admin emailkamu@student.itk.ac.id

# Akses:
#    Frontend:           http://localhost:3000
#    Status API:         http://localhost:3000/api/status
#    Auth Health:        http://localhost:8001/health
#    Item Health:        http://localhost:8002/health
#    Engagement Health:  http://localhost:8003/health
```

## Setup Pertama Kali

### Bagaimana `.env` bekerja

Docker Compose hanya membaca **root `.env`** (di folder utama project). File ini berisi config untuk semua service sekaligus (database, auth, item, engagement, frontend). Docker Compose **tidak** membaca `.env` di folder service masing-masing — itu hanya untuk dev lokal tanpa Docker.

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

> Jika kamu pernah menjalankan stack monolith lama, jalankan `.\scripts\temuin.ps1 reset` sekali. Reset ini membuat volume database bersih supaya `auth_db`, `item_db`, dan `engagement_db` dibuat oleh `infra/postgres-init/01-create-databases.sh`.

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

Kamu **tidak perlu build Docker images**. Cukup pull dan start. Docker di sini untuk menjalankan environment lengkap (database + auth + item + engagement + frontend) agar bisa testing integrasi.

## Workflow: DevOps (Build & Push Images)

Hanya DevOps lead (@PangeranSilaen) yang build dan push images ke Docker Hub. Normalnya build/push dilakukan oleh GitHub Actions dari branch `master`; local runner dipakai untuk pull dan smoke test image terbaru.

```
1. Pastikan PR backend/frontend sudah merged ke master
2. Checkout master dan pull latest
3. Pastikan workflow build/push Docker image sukses
4. Pull images terbaru:
   .\scripts\temuin.ps1 pull
5. Smoke test lokal:
   .\scripts\temuin.ps1 start
   curl http://localhost:3000/api/status
```

## Command Reference

| Command          | Fungsi                                                                                                            |
|------------------|-------------------------------------------------------------------------------------------------------------------|
| `start`          | Buat `.env` jika belum ada, stop legacy monolith jika sedang jalan, lalu start db → auth → item → engagement → frontend |
| `stop`           | Stop semua container. Data **tetap tersimpan** di volume                                                          |
| `restart`        | Stop + start                                                                                                      |
| `reset`          | Full clean restart: stop, hapus volume DB, pull images terbaru, start ulang. **MENGHAPUS semua data!**            |
| `status`         | Lihat status container dan URL akses                                                                              |
| `logs [service]` | Tail logs (opsional: `db`, `auth`, `item`, `engagement`, `frontend`)                                              |
| `pull`           | Pull images dari Docker Hub                                                                                       |
| `seed`           | Seed master data item-service untuk manual re-seed                                                                |
| `make-admin <email>` | Promote user yang sudah register menjadi admin                                                                |

## Catatan Penting

- **Database TIDAK di-reset** saat start/stop. Data tersimpan di Docker volume `temuin_pgdata`. Untuk reset total microservices: jalankan `reset` command.
- **Clean DB pertama kali penting**: Volume lama dari monolith tidak otomatis membuat `auth_db`, `item_db`, dan `engagement_db`. Gunakan `reset` setelah pindah ke microservices.
- **Migrations otomatis**: Setiap service menjalankan migration masing-masing saat start via entrypoint container.
- **Seed item-service**: Master data item-service bisa di-seed manual dengan command `seed`.
- **Admin account**: Tidak ada akun admin default. Register dulu lewat UI, lalu promote via `make-admin` command.
- **Frontend env berubah**: Jalankan `build` ulang karena `VITE_*` di-bake saat build.
- **Legacy monolith**: Masih bisa dijalankan manual dengan `docker compose up -d`, tapi script `temuin.ps1` dan `temuin.sh` sekarang default ke microservices.

## Akses

| Service           | URL                                                   |
|-------------------|-------------------------------------------------------|
| Frontend          | http://localhost:3000                                  |
| Status API        | http://localhost:3000/api/status                       |
| Auth Health       | http://localhost:8001/health                           |
| Item Health       | http://localhost:8002/health                           |
| Engagement Health | http://localhost:8003/health                           |
| Database          | internal `temuin-db:5432` (`auth_db`, `item_db`, `engagement_db`) |

## Docker Hub Images

- `pangeransilaen/temuin-auth-service:latest`
- `pangeransilaen/temuin-item-service:latest`
- `pangeransilaen/temuin-engagement-service:latest`
- `pangeransilaen/temuin-frontend:prod`

## Troubleshooting

- **Port conflict**: Pastikan port 3000, 8001, 8002, dan 8003 belum dipakai. Script `start` otomatis menghentikan legacy monolith compose tanpa menghapus volume.
- **DB connection error**: Tunggu beberapa detik setelah start, PostgreSQL butuh waktu init
- **Frontend env berubah**: Jalankan `build` ulang karena `VITE_*` di-bake saat build
- **StatusPage kosong**: Buka `http://localhost:3000/api/status`. Response harus JSON dengan key `services`, bukan HTML SPA atau `{"detail":"Not Found"}`.
- **Mau reset database**: Jalankan `.\scripts\temuin.ps1 reset` (akan hapus DB, pull images terbaru, dan start ulang)
- **`.env` lama masih ada Firebase vars**: Tidak akan error, tapi lebih bersih kalau regenerate dari `.env.docker` (lihat "Setup Pertama Kali")
- **`make-admin` tidak berhasil**: Pastikan user sudah register dulu lewat UI. Command ini hanya update role, tidak buat akun baru
