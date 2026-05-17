# Sprint 05 - CI And Backend Testing

## Tujuan Sprint

Menerapkan git workflow (branch protection, CODEOWNERS, Makefile), menambah test backend yang berguna, menyalakan CI dasar, dan menstabilkan build project.

## Alignment Modul: 9-10

- Modul 9: Git Workflow & Branching Strategy
- Modul 10: Continuous Integration — Automated Testing & Build dengan GitHub Actions

## Lead Backend (@disnejy)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| BE-5.1 | Buat fixture test backend dan auth tests | High | 3h | BE-4.3 | todo | - | Modul 10: pytest fixtures, conftest.py. Min 5 test (register, duplicate, login success, login wrong, /me) |
| BE-5.2 | Tambah tests untuk items dan claims | High | 4h | BE-5.1 | todo | - | Modul 10: target min 12 backend tests total. Cover create, list, detail, claim flow, unauthorized |
| BE-5.3 | Rapikan bug atau celah yang terungkap dari test backend | Medium | 2h | BE-5.2 | todo | - | - |
| BE-5.4 | Setup pytest-cov dengan threshold ≥60% (DEC-020) | Medium | 2h | BE-5.1 | todo | - | Tambah `pytest --cov=app --cov-fail-under=60` ke CI. Conftest.py dengan fixture `client`, `db_session`, `auth_user` reusable |

## Lead Frontend (@nicholasmnrng)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| FE-5.1 | Perbaiki bug frontend hasil sprint UTS | High | 3h | QA-4.3 | todo | - | - |
| FE-5.2 | Tambah route lazy loading dan cleanup state yang perlu | Medium | 2h | FE-5.1 | todo | - | - |
| FE-5.3 | Pastikan build frontend stabil untuk kebutuhan CI | Medium | 2h | FE-5.2 | todo | - | `npm run build` exit 0, output `dist/` valid |
| FE-5.4 | Setup Vitest dan tulis min 7 frontend tests dengan coverage ≥40% (DEC-020) | Medium | 3h | FE-5.3 | todo | - | Modul 10: Vitest + @testing-library/react + jsdom. Test minimum: LoginPage, ProtectedRoute, ItemCard, ItemListPage, Header, ItemForm, api client. Threshold di `vitest.config.js` |

## Lead DevOps (@PangeranSilaen)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| DO-5.1 | Buat workflow CI 3-job (lint + backend-test + frontend-test) (DEC-020) | High | 3h | BE-5.1 | todo | - | Modul 10: `.github/workflows/ci.yml` dengan job paralel. Job `lint` (ruff backend + eslint frontend), `backend-test` (pytest cov ≥60%), `frontend-test` (vitest cov ≥40% + npm build) |
| DO-5.2 | Tambah ruff config + integrasikan ke CI lint job | Medium | 1h | DO-5.1 | todo | - | `pyproject.toml` punya `[tool.ruff]`. `ruff check backend/` exit 0 di CI |
| DO-5.3 | Tulis aturan review dan dokumentasikan branch protection di `docs/branch-protection-guide.md` | Medium | 1h | DO-5.1 | todo | - | Step-by-step screenshot setup branch protection + required status checks: `lint`, `backend-test`, `frontend-test`. Tidak perlu di-enable kalau tidak ada permission, cukup dokumentasikan |
| DO-5.4 | Setup branch protection rules di master | High | 1h | - | done | - | Modul 9: ruleset aktif, 1 approval required |
| DO-5.5 | Buat CODEOWNERS file | Medium | 1h | - | done | chore/add-codeowners | Modul 9: PR #77 merged |
| DO-5.6 | Buat docker-compose.prod.yml | Medium | 1h | - | done | feature/compose-profiles | Modul 9: PR #78 merged |
| DO-5.7 | Buat Makefile dengan lint/test/pr-check | Medium | 1h | - | done | feature/makefile-update | Modul 9: PR #79 merged |

## Lead QA & Docs (@raniayudewi)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| QA-5.1 | Blackbox regression setelah bugfix sprint 05 | High | 2h | FE-5.1, BE-5.3 | todo | - | - |
| QA-5.2 | Verifikasi CI 3-job berjalan hijau dan tambah CI badge di README | Medium | 1h | DO-5.1, DO-5.2 | todo | - | Modul 10: CI badge di README plus screenshot 3 job hijau di `image/sprint-05/` |
| QA-5.3 | Tulis `docs/testing-guide.md` (cara run test, threshold, troubleshoot) | Medium | 2h | BE-5.4, FE-5.4 | todo | - | Modul 10: prerequisites, run backend tests, run frontend tests, threshold reference (60% backend, 40% frontend), troubleshooting CI failure |

## Quick Links

- [ACTIVE_SPRINT.md](./ACTIVE_SPRINT.md)
- [../05-roles/backend.md](../05-roles/backend.md)
- [../05-roles/frontend.md](../05-roles/frontend.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../05-roles/qa-docs.md](../05-roles/qa-docs.md)
- [../04-implementation-plan/development-workflow.md](../04-implementation-plan/development-workflow.md)
