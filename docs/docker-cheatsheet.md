# Docker Cheatsheet - Temuin

Cheatsheet perintah Docker yang paling sering dipakai untuk proyek Temuin (FastAPI + React + PostgreSQL).

## Tech Stack Proyek

| Komponen | Teknologi | Path |
|----------|-----------|------|
| Backend | FastAPI + SQLAlchemy + PostgreSQL | `backend/` |
| Frontend | React + Vite + Tailwind CSS + shadcn/ui | `frontend/` |
| Database | PostgreSQL | - |

## Quick Reference

### 1. `docker pull` - Pull Image

Mengunduh image dari Docker Hub atau registry lain.

```bash
# Pull image PostgreSQL versi 15
docker pull postgres:15

# Pull image Python (untuk backend FastAPI)
docker pull python:3.11-slim

# Pull image Node (untuk frontend React)
docker pull node:20-alpine
```

### 2. `docker build` - Build Image

Membangun Docker image dari Dockerfile.

```bash
# Build image backend
docker build -t temuin-backend:latest -f backend/Dockerfile .

# Build image frontend
docker build -t temuin-frontend:latest -f frontend/Dockerfile .

# Build tanpa cache (fresh build)
docker build --no-cache -t temuin-backend:latest -f backend/Dockerfile .

# Build dengan tag versi
docker build -t temuin-backend:v1.0.0 -f backend/Dockerfile .
```

### 3. `docker run` - Run Container

Menjalankan container dari image.

```bash
# Jalankan database PostgreSQL
docker run -d \
  --name temuin-db \
  -e POSTGRES_USER=temuin_user \
  -e POSTGRES_PASSWORD=temuin_password \
  -e POSTGRES_DB=temuin_db \
  -p 5432:5432 \
  postgres:15

# Jalankan backend FastAPI
docker run -d \
  --name temuin-backend \
  -e DATABASE_URL=postgresql://temuin_user:temuin_password@temuin-db:5432/temuin_db \
  -e ENVIRONMENT=development \
  -p 8000:8000 \
  temuin-backend:latest

# Jalankan frontend React
docker run -d \
  --name temuin-frontend \
  -p 5173:5173 \
  temuin-frontend:latest

# Jalankan dengan volume mount (development mode)
docker run -d \
  --name temuin-backend-dev \
  -v $(pwd)/backend:/app \
  -p 8000:8000 \
  temuin-backend:latest
```

### 4. `docker ps` - List Containers

Menampilkan container yang sedang berjalan.

```bash
# Lihat semua container yang berjalan
docker ps

# Lihat semua container (termasuk yang stopped)
docker ps -a

# Lihat container dengan filter nama
docker ps --filter name=temuin

# Lihat container dengan format custom
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### 5. `docker logs` - View Container Logs

Melihat output log dari container.

```bash
# Lihat log backend
docker logs temuin-backend

# Lihat log dengan follow (real-time)
docker logs -f temuin-backend

# Lihat 100 baris log terakhir
docker logs --tail 100 temuin-backend

# Lihat log dengan timestamp
docker logs -t temuin-backend

# Lihat log dari waktu tertentu
docker logs --since 2024-01-01T10:00:00 temuin-backend
```

### 6. `docker exec` - Execute Command in Container

Menjalankan perintah di dalam container yang sedang berjalan.

```bash
# Masuk ke shell backend
docker exec -it temuin-backend /bin/bash

# Jalankan migrasi database
docker exec -it temuin-backend python -m alembic upgrade head

# Jalankan test backend
docker exec -it temuin-backend pytest

# Masuk ke database shell
docker exec -it temuin-db psql -U temuin_user -d temuin_db

# Lihat isi container
docker exec -it temuin-backend ls -la /app
```

### 7. `docker stop` - Stop Container

Menghentikan container yang sedang berjalan.

```bash
# Stop satu container
docker stop temuin-backend

# Stop beberapa container sekaligus
docker stop temuin-backend temuin-frontend temuin-db

# Stop semua container dengan prefix "temuin"
docker stop $(docker ps --filter name=temuin -q)

# Stop dengan timeout tertentu (detik)
docker stop -t 30 temuin-backend
```

### 8. `docker rm` - Remove Container

Menghapus container yang sudah stopped.

```bash
# Hapus container
docker rm temuin-backend

# Hapus container yang sudah stopped
docker rm $(docker ps -a -q)

# Force remove container yang masih berjalan
docker rm -f temuin-backend

# Hapus semua container yang exit
docker rm $(docker ps -a --filter status=exited -q)
```

### 9. `docker push` - Push Image to Registry

Mengunggah image ke Docker Hub atau registry lain.

```bash
# Login ke Docker Hub
docker login

# Push image ke Docker Hub
docker push username/temuin-backend:latest

# Push dengan tag versi
docker push username/temuin-backend:v1.0.0

# Push ke GitHub Container Registry
docker tag temuin-backend:latest ghcr.io/username/temuin-backend:latest
docker push ghcr.io/username/temuin-backend:latest
```

## Docker Compose Commands

### `docker compose up` - Start Services

```bash
# Jalankan semua services
docker compose up -d

# Jalankan dengan rebuild
docker compose up -d --build

# Jalankan specific service
docker compose up -d backend

# Jalankan dengan logs
docker compose up -d && docker compose logs -f
```

### `docker compose down` - Stop Services

```bash
# Stop semua services
docker compose down

# Stop dan hapus volumes
docker compose down -v

# Stop dan hapus images
docker compose down --rmi all
```

### `docker compose ps` - List Services

```bash
# Lihat services yang berjalan
docker compose ps

# Lihat semua services
docker compose ps -a
```

### `docker compose exec` - Execute in Service

```bash
# Exec ke backend service
docker compose exec backend /bin/bash

# Exec ke database
docker compose exec db psql -U temuin_user -d temuin_db
```

## Common Workflows

### Development Setup

```bash
# 1. Pull dependencies
docker compose build

# 2. Jalankan semua services
docker compose up -d

# 3. Cek status
docker compose ps

# 4. Cek logs
docker compose logs -f backend
```

### Database Migration

```bash
# Jalankan migrasi via Alembic
docker compose exec backend alembic upgrade head

# Atau langsung ke database
docker compose exec db psql -U temuin_user -d temuin_db -c "\dt"
```

### Debugging

```bash
# 1. Cek container yang berjalan
docker ps

# 2. Cek logs
docker logs temuin-backend

# 3. Masuk ke container
docker exec -it temuin-backend /bin/bash

# 4. Cek koneksi database
docker exec -it temuin-db psql -U temuin_user -d temuin_db -c "SELECT 1"
```

### Cleanup

```bash
# 1. Stop semua containers
docker compose down

# 2. Hapus dangling images
docker image prune -a

# 3. Hapus volumes (jika perlu fresh start)
docker compose down -v
```

## Tips

| Tip | Command |
|-----|---------|
| Lihat disk usage | `docker system df` |
| Hapus semua unused | `docker system prune -a` |
| Inspect container | `docker inspect temuin-backend` |
| Lihat IP container | `docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' temuin-backend` |
| Copy file ke container | `docker cp file.txt temuin-backend:/app/` |
| Copy file dari container | `docker cp temuin-backend:/app/file.txt .` |
