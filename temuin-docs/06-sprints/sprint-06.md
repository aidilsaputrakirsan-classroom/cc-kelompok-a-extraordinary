# Sprint 06 - Cloud Deploy + Microservices Split (Hybrid 3-Service)

## Tujuan Sprint

1. Deploy versi monolith ke Tencent VPS (DEC-018) sebagai milestone yang dijamin tercapai untuk Modul 11.
2. Pecah backend monolith jadi 3 service hybrid: `auth-service`, `item-service` (gabung items + master_data), `engagement-service` (gabung claims + notifications + audit_logs). Mengikuti DEC-019.

## Alignment Modul: 11-12

- Modul 11: Continuous Deployment — Automated Deploy ke Cloud
- Modul 12: Microservices — Konsep & Dekomposisi

## Lead Backend (@disnejy)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| BE-6.1 | Pisahkan `app/auth/` ke `services/auth-service/` (port 8001) | High | 5h | BE-5.3 | done | feature/sprint-06-backend-split | Modul 12: bounded context. Struktur identik (`main.py`, `database.py`, `models.py`, `schemas.py`, `routers/`, `Dockerfile`). Endpoint: `POST /register`, `POST /login`, `GET /me`, `PUT /me` |
| BE-6.2 | Pisahkan `app/items/` + `app/master_data/` ke `services/item-service/` (port 8002) | High | 5h | BE-5.3 | done | feature/sprint-06-backend-split | Modul 12: gabung items + master_data ke satu service (DEC-019). Endpoint items + categories + buildings + locations + security_officers |
| BE-6.3 | Pisahkan `app/claims/` + `app/notifications/` + audit_logs ke `services/engagement-service/` (port 8003) | High | 5h | BE-6.2 | done | feature/sprint-06-backend-split | Modul 12: gabung claims + notifications + audit (DEC-019). Tambah `httpx_client.py` untuk call ke item-service |
| BE-6.4 | Tambah shared JWT verification helper di item-service & engagement-service (DEC-017) | High | 3h | BE-6.1, BE-6.2, BE-6.3 | done | feature/sprint-06-backend-split | Modul 12: shared secret JWT via env `JWT_SECRET`, verifikasi lokal tanpa call ke auth-service |
| BE-6.5 | Tambah `httpx_client.py` untuk inter-service HTTP calls dengan timeout 5s | High | 2h | BE-6.3 | done | feature/sprint-06-backend-split | Modul 12: sync REST communication. Timeout default 5s. Retry+CB ditambah di Sprint 7 |
| BE-6.6 | Security hardening + comprehensive cleanup pasca code review microservices | High | 4h | BE-6.1, BE-6.2, BE-6.3, BE-6.5 | done | feature/sprint-06-backend-split | Hotfix follow-up review PR #96. **Security**: auth guard di `/auth/users/admins` & `/auth/users/{id}` (B-1, leak admin email); owner+admin check di `PUT /items/{id}/status` (B-2, any user bisa ubah status); auth wajib di `GET /master-data/{type}` (B-5); domain check `@itk.ac.id` + subdomain (B-7, support `student.itk.ac.id`); name min_length=1 (B-3); hapus `firebase_uid` carryover (B-12); hapus testing endpoint `POST /notifications/` (B-13); httpx_client forward JWT bearer; logging.warning() replace print(). **Quality**: ruff clean (181→0 errors), B904 raise from, models/__init__.py __all__, seed.py drop sys.path hack. **Tests**: 15 smoke test (5/service, SQLite in-memory, JWT shared secret). **Infra**: .dockerignore per service, pytest config |

## Lead Frontend (@nicholasmnrng)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| FE-6.1 | Adaptasi `src/config/api.js`: base URL via `VITE_API_BASE_URL`, fallback `''` | Medium | 2h | FE-5.3, DO-6.2 | done | feature/frontend/sprint-06-api-adaptation | PR #102 merged. Fallback jadi empty string (Vite proxy handle /api routing). .env.example diupdate dengan panduan dev vs production |
| FE-6.2 | Update path API ke prefix `/api/*`: `/api/auth/*`, `/api/items/*`, `/api/claims/*`, `/api/notifications/*` | High | 3h | FE-6.1, BE-6.4 | done | feature/frontend/sprint-06-api-adaptation | PR #102 merged. 14 file diubah, 39 endpoint diupdate. Build hijau, 21/21 tests lulus |
| FE-6.3 | Toast Sonner saat 503/timeout cross-service | Medium | 2h | FE-6.2 | done | feature/frontend/sprint-06-api-adaptation | PR #102 merged. Axios response interceptor untuk 503/504/network error -> toast "Layanan sementara terganggu, coba lagi" |

