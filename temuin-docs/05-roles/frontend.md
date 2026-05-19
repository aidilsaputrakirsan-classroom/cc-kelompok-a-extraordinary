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
- Frontend tests (Vitest, min 7 tests) dengan coverage ≥40% (DEC-020) — sprint 05
- Adaptasi base URL via `VITE_API_BASE_URL`, semua path API prefix `/api/*` — sprint 06
- Toast Sonner saat 503/timeout cross-service — sprint 06
- Error boundary + banner shadcn `<Alert variant="destructive">` dengan Retry saat 503 — sprint 07
- StatusPage shadcn (`<Card>` + `<Badge>` + `<Skeleton>`) di route `/status` polling 30s (DEC-022) — sprint 07
- Axios interceptor log `X-Correlation-ID` — sprint 07
- Lighthouse audit production (performance ≥80, a11y ≥90, best practices ≥90) — sprint 08
- XSS audit + code cleanup (no console.log, no dead component) — sprint 08

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
