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
