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
| BE-6.6 | Security hardening pasca code review microservices split | High | 2h | BE-6.1, BE-6.2, BE-6.3, BE-6.5 | done | feature/sprint-06-backend-split | Hotfix follow-up review PR #96. Tambah auth guard di `/auth/users/admins` & `/auth/users/{id}` (sebelumnya public, leak admin email/role); tambah owner+admin check di `PUT /items/{id}/status` (sebelumnya any user bisa ubah status item siapa saja); tambah auth pada `GET /master-data/{type}`; fix domain check `endswith("@itk.ac.id")` (sebelumnya `endswith("itk.ac.id")` bypass via `notitk.ac.id`); httpx_client.get_admins forward JWT bearer; replace `print()` dengan `logging.warning()` di claims notify-admin |

## Lead Frontend (@nicholasmnrng)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| FE-6.1 | Adaptasi `src/config/api.js`: base URL via `VITE_API_BASE_URL`, fallback `/api` | Medium | 2h | FE-5.3, DO-6.2 | todo | - | `.env.production` set `VITE_API_BASE_URL=https://temuin.pangeransilaen.net/api` |
| FE-6.2 | Update path API ke prefix `/api/*`: `/api/auth/*`, `/api/items/*`, `/api/claims/*`, `/api/notifications/*` | High | 3h | FE-6.1, BE-6.4 | todo | - | Tidak ada hardcode `localhost:8000`. Adapt sesuai routing gateway |
| FE-6.3 | Toast Sonner saat 503/timeout cross-service | Medium | 2h | FE-6.2 | todo | - | "Layanan sementara terganggu, coba lagi". Pakai shadcn `<Sonner />` |

## Lead DevOps (@PangeranSilaen)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| DO-6.1 | Deploy monolith versi master ke Tencent VPS port 8000 → URL `https://temuin.pangeransilaen.net` (DEC-018) | High | 3h | DO-5.3, FE-5.3, BE-5.3 | todo | - | Modul 11: PaaS-equivalent deploy. Reference `docs/deployment-guide.md`. Setup host nginx + Let's Encrypt + swap 2GB |
| DO-6.2 | Setup env vars di VPS dan database production di `/opt/temuin/.env` | High | 2h | DO-6.1 | todo | - | Modul 11: secrets management. `JWT_SECRET` random hex 64 char, `DB_PASSWORD` random, `CORS_ORIGINS` set ke domain |
| DO-6.3 | Buat `docker-compose.microservices.yml`: 3 service + 1 Postgres shared multi-DB | High | 4h | BE-6.1, BE-6.2, BE-6.3 | todo | - | Modul 12: compose microservices. Init script `CREATE DATABASE auth_db, item_db, engagement_db`. 3 service expose ke internal network only |
| DO-6.4 | Update Makefile: `up-micro`, `down-micro`, `logs-micro service=<name>`, `shell-micro service=<name>` | Medium | 1h | DO-6.3 | todo | - | Wrapper untuk dev tim |
| DO-6.5 | Setup CD pipeline `.github/workflows/ci.yml` job `deploy` (DEC-020) | High | 3h | DO-6.1, DO-5.1 | todo | - | Modul 11: trigger `if: github.ref == 'refs/heads/master' && github.event_name == 'push'`. SSH ke VPS, `docker compose pull && docker compose up -d`. Health check post-deploy 30s retry |
| DO-6.6 | Setup secrets di GitHub Actions: `TENCENT_VPS_HOST`, `TENCENT_VPS_USER`, `TENCENT_VPS_SSH_KEY`, `DOCKER_HUB_USERNAME`, `DOCKER_HUB_TOKEN` | High | 2h | DO-6.5 | todo | - | Modul 11: production secrets di GitHub Secrets. Generate SSH key terpisah untuk CD, jangan reuse personal key |
| DO-6.7 | Verifikasi RAM consumption pakai `docker stats` setelah 5 menit idle | Medium | 1h | DO-6.3 | todo | - | Total <1.4 GB. Kalau over → trigger fallback Render free tier monolith |

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
