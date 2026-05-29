# Deployment & Migration Guide - Temuin

> **Role**: Lead QA & Docs (@raniayudewi) & Lead DevOps (@PangeranSilaen)  
> **Target**: Panduan lengkap untuk melakukan deployment awal (Monolith) hingga proses migrasi ke arsitektur Microservices Split (Hybrid 3-Service) di Tencent Cloud VPS dan alternatif fallback ke PaaS Render.

---

## 1. Konsep Dasar & Arsitektur

Sistem deployment Temuin dirancang dengan dua jenis arsitektur bertahap untuk memenuhi target modul kuliah (Modul 11-12) dan keandalan sistem produksi:

### 1.1 Arsitektur Layer 2-Nginx
Untuk efisiensi pembagian lalu lintas (*traffic routing*), manajemen SSL Let's Encrypt, dan isolasi wadah (*container isolation*), Temuin menggunakan pola **2-Layer Nginx**:
1. **Nginx Host (VPS Utama)**: Berjalan langsung di sistem operasi VPS. Menangani koneksi HTTPS (port 443), verifikasi sertifikat SSL Let's Encrypt, dan mengarahkan subdomain yang sesuai (misalnya `temuin.pangeransilaen.net`, `9router.pangeransilaen.net`) ke port container internal.
2. **Nginx Container (Frontend)**: Berjalan di dalam container Docker frontend. Berfungsi menyajikan berkas statis React SPA dan melakukan *reverse proxy* otomatis untuk setiap request ber-prefix `/api/*` langsung ke container backend yang dituju.

### 1.2 Arsitektur Microservices (Hybrid 3-Service)
Untuk efisiensi penggunaan sumber daya RAM VPS Tencent yang terbatas (1.9 GB), arsitektur microservices didekomposisi secara hybrid menjadi 3 layanan utama yang berbagi 1 PostgreSQL instance dengan 3 *logical database* terpisah (`auth_db`, `item_db`, `engagement_db`):

```text
                     Internet
                        |
                        v
                 [Cloudflare DNS]
                        |
                        v
           [VPS Tencent — port 80/443]
                        |
                        v
               [Host Nginx + SSL]
                        |
                        v
            [Frontend container :3000]
                        |
            Internal nginx route per prefix:
       +----------------+----------------+
       |                |                |
   /api/auth/*     /api/items/*     /api/claims/*
                   /api/master-     /api/notifications/*
                   data/*
       |                |                |
       v                v                v
 [auth-service]   [item-service]  [engagement-service]
     :8001            :8002            :8003
       |                |                |
       +--------+-------+--------+-------+
                |
                v
  [Postgres :5432 — 3 logical DB]
  - auth_db
  - item_db
  - engagement_db
```

---

## 2. Persiapan Awal VPS (Prasyarat)

Sebelum menjalankan instalasi Docker, pastikan konfigurasi dasar VPS Tencent Cloud (2 vCPU, 1.9 GB RAM, Ubuntu 22.04) telah selesai di-setup:

### 2.1 Alokasi Swap Memory 2 GB (Mencegah OOM - Out of Memory)
Sumber daya RAM 1.9 GB rentan mengalami kegagalan *Out of Memory* (OOM) saat proses build container atau lonjakan *traffic*. Wajib menambahkan 2 GB Swap virtual:
```bash
# Buat berkas swap 2GB
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Pasang permanen di fstab agar tidak hilang saat restart VPS
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verifikasi swap telah aktif
free -h
```

### 2.2 Menambahkan User ke Docker Group (Tanpa Sudo)
Agar proses deployment (CI/CD) dapat dijalankan tanpa memerlukan akses root (`sudo`), daftarkan user `ubuntu` ke group `docker`:
```bash
sudo usermod -aG docker ubuntu

# Logout dan login kembali untuk me-refresh cache group
exit
ssh ubuntu@<IP_VPS>
groups # Pastikan kata "docker" tercantum
```

---

## 3. Panduan Deploy Versi Monolith (Milestone Modul 11)

Langkah awal untuk memastikan stack dasar monolith berjalan sukses sebelum migrasi:

