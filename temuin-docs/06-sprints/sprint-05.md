# Sprint 05 - CI And Backend Testing

## Tujuan Sprint

Menerapkan git workflow (branch protection, CODEOWNERS, Makefile), menambah test backend yang berguna, menyalakan CI dasar, dan menstabilkan build project.

## Alignment Modul: 9-10

- Modul 9: Git Workflow & Branching Strategy
- Modul 10: Continuous Integration — Automated Testing & Build dengan GitHub Actions

## Lead Backend (@disnejy)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| BE-5.1 | Buat fixture test backend dan auth tests | High | 3h | BE-4.3 | todo | - | Modul 10: pytest fixtures, conftest.py |
| BE-5.2 | Tambah tests untuk items dan claims | High | 4h | BE-5.1 | todo | - | Modul 10: target min 12 backend tests |
| BE-5.3 | Rapikan bug atau celah yang terungkap dari test backend | Medium | 2h | BE-5.2 | todo | - | - |
| BE-5.4 | Setup pytest fixtures dan conftest.py | Medium | 2h | BE-5.1 | todo | - | Modul 10: shared fixtures untuk semua test |

## Lead Frontend (@nicholasmnrng)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| FE-5.1 | Perbaiki bug frontend hasil sprint UTS | High | 3h | QA-4.3 | todo | - | - |
| FE-5.2 | Tambah route lazy loading dan cleanup state yang perlu | Medium | 2h | FE-5.1 | todo | - | - |
| FE-5.3 | Pastikan build frontend stabil untuk kebutuhan CI | Medium | 2h | FE-5.2 | todo | - | - |
| FE-5.4 | Setup Vitest dan tulis min 7 frontend tests | Medium | 3h | FE-5.3 | todo | - | Modul 10: frontend testing dengan Vitest |

## Lead DevOps (@PangeranSilaen)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| DO-5.1 | Buat workflow CI untuk lint dan test backend | High | 3h | BE-5.1 | todo | - | Modul 10: GitHub Actions CI workflow |
| DO-5.2 | Buat workflow CI untuk build frontend | High | 2h | FE-5.3 | todo | - | Modul 10: frontend build CI |
| DO-5.3 | Tulis aturan review dan penggunaan CI sesuai permission repo yang ada | Medium | 1h | DO-5.1, DO-5.2 | todo | - | - |
| DO-5.4 | Setup branch protection rules di master | High | 1h | - | done | - | Modul 9: ruleset aktif, 1 approval required |
| DO-5.5 | Buat CODEOWNERS file | Medium | 1h | - | done | chore/add-codeowners | Modul 9: PR #77 merged |
| DO-5.6 | Buat docker-compose.prod.yml | Medium | 1h | - | done | feature/compose-profiles | Modul 9: PR #78 merged |
| DO-5.7 | Buat Makefile dengan lint/test/pr-check | Medium | 1h | - | done | feature/makefile-update | Modul 9: PR #79 merged |

## Lead QA & Docs (@raniayudewi)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| QA-5.1 | Blackbox regression setelah bugfix sprint 05 | High | 2h | FE-5.1, BE-5.3 | todo | - | - |
| QA-5.2 | Verifikasi CI berjalan di branch yang sudah di-push | Medium | 1h | DO-5.1, DO-5.2 | todo | - | Modul 10: CI badge di README |
| QA-5.3 | Update catatan testing tim jika ada perubahan langkah | Medium | 1h | QA-5.1, QA-5.2 | todo | - | - |

## Quick Links

- [ACTIVE_SPRINT.md](./ACTIVE_SPRINT.md)
- [../05-roles/backend.md](../05-roles/backend.md)
- [../05-roles/frontend.md](../05-roles/frontend.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../05-roles/qa-docs.md](../05-roles/qa-docs.md)
- [../04-implementation-plan/development-workflow.md](../04-implementation-plan/development-workflow.md)
