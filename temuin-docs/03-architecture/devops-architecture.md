# DevOps Architecture - Temuin

## Fokus Per Fase

| Sprint | Fokus DevOps |
|-------|---------------|
| 1-2 | Environment lokal dan bantuan setup |
| 3-4 | Dockerfile dan Docker Compose |
| 5 | GitHub Actions CI |
| 6 | Deploy ke cloud dan compose microservices |
| 7 | Nginx gateway, health checks, logging |
| 8 | Security hardening dan final deploy |

## Artefak Kunci

- `backend/.env.example`
- `frontend/.env.example`
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docker-compose.yml`
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`
- `gateway/nginx.conf`

## Prinsip DevOps

- Development lokal harus sederhana dulu
- Docker digunakan saat sprint relevan, bukan dipaksa dari awal
- Workflow cloud mengikuti kebutuhan modul
- Branch protection boleh dipakai jika akses repo memungkinkan, tapi dokumentasi tidak boleh bergantung pada admin permission

## Health And Logging

- Sprint 4 memastikan demo Docker stabil
- Sprint 7 menambahkan health checks, gateway, dan structured logging
- Sprint 8 menambahkan hardening untuk image dan deployment

## Dokumen Terkait

- [system-architecture.md](./system-architecture.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../04-implementation-plan/environment-setup.md](../04-implementation-plan/environment-setup.md)