## Lead DevOps (@PangeranSilaen)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| DO-6.1 | Deploy monolith versi master ke Tencent VPS port 8000 → URL `https://temuin.pangeransilaen.net` (DEC-018) | High | 3h | DO-5.3, FE-5.3, BE-5.3 | done | manual deploy `/opt/temuin/` di VPS | Modul 11: PaaS-equivalent deploy. Reference [temuin-deployment-guide](https://github.com/PangeranSilaen/random/blob/main/temuin-deployment-guide.md). Setup host nginx + Let's Encrypt + swap 2GB. Verified `https://temuin.pangeransilaen.net` HTTPS hidup, SSL valid, login flow E2E works (post fix #97 trailing slash) |
| DO-6.2 | Setup env vars di VPS dan database production di `/opt/temuin/.env` | High | 2h | DO-6.1 | done | manual config di VPS | Modul 11: secrets management. `SECRET_KEY` random hex 64 char, `DB_PASSWORD` random, `CORS_ORIGINS=["https://temuin.pangeransilaen.net"]`. Permission `chmod 600`. Sekaligus cleanup omniroute fork yang gak terpakai (3 nginx config + SSL cert revoked) |
| DO-6.3 | Buat `docker-compose.microservices.yml`: 3 service + 1 Postgres shared multi-DB | High | 4h | BE-6.1, BE-6.2, BE-6.3 | done | feat/devops/sprint-06-microservices | Modul 12: `infra/docker-compose.microservices.yml` 5 container (db + 3 service + frontend). 3 logical DB shared 1 Postgres instance via `infra/postgres-init/01-create-databases.sh`. Memory limits: db 384M, services 256M each, frontend 96M. Volume `temuin_pgdata` external |
| DO-6.4 | Update Makefile: `up-micro`, `down-micro`, `logs-micro service=<name>`, `shell-micro service=<name>` | Medium | 1h | DO-6.3 | done | feat/devops/sprint-06-microservices | Plus down-micro-clean, ps-micro, stats-micro |
| DO-6.5 | Setup CD pipeline `.github/workflows/cd.yml` (DEC-020) | High | 3h | DO-6.1, DO-5.1 | done | feat/devops/sprint-06-microservices | Modul 11: trigger push master + manual dispatch. Build matrix 4 image (3 service + frontend) parallel via `docker/build-push-action@v6`. SSH VPS, compose pull && up -d. Health check 3 endpoint retry 3x. On failure capture logs --tail=50 per service |
| DO-6.6 | Setup secrets di GitHub Actions: `TENCENT_VPS_HOST`, `TENCENT_VPS_USER`, `TENCENT_VPS_SSH_KEY`, `DOCKER_HUB_USERNAME`, `DOCKER_HUB_TOKEN` | High | 2h | DO-6.5 | done | feat/devops/sprint-06-microservices | Modul 11: 5 secret di-set via `gh secret set`. SSH key dedicated ed25519 (bukan reuse personal), authorized_keys di VPS hanya berisi key CD ini |
| DO-6.7 | Verifikasi RAM consumption pakai `docker stats` setelah 5 menit idle | Medium | 1h | DO-6.1 | done | manual check di VPS | Monolith: Total Temuin <300 MB. Microservices (post DO-6.13 cutover): db 56M + auth 76M + item 72M + engagement 69M + frontend 5M = ~278 MB. Sistem total 807Mi/1.9Gi used (sisa 1Gi+ available + 2GB swap). Far under DEC-019 budget 1.4 GB |
| DO-6.8 | Hotfix: rebuild + redeploy frontend image `:prod` setelah fix trailing slash 307 | High | 0.5h | DO-6.1 | done | PR #97 | Production blocker: `POST /auth/login/` return 307 redirect (FastAPI `redirect_slashes=True` + FE pakai trailing slash). Fix: hapus trailing slash di FE, rebuild image digest `sha256:95b4c34589f1`, redeploy. Verified login E2E works |
| DO-6.9 | Hotfix: exclude credential files dari Docker image (security) | High | 0.5h | DO-6.1 | done | PR #98 | `serviceAccountKey.json` Firebase ke-bake ke image karena tidak ada di `.dockerignore`. Image public di Docker Hub berarti credentials exposed. Action: revoke key di GCP, patch `.dockerignore`, rebuild backend digest `sha256:ef893ed5d866`, redeploy |
| DO-6.10 | Backup state monolith pre-microservices cutover | High | 0.5h | DO-6.3 | done | manual via SSH | Backup `/opt/temuin/docker-compose.yml` -> `docker-compose.monolith.yml.bak`, `/etc/nginx/sites-available/temuin` -> `temuin.monolith.bak`. SQL dump 141K ke `/tmp/temuin-db-backup-20260525-011441/temuin_db.sql` |
| DO-6.11 | Rebuild frontend image dengan nginx 5-route gateway | High | 1h | DO-6.3 | done | feat/devops/sprint-06-microservices | `frontend/nginx.conf` route `/api/auth/*` -> auth-service:8001, `/api/items/*` + `/api/master-data/*` -> item-service:8002, `/api/claims/*` + `/api/notifications/*` -> engagement-service:8003. Plus health endpoint exposure |
| DO-6.12 | Build + push 3 microservice image ke Docker Hub | High | 1h | DO-6.3 | done | feat/devops/sprint-06-microservices | Image size: auth/item/engagement 216 MB, frontend 94 MB. Tag `pangeransilaen/temuin-{auth,item,engagement}-service:latest` + `temuin-frontend:prod` |
| DO-6.13 | Cutover production VPS dari monolith ke microservices | High | 2h | DO-6.10, DO-6.11, DO-6.12 | done | feat/devops/sprint-06-microservices | Replace strategy. Stop monolith, drop volume `temuin_pgdata`, recreate. Upload compose + postgres-init via SSH. Pull 4 image, `docker compose up -d`, all 5 container healthy. Production smoke test: 3 health endpoint OK via HTTPS, register `deploy.test@student.itk.ac.id` (subdomain B-7 fix verified), promote admin, master-data list OK |
| DO-6.14 | Fix item-service entrypoint: seed jalan setelah schema init | Medium | 0.5h | DO-6.13 | done | feat/devops/sprint-06-microservices | Pre-fix bug: seed.py jalan sebelum uvicorn create_all -> table 'categories' tidak ada -> seed gagal. Fix: `python -c 'import app.main'` dulu untuk trigger create_all, lalu seed. Re-build image + push |

