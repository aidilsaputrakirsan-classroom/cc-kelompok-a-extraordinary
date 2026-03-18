# Sprint 07 - Gateway, Health, And Monitoring

## Tujuan Sprint

Menambahkan Nginx gateway, health checks, audit log, dan logging dasar untuk arsitektur microservices.

## Lead Backend (@disnejy)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| BE-7.1 | Tambah health endpoint per service | High | 1h | BE-6.4 | todo | - | - |
| BE-7.2 | Tambah audit log untuk aksi admin penting | Medium | 3h | BE-4.2 | todo | - | - |
| BE-7.3 | Tambah structured logging dan response timing | Medium | 2h | BE-7.1 | todo | - | - |

## Lead Frontend (@nicholasmnrng)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| FE-7.1 | Arahkan frontend ke gateway path | High | 2h | DO-7.2, BE-7.1 | todo | - | - |
| FE-7.2 | Tambah handling service unavailable dan retry message ringan | Medium | 2h | FE-7.1 | todo | - | - |
| FE-7.3 | Rapikan feedback status untuk area admin dan monitoring dasar | Medium | 2h | FE-7.2, BE-7.2 | todo | - | - |

## Lead DevOps (@PangeranSilaen)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| DO-7.1 | Tambah container gateway Nginx | High | 3h | DO-6.3 | todo | - | - |
| DO-7.2 | Route auth-service dan item-service via gateway | High | 3h | DO-7.1, BE-6.4 | todo | - | - |
| DO-7.3 | Tambah health checks dan restart policies di compose | Medium | 2h | DO-7.2, BE-7.1 | todo | - | - |
| DO-7.4 | Tulis catatan log dan command ops dasar untuk tim | Medium | 1h | DO-7.3, BE-7.3 | todo | - | - |

## Lead QA & Docs (@raniayudewi)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| QA-7.1 | Blackbox routing via gateway untuk flow utama | High | 2h | FE-7.1, DO-7.2 | todo | - | - |
| QA-7.2 | Blackbox perilaku saat salah satu service down | High | 2h | FE-7.2, DO-7.3 | todo | - | - |
| QA-7.3 | Update catatan ops/testing jika gateway flow berubah | Medium | 1h | QA-7.1, QA-7.2 | todo | - | - |

## Quick Links

- [ACTIVE_SPRINT.md](./ACTIVE_SPRINT.md)
- [../05-roles/backend.md](../05-roles/backend.md)
- [../05-roles/frontend.md](../05-roles/frontend.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../05-roles/qa-docs.md](../05-roles/qa-docs.md)
- [../04-implementation-plan/development-workflow.md](../04-implementation-plan/development-workflow.md)
