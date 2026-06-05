# Sprint 07 - Production Gateway + Observability + Reliability

## Tujuan Sprint

1. Naikkan nginx gateway dari sekadar reverse proxy ke production-grade: rate limiting (DEC-023), correlation ID injection, retry+CB di backend (DEC-021).
2. Tambah observability stack MVP: structured JSON logging, /metrics endpoint, StatusPage UI di frontend (DEC-022).

## Alignment Modul: 13-14

- Modul 13: Microservices — Implementasi & Reliability
- Modul 14: Monitoring, Logging & Observability

## Lead Backend (@disnejy)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| BE-7.1 | Tambah aggregated `/health` endpoint per service: status DB + downstream service | High | 2h | BE-6.4 | done | feature/sprint-07-backend-observability-reliability | Modul 13: health checks granular. Status: healthy / degraded / unhealthy |
| BE-7.2 | Tambah audit_logs handling di engagement-service: emit log saat admin action (claim approve/reject, item status change) | Medium | 3h | BE-6.3 | done | feature/sprint-07-backend-observability-reliability | DEC-008. Audit log dimasukkan ke engagement-service per DEC-019 |
| BE-7.3 | Tambah `services/shared/logging_config.py` + `logging_middleware.py` (DEC-022) | High | 3h | BE-7.1 | done | feature/sprint-07-backend-observability-reliability | Modul 14: structured JSON logging. Field: timestamp ISO UTC, level, service, correlation_id, method, path, status, duration_ms. Copy ke 3 service |
| BE-7.4 | Implementasi retry pattern (3x exponential 0.5/1/2s) di `httpx_client.py` (DEC-021) | High | 3h | BE-6.5 | done | feature/sprint-07-backend-observability-reliability | Modul 13: retry untuk jalur `engagement → item-service`. Retryable: 500/502/503/504/timeout/connection error. Non-retryable: 400/401/403/404 |
| BE-7.5 | Implementasi circuit breaker in-memory di `httpx_client.py` (DEC-021) | High | 3h | BE-7.4 | done | feature/sprint-07-backend-observability-reliability | Modul 13: state CLOSED → OPEN setelah 5 failure dalam 30s, cooldown 60s sebelum HALF_OPEN |
| BE-7.6 | Tambah `/metrics` endpoint per service: Prometheus text format (DEC-022) | Medium | 3h | BE-7.3 | done | feature/sprint-07-backend-observability-reliability | Modul 14: counter request_total, histogram request_duration_seconds, counter error_total. Tidak deploy Prometheus |
| BE-7.7 | Tambah graceful degradation: bila `item-service` down, listing claims tetap respond tanpa info item enrichment (DEC-021) | Medium | 2h | BE-7.5 | done | feature/sprint-07-backend-observability-reliability | Modul 13: graceful degradation pattern |
| BE-7.8 | Tambah endpoint `GET /api/status` aggregator: JSON status 3 service untuk StatusPage | Medium | 2h | BE-7.1, BE-7.6 | done | feature/sprint-07-backend-observability-reliability | Modul 14: response `{"services":[{"name":"auth","status":"up","latency_ms":12}, ...]}` |

## Lead Frontend (@nicholasmnrng)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| FE-7.1 | Pastikan frontend forward via gateway path (sudah dari Sprint 6, verify kembali) | High | 1h | DO-7.2, BE-7.1 | todo | - | Verifikasi tidak ada hardcoded port service backend |
| FE-7.2 | Tambah error boundary + banner shadcn `<Alert variant="destructive">` dengan Retry saat 503 | Medium | 2h | FE-7.1 | todo | - | Modul 13: graceful degradation UI |
| FE-7.3 | Tambah feedback status untuk admin (loading state, success toast, error banner) | Medium | 2h | FE-7.2, BE-7.2 | todo | - | Konsistensi UX area admin |
| FE-7.4 | Buat `StatusPage.jsx` dengan shadcn `<Card>` + `<Badge>` (success/destructive) + `<Skeleton>` (DEC-022) | Medium | 4h | BE-7.8, FE-7.2 | todo | - | Modul 14: route `/status`, polling 30 detik, public no-auth, source data `GET /api/status`. Accessibility: `role="status"`, `aria-label` per badge, target Lighthouse a11y ≥90 |
| FE-7.5 | Update axios interceptor: log header `X-Correlation-ID` ke console saat 5xx error | Low | 1h | FE-7.4 | todo | - | Modul 14: debugging trace |

