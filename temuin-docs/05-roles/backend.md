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
- Unit test backend (pytest, min 12 tests) — sprint 05
- Inter-service communication (auth_client.py, shared JWT) — sprint 06
- Retry dan circuit breaker patterns — sprint 07
- Metrics endpoint (/metrics) — sprint 07
- Security hardening dan code cleanup — sprint 08

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
