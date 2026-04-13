# Sprint 03 - Core Features

## Tujuan Sprint

Menyelesaikan search, filter, claim flow, notifications, dan master data.

## Lead Backend (@disnejy)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| BE-3.1 | Buat endpoint claim dan aturan satu claim aktif | High | 4h | BE-2.4 | done | feat/be-3.1-claim-endpoint | Ref: DEC-005, DEC-007 |
| BE-3.2 | Sinkronkan perubahan status item dan claim + history | High | 3h | BE-3.1 | done | feat/be-3.1-claim-endpoint | - |
| BE-3.3 | Tambah search, filter, dan pagination items | High | 3h | BE-2.4 | todo | - | Include pagination query params |
| BE-3.4 | Tambah CRUD master data dan notification endpoints | Medium | 4h | BE-3.2 | todo | - | Notif testable via API dulu, full event flow di Sprint 4 |

## Lead Frontend (@nicholasmnrng)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| FE-3.1 | Buat komponen search dan filter di daftar item | High | 3h | FE-2.3, BE-3.3 | todo | - | - |
| FE-3.2 | Buat ClaimForm dan flow submit claim | High | 3h | FE-2.3, BE-3.1 | todo | - | API: POST /claims, Ref: DEC-005 |
| FE-3.3 | Buat halaman MyItems, MyClaims, dan Notifications | Medium | 4h | FE-3.2, BE-3.4 | todo | - | - |
| FE-3.4 | Buat ImageUpload dan badge status item/claim | Medium | 3h | FE-2.4, BE-3.2 | todo | - | - |

## Lead DevOps (@PangeranSilaen)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| DO-3.1 | Buat Dockerfile backend | High | 2h | BE-2.4 | todo | - | - |
| DO-3.2 | Buat Dockerfile frontend | High | 2h | FE-2.4 | todo | - | - |
| DO-3.3 | Buat `docker-compose.yml` monolith | High | 3h | DO-3.1, DO-3.2 | todo | - | - |
| DO-3.4 | Tulis panduan singkat menjalankan Docker Compose | Medium | 1h | DO-3.3 | todo | - | - |

## Lead QA & Docs (@raniayudewi)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| QA-3.1 | Blackbox claim submission (user side) dan cek status via API | High | 2h | FE-3.2, BE-3.2 | todo | - | Full UI claim flow di QA-4.1 setelah admin pages |
| QA-3.2 | Blackbox search, filter, dan status badge | High | 2h | FE-3.1, FE-3.4, BE-3.3 | todo | - | - |
| QA-3.3 | Blackbox notifications dan master data utama | Medium | 2h | FE-3.3, BE-3.4 | todo | - | - |
| QA-3.4 | Simpan screenshot flow claim dan hasil search/filter | Medium | 1h | QA-3.1, QA-3.2 | todo | - | - |

## Quick Links

- [ACTIVE_SPRINT.md](./ACTIVE_SPRINT.md)
- [../05-roles/backend.md](../05-roles/backend.md)
- [../05-roles/frontend.md](../05-roles/frontend.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../05-roles/qa-docs.md](../05-roles/qa-docs.md)
- [../04-implementation-plan/development-workflow.md](../04-implementation-plan/development-workflow.md)
