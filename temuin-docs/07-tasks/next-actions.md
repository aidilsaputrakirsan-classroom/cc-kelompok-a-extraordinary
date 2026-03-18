# Next Actions - Temuin

## Untuk Semua Orang

1. Baca root `AGENTS.md`
2. Baca `temuin-docs/00-ai/AI_GUIDE.md`
3. Baca `temuin-docs/06-sprints/ACTIVE_SPRINT.md`
4. Buka sprint aktif dan role guide masing-masing
5. Pilih task ID atau biarkan agent auto-select dari sprint aktif

## Setup Direktori Kerja

Sebelum mulai kerja tim:

1. Pastikan folder repo utama checkout ke `project/temuin`
2. Buat worktree practicum:

```bash
git checkout project/temuin
git pull origin project/temuin
git worktree add .worktrees/practicum-master master
```

3. Pakai folder repo utama untuk final project
4. Pakai `.worktrees/practicum-master` hanya untuk practicum

## Langkah Awal Sprint 01

### Lead Backend (@disnejy)
- Mulai dari `BE-1.1`
- Branch contoh: `feat/backend/app-scaffold`

### Lead Frontend (@nicholasmnrng)
- Mulai dari `FE-1.1`
- Branch contoh: `feat/frontend/vite-tailwind-shadcn`

### Lead DevOps (@PangeranSilaen)
- Mulai dari `DO-1.1`
- Branch contoh: `chore/devops/env-template`

### Lead QA & Docs (@raniayudewi)
- Mulai dari `QA-1.1`
- Branch contoh: `docs/qa/sprint-01-blackbox`

## Reminder

- Base branch selalu `project/temuin`
- Ubah status menjadi `in_progress` sebelum mulai
- Ubah status menjadi `done` hanya setelah commit dan push
- Jangan bolak-balik checkout `master` dan `project/temuin` di folder yang sama
