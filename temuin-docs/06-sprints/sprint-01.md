# Sprint 01 - Foundation And Fresh Start

## Tujuan Sprint

Membuat fondasi project final yang bersih di branch `master`: scaffold backend, scaffold frontend dengan shadcn/ui, data model inti, dan panduan kerja awal.

## Lead Backend (@disnejy)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| BE-1.1 | Buat scaffold `backend/app/` dan entrypoint FastAPI | High | 2h | - | done | master | - |
| BE-1.2 | Tambah `config.py`, `database.py`, dan pembacaan env vars | High | 2h | BE-1.1 | done | master | - |
| BE-1.3 | Buat model inti: users, items, claims, master data, notifications | High | 4h | BE-1.2 | done | master | Ref: database-design.md |
| BE-1.4 | Tambah endpoint `/health` dan seed awal master data | Medium | 2h | BE-1.3 | done | master | - |

## Lead Frontend (@nicholasmnrng)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| FE-1.1 | Init React + Vite + Tailwind CSS di `frontend/` | High | 2h | - | done | feature/sprint1-fe-scaffold | - |
| FE-1.2 | Init shadcn/ui dan komponen dasar layout | High | 2h | FE-1.1 | done | feature/sprint1-fe-scaffold | - |
| FE-1.3 | Setup router, layout shell, dan struktur folder frontend | High | 3h | FE-1.2 | done | feature/sprint1-fe-scaffold | - |
| FE-1.4 | Setup `config/api.js` dan `config/firebase.js` placeholder | Medium | 2h | FE-1.3 | done | feature/sprint1-fe-scaffold | Ref: frontend-architecture.md, backend-architecture.md auth flow |

## Lead DevOps (@PangeranSilaen)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| DO-1.1 | Tambah `.env.example` backend dan frontend sesuai arsitektur | High | 1h | - | todo | - | - |
| DO-1.2 | Siapkan panduan PostgreSQL lokal atau Docker untuk tim | Medium | 2h | DO-1.1 | todo | - | - |
| DO-1.3 | Review scaffold repo dan pastikan `.gitignore` aman | Medium | 1h | DO-1.1 | todo | - | - |
| DO-1.4 | Bantu validasi setup lokal setelah backend dan frontend hidup | Medium | 2h | BE-1.4, FE-1.4 | todo | - | - |

## Lead QA & Docs (@raniayudewi)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| QA-1.1 | Review chain dokumen aktif dan catat gap yang membingungkan | High | 1h | - | todo | - | - |
| QA-1.2 | Lakukan blackbox setup check untuk backend scaffold | Medium | 1h | BE-1.4 | todo | - | - |
| QA-1.3 | Lakukan blackbox setup check untuk frontend scaffold | Medium | 1h | FE-1.4 | todo | - | - |
| QA-1.4 | Simpan screenshot bukti halaman awal dan health check | Medium | 1h | QA-1.2, QA-1.3 | todo | - | - |

## Quick Links

- [ACTIVE_SPRINT.md](./ACTIVE_SPRINT.md)
- [../05-roles/backend.md](../05-roles/backend.md)
- [../05-roles/frontend.md](../05-roles/frontend.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../05-roles/qa-docs.md](../05-roles/qa-docs.md)
- [../04-implementation-plan/development-workflow.md](../04-implementation-plan/development-workflow.md)
