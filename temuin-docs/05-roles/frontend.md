# Role Guide - Lead Frontend (@nicholasmnrng)

## Fokus Tanggung Jawab

- Bangun UI dan flow user dengan React + Vite
- Gunakan Tailwind CSS dan shadcn/ui sebagai basis komponen
- Integrasi auth (email+password) dan API backend
- Jaga UX tetap sederhana, responsif, dan mudah diuji

## Output Yang Diharapkan

- Scaffold frontend dengan Tailwind dan shadcn/ui
- Halaman auth, item, claim, profile, notifications, dan admin
- State auth yang stabil
- Komponen status, feedback, dan form yang konsisten
- Frontend tests (Vitest, min 7 tests) — sprint 05
- Health dashboard / status page — sprint 07
- Code cleanup dan final polish — sprint 08

## Aturan Wajib Frontend

- Gunakan JavaScript / JSX
- Gunakan shadcn/ui untuk komponen inti
- Jika komponen UI belum ada, utamakan pola atau CLI shadcn/ui sebelum membuat komponen custom
- Jangan bikin design system custom besar sendiri
- Base URL API harus lewat env vars
- Pastikan build stabil sebelum push (mulai sprint 05)

## Bacaan Kunci

- `temuin-docs/03-architecture/frontend-architecture.md`
- `temuin-docs/03-architecture/backend-architecture.md`
- `temuin-docs/03-architecture/devops-architecture.md`
- `temuin-docs/02-prd/prd-user-flows.md`
- `temuin-docs/06-sprints/ACTIVE_SPRINT.md`
