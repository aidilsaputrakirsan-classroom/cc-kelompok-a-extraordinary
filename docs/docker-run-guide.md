# 🚀 Cara Menggunakan docker-run.sh

## 📍 Lokasi Eksekusi

**PENTING:** Script harus dijalankan dari **root directory praktikum**, bukan dari subdirectory!

```bash
# ✅ BENAR
cd /path/to/praktikum
./scripts/docker-run.sh start

# ❌ SALAH
cd /path/to/praktikum/backend
../scripts/docker-run.sh start  # Akan error!
```

---

## 🎯 Commands Available

### 1. Start Containers
```bash
./scripts/docker-run.sh start
```
**Apa yang terjadi:**
- Cek Docker running
- Buat network `cloudnet` (jika belum ada)
- Pull & start PostgreSQL container (jika belum ada)
- Pull & start backend container (jika belum ada)
- Tampilkan status

**Output:**
```
[INFO] Starting containers...
[INFO] Creating and starting container 'db'...
[SUCCESS] Container 'db' created and started
[INFO] Waiting for database to be ready...
[INFO] Creating and starting container 'backend'...
[SUCCESS] Container 'backend' created and started
[SUCCESS] Semua container berhasil dijalankan!

[INFO] Status containers:
NAMES     STATUS                    PORTS
backend   Up 3 seconds (healthy)    0.0.0.0:8000->8000/tcp
db        Up 6 seconds              0.0.0.0:5433->5432/tcp

[SUCCESS] Semua container running!
[INFO] Akses aplikasi:
  - Backend API: http://localhost:8000
  - API Docs: http://localhost:8000/docs
  - Database: localhost:5433
```

---

### 2. Check Status
```bash
./scripts/docker-run.sh status
```
Menampilkan status semua container dan info akses.

---

### 3. View Logs
```bash
# Logs semua container
./scripts/docker-run.sh logs

# Logs database saja
./scripts/docker-run.sh logs db

# Logs backend saja
./scripts/docker-run.sh logs backend
```

**Tips:** Tekan `Ctrl+C` untuk keluar dari logs.

---

### 4. Stop Containers
```bash
./scripts/docker-run.sh stop
```
Stop semua container (data tetap tersimpan di volume).

---

### 5. Restart Containers
```bash
./scripts/docker-run.sh restart
```
Stop lalu start ulang semua container.

---

### 6. Help
```bash
./scripts/docker-run.sh help
```
Tampilkan bantuan dan daftar commands.

---

## 🐳 Docker Images

### Backend Image
- **Repository:** `pangeransilaen/cloudapp-backend`
- **Tag:** `alpine` (157 MB)
- **Status:** Custom image, di-push ke Docker Hub
- **Auto-pull:** Ya, script akan pull otomatis jika belum ada

### Database Image
- **Repository:** `postgres` (official)
- **Tag:** `16-alpine` (~240 MB)
- **Status:** Official image dari Docker Hub
- **Auto-pull:** Ya, Docker akan pull otomatis jika belum ada
- **Tidak perlu push:** Image official, siapa pun bisa pull langsung

---

## 🔄 Workflow Pertama Kali

Ketika menjalankan script pertama kali di mesin baru:

```bash
cd /path/to/praktikum
./scripts/docker-run.sh start
```

**Yang terjadi:**
1. Script cek Docker running ✅
2. Script cek network `cloudnet` → tidak ada → **buat baru** ✅
3. Script cek container `db` → tidak ada → **pull image** `postgres:16-alpine` → **create & start** ✅
4. Script tunggu 3 detik (database initialization)
5. Script cek container `backend` → tidak ada → **pull image** `pangeransilaen/cloudapp-backend:alpine` → **create & start** ✅
6. Tampilkan status ✅

**Total waktu:** ~30-60 detik (tergantung kecepatan internet untuk pull images)

---

## 🔄 Workflow Selanjutnya

Setelah pertama kali, container sudah ada (meskipun stopped):

```bash
./scripts/docker-run.sh start
```

**Yang terjadi:**
1. Script cek Docker running ✅
2. Script cek network `cloudnet` → sudah ada ✅
3. Script cek container `db` → sudah ada → **start saja** (tidak pull lagi) ✅
4. Script tunggu 3 detik
5. Script cek container `backend` → sudah ada → **start saja** (tidak pull lagi) ✅
6. Tampilkan status ✅

**Total waktu:** ~5-10 detik

---

## 🗂️ Data Persistence

### Volume PostgreSQL
Data database disimpan di Docker volume `pgdata`:
```bash
# Lihat volume
docker volume ls | grep pgdata

# Inspect volume
docker volume inspect pgdata
```

**Data tetap ada** meskipun:
- Container di-stop
- Container di-remove
- Docker Desktop di-restart

**Data hilang** jika:
- Volume di-delete: `docker volume rm pgdata`

---

## 🛠️ Troubleshooting

### Error: "Docker tidak running"
```bash
# Start Docker Desktop
# Windows: Buka Docker Desktop dari Start Menu
# Mac: Buka Docker Desktop dari Applications
# Linux: sudo systemctl start docker
```

### Error: "Container name already in use"
```bash
# Stop & remove container lama
docker stop backend db
docker rm backend db

# Jalankan script lagi
./scripts/docker-run.sh start
```

### Error: "Network already exists"
Ini bukan error, script akan skip create network.

### Container tidak healthy
```bash
# Cek logs
./scripts/docker-run.sh logs backend

# Restart container
./scripts/docker-run.sh restart
```

### Port sudah digunakan
```bash
# Cek apa yang pakai port 8000
# Windows:
netstat -ano | findstr :8000

# Linux/Mac:
lsof -i :8000

# Stop aplikasi yang pakai port tersebut
```

---

## 📚 Referensi

- Docker Hub Backend: https://hub.docker.com/r/pangeransilaen/cloudapp-backend
- Docker Hub PostgreSQL: https://hub.docker.com/_/postgres
- Repository: https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary

---

**Last Updated:** 2026-04-10
