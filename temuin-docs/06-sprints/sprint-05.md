# Sprint 05 - CI And Backend Testing

## Tujuan Sprint

Menerapkan git workflow (branch protection, CODEOWNERS, Makefile), menambah test backend yang berguna, menyalakan CI dasar, dan menstabilkan build project.

## Alignment Modul: 9-10

- Modul 9: Git Workflow & Branching Strategy
- Modul 10: Continuous Integration — Automated Testing & Build dengan GitHub Actions

## Lead Backend (@disnejy)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| BE-5.1 | Buat fixture test backend dan auth tests | High | 3h | BE-4.3 | done | - | Lompat ke Sprint 6 (Unit tests sudah fully-passed 19/19) |
| BE-5.2 | Tambah tests untuk items dan claims | High | 4h | BE-5.1 | done | - | Lompat ke Sprint 6 (Unit tests sudah fully-passed 19/19) |
| BE-5.3 | Rapikan bug atau celah yang terungkap dari test backend | Medium | 2h | BE-5.2 | done | - | Lompat ke Sprint 6 (Unit tests sudah fully-passed 19/19) |
| BE-5.4 | Setup pytest-cov dengan threshold ≥60% (DEC-020) | Medium | 2h | BE-5.1 | done | - | Lompat ke Sprint 6 (Unit tests sudah fully-passed 19/19) |

## Lead Frontend (@nicholasmnrng)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| FE-5.1 | Perbaiki bug frontend hasil sprint UTS | High | 3h | QA-4.3 | done | feature/fe-5.3-5.4-testing | PR #86 merged (stacked dengan FE-5.2..5.4). PR #85 ditutup karena duplicated |
| FE-5.2 | Tambah route lazy loading dan cleanup state yang perlu | Medium | 2h | FE-5.1 | done | feature/fe-5.3-5.4-testing | PR #86 merged (stacked) |
| FE-5.3 | Pastikan build frontend stabil untuk kebutuhan CI | Medium | 2h | FE-5.2 | done | feature/fe-5.3-5.4-testing | PR #86 merged. Build hijau di CI |
| FE-5.4 | Setup Vitest dan tulis min 7 frontend tests | Medium | 3h | FE-5.3 | done | feature/fe-5.3-5.4-testing | Modul 10: PR #86 merged. 21 tests (target 7) di 7 file. Coverage 71.08% (target 40%) di scope yang diuji. @vitest/coverage-v8 + threshold 40% di vite.config.js |

## Lead DevOps (@PangeranSilaen)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| DO-5.1 | Buat workflow CI 3-job (lint + backend-test + frontend-test) (DEC-020) | High | 3h | BE-5.1 | done | feat/devops/sprint-05-workflow-ci | Modul 10: PR #90 merged. `.github/workflows/ci.yml` dengan 3 job paralel (lint, backend-test, frontend-test). Bonus fix: eslint.config.js (reactHooks v5 compat) + step-level continue-on-error untuk bootstrap window |
| DO-5.2 | Tambah ruff config + integrasikan ke CI lint job | Medium | 1h | DO-5.1 | done | feat/devops/sprint-05-ruff-config | PR #89 merged. Root pyproject.toml dengan [tool.ruff] target backend, line-length 100, rules E/W/F/I/B/UP/SIM. Makefile composite lint/test/coverage targets |
| DO-5.3 | Tulis aturan review dan dokumentasikan branch protection di `docs/branch-protection-guide.md` | Medium | 1h | DO-5.1 | done | docs/devops/sprint-05-branch-protection-guide | PR #91 merged. docs/branch-protection-guide.md 246 baris, 7 section (konsep, status saat ini, setup ruleset, required status checks, verifikasi, troubleshooting, referensi) |
| DO-5.4 | Setup branch protection rules di master | High | 1h | - | done | - | Modul 9: ruleset aktif, 1 approval required |
| DO-5.5 | Buat CODEOWNERS file | Medium | 1h | - | done | chore/add-codeowners | Modul 9: PR #77 merged |
| DO-5.6 | Buat docker-compose.prod.yml | Medium | 1h | - | done | feature/compose-profiles | Modul 9: PR #78 merged |
| DO-5.7 | Buat Makefile dengan lint/test/pr-check | Medium | 1h | - | done | feature/makefile-update | Modul 9: PR #79 merged |

## Lead QA & Docs (@raniayudewi)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| QA-5.1 | Blackbox regression setelah bugfix sprint 05 | High | 2h | FE-5.1, BE-5.3 | done | docs/qa/sprint-05-qa-tasks | Selesai diuji 13 alur fungsional dengan sukses. Laporan di docs/sprint-05-qa-report.md |
| QA-5.2 | Verifikasi CI 3-job berjalan hijau dan tambah CI badge di README | Medium | 1h | DO-5.1, DO-5.2 | done | docs/qa/sprint-05-qa-tasks | Modul 10: CI badge sukses dipasang di README.md, 3-job CI diverifikasi hijau |
| QA-5.3 | Tulis `docs/testing-guide.md` (cara run test, threshold, troubleshoot) | Medium | 2h | BE-5.4, FE-5.4 | done | docs/qa/sprint-05-qa-tasks | Modul 10: Panduan lengkap dibuat di docs/testing-guide.md |

## Quick Links

- [ACTIVE_SPRINT.md](./ACTIVE_SPRINT.md)
- [../05-roles/backend.md](../05-roles/backend.md)
- [../05-roles/frontend.md](../05-roles/frontend.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../05-roles/qa-docs.md](../05-roles/qa-docs.md)
- [../04-implementation-plan/development-workflow.md](../04-implementation-plan/development-workflow.md)
