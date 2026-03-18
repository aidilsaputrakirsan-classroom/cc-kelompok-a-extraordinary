# Sprint 05 - CI And Backend Testing

## Tujuan Sprint

Menambah test backend yang berguna, menyalakan CI dasar, dan menstabilkan build project.

## Lead Backend (@disnejy)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| BE-5.1 | Buat fixture test backend dan auth tests | High | 3h | BE-4.3 | todo | - | - |
| BE-5.2 | Tambah tests untuk items dan claims | High | 4h | BE-5.1 | todo | - | - |
| BE-5.3 | Rapikan bug atau celah yang terungkap dari test backend | Medium | 2h | BE-5.2 | todo | - | - |

## Lead Frontend (@nicholasmnrng)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| FE-5.1 | Perbaiki bug frontend hasil sprint UTS | High | 3h | QA-4.3 | todo | - | - |
| FE-5.2 | Tambah route lazy loading dan cleanup state yang perlu | Medium | 2h | FE-5.1 | todo | - | - |
| FE-5.3 | Pastikan build frontend stabil untuk kebutuhan CI | Medium | 2h | FE-5.2 | todo | - | - |

## Lead DevOps (@PangeranSilaen)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| DO-5.1 | Buat workflow CI untuk lint dan test backend | High | 3h | BE-5.1 | todo | - | - |
| DO-5.2 | Buat workflow CI untuk build frontend | High | 2h | FE-5.3 | todo | - | - |
| DO-5.3 | Tulis aturan review dan penggunaan CI sesuai permission repo yang ada | Medium | 1h | DO-5.1, DO-5.2 | todo | - | - |

## Lead QA & Docs (@raniayudewi)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| QA-5.1 | Blackbox regression setelah bugfix sprint 05 | High | 2h | FE-5.1, BE-5.3 | todo | - | - |
| QA-5.2 | Verifikasi CI berjalan di branch yang sudah di-push | Medium | 1h | DO-5.1, DO-5.2 | todo | - | - |
| QA-5.3 | Update catatan testing tim jika ada perubahan langkah | Medium | 1h | QA-5.1, QA-5.2 | todo | - | - |

## Quick Links

- [ACTIVE_SPRINT.md](./ACTIVE_SPRINT.md)
- [../05-roles/backend.md](../05-roles/backend.md)
- [../05-roles/frontend.md](../05-roles/frontend.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../05-roles/qa-docs.md](../05-roles/qa-docs.md)
- [../04-implementation-plan/development-workflow.md](../04-implementation-plan/development-workflow.md)
