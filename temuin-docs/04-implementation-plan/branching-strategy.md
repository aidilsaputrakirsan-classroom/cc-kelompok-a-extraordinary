# Branching Strategy - Temuin

## Branch Inti

| Branch | Fungsi |
|-------|--------|
| `master` | Base branch final project |

## Aturan Dasar

- Semua feature branch dibuat dari `master`
- Jangan commit langsung ke `master` (branch protection aktif)
- PR ke `master` wajib dengan minimal 1 approval
- Merge strategy: squash and merge
- Status task `done` berarti sudah di-commit dan di-push ke remote

## Branch Protection

Branch `master` dilindungi dengan ruleset:
- Require pull request (1 approval)
- Block force pushes
- Restrict deletions

Status checks (CI) akan ditambahkan setelah GitHub Actions aktif (sprint 05).

## CODEOWNERS

File `.github/CODEOWNERS` mengatur automatic reviewer assignment:
- `/backend/` → @disnejy
- `/frontend/` → @nicholasmnrng
- Docker/infra files → @PangeranSilaen
- `/docs/` → @raniayudewi

## Format Nama Branch

```text
<tipe>/<role>/<deskripsi-singkat>
```

### Tipe

| Tipe | Contoh |
|------|--------|
| `feat` | `feat/frontend/login-page` |
| `fix` | `fix/backend/claim-validation` |
| `chore` | `chore/devops/docker-compose` |
| `docs` | `docs/qa/sprint-02-blackbox` |
| `refactor` | `refactor/backend/split-services` |
| `ci` | `ci/devops/github-actions` |

### Role

| Role | Kode |
|------|------|
| Lead Backend | `backend` |
| Lead Frontend | `frontend` |
| Lead DevOps | `devops` |
| Lead QA & Docs | `qa` |

## Dokumen Terkait

- [development-workflow.md](./development-workflow.md)
- [commit-convention.md](./commit-convention.md)