## Lead QA & Docs (@raniayudewi)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| QA-6.1 | Smoke test 3 endpoint health di production (`/api/auth/health`, `/api/items/health`, `/api/engagement/health`) | High | 2h | DO-6.3 | todo | - | Modul 11: production smoke test. Semua return 200, screenshot di `image/sprint-06/` |
| QA-6.2 | Regression blackbox flow penuh: register → login → create item → claim → approve dengan 3 service hidup | High | 3h | FE-6.2, BE-6.4, DO-6.3 | todo | - | Modul 12: end-to-end testing |
| QA-6.3 | Tulis/update `docs/deployment-guide.md` (cara deploy ke VPS, env vars, troubleshooting OOM, fallback Render) | Medium | 2h | QA-6.1, DO-6.2 | todo | - | Modul 11: deployment documentation. Reference panduan privat user yang sudah ada |
| QA-6.4 | Production smoke test setelah CD deploy auto-trigger | Medium | 1h | DO-6.5 | todo | - | Modul 11: verify CD pipeline works. PR test → merge → CD trigger → verify deploy live |
| QA-6.5 | Update `temuin-docs/03-architecture/system-architecture.md` dengan diagram 3-service hybrid kalau ada perubahan dari implementasi | Low | 1h | DO-6.3 | todo | - | Pastikan dokumen sinkron dengan implementasi |

## Quick Links

- [ACTIVE_SPRINT.md](./ACTIVE_SPRINT.md)
- [../05-roles/backend.md](../05-roles/backend.md)
- [../05-roles/frontend.md](../05-roles/frontend.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../05-roles/qa-docs.md](../05-roles/qa-docs.md)
- [../04-implementation-plan/development-workflow.md](../04-implementation-plan/development-workflow.md)
- [../01-concept/decision-log.md](../01-concept/decision-log.md) (DEC-018, DEC-019, DEC-020)
