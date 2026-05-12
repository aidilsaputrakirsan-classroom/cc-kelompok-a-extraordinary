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
- Workflow GitHub Actions CI (`.github/workflows/ci.yml`) — sprint 05
- CD pipeline (`.github/workflows/deploy.yml`) — sprint 06
- Nginx gateway config (`gateway/nginx.conf`) — sprint 07
- Release tag v3.0.0 — sprint 08

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
