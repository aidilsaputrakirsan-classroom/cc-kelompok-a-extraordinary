# Sprint 07 - Gateway, Health, And Monitoring

## Tujuan Sprint

Menambahkan Nginx gateway, health checks, reliability patterns, dan monitoring dasar untuk arsitektur microservices.

## Alignment Modul: 13-14

- Modul 13: Microservices — Implementasi & Reliability
- Modul 14: Monitoring, Logging & Observability

## Lead Backend (@disnejy)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| BE-7.1 | Tambah health endpoint per service | High | 1h | BE-6.4 | todo | - | - |
| BE-7.2 | Tambah audit log untuk aksi admin penting | Medium | 3h | BE-4.2 | todo | - | - |
| BE-7.3 | Tambah structured logging dan response timing | Medium | 2h | BE-7.1 | todo | - | Modul 14: JSON structured logging |
| BE-7.4 | Implementasi retry pattern (exponential backoff) antar service | Medium | 3h | BE-7.1 | todo | - | Modul 13: 3 retries, 0.5s/1s/2s |
| BE-7.5 | Implementasi circuit breaker pattern | Medium | 3h | BE-7.4 | todo | - | Modul 13: 5 failures threshold, 30s cooldown |
| BE-7.6 | Tambah metrics endpoint (/metrics: latency p50/p95/p99, error rate) | Medium | 2h | BE-7.3 | todo | - | Modul 14: Four Golden Signals |

## Lead Frontend (@nicholasmnrng)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| FE-7.1 | Arahkan frontend ke gateway path | High | 2h | DO-7.2, BE-7.1 | todo | - | - |
| FE-7.2 | Tambah handling service unavailable dan retry message ringan | Medium | 2h | FE-7.1 | todo | - | Modul 13: graceful degradation UI |
| FE-7.3 | Rapikan feedback status untuk area admin dan monitoring dasar | Medium | 2h | FE-7.2, BE-7.2 | todo | - | - |
| FE-7.4 | Buat health dashboard / status page sederhana | Medium | 3h | BE-7.1, FE-7.2 | todo | - | Modul 14: React StatusPage component |

## Lead DevOps (@PangeranSilaen)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| DO-7.1 | Tambah container gateway Nginx | High | 3h | DO-6.3 | todo | - | - |
| DO-7.2 | Route auth-service dan item-service via gateway | High | 3h | DO-7.1, BE-6.4 | todo | - | - |
| DO-7.3 | Tambah health checks dan restart policies di compose | Medium | 2h | DO-7.2, BE-7.1 | todo | - | Modul 13: restart policies, resource limits |
| DO-7.4 | Tulis catatan log dan command ops dasar untuk tim | Medium | 1h | DO-7.3, BE-7.3 | todo | - | - |
| DO-7.5 | Centralized logging dan log rotation di compose | Medium | 2h | DO-7.3, BE-7.3 | todo | - | Modul 14: Docker logging driver config |
| DO-7.6 | Correlation ID forwarding antar services | Medium | 2h | DO-7.2, BE-7.3 | todo | - | Modul 14: request tracing |

## Lead QA & Docs (@raniayudewi)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| QA-7.1 | Blackbox routing via gateway untuk flow utama | High | 2h | FE-7.1, DO-7.2 | todo | - | - |
| QA-7.2 | Blackbox perilaku saat salah satu service down | High | 2h | FE-7.2, DO-7.3 | todo | - | - |
| QA-7.3 | Update catatan ops/testing jika gateway flow berubah | Medium | 1h | QA-7.1, QA-7.2 | todo | - | - |
| QA-7.4 | Test reliability: matikan satu service, verifikasi graceful degradation | Medium | 2h | FE-7.2, BE-7.5, DO-7.3 | todo | - | Modul 13: chaos testing sederhana |

## Quick Links

- [ACTIVE_SPRINT.md](./ACTIVE_SPRINT.md)
- [../05-roles/backend.md](../05-roles/backend.md)
- [../05-roles/frontend.md](../05-roles/frontend.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../05-roles/qa-docs.md](../05-roles/qa-docs.md)
- [../04-implementation-plan/development-workflow.md](../04-implementation-plan/development-workflow.md)