### 3.1 Setup Folder & Environment Variables (`.env`)
Buat direktori kerja di `/opt/temuin/` dan buat berkas konfigurasi `.env` dengan permission ketat:
```bash
sudo mkdir -p /opt/temuin/
sudo chown -R ubuntu:ubuntu /opt/temuin/
chmod 700 /opt/temuin/

# Buat berkas konfigurasi rahasia
cat <<EOF > /opt/temuin/.env
DB_USER=temuin_user
DB_PASSWORD=$(openssl rand -base64 18)
SECRET_KEY=$(openssl rand -hex 32)
CORS_ORIGINS=["https://temuin.pangeransilaen.net"]
EOF

chmod 600 /opt/temuin/.env
```

### 3.2 Konfigurasi Host Nginx & SSL Certbot
Buat berkas server block baru di `/etc/nginx/sites-available/temuin`:
```nginx
server {
    listen 80;
    server_name temuin.pangeransilaen.net;

    location / {
        proxy_pass http://127.0.0.1:3000; # Mengarah ke frontend container
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Aktifkan konfigurasi dan pasang sertifikat SSL gratis via Certbot (Let's Encrypt):
```bash
sudo ln -s /etc/nginx/sites-available/temuin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install SSL SSL termination
sudo certbot --nginx -d temuin.pangeransilaen.net
```

---

## 4. Panduan Migrasi & Deploy Microservices (Modul 12)

Strategi migrasi yang digunakan adalah **Cutover Replace** (mematikan monolith, membersihkan database lama, dan menghidupkan 3 logical DB microservices secara bersih).

### 4.1 Langkah Backup State Monolith (PENTING!)
Sebelum melakukan migrasi ke microservices, simpan cadangan konfigurasi dan data monolith:
```bash
# 1. Cadangkan berkas docker-compose monolith lama
sudo cp /opt/temuin/docker-compose.yml /opt/temuin/docker-compose.monolith.yml.bak

# 2. Cadangkan konfigurasi Nginx lama
sudo cp /etc/nginx/sites-available/temuin /etc/nginx/sites-available/temuin.monolith.bak

# 3. Lakukan SQL dump database monolith aktif
BACKUP_DIR="/tmp/temuin-db-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
docker exec temuin-db pg_dump -U temuin_user -d temuin_db > "$BACKUP_DIR/temuin_db.sql"
echo "Backup tersimpan aman di: $BACKUP_DIR/temuin_db.sql"
```

### 4.2 Unggah File Docker Compose Microservices & Script Database Init
Gunakan SCP untuk memindahkan berkas konfigurasi dari repositori lokal laptop Anda ke VPS:
```bash
# Di laptop lokal:
scp infra/docker-compose.microservices.yml ubuntu@<IP_VPS>:/opt/temuin/

# Upload init database multi-logical script
ssh ubuntu@<IP_VPS> "mkdir -p /opt/temuin/postgres-init"
scp infra/postgres-init/01-create-databases.sh ubuntu@<IP_VPS>:/opt/temuin/postgres-init/
ssh ubuntu@<IP_VPS> "chmod +x /opt/temuin/postgres-init/01-create-databases.sh"
```

### 4.3 Melakukan Pembersihan (Reset Volume) & Menjalankan Stack Microservices
Matikan container monolith lama, hapus volume lama agar skema logical database yang baru dapat dibentuk oleh script inisialisasi:
```bash
# Di VPS:
cd /opt/temuin/

# Stop monolith
docker compose -f docker-compose.monolith.yml.bak down

# Hapus volume database lama
docker volume rm temuin_pgdata

# Tarik image microservices terbaru dari Docker Hub
docker compose -f docker-compose.microservices.yml pull

