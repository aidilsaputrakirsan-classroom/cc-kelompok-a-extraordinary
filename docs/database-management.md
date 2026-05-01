# 🗄️ Database & Data Management

## 📍 Lokasi Data Database

### Data Disimpan di Docker Volume

Data database **TIDAK** disimpan di:
- ❌ PostgreSQL lokal di laptop
- ❌ Di dalam container (ephemeral)

Data database **DISIMPAN** di:
- ✅ Docker Compose volume `cloudapp-pgdata` (persistent storage)

```bash
# Cek volume
docker volume ls | grep cloudapp-pgdata

# Inspect volume
docker volume inspect cloudapp-pgdata
```

**Lokasi fisik (Windows):**
```
\\wsl$\docker-desktop-data\data\docker\volumes\cloudapp-pgdata\_data
```

---

## 🔄 Data Persistence

### ✅ Data Tetap Ada Saat:
- Container di-stop: `docker stop db`
- Container di-restart: `docker restart db`
- Container di-remove: `docker rm db`
- Docker Desktop di-restart

### ❌ Data Hilang Saat:
- Volume di-delete: `docker volume rm cloudapp-pgdata`
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
docker compose exec -T db pg_dump -U postgres cloudapp > backup.sql

# Export dengan timestamp
docker compose exec -T db pg_dump -U postgres cloudapp > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Export ke Custom Format (Compressed)
```bash
docker compose exec -T db pg_dump -U postgres -Fc cloudapp > backup.dump
```

---

## 📥 Import Database

### Import dari SQL File
```bash
# Import SQL
docker compose exec -T db psql -U postgres cloudapp < backup.sql
```

### Import dari Custom Format
```bash
docker compose exec -T db pg_restore -U postgres -d cloudapp < backup.dump
```

---

## 🔄 Reset Database

### Option 1: Drop & Recreate Tables
```bash
docker compose exec db psql -U postgres -d cloudapp -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

### Option 2: Delete Volume & Recreate
```bash
# Stop containers dan hapus volume
docker compose down -v

# Start ulang (akan create volume baru)
docker compose up -d

# Seed data
./scripts/seed-database.sh
```

---

## 🔍 Inspect Data

### Connect ke Database
```bash
# Via psql
docker compose exec db psql -U postgres -d cloudapp

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
docker volume ls | grep cloudapp-pgdata

# Cek mount point container
docker inspect cloudapp-db | grep -A 10 Mounts
```

### Database Corrupt
**Solusi:**
```bash
# Backup data (jika bisa)
docker compose exec -T db pg_dump -U postgres cloudapp > emergency_backup.sql

# Reset database
docker compose down -v

# Start ulang & restore
docker compose up -d
docker compose exec -T db psql -U postgres cloudapp < emergency_backup.sql
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
