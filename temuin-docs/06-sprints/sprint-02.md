# Sprint 02 - Auth And Core Item Flow

## Tujuan Sprint

Menyelesaikan login Google, JWT internal, flow item dasar, dan halaman utama yang dibutuhkan untuk alur awal user.

## Lead Backend (@disnejy)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| BE-2.1 | Integrasi Firebase Admin SDK dan login token verification | High | 3h | BE-1.2 | done | master | Ref: backend-architecture.md auth flow |
| BE-2.2 | Buat `POST /auth/login` dan sync user internal | High | 3h | BE-2.1 | done | feat/be-2.2-login-sync | Ref: DEC-002, prd-user-flows.md login flow |
| BE-2.3 | Buat `GET /auth/me`, `PUT /auth/me`, dan dependency auth | High | 3h | BE-2.2 | done | feat/be-2.2-login-sync | - |
| BE-2.4 | Buat CRUD dasar items dan validasi `found` wajib satpam | High | 4h | BE-1.4, BE-2.3 | todo | - | Ref: DEC-004, DEC-006, DEC-010, DEC-016 |

## Lead Frontend (@nicholasmnrng)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| FE-2.1 | Buat LoginPage dan Google login button | High | 3h | FE-1.4, DO-2.1 | todo | - | API: POST /auth/login |
| FE-2.2 | Buat auth state, logout, dan protected route | High | 3h | FE-2.1, BE-2.3 | todo | - | - |
| FE-2.3 | Buat HomePage, ItemListPage, dan ItemDetailPage | High | 4h | FE-2.2, BE-2.4 | todo | - | API: GET /items, GET /items/:id |
| FE-2.4 | Buat CreateItemPage dan form lost/found | High | 4h | FE-2.3, BE-2.4 | todo | - | API: POST /items, Ref: DEC-004, DEC-010, DEC-016 |

## Lead DevOps (@PangeranSilaen)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| DO-2.1 | Siapkan placeholder konfigurasi Firebase untuk tim | High | 2h | DO-1.1 | todo | - | - |
| DO-2.2 | Review dan bantu debug issue env atau CORS | Medium | 2h | BE-2.2, FE-2.1 | todo | - | - |
| DO-2.3 | Tambah panduan singkat test API manual untuk tim | Low | 1h | BE-2.4 | todo | - | - |

## Lead QA & Docs (@raniayudewi)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| QA-2.1 | Blackbox login flow dan validasi email kampus | High | 2h | FE-2.2, BE-2.3 | todo | - | - |
| QA-2.2 | Blackbox create item, list item, dan detail item | High | 2h | FE-2.4, BE-2.4 | todo | - | - |
| QA-2.3 | Simpan screenshot flow login dan create item | Medium | 1h | QA-2.1, QA-2.2 | todo | - | - |
| QA-2.4 | Update dokumen bila ada langkah auth atau item flow yang berubah | Medium | 1h | QA-2.1, QA-2.2 | todo | - | - |

## Quick Links

- [ACTIVE_SPRINT.md](./ACTIVE_SPRINT.md)
- [../05-roles/backend.md](../05-roles/backend.md)
- [../05-roles/frontend.md](../05-roles/frontend.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../05-roles/qa-docs.md](../05-roles/qa-docs.md)
- [../04-implementation-plan/development-workflow.md](../04-implementation-plan/development-workflow.md)