# Jalankan microservices stack
docker compose -f docker-compose.microservices.yml up -d
```

### 4.4 Verifikasi Status Container & Penggunaan RAM
Pastikan kelima container berjalan sehat dan konsumsi memori hemat sesuai anggaran (anggaran RAM microservices < 1.4 GB):
```bash
docker compose -f docker-compose.microservices.yml ps
docker stats --no-stream
```
*Realisasi penggunaan RAM microservices saat idle:*
* `db`: ~56MB
* `auth-service`: ~76MB
* `item-service`: ~72MB
* `engagement-service`: ~69MB
* `frontend`: ~5MB
* **Total konsumsi RAM**: **~278 MB** (Sangat hemat dan jauh di bawah batas limit VPS 1.9 GB).

---

## 5. CD Pipeline (GitHub Actions Auto-Deploy)

Setiap ada push/merge perubahan baru di branch `master`, GitHub Actions akan otomatis memicu CD pipeline untuk melakukan build image baru dan deploy ulang secara otomatis.

### 5.1 Kunci Secrets di GitHub Repository
Daftarkan secrets berikut pada pengaturan repositori GitHub Anda di `Settings -> Secrets and variables -> Actions`:
* `DOCKER_HUB_USERNAME`: Username Docker Hub Anda.
* `DOCKER_HUB_TOKEN`: Access Token Docker Hub dengan hak akses write.
* `TENCENT_VPS_HOST`: Alamat IP VPS Anda (`43.156.15.248`).
* `TENCENT_VPS_USER`: User SSH VPS (`ubuntu`).
* `TENCENT_VPS_SSH_KEY`: Private SSH Key dedikatif (Ed25519) yang terdaftar di berkas `authorized_keys` VPS.

### 5.2 Skema CD Workflow (`cd.yml`)
CD pipeline melakukan proses sebagai berikut:
1. Trigger pada perubahan berkas di branch `master`.
2. Build dan Push 4 Docker Images paralel (`auth-service`, `item-service`, `engagement-service`, `frontend`) ke Docker Hub dengan tag `:latest` dan `:prod`.
3. SSH ke Tencent VPS menggunakan key khusus.
4. Menarik (*Pull*) image terbaru di VPS dan menjalankan `docker compose -f docker-compose.microservices.yml up -d --remove-orphans`.
5. Melakukan **Health Check** (retry 3x) ke ketiga endpoint microservice produksi.

---

## 6. Panduan Troubleshooting & Skenario Rollback

### 6.1 Mengatasi OOM (Out Of Memory)
Jika container database atau python mendadak mati (*exited 137*):
1. Periksa syslog untuk memastikan OOM killer aktif: `dmesg -T | grep -i oom`
2. Jika swap belum aktif, ikuti instruksi swap di **Kategori 2.1**.
3. Batasi memori di berkas compose menggunakan directive `deploy.resources.limits.memory` (Sudah terpasang di `docker-compose.microservices.yml`).

### 6.2 Langkah Cepat Rollback ke Monolith (Emergency)
Jika sistem microservices mengalami error fatal di produksi dan Anda ingin kembali ke versi monolith yang stabil:
```bash
cd /opt/temuin/

# 1. Stop microservices stack
docker compose -f docker-compose.microservices.yml down

# 2. Hapus database microservices yang rusak
docker volume rm temuin_pgdata

# 3. Jalankan kembali monolith stack menggunakan backup compose
docker compose -f docker-compose.monolith.yml.bak up -d

# 4. Kembalikan data monolith dari SQL Dump terakhir
# Tunggu postgres container siap menerima koneksi (sekitar 10 detik)
sleep 10
docker exec -i temuin-db psql -U temuin_user -d temuin_db < /tmp/temuin-db-backup-XXXXXXXX-XXXXXX/temuin_db.sql

# 5. Kembalikan Nginx config host ke monolith
sudo cp /etc/nginx/sites-available/temuin.monolith.bak /etc/nginx/sites-available/temuin
sudo systemctl reload nginx
```

---

## 7. Alternatif Fallback: Deploy ke PaaS Render

Jika Tencent Cloud VPS mengalami gangguan panjang, tim dapat menggunakan **Render** sebagai solusi hosting gratis cadangan:

### 7.1 Deployment Database (Render PostgreSQL)
1. Buka Render Dashboard, pilih **New -> PostgreSQL**.
2. Beri nama `temuin-db-render`.
3. Render akan meng-generate link koneksi luar seperti `postgres://user:password@host/database`. Simpan URI ini.

### 7.2 Deployment Backend Services (3 Web Service terpisah)
Buat 3 **Web Service** baru di Render untuk masing-masing folder layanan:
* **Auth Service**:
  * Root Directory: `services/auth-service/`
  * Runtime: `Python`
  * Build Command: `pip install -r requirements.txt`
  * Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  * Env Vars: `DATABASE_URL` (dari Render Postgres), `SECRET_KEY`.
* **Item Service** & **Engagement Service**:
  * Lakukan setup identik sesuai folder layanannya dengan port dinamis Render.

### 7.3 Deployment Frontend (Static Site Render)
1. Pilih **New -> Static Site**.
2. Hubungkan ke repositori GitHub Temuin.
3. Root Directory: `frontend/`
4. Build Command: `npm run build`
5. Publish Directory: `dist`
6. Env Vars: `VITE_API_BASE_URL` diarahkan ke URL gateway / routing API Render Anda.
