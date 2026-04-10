# 🗄️ Database & Data Management

## 📍 Lokasi Data Database

### Data Disimpan di Docker Volume

Data database **TIDAK** disimpan di:
- ❌ PostgreSQL lokal di laptop
- ❌ Di dalam container (ephemeral)

Data database **DISIMPAN** di:
- ✅ Docker volume `pgdata` (persistent storage)

```bash
# Cek volume
docker volume ls | grep pgdata

# Inspect volume
docker volume inspect pgdata
```

**Lokasi fisik (Windows):**
```
\\wsl$\docker-desktop-data\data\docker\volumes\pgdata\_data
```

---

## 🔄 Data Persistence

### ✅ Data Tetap Ada Saat:
- Container di-stop: `docker stop db`
- Container di-restart: `docker restart db`
- Container di-remove: `docker rm db`
- Docker Desktop di-restart

### ❌ Data Hilang Saat:
- Volume di-delete: `docker volume rm pgdata`
- Docker Desktop di-reset (factory reset)

---

## 👥 Data di Antar Anggota Tim

### Setiap Laptop Punya Data Sendiri

```
Laptop A: Volume pgdata → Data A (User A, Item A, B)
Laptop B: Volume pgdata → Data B (User B, Item C)
Laptop C: Volume pgdata → Data C (User C, Item D, E)
```

**Tidak ada sinkronisasi otomatis!** Setiap anggota develop dengan data lokal.

---

## 🌱 Seed Database (Recommended)

Agar semua anggota tim punya data awal yang sama:

```bash
# Jalankan seed script
./scripts/seed-database.sh
```

**Apa yang dilakukan:**
1. Clear existing data (optional)
2. Insert sample users
3. Insert sample items

**Sample credentials setelah seed:**
```
Email: admin@test.com
Password: password123!

Email: user1@test.com
Password: password123!
```

---

## 📤 Export Database

### Export ke SQL File
```bash
# Export semua data
docker exec db pg_dump -U postgres cloudapp > backup.sql

# Export dengan timestamp
docker exec db pg_dump -U postgres cloudapp > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Export ke Custom Format (Compressed)
```bash
docker exec db pg_dump -U postgres -Fc cloudapp > backup.dump
```

---

## 📥 Import Database

### Import dari SQL File
```bash
# Import SQL
docker exec -i db psql -U postgres cloudapp < backup.sql
```

### Import dari Custom Format
```bash
docker exec -i db pg_restore -U postgres -d cloudapp < backup.dump
```

---

## 🔄 Reset Database

### Option 1: Drop & Recreate Tables
```bash
docker exec db psql -U postgres -d cloudapp -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

### Option 2: Delete Volume & Recreate
```bash
# Stop & remove containers
docker stop backend db
docker rm backend db

# Delete volume
docker volume rm pgdata

# Start ulang (akan create volume baru)
./scripts/docker-run.sh start

# Seed data
./scripts/seed-database.sh
```

---

## 🔍 Inspect Data

### Connect ke Database
```bash
# Via psql
docker exec -it db psql -U postgres -d cloudapp

# List tables
\dt

# Query users
SELECT * FROM users;

# Query items
SELECT * FROM items;

# Exit
\q
```

### Via GUI Tools
Connect dengan credentials:
```
Host: localhost
Port: 5433
Database: cloudapp
Username: postgres
Password: postgres123
```

**Recommended tools:**
- DBeaver
- pgAdmin
- TablePlus
- DataGrip

---

## 🎯 Best Practices

### Development
1. ✅ Gunakan seed script untuk data awal
2. ✅ Dokumentasikan sample data
3. ✅ Jangan commit data sensitif
4. ✅ Backup data penting sebelum reset

### Production
1. ✅ Gunakan managed database service (AWS RDS, etc)
2. ✅ Setup automated backups
3. ✅ Gunakan environment variables untuk credentials
4. ✅ Enable SSL/TLS untuk koneksi database

---

## 🚨 Troubleshooting

### Data Hilang Setelah Restart
**Penyebab:** Volume tidak di-mount dengan benar

**Solusi:**
```bash
# Cek apakah volume ada
docker volume ls | grep pgdata

# Cek mount point container
docker inspect db | grep -A 10 Mounts
```

### Database Corrupt
**Solusi:**
```bash
# Backup data (jika bisa)
docker exec db pg_dump -U postgres cloudapp > emergency_backup.sql

# Reset database
docker stop db
docker rm db
docker volume rm pgdata

# Start ulang & restore
./scripts/docker-run.sh start
docker exec -i db psql -U postgres cloudapp < emergency_backup.sql
```

### Disk Space Penuh
```bash
# Cek ukuran volume
docker system df -v

# Cleanup unused volumes
docker volume prune
```

---

**Last Updated:** 2026-04-10
