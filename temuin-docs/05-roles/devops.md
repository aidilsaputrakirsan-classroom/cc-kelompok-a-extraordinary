# Role Guide - Lead DevOps (@PangeranSilaen)

## Fokus Tanggung Jawab

- Jaga environment lokal tim tetap jalan
- Siapkan Docker dan Docker Compose
- Bangun workflow CI/CD
- Siapkan deploy, gateway, health checks, dan logging dasar
- Kelola branch protection dan CODEOWNERS

## Output Yang Diharapkan

- `.env.example` yang jelas
- Dockerfile backend dan frontend
- `docker-compose.yml`, `docker-compose.dev.yml`, `docker-compose.prod.yml`
- `Makefile` dengan targets lint/test/pr-check
- `.github/CODEOWNERS`
- Workflow GitHub Actions CI 3-job (`.github/workflows/ci.yml`) lint + backend-test + frontend-test (DEC-020) — sprint 05
- Branch protection guide di `docs/branch-protection-guide.md` — sprint 05
- Deploy monolith ke Tencent VPS `https://temuin.pangeransilaen.net` (DEC-018) — sprint 06
- `docker-compose.microservices.yml` 3 service + 1 Postgres shared multi-DB (DEC-019) — sprint 06
- CD pipeline job `deploy` (`.github/workflows/ci.yml` job `deploy`) trigger push master, SSH ke VPS — sprint 06
- Container `temuin-gateway` Nginx production-grade (rate limiting + correlation ID) — sprint 07
- Healthcheck Docker Compose, restart policies, resource limits — sprint 07
- Logging driver json-file max 10m × 3 (DEC-022) — sprint 07
- Integration test job di CI (DEC-020) — sprint 07
- `scripts/logs.sh`, `scripts/integration-test.sh` — sprint 07
- Image hardening (non-root user), secret audit, security headers backend — sprint 08
- Backup video demo + git tag v1.0.0 + `docs/release-notes.md` — sprint 08

## Aturan VPS Production (DEC-018)

- Domain: `temuin.pangeransilaen.net` (Cloudflare DNS A record)
- IP VPS: 43.156.15.248 (Tencent Cloud, 2 vCPU, 1.9 GB RAM, swap 2 GB)
- 2-layer nginx: host nginx (SSL Let's Encrypt) di port 443 → container nginx:alpine di `127.0.0.1:8080`
- Direktori deployment: `/opt/temuin/`, file `.env` permission 600
- Container Temuin tidak boleh expose port ke internet, hanya loopback (`127.0.0.1:8080`, `127.0.0.1:3000`)
- Tidak boleh mengganggu service lain di VPS (`9router`, `enowxai`)
- Fallback Render free tier monolith bila VPS bermasalah

## Prioritas Kerja

1. Bantu tim jalan di lokal lebih dulu
2. Docker masuk saat sprint yang relevan
3. Branch protection aktif — semua PR wajib 1 approval, squash merge
4. CI/CD mengikuti urutan sprint (CI sprint 05, CD sprint 06)
5. Dokumentasikan langkah penting seperlunya

## Docker

Lihat panduan lengkap di [`docs/docker-guide.md`](../../docs/docker-guide.md).

## Bacaan Kunci

- `temuin-docs/03-architecture/devops-architecture.md`
- `temuin-docs/03-architecture/system-architecture.md`
- `temuin-docs/04-implementation-plan/environment-setup.md`
- `temuin-docs/04-implementation-plan/branching-strategy.md`
- `temuin-docs/06-sprints/ACTIVE_SPRINT.md`
