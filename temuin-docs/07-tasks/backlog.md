# Backlog Reference - Temuin

Dokumen ini adalah referensi lintas sprint. Status hidup tetap dikelola di file sprint, bukan di backlog ini.

## Ringkasan Per Sprint

| Sprint | Periode | Modul | Fokus Utama | Output Minimum |
|-------|---------|-------|-------------|----------------|
| 01 | Minggu 1-2 | 1-4 | Fresh start scaffold | Backend dan frontend foundation hidup |
| 02 | Minggu 3-4 | 4-5 | Auth dan item flow | Login, list item, detail, create item |
| 03 | Minggu 5-6 | 5-7 | Claim dan fitur inti, Docker | Claim, search/filter, notifications, monolith dockerized |
| 04 | Minggu 7-8 | 7-9 | Docker dan UTS | Flow inti jalan di Docker Compose |
| 05 | Minggu 13 (active) | 9-10 | CI 3-job dan tests dengan threshold | CI lint+backend-test+frontend-test, cov 60%/40% |
| 06 | Minggu 14 | 11-12 | Deploy ke VPS dan microservices hybrid 3-service | App live di `temuin.pangeransilaen.net`, split 3 service |
| 07 | Minggu 15 | 13-14 | Gateway production, retry+CB, observability, StatusPage | Gateway rate limit + correlation ID, /metrics, StatusPage shadcn |
| 08 | Minggu 16 (UAS) | 15 | Security hardening dan final | Final regression 20 skenario, image non-root, release v1.0.0 |

## Backlog Inti Per Area

### Backend
- Auth dan JWT internal
- Item CRUD dan business rules
- Claim flow
- Master data
- Notifications
- Audit log
- Microservices split hybrid 3-service (Sprint 6, DEC-019)
- Reliability: retry, circuit breaker, graceful degradation (Sprint 7, DEC-021)
- Observability: structured logging, correlation ID, /metrics, /api/status (Sprint 7, DEC-022)
- Security hardening: Pydantic field_validator, security headers, secret audit (Sprint 8, DEC-023)

### Frontend
- Scaffold React + Tailwind + shadcn/ui
- Auth pages dan protected routes
- Item pages
- Claim pages
- Admin pages
- Vitest + tests dengan coverage ≥40% (Sprint 5, DEC-020)
- StatusPage shadcn polling 30s (Sprint 7, DEC-022)
- Error handling 503 dengan banner Alert (Sprint 7)
- Final polish dan accessibility audit Lighthouse (Sprint 8)

### DevOps
- Env templates
- Dockerfiles dan compose
- CI 3-job dengan threshold (Sprint 5, DEC-020)
- Deploy ke Tencent VPS (Sprint 6, DEC-018)
- `docker-compose.microservices.yml` 3-service shared Postgres multi-DB
- CD pipeline trigger push master
- Gateway nginx production-grade (rate limiting, correlation ID, retry)
- Observability: log driver json-file 10m × 3, /metrics route forward
- Security hardening: image non-root, security headers, secret audit

### QA & Docs
- Blackbox checks per sprint
- Screenshot bukti
- Regression checks
- `docs/testing-guide.md` (Sprint 5)
- `docs/deployment-guide.md` (Sprint 6)
- `docs/operations-guide.md` (Sprint 7)
- `docs/api-contract.md`, `docs/final-checklist.md`, README final (Sprint 8)
- Update dokumen aktif `temuin-docs/` bila flow berubah
