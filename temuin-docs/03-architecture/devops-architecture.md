# DevOps Architecture - Temuin

## Fokus Per Fase

| Sprint | Fokus DevOps                                                                            |
| ------ | --------------------------------------------------------------------------------------- |
| 1-2    | Environment lokal dan bantuan setup                                                     |
| 3-4    | Dockerfile dan Docker Compose                                                           |
| 5      | Git workflow, branch protection, GitHub Actions CI 3-job (lint + backend-test + frontend-test) |
| 6      | Deploy monolith ke Tencent VPS (DEC-018), CD pipeline, compose microservices 3-service hybrid (DEC-019) |
| 7      | Production gateway (rate limiting + correlation ID), structured logging, /metrics, integration test job di CI |
| 8      | Security hardening (image non-root, secrets audit, security headers), final deploy, release tag v1.0.0 |

## Modul Alignment

| Sprint | Modul | Topik Utama |
|--------|-------|-------------|
| 5 | 9-10 | Git Workflow + CI (GitHub Actions, pytest dengan coverage ≥60%, Vitest dengan coverage ≥40%) |
| 6 | 11-12 | CD ke Tencent VPS (DEC-018) + Hybrid 3-service split (DEC-019) |
| 7 | 13-14 | Reliability retry+CB (DEC-021) + Observability JSON log + correlation ID + /metrics + StatusPage (DEC-022) + rate limiting (DEC-023) |
| 8 | 15 | Security Hardening + Final Polish + Release v1.0.0 |

## Service Container Mapping (Sprint 6+, hybrid 3-service)

| Container | Image base | Port internal | Port host (VPS) | Tugas |
|-----------|------------|---------------|-----------------|-------|
| `temuin-db` | `postgres:16-alpine` | 5432 | tidak di-expose | Shared Postgres untuk 3 logical DB (`auth_db`, `item_db`, `engagement_db`) |
| `temuin-auth` | python:3.12-slim + FastAPI | 8001 | tidak di-expose | auth-service |
| `temuin-item` | python:3.12-slim + FastAPI | 8002 | tidak di-expose | item-service (gabung items + master_data) |
| `temuin-engagement` | python:3.12-slim + FastAPI | 8003 | tidak di-expose | engagement-service (gabung claims + notifications + audit) |
| `temuin-gateway` | nginx:alpine | 8080 | `127.0.0.1:8080` | Reverse proxy + rate limiting + correlation ID |
| `temuin-frontend` | nginx:alpine + React static | 80 | `127.0.0.1:3000` | Frontend nginx serve dist + SPA fallback |

Host nginx di VPS forward `temuin.pangeransilaen.net` ke `127.0.0.1:8080` (gateway). Container backend dan database tidak di-expose ke internet.

## Deployment Strategy (DEC-018)

### Primary: Tencent VPS

