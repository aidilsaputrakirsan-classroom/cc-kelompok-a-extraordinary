# Sprint 04 - Docker And UTS Readiness

## Tujuan Sprint

Menstabilkan flow inti di Docker, menambah halaman admin penting, dan menyiapkan demo UTS.

## Lead Backend (@disnejy)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| BE-4.1 | Perbaiki bug backend hasil blackbox sprint 02-03 | High | 3h | QA-3.3 | done | feat/backend/sprint-04-v2 | test added |
| BE-4.2 | Review kelengkapan endpoint terhadap flow inti UTS | Medium | 2h | BE-4.1 | done | feat/backend/sprint-04-v2 | admin claims check added |
| BE-4.3 | Pastikan backend stabil saat dijalankan via Docker Compose | High | 2h | DO-3.3, BE-4.2 | done | feat/backend/sprint-04-v2 | cors updated for docker compose |
| BE-4.4 | Hapus Firebase Auth, implementasi register/login email+password | High | 4h | BE-4.1 | todo | - | Issue #46. Tambah passlib[bcrypt], migration password_hash, rewrite auth service/router/schemas |

## Lead Frontend (@nicholasmnrng)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| FE-4.0 | Hapus Firebase Auth, buat form register/login email+password | High | 3h | - | in_progress | - | Issue #47. Rewrite providers, login page, buat register page, hapus firebase.js |
| FE-4.1 | Buat halaman admin claim list dan claim detail | High | 4h | FE-3.2, BE-3.2 | done | feat/frontend/sprint-04-admin-claims | Admin claims created |
| FE-4.2 | Buat halaman admin master data | Medium | 4h | FE-3.3, BE-3.4 | done | feat/frontend/sprint-04-admin-claims | Master data CRUD done |
| FE-4.3 | Tambah toast, empty state, dan error state penting | Medium | 3h | FE-4.1, FE-4.2 | done | feat/frontend/sprint-04-admin-claims | Mock removed, PageState added |
| FE-4.4 | Rapikan responsivitas untuk flow demo UTS | Medium | 2h | FE-4.3 | todo | - | - |

## Lead DevOps (@PangeranSilaen)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| DO-4.1 | Optimasi Dockerfile dan `.dockerignore` | Medium | 2h | DO-3.3 | todo | - | - |
| DO-4.2 | Tambah volume atau workflow hot reload dev bila diperlukan | Medium | 2h | DO-4.1 | todo | - | - |
| DO-4.3 | Update docker-compose.yml: hapus Firebase mounts dan env vars | High | 1h | BE-4.4, FE-4.0 | todo | - | Issue #46 step 10. Hapus serviceAccountKey mount, VITE_FIREBASE_* args |
| DO-4.4 | Verifikasi alur UTS berjalan penuh via Docker Compose | High | 2h | DO-4.2, DO-4.3, BE-4.4, FE-4.4 | todo | - | - |

## Lead QA & Docs (@raniayudewi)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| QA-4.1 | Blackbox full flow di Docker: login hingga returned | High | 2h | DO-4.3 | todo | - | - |
| QA-4.2 | Blackbox admin pages utama | Medium | 2h | FE-4.2, BE-3.4 | todo | - | - |
| QA-4.3 | Simpan screenshot flow utama untuk persiapan demo UTS | Medium | 1h | QA-4.1, QA-4.2 | todo | - | - |
| QA-4.4 | Update langkah demo atau dokumen terkait bila flow berubah | Medium | 1h | QA-4.1 | todo | - | - |

## Quick Links

- [ACTIVE_SPRINT.md](./ACTIVE_SPRINT.md)
- [../05-roles/backend.md](../05-roles/backend.md)
- [../05-roles/frontend.md](../05-roles/frontend.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../05-roles/qa-docs.md](../05-roles/qa-docs.md)
- [../04-implementation-plan/development-workflow.md](../04-implementation-plan/development-workflow.md)
