# DevOps Architecture - Temuin

## Fokus Per Fase

| Sprint | Fokus DevOps                                                  |
| ------ | ------------------------------------------------------------- |
| 1-2    | Environment lokal dan bantuan setup                           |
| 3-4    | Dockerfile dan Docker Compose                                 |
| 5      | Git workflow, branch protection, GitHub Actions CI            |
| 6      | Deploy ke cloud (PaaS), CD pipeline, compose microservices    |
| 7      | Nginx gateway, health checks, logging, reliability patterns   |
| 8      | Security hardening, final deploy, release tag v3.0.0          |

## Modul Alignment

| Sprint | Modul | Topik Utama |
|--------|-------|-------------|
| 5 | 9-10 | Git Workflow + CI (GitHub Actions, pytest, Vitest) |
| 6 | 11-12 | CD (Railway/PaaS) + Microservices Decomposition |
| 7 | 13-14 | Reliability (retry, circuit breaker) + Monitoring (logging, metrics) |
| 8 | 15 | Security Hardening + Final Polish + Release |

## Artefak Kunci

- `backend/.env.example`
- `frontend/.env.example`
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docker-compose.yml`
- `docker-compose.dev.yml`
- `docker-compose.prod.yml`
- `Makefile`
- `.github/CODEOWNERS`
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`
- `gateway/nginx.conf`

## Prinsip DevOps

- Development lokal harus sederhana dulu
- Docker digunakan saat sprint relevan, bukan dipaksa dari awal
- Workflow cloud mengikuti kebutuhan modul
- Branch protection aktif di master (1 approval, block force push)
- Semua PR ke master wajib squash merge
- CODEOWNERS mengatur automatic reviewer assignment

## Health And Logging

- Sprint 4 memastikan demo Docker stabil
- Sprint 7 menambahkan health checks, gateway, structured logging, dan reliability patterns
- Sprint 8 menambahkan hardening untuk image dan deployment

## CI/CD Pipeline

- Sprint 5: GitHub Actions CI (lint + test backend, build frontend)
- Sprint 6: CD pipeline (auto deploy ke PaaS on push to master)
- Status checks akan ditambahkan ke branch protection setelah CI aktif

## Dokumen Terkait

- [system-architecture.md](./system-architecture.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../04-implementation-plan/environment-setup.md](../04-implementation-plan/environment-setup.md)
- [../04-implementation-plan/branching-strategy.md](../04-implementation-plan/branching-strategy.md)