- Domain: `temuin.pangeransilaen.net`
- IP: 43.156.15.248
- Spec: 2 vCPU, 1.9 GB RAM, 40 GB disk, swap 2 GB, Ubuntu 22.04
- DNS: Cloudflare A record (DNS-only mode untuk Let's Encrypt)
- SSL: Let's Encrypt + Certbot, auto-renew via cron
- Direktori: `/opt/temuin/` dengan `docker-compose.yml` production + `.env`
- Reference: `docs/deployment-guide.md` (akan dibuat di Sprint 6 oleh DevOps)
- Catatan port: host nginx tetap mengelola domain lain (`9router`, `enowxai`) di port 80/443. Container Temuin pakai port loopback 8080 dan 3000 yang dipatch host nginx

### Fallback: Render Free Tier

Trigger: dosen menolak VPS, VPS OOM, atau infra failure
- Deploy versi monolith ke Render web service + Postgres add-on
- URL backup terdokumentasi di `docs/deployment-guide.md`
- Tetap memenuhi Modul 11 minimum requirement

## CI/CD Pipeline (DEC-020)

### Sprint 5: 3-job CI
File `.github/workflows/ci.yml`:
- **Job `lint`**: ruff backend + eslint frontend, fail on error
- **Job `backend-test`**: pytest dengan `--cov-fail-under=60`, upload coverage HTML artifact
- **Job `frontend-test`**: vitest dengan threshold 40%, plus `npm run build`

Branch protection (didokumentasikan, di-enable manual oleh repo owner):
- Required status checks: `lint`, `backend-test`, `frontend-test`
- Required approvals: 1
- Block force push

### Sprint 6: + CD job
- **Job `deploy`**: trigger `if: github.ref == 'refs/heads/master' && github.event_name == 'push'`
- SSH ke Tencent VPS, pull image baru dari Docker Hub, `docker compose pull && docker compose up -d`
- Secrets di GitHub: `TENCENT_VPS_HOST`, `TENCENT_VPS_USER`, `TENCENT_VPS_SSH_KEY`, `DOCKER_HUB_USERNAME`, `DOCKER_HUB_TOKEN`
- Health check post-deploy: curl `/api/auth/health` dengan 30 detik retry, fail workflow kalau tidak hijau

### Sprint 7: + integration test job
- **Job `integration-test`**: spin compose microservices di runner, jalankan `scripts/integration-test.sh` (curl 3 health endpoint + 1 login flow + 1 claim flow), trigger hanya untuk PR ke master
- Artifact: docker logs dari setiap container kalau gagal

## Nginx Gateway Production (DEC-022, DEC-023, Sprint 7)

### Routing
File `gateway/nginx.conf`:
- `/api/auth/*`       → `auth-service:8001`
- `/api/items/*`, `/api/categories/*`, `/api/buildings/*`, `/api/locations/*`, `/api/security-officers/*` → `item-service:8002`
- `/api/claims/*`, `/api/notifications/*`, `/api/audit-logs/*` → `engagement-service:8003`
- `/api/status` → aggregator (lokal di gateway atau forward ke engagement-service)
- `/` → `frontend:80`

### Rate Limiting (DEC-023)
- Zone `auth_zone` 5r/s burst 10 untuk `/api/auth/login` dan `/api/auth/register`
- Zone `general_zone` 30r/s burst 50 untuk endpoint lain
- Response 429 dengan body JSON `{"detail":"Too many requests"}`

### Correlation ID (DEC-022)
- Header `X-Correlation-ID`: nginx generate UUID 12 karakter bila request user tidak punya
- Forward ke upstream service via `proxy_set_header X-Correlation-ID $request_id`
- Log di access log nginx untuk grep cross-service

### Healthcheck
- `proxy_connect_timeout 5s`, `proxy_send_timeout 30s`, `proxy_read_timeout 30s`
- `proxy_next_upstream error timeout http_502 http_503 http_504`

## Observability Ops (DEC-022, Sprint 7)

### Log Driver
File `docker-compose.yml`:
- Driver `json-file`, max-size `10m`, max-file `3`
- Service tag per container untuk filtering: `tag: "{{.Name}}"`

### Endpoint /metrics
- Setiap service expose `GET /metrics` format Prometheus text
- Tidak deploy Prometheus, hanya format siap di-scrape kalau dibutuhkan
- Gateway juga punya `/api/auth/metrics`, `/api/items/metrics`, `/api/engagement/metrics` route forward

### StatusPage
- Frontend route `/status` polling 30 detik ke `/api/status`
- Endpoint `/api/status` aggregate health 3 service
- Komponen pakai shadcn `<Card>` + `<Badge>` + `<Skeleton>`

### Helper Scripts
- `scripts/logs.sh` dengan subcommand: `all`, `errors`, `trace <correlation_id>`, `metrics`
- `scripts/integration-test.sh` untuk CI integration test job

## Security (Sprint 8, DEC-023)

### Image Hardening
- Backend Dockerfile pakai `USER appuser` (uid 1000), tidak run sebagai root
- Frontend nginx pakai `--user 101:101` (nginx user di alpine)
- `.dockerignore` pastikan `.env`, `__pycache__`, `node_modules` tidak masuk image

### Secrets Audit
- `.env.example` lengkap di repo (placeholder, no real secret)
- `.env`, `.env.production`, `.env.docker` wajib di `.gitignore`
- Verifikasi dengan `git log --all --full-history -- '.env'` empty
- `JWT_SECRET` minimum 32 karakter random hex (`openssl rand -hex 32`)
- `SECRET_KEY` Postgres password generate fresh, tidak reuse

### Security Headers
Backend middleware tambah:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` (HTTPS only)
- `Content-Security-Policy: default-src 'self'` minimum

### Input Validation
Pydantic schema dengan `field_validator`:
- Email: regex `@itk.ac.id$`
- Password: min 8 char, mengandung huruf dan angka
- String fields: max length sesuai kebutuhan (title 200, description 2000)
- Numeric: bound check (price 0..999_999_999, kalau ada)

## Artefak Kunci

- `backend/.env.example`, `frontend/.env.example`, `.env.example` (root, untuk compose production)
- `backend/Dockerfile`, `frontend/Dockerfile`, `services/auth-service/Dockerfile`, `services/item-service/Dockerfile`, `services/engagement-service/Dockerfile`
- `docker-compose.yml` (monolith Sprint 1-5), `docker-compose.dev.yml`, `docker-compose.prod.yml`
- `docker-compose.microservices.yml` (Sprint 6+, 3-service hybrid)
- `Makefile` (target dev + microservices)
- `.github/CODEOWNERS`
- `.github/workflows/ci.yml` (3 job di Sprint 5, +deploy di Sprint 6, +integration-test di Sprint 7)
- `gateway/nginx.conf` (Sprint 6 dasar, Sprint 7 production-grade)
- `services/shared/logging_config.py`, `logging_middleware.py`, `metrics.py`, `httpx_client.py`
- `scripts/integration-test.sh`, `scripts/logs.sh`

## Prinsip DevOps

- Development lokal harus sederhana dulu
- Docker digunakan saat sprint relevan, bukan dipaksa dari awal
- Workflow cloud mengikuti kebutuhan modul (DEC-018: Tencent VPS primary)
- Branch protection aktif di master (1 approval, block force push)
- Semua PR ke master wajib squash merge
- CODEOWNERS mengatur automatic reviewer assignment
- Tidak deploy tooling tambahan (Prometheus, Grafana, Loki) — di luar scope MVP, hanya format yang siap

## Dokumen Terkait

- [system-architecture.md](./system-architecture.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../04-implementation-plan/environment-setup.md](../04-implementation-plan/environment-setup.md)
- [../04-implementation-plan/branching-strategy.md](../04-implementation-plan/branching-strategy.md)
- [../01-concept/decision-log.md](../01-concept/decision-log.md) (DEC-018, DEC-019, DEC-020, DEC-021, DEC-022, DEC-023)
