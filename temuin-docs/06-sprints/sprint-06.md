# Sprint 06 - Deploy And Microservices Split

## Tujuan Sprint

Mendeploy aplikasi ke cloud dan memulai pemecahan backend ke auth-service dan item-service.

## Alignment Modul: 11-12

- Modul 11: Continuous Deployment — Automated Deploy ke Cloud
- Modul 12: Microservices — Konsep & Dekomposisi

## Lead Backend (@disnejy)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| BE-6.1 | Pisahkan auth logic ke `auth-service` | High | 5h | BE-5.3 | todo | - | Modul 12: bounded context |
| BE-6.2 | Pisahkan items, claims, dan master data ke `item-service` | High | 5h | BE-5.3 | todo | - | Modul 12: database per service |
| BE-6.3 | Tambah komunikasi token verification antar service | High | 3h | BE-6.1, BE-6.2 | todo | - | Ref: DEC-017, shared JWT secret via env vars |
| BE-6.4 | Rapikan bug hasil split service | Medium | 2h | BE-6.3 | todo | - | - |
| BE-6.5 | Tambah auth_client.py untuk inter-service HTTP calls | High | 2h | BE-6.1 | todo | - | Modul 12: sync REST communication |

## Lead Frontend (@nicholasmnrng)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| FE-6.1 | Adaptasi base URL frontend untuk deploy cloud | Medium | 2h | FE-5.3, DO-6.2 | todo | - | - |
| FE-6.2 | Perbaiki flow frontend setelah split service | High | 3h | FE-6.1, BE-6.4 | todo | - | - |
| FE-6.3 | Rapikan UX untuk environment deploy | Medium | 2h | FE-6.2 | todo | - | - |

## Lead DevOps (@PangeranSilaen)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| DO-6.1 | Deploy ke Railway atau platform PaaS lain | High | 3h | DO-5.3, FE-5.3, BE-5.3 | todo | - | Modul 11: PaaS deployment |
| DO-6.2 | Setup env vars dan database cloud | High | 2h | DO-6.1 | todo | - | Modul 11: secrets management |
| DO-6.3 | Update `docker-compose.yml` untuk 2 service dan 2 DB | High | 3h | BE-6.1, BE-6.2 | todo | - | Modul 12: compose microservices |
| DO-6.4 | Tambah catatan operasional split service untuk tim | Medium | 1h | DO-6.2, DO-6.3 | todo | - | - |
| DO-6.5 | Setup CD pipeline (GitHub Actions → auto deploy) | High | 3h | DO-6.1, DO-5.1 | todo | - | Modul 11: automated deploy on push to master |
| DO-6.6 | Setup secrets management (GitHub Secrets + platform env vars) | High | 2h | DO-6.1 | todo | - | Modul 11: production secrets |

## Lead QA & Docs (@raniayudewi)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| QA-6.1 | Blackbox smoke test pada deployment cloud | High | 2h | DO-6.2 | todo | - | Modul 11: production smoke test |
| QA-6.2 | Blackbox regression setelah split service | High | 2h | FE-6.2, BE-6.4, DO-6.3 | todo | - | - |
| QA-6.3 | Update dokumen aktif bila flow deploy atau API berubah | Medium | 1h | QA-6.1, QA-6.2 | todo | - | - |
| QA-6.4 | Production smoke test setelah CD deploy | Medium | 1h | DO-6.5 | todo | - | Modul 11: verify CD pipeline works |

## Quick Links

- [ACTIVE_SPRINT.md](./ACTIVE_SPRINT.md)
- [../05-roles/backend.md](../05-roles/backend.md)
- [../05-roles/frontend.md](../05-roles/frontend.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../05-roles/qa-docs.md](../05-roles/qa-docs.md)
- [../04-implementation-plan/development-workflow.md](../04-implementation-plan/development-workflow.md)
