# Sprint 08 - Security Hardening + UAS Final

## Tujuan Sprint

Tutup celah security yang disinggung Modul 15, finalisasi dokumen, siapkan demo UAS, dan tag release v1.0.0.

## Alignment Modul: 15

- Modul 15: Final Polish — Security, Cleanup & Dokumentasi

## Lead Backend (@disnejy)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| BE-8.1 | Audit Pydantic schema: semua input pakai `field_validator` + length limit + regex email itk.ac.id | High | 3h | BE-7.3 | todo | - | Modul 15: OWASP Top 10 (A03 Injection). Password min 8 char + huruf + angka, name 2..200, title max 200, description max 2000 |
| BE-8.2 | Audit env vars: `JWT_SECRET`, `DATABASE_URL`, secret tidak masuk log atau response | High | 2h | BE-8.1 | todo | - | Modul 15: secret hygiene. `grep JWT_SECRET` di output `docker logs` semua service → 0 hit |
| BE-8.3 | Tutup bug final yang mempengaruhi demo | High | 2h | BE-8.2 | todo | - | - |
| BE-8.4 | Tambah security headers middleware: X-Content-Type-Options, X-Frame-Options, HSTS, CSP minimal | Medium | 2h | BE-8.1 | todo | - | Modul 15: security hardening. Verifikasi via `curl -I https://temuin.pangeransilaen.net` |
| BE-8.5 | Code cleanup: hapus dead code, TODO, print statements; ganti ke `logger` | Medium | 2h | BE-8.3 | todo | - | Modul 15: code quality. `grep -rn "print(" services/` → 0 hit selain debug intended |
| BE-8.6 | Final swagger cleanup + Tutup endpoint internal dari public docs | Medium | 2h | BE-8.5 | todo | - | Modul 15: API documentation finalization |

## Lead Frontend (@nicholasmnrng)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| FE-8.1 | Final UI polish: konsistensi spacing, copy bahasa Indonesia, loading state, empty state semua halaman | Medium | 3h | FE-7.3 | todo | - | Walkthrough screenshot 10 halaman utama |
| FE-8.2 | Pastikan build production stabil + Lighthouse audit (performance ≥80, a11y ≥90, best practices ≥90) | High | 2h | FE-8.1 | todo | - | Modul 15: Lighthouse production. Simpan report screenshot |
| FE-8.3 | Tutup bug final yang mempengaruhi demo | High | 2h | FE-8.2 | todo | - | - |
| FE-8.4 | Audit XSS surface: tidak ada `dangerouslySetInnerHTML` tanpa sanitize. Code cleanup: hapus console.log + dead components | Medium | 2h | FE-8.3 | todo | - | Modul 15: code quality + security |

## Lead DevOps (@PangeranSilaen)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| DO-8.1 | Image hardening: backend Dockerfile pakai `USER appuser` (uid 1000), frontend nginx `--user 101:101` (DEC-018) | High | 2h | DO-7.5 | todo | - | Modul 15: image security |
| DO-8.2 | Audit `.env*` files: pastikan `.env`, `.env.production`, `.env.docker` di `.gitignore`. `git log --all --full-history -- .env*` tidak nemu real secret | High | 2h | DO-8.1 | todo | - | Modul 15: secret leak prevention |
| DO-8.3 | Final deployment ke Tencent VPS dengan tag v1.0.0 + cleanup environment | High | 2h | DO-8.2, BE-8.6 | todo | - | Modul 15: production-ready release. Container running, /api/status all up |
| DO-8.4 | Backup video demo 5 menit (rekam screen seluruh flow utama untuk safety net UAS) | Medium | 2h | DO-8.3 | todo | - | Modul 15: backup demo. Upload ke Google Drive, link di `docs/final-checklist.md` |
| DO-8.5 | Git tag v1.0.0 + buat `docs/release-notes.md` (highlights, migration notes, known limitations) | Medium | 1h | DO-8.3 | todo | - | Modul 15: final release. Push tag ke remote |
| DO-8.6 | Final verification checklist + verify deployment docs sinkron dengan reality | Medium | 1h | DO-8.5 | todo | - | Modul 15: operations guide validation |

## Lead QA & Docs (@raniayudewi)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| QA-8.1 | Full blackbox regression seluruh flow utama: register, login, create lost, create found, claim, approve, completed, notification, profile, admin master data | High | 4h | BE-8.3, FE-8.3, DO-8.3 | todo | - | Modul 15: 20 skenario testing. Checklist + screenshot semua di `image/sprint-08/` |
| QA-8.2 | Tulis `docs/api-contract.md`: ringkasan endpoint per service, request/response sample, JWT requirement, rate limit | Medium | 2h | BE-8.6 | todo | - | Modul 15: professional documentation |
| QA-8.3 | Tulis `docs/final-checklist.md`: pre-demo checklist (VPS up, DB seeded, demo creds, browser cache, video backup ready) | Medium | 1h | QA-8.1, DO-8.4 | todo | - | Modul 15: UAS readiness checklist |
| QA-8.4 | Final verification: semua service jalan via gateway, `/api/status` semua up, demo ready | High | 2h | QA-8.1, DO-8.5 | todo | - | Modul 15: UAS readiness |
| QA-8.5 | Update comprehensive README.md (architecture, tech stack, quick start, API docs, team, live URL) | Medium | 2h | QA-8.2, DO-8.6 | todo | - | Modul 15: README final. CI badge + live URL `https://temuin.pangeransilaen.net` |
| QA-8.6 | Audit konsistensi dokumen aktif `temuin-docs/`: tidak ada stale modul reference, decision log lengkap | Medium | 1h | QA-8.5 | todo | - | Modul 15: docs final consistency |

## Quick Links

- [ACTIVE_SPRINT.md](./ACTIVE_SPRINT.md)
- [../05-roles/backend.md](../05-roles/backend.md)
- [../05-roles/frontend.md](../05-roles/frontend.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../05-roles/qa-docs.md](../05-roles/qa-docs.md)
- [../04-implementation-plan/development-workflow.md](../04-implementation-plan/development-workflow.md)
- [../01-concept/decision-log.md](../01-concept/decision-log.md) (DEC-018, DEC-023)
