# Role Guide - Lead DevOps (@PangeranSilaen)

## Fokus Tanggung Jawab

- Jaga environment lokal tim tetap jalan
- Siapkan Docker dan Docker Compose
- Bangun workflow CI/CD yang realistis untuk akses repo yang ada
- Siapkan deploy, gateway, health checks, dan logging dasar

## Output Yang Diharapkan

- `.env.example` yang jelas
- Dockerfile backend dan frontend
- `docker-compose.yml`
- Workflow GitHub Actions
- Konfigurasi deploy dan gateway pada sprint lanjut

## Prioritas Kerja

1. Bantu tim jalan di lokal lebih dulu
2. Docker masuk saat sprint yang relevan
3. Jangan buat workflow yang bergantung pada permission admin repo kalau belum pasti ada
4. Dokumentasikan langkah penting seperlunya

## Docker Compose Quick Guide (Sprint 3)

### Prerequisites

- Docker Desktop (terbaru) sudah terinstall dan running

### Setup (Sekali Saja)

1. Copy environment template:
   ```bash
   cp .env.docker .env          # Linux/Mac
   copy .env.docker .env        # Windows
   ```
2. Edit `.env` -- isi Firebase config dari Firebase Console
3. Taruh `serviceAccountKey.json` di folder `backend/` (file ini sudah di-`.gitignore`)

### Menjalankan

```bash
# Linux/Mac
./scripts/temuin.sh start

# Windows PowerShell
.\scripts\temuin.ps1 start
```

### Akses

| Service   | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost:3000       |
| Backend   | http://localhost:8000       |
| API Docs  | http://localhost:8000/docs  |
| Database  | localhost:5434 (postgres)   |

### Command Lainnya

| Command                  | Fungsi                          |
|--------------------------|---------------------------------|
| `start`                  | Start semua container           |
| `stop`                   | Stop semua container            |
| `restart`                | Restart semua container         |
| `status`                 | Lihat status dan URL            |
| `logs [service]`         | Tail logs (db/backend/frontend) |
| `build`                  | Build images lokal              |
| `pull`                   | Pull images dari Docker Hub     |
| `migrate`                | Jalankan Alembic migrations     |
| `seed`                   | Seed database dengan data awal  |

### Troubleshooting

- **Port conflict**: Edit `DB_PORT` di `.env` jika port 5434 sudah terpakai
- **Firebase error**: Pastikan `serviceAccountKey.json` ada di `backend/`. Tanpa file ini, login tidak bisa tapi endpoint lain tetap jalan
- **DB connection error**: Tunggu beberapa detik setelah start, PostgreSQL butuh waktu init
- **Frontend env berubah**: Jalankan `build` ulang karena VITE_* di-bake saat build

### Docker Hub Images

- `pangeransilaen/temuin-backend:latest`
- `pangeransilaen/temuin-frontend:latest`

Tim bisa pull langsung tanpa build lokal:
```bash
./scripts/temuin.sh pull    # Pull images
./scripts/temuin.sh start   # Start containers
```

## Bacaan Kunci

- `temuin-docs/03-architecture/devops-architecture.md`
- `temuin-docs/03-architecture/system-architecture.md`
- `temuin-docs/04-implementation-plan/environment-setup.md`
- `temuin-docs/06-sprints/ACTIVE_SPRINT.md`
