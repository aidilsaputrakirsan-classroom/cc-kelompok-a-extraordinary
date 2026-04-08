# 🐳 Docker Cheatsheet - Praktikum CC

Dokumentasi lengkap Docker commands yang sering dipakai dalam project ini. Cocok untuk development dan production setup.

---

## 📋 Daftar Isi
1. [Build Images](#build-images)
2. [Run Containers](#run-containers)
3. [List & Monitor](#list--monitor)
4. [Logs & Debugging](#logs--debugging)
5. [Execute Commands](#execute-commands)
6. [Stop & Remove](#stop--remove)
7. [Push & Pull](#push--pull)
8. [Quick Tips](#quick-tips)

---

## 🏗️ Build Images

### Build Backend Image
```bash
# Build dengan custom tag
docker build -t backend:latest ./backend

# Build dengan full tag (misal untuk push ke registry)
docker build -t username/backend:v1.0 ./backend

# Build dengan label metadata
docker build --label version=1.0 --label author=team -t backend:latest ./backend

# Build tanpa cache (untuk fresh install)
docker build --no-cache -t backend:latest ./backend
```

### Build Frontend Image
Jika ada Dockerfile di frontend folder:
```bash
docker build -t frontend:latest ./frontend
```

### Build Multiple Services
```bash
# Build backend
docker build -t backend:latest ./backend

# Build frontend
docker build -t frontend:latest ./frontend
```

---

## 🚀 Run Containers

### Run Backend (Development)
```bash
# Simple run dengan port mapping (port 8000 container -> 8000 host)
docker run -p 8000:8000 backend:latest

# Run dengan environment variables
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:pass@db:5432/dbname \
  -e DEBUG=true \
  backend:latest

# Run dengan volume mount (hot-reload code changes)
docker run -p 8000:8000 \
  -v C:\path\to\backend:/app \
  backend:latest

# Run in background (detached mode)
docker run -d -p 8000:8000 --name backend-dev backend:latest
```

### Run Backend (Production)
```bash
# Run dengan restart policy
docker run -d \
  -p 8000:8000 \
  --name backend-prod \
  --restart unless-stopped \
  -e DEBUG=false \
  backend:latest

# Run dengan resource limits (memory & CPU)
docker run -d \
  -p 8000:8000 \
  --name backend-prod \
  --memory=512m \
  --cpus=1 \
  backend:latest
```

### Run Frontend (Development with Vite)
```bash
# Frontend development dengan port 5173 (Vite default)
docker run -p 5173:5173 \
  -v C:\path\to\frontend:/app \
  frontend:latest

# Atau jika menggunakan npm dev
docker run -p 5173:5173 frontend:latest npm run dev
```

### Run with Docker Network
Untuk komunikasi antar container (backend & frontend bersama):
```bash
# Create network
docker network create praktikum-net

# Run backend di network
docker run -d \
  --name backend \
  --network praktikum-net \
  -e DATABASE_URL=postgresql://db:5432/dbname \
  backend:latest

# Run frontend di network (dapat akses backend via http://backend:8000)
docker run -d \
  --name frontend \
  --network praktikum-net \
  -p 5173:5173 \
  frontend:latest
```

---

## 📊 List & Monitor

### List Running Containers
```bash
# List semua containers yang sedang running
docker ps

# List semua containers (termasuk yang stopped)
docker ps -a

# List dengan format custom
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# List containers dengan label tertentu
docker ps --filter "label=version=1.0"
```

### List Images
```bash
# List semua images di local
docker image ls

# List images dengan specific pattern
docker image ls | grep backend

# List dengan format detail
docker image ls --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

### Show Container Stats (Live CPU, Memory, Network)
```bash
# Real-time statistics
docker stats

# Stats untuk specific container
docker stats backend-dev

# Stats tanpa stream (one-time)
docker stats --no-stream
```

---

## 📝 Logs & Debugging

### View Container Logs
```bash
# Show logs dari backend container
docker logs backend-dev

# Show logs dengan timestamp
docker logs --timestamps backend-dev

# Show last 50 lines
docker logs --tail 50 backend-dev

# Follow logs (like tail -f)
docker logs -f backend-dev

# Show logs dari 5 menit terakhir
docker logs --since 5m backend-dev
```

### Inspect Container
```bash
# Show detail informasi container
docker inspect backend-dev

# Extract specific info (misal IP address)
docker inspect -f '{{.NetworkSettings.IPAddress}}' backend-dev

# Show environment variables
docker inspect backend-dev | grep -A 10 '"Env"'
```

---

## ⚙️ Execute Commands

### Execute Command di Running Container
```bash
# Run bash interaktif di backend container
docker exec -it backend-dev bash

# Run python command
docker exec backend-dev python -m pytest

# Run linting
docker exec backend-dev flake8 .

# Check Python version
docker exec backend-dev python --version

# Run specific Python script
docker exec backend-dev python scripts/migrate.py
```

### Copy Files from Container
```bash
# Copy file dari container ke host
docker cp backend-dev:/app/output.txt ./output.txt

# Copy folder dari container ke host
docker cp backend-dev:/app/logs ./logs
```

### Copy Files to Container
```bash
# Copy file dari host ke container
docker cp ./config.env backend-dev:/app/config.env
```

---

## 🛑 Stop & Remove

### Stop Containers
```bash
# Stop container (graceful shutdown, wait 10 seconds)
docker stop backend-dev

# Stop all running containers
docker stop $(docker ps -q)

# Force stop (SIGKILL immediately)
docker kill backend-dev
```

### Remove Containers
```bash
# Remove stopped container
docker rm backend-dev

# Remove all stopped containers
docker container prune

# Remove container paksa (meski sedang running)
docker rm -f backend-dev
```

### Remove Images
```bash
# Remove image (jika tidak ada container yang menggunakannya)
docker rmi backend:latest

# Remove image paksa
docker rmi -f backend:latest

# Remove unused images
docker image prune

# Remove ALL images (warning: very destructive)
docker image prune -a
```

### Clean Up Everything
```bash
# Remove semua stopped containers, unused networks, dangling images
docker system prune

# Include unused volumes tapi (careful!)
docker system prune -a --volumes
```

---

## 📤📥 Push & Pull

### Push Image ke Docker Registry

> **Note**: Sebelum push, pastikan sudah login ke Docker Hub atau registry lain.

```bash
# Login ke Docker Hub
docker login

# Tag image dengan username/registry
docker tag backend:latest myusername/backend:v1.0

# Push ke Docker Hub
docker push myusername/backend:v1.0

# Push dengan multiple tags
docker tag backend:latest myusername/backend:latest
docker push myusername/backend:latest
```

### Pull Image dari Registry
```bash
# Pull image dari Docker Hub
docker pull myusername/backend:v1.0

# Pull latest tag
docker pull myusername/backend:latest

# Pull dan langsung run
docker run -d -p 8000:8000 myusername/backend:v1.0
```

### Logout dari Registry
```bash
docker logout
```

---

## 💡 Quick Tips

### 1. **Container Naming Best Practices**
```bash
# ❌ Hindari
docker run -d backend:latest

# ✅ Lebih baik
docker run -d --name backend-dev backend:latest
docker run -d --name backend-prod backend:latest
```

### 2. **Environment File**
```bash
# Buat file .env
# DATABASE_URL=postgresql://user:pass@db:5432/dbname
# DEBUG=false

# Run dengan env file
docker run -d --env-file .env backend:latest
```

### 3. **See Last Command**
```bash
# Lihat command apa yang dijalankan saat container start
docker inspect backend-dev | grep -A 5 '"Cmd"'
```

### 4. **Port Already in Use?**
```bash
# Gunakan port berbeda
docker run -p 8001:8000 backend:latest

# Atau cek container mana yang pakai port 8000
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

### 5. **Memory atau Disk Space Full?**
```bash
# Hapus semua yang tidak dipakai
docker system prune -a

# Check disk usage
docker system df
```

### 6. **Debugging: Inspect Running Process**
```bash
# Lihat top processes di container
docker top backend-dev

# Attach ke container (lihat output live)
docker attach backend-dev
```

### 7. **Multi-Container dengan Custom Network**
```bash
# Create shared network
docker network create praktikum-network

# Run containers di network yang sama
docker run -d --name db --network praktikum-network postgres:15
docker run -d --name backend --network praktikum-network backend:latest
docker run -d --name frontend --network praktikum-network -p 5173:5173 frontend:latest

# Containers dapat akses satu sama lain via hostname
# Misal: backend dapat akses db via "postgresql://db:5432/dbname"
```

---

## 📚 Useful Docker Compose Alternative

Jika manage multiple containers cukup kompleks, consider menggunakan `docker-compose.yml`:

```yaml
version: '3.9'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/dbname
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=praktikum
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
```

Run semuanya:
```bash
docker-compose up -d
```

---

## 🔗 Referensi
- [Docker Official Docs](https://docs.docker.com/)
- [Docker CLI Reference](https://docs.docker.com/engine/reference/commandline/cli/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)

**Last Updated**: April 8, 2026  
**Author**: Frontend Team - Praktikum CC
