# Role Guide - Lead Backend (@disnejy)

## Fokus Tanggung Jawab

- Bangun API FastAPI dan business rules
- Desain schema, models, dan service layer
- Jaga konsistensi status item dan claim
- Siapkan backend monolith lalu pecah ke microservices pada sprint lanjut

## Output Yang Diharapkan

- Struktur backend modular
- Endpoint auth, items, claims, master data, notifications
- History dan audit log berjalan
- Unit test backend (pytest, min 12 tests) dengan coverage ≥60% (DEC-020) — sprint 05
- Conftest.py dengan fixture reusable (`client`, `db_session`, `auth_user`) — sprint 05
- Pisah monolith jadi 3 service hybrid: `auth-service` + `item-service` + `engagement-service` (DEC-019) — sprint 06
- Shared JWT verification helper (DEC-017), `httpx_client.py` untuk inter-service call — sprint 06
- Retry 3x exponential backoff (0.5/1/2s) + circuit breaker (5 fail/30s, cooldown 60s) di `httpx_client.py` (DEC-021) — sprint 07
- Structured JSON logging + correlation ID propagation (DEC-022) — sprint 07
- `/metrics` endpoint Prometheus text format + `/api/status` aggregator (DEC-022) — sprint 07
- Graceful degradation untuk jalur `engagement → item` (DEC-021) — sprint 07
- Security hardening: Pydantic field_validator, security headers middleware, secret audit (DEC-023) — sprint 08
- Code cleanup (no print, no dead code, no TODO) — sprint 08

## Prioritas Kerja

1. Ikuti `decision-log.md`
2. Bangun monolith yang stabil dulu
3. Jangan split microservices terlalu cepat
4. Jaga kontrak API agar frontend dan QA bisa ikut jalan
5. Pastikan tests passing sebelum push (mulai sprint 05)

## Bacaan Kunci

- `temuin-docs/03-architecture/backend-architecture.md`
- `temuin-docs/03-architecture/database-design.md`
- `temuin-docs/03-architecture/devops-architecture.md`
- `temuin-docs/02-prd/prd-user-flows.md`
- `temuin-docs/06-sprints/ACTIVE_SPRINT.md`