## Lead DevOps (@PangeranSilaen)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| DO-7.1 | Tambah container `temuin-gateway` Nginx production-grade (DEC-022, DEC-023) | High | 3h | DO-6.3 | todo | - | Modul 13: container nginx:alpine. `gateway/nginx.conf` dengan upstream block 3 service |
| DO-7.2 | Routing nginx: 3 service + path stripping + proxy_next_upstream | High | 3h | DO-7.1, BE-6.4 | todo | - | Routing per `devops-architecture.md` section "Nginx Gateway Production" |
| DO-7.3 | Healthcheck Docker Compose (interval 10s, retries 3) + restart policy `unless-stopped` 3 service | Medium | 2h | DO-7.2, BE-7.1 | todo | - | Modul 13: restart policies, resource limits memory 200M per service |
| DO-7.4 | Tulis `scripts/logs.sh` helper: `all`, `errors`, `trace <id>`, `metrics` subcommand | Medium | 2h | DO-7.3, BE-7.3 | todo | - | Modul 14: helper untuk debug correlation ID dan metrics |
| DO-7.5 | Setup logging driver json-file max-size 10m max-file 3 di compose (DEC-022) | Medium | 2h | DO-7.3, BE-7.3 | todo | - | Modul 14: log rotation. Service tag per container |
| DO-7.6 | Correlation ID forwarding nginx: generate UUID 12 char bila tidak ada, forward ke upstream (DEC-022) | High | 2h | DO-7.2, BE-7.3 | todo | - | Modul 14: `proxy_set_header X-Correlation-ID $request_id`. Log di access log |
| DO-7.7 | Rate limiting nginx zone `auth_zone` 5r/s burst 10 + `general_zone` 30r/s burst 50 (DEC-023) | High | 2h | DO-7.2 | todo | - | Modul 13: response 429 dengan body JSON `{"detail":"Too many requests"}` |
| DO-7.8 | Integration test job di CI: spin compose microservices + run `scripts/integration-test.sh` (DEC-020) | Medium | 3h | DO-6.3 | todo | - | Modul 13: trigger hanya untuk PR ke master. Smoke test 3 health endpoint + 1 login flow + 1 claim flow |
| DO-7.9 | Deploy update gateway+observability ke Tencent VPS, verifikasi `https://temuin.pangeransilaen.net/api/status` | Medium | 2h | DO-7.7, BE-7.8 | todo | - | Modul 11+14: production deploy update |

## Lead QA & Docs (@raniayudewi)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| QA-7.1 | Blackbox routing via gateway untuk flow utama: register, login, create item, claim, approve | High | 2h | FE-7.1, DO-7.2 | todo | - | Pastikan semua endpoint accessible via `https://temuin.pangeransilaen.net/api/*` |
| QA-7.2 | Blackbox: matikan tiap service satu-satu, verifikasi StatusPage update ke "down" dalam 30 detik | High | 2h | FE-7.4, DO-7.3 | todo | - | Modul 14: chaos test ringan. Screenshot 3 skenario down |
| QA-7.3 | Blackbox: rate limit `/api/auth/login` benar 429 setelah 5 req/s (DEC-023) | Medium | 1h | DO-7.7 | todo | - | Modul 13: loop 20x curl, expect HTTP 429. Screenshot response 429 |
| QA-7.4 | Verifikasi correlation ID end-to-end: trigger 1 request, ambil header dari devtools, grep di 3 log container | Medium | 2h | FE-7.5, DO-7.6 | todo | - | Modul 14: request tracing. Screenshot devtools + grep output |
| QA-7.5 | Tulis `docs/operations-guide.md`: cara baca log JSON, cek `/metrics`, restart service, investigasi correlation_id | Medium | 2h | QA-7.4, DO-7.4 | todo | - | Modul 14: ops handbook |
| QA-7.6 | Update `temuin-docs/03-architecture/devops-architecture.md` jika ada deviasi dari implementasi | Low | 1h | DO-7.9 | todo | - | Pastikan sinkron |

## Quick Links

- [ACTIVE_SPRINT.md](./ACTIVE_SPRINT.md)
- [../05-roles/backend.md](../05-roles/backend.md)
- [../05-roles/frontend.md](../05-roles/frontend.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../05-roles/qa-docs.md](../05-roles/qa-docs.md)
- [../04-implementation-plan/development-workflow.md](../04-implementation-plan/development-workflow.md)
- [../01-concept/decision-log.md](../01-concept/decision-log.md) (DEC-021, DEC-022, DEC-023)
