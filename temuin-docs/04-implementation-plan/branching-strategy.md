# Branching Strategy - Temuin

## Branch Inti

| Branch | Fungsi |
|-------|--------|
| `master` | Base branch final project |

## Aturan Dasar

- Semua feature branch dibuat dari `master`
- Jangan commit langsung ke `master`
- PR ke `master` direkomendasikan, tetapi status task `done` tidak bergantung pada PR merge

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
