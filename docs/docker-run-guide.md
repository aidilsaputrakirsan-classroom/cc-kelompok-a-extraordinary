# Cara Menggunakan docker-run.sh

`scripts/docker-run.sh` sekarang menjadi wrapper untuk Docker Compose. Script ini tetap bisa dipakai untuk demo atau workflow harian, tetapi semua operasi container mengikuti konfigurasi utama di `docker-compose.yml`.

Untuk Modul 7, command utama yang direkomendasikan tetap:

```bash
docker compose up -d
```

atau via Makefile:

```bash
make up
```

Script ini disediakan sebagai shortcut alternatif untuk anggota tim yang sudah terbiasa memakai `scripts/docker-run.sh` dari modul sebelumnya.

## Lokasi Eksekusi

Script bisa dijalankan dari root project:

```bash
cd /path/to/praktikum
./scripts/docker-run.sh start
```

Script akan otomatis berpindah ke root project, sehingga aman juga dipanggil dari folder lain selama path script benar.

## Commands Available

| Command | Alias | Fungsi |
|---------|-------|--------|
| `start` | `up` | Start semua services dengan `docker compose up -d` |
| `build` | - | Build ulang image lalu start semua services |
| `stop` | `down` | Stop dan remove containers/network, volume tetap ada |
| `clean` | - | Stop dan remove containers/network/volume |
| `restart` | - | Restart semua services |
| `status` | `ps` | Tampilkan status services |
| `logs` | - | Follow logs semua services |
| `logs db` | - | Follow logs database |
| `logs backend` | - | Follow logs backend |
| `logs frontend` | - | Follow logs frontend |
| `images` | - | Tampilkan image Temuin lokal |
| `push` | - | Push backend dan frontend image ke Docker Hub |
| `help` | `--help`, `-h` | Tampilkan bantuan |

## Start Services

```bash
./scripts/docker-run.sh start
```

Yang terjadi:

1. Script memastikan Docker Desktop running.
2. Menjalankan `docker compose up -d`.
3. Compose membuat network `cloudapp-network` jika belum ada.
4. Compose membuat volume `cloudapp-pgdata` jika belum ada.
5. Compose menjalankan services `db`, `backend`, dan `frontend`.
6. Backend menunggu database healthy sebelum start.
7. Frontend menunggu backend healthy sebelum start.

## Build & Start

Gunakan command ini setelah ada perubahan Dockerfile, dependency, atau source yang perlu masuk image:

```bash
./scripts/docker-run.sh build
```

Command ini setara dengan:

```bash
docker compose up --build -d
```

Image yang dihasilkan:

| Service | Image |
|---------|-------|
| Backend | `pangeransilaen/temuin-backend:latest` |
| Frontend | `pangeransilaen/temuin-frontend:latest` |
| Database | `postgres:16-alpine` |

## Check Status

```bash
./scripts/docker-run.sh status
```

Output yang diharapkan:

```text
NAME                IMAGE                                   STATUS
cloudapp-db         postgres:16-alpine                      Up (healthy)
cloudapp-backend    pangeransilaen/temuin-backend:latest    Up (healthy)
cloudapp-frontend   pangeransilaen/temuin-frontend:latest   Up (healthy)
```

## View Logs

```bash
# Logs semua services
./scripts/docker-run.sh logs

# Logs database
./scripts/docker-run.sh logs db

# Logs backend
./scripts/docker-run.sh logs backend

# Logs frontend
./scripts/docker-run.sh logs frontend
```

Tekan `Ctrl+C` untuk keluar dari follow logs.

## Stop Services

```bash
./scripts/docker-run.sh stop
```

Command ini menjalankan `docker compose down`. Containers dan network akan dihapus, tetapi volume database tetap tersimpan.

## Clean Services

```bash
./scripts/docker-run.sh clean
```

Command ini menjalankan `docker compose down -v`. Data PostgreSQL di volume `cloudapp-pgdata` akan hilang.

## Restart Services

```bash
./scripts/docker-run.sh restart
```

## Push Images

Pastikan sudah login ke Docker Hub dengan akun yang punya akses ke repository `pangeransilaen`.

```bash
./scripts/docker-run.sh push
```

Command ini setara dengan:

```bash
docker compose push backend frontend
```

## Data Persistence

Database memakai named volume `cloudapp-pgdata`.

```bash
docker volume ls | grep cloudapp-pgdata
docker volume inspect cloudapp-pgdata
```

Data tetap ada setelah:

```bash
./scripts/docker-run.sh stop
./scripts/docker-run.sh start
```

Data hilang jika menjalankan:

```bash
./scripts/docker-run.sh clean
```

## Access URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- Database: `localhost:5433`

## Troubleshooting

### Docker tidak running

Jalankan Docker Desktop terlebih dahulu, lalu ulangi command.

### Port sudah digunakan

Port yang dipakai Compose:

| Port | Service |
|------|---------|
| `3000` | Frontend |
| `8000` | Backend |
| `5433` | PostgreSQL |

Stop aplikasi lain yang memakai port tersebut atau ubah mapping port di `docker-compose.yml`.

### Service tidak healthy

```bash
./scripts/docker-run.sh status
./scripts/docker-run.sh logs backend
./scripts/docker-run.sh logs db
./scripts/docker-run.sh logs frontend
```

## Referensi

- Docker Hub Backend: https://hub.docker.com/r/pangeransilaen/temuin-backend
- Docker Hub Frontend: https://hub.docker.com/r/pangeransilaen/temuin-frontend
- Docker Hub PostgreSQL: https://hub.docker.com/_/postgres
- Repository: https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary
