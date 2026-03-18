# Environment Setup - Temuin

## Prerequisites

| Tool | Versi Minimum |
|------|---------------|
| Python | 3.12+ |
| Node.js | 20+ |
| Git | 2.40+ |
| Docker Desktop | terbaru |
| PostgreSQL | 15+ atau via Docker |

## Setup Branch Final Project

```bash
git fetch origin --prune
git checkout project/temuin
git pull origin project/temuin
```

## Setup Workspace Yang Direkomendasikan

Gunakan repo utama untuk final project, lalu worktree terpisah untuk practicum.

### 1. Workspace utama = final project

Folder repo utama ini harus dipakai untuk:
- branch `project/temuin`
- semua dokumentasi aktif di `temuin-docs/`
- semua feature branch final project

### 2. Workspace kedua = practicum

Buat worktree untuk branch `master` supaya practicum tidak campur dengan final project.

```bash
git checkout project/temuin
git pull origin project/temuin
git worktree add .worktrees/practicum-master master
```

### 3. Cara pakai harian

- Jika mau kerja final project, tetap di folder repo utama
- Jika mau buka hasil practicum, masuk ke `.worktrees/practicum-master`
- Jangan bolak-balik checkout `master` dan `project/temuin` di folder yang sama

### 4. Layout yang diharapkan

```text
cc-kelompok-a-extraordinary/              -> final project (`project/temuin`)
cc-kelompok-a-extraordinary/.worktrees/
└── practicum-master/                     -> practicum (`master`)
```

## Setup Backend Awal

Sprint 1 akan membuat scaffold backend final project di folder `backend/`.

Target awal:
- `backend/app/`
- `backend/requirements.txt`
- `backend/.env.example`

## Setup Frontend Awal

Sprint 1 akan membuat scaffold frontend final project di folder `frontend/`.

Target awal:
- React + Vite
- Tailwind CSS
- shadcn/ui
- `components.json`

## Aturan Env

- Gunakan `.env.example` untuk template
- Jangan commit `.env` lokal
- Semua config runtime harus lewat env vars

## Dokumen Terkait

- [../03-architecture/frontend-architecture.md](../03-architecture/frontend-architecture.md)
- [../03-architecture/backend-architecture.md](../03-architecture/backend-architecture.md)
- [development-workflow.md](./development-workflow.md)
