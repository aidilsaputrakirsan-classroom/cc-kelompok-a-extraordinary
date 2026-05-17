# System Architecture - Temuin

## Arsitektur Bertahap

Temuin dibangun bertahap mengikuti modul mata kuliah:

| Sprint | Bentuk Sistem | Modul |
|-------|----------------|-------|
| 1-4 | Monolith: satu backend FastAPI, satu database, satu frontend React | Modul 1-9 (intro CC, virtualization, Linux, Docker, Compose) |
| 5 | Monolith + git workflow (branch protection, CODEOWNERS, Makefile) + CI dasar (lint, backend test, frontend test) | Modul 9-10 |
| 6 | Deploy ke cloud (Tencent VPS) + split monolith jadi 3 service hybrid (`auth-service`, `item-service`, `engagement-service`) di belakang gateway | Modul 11-12 |
| 7 | Production gateway (rate limiting, correlation ID, retry, circuit breaker) + observability (structured JSON log, /metrics, StatusPage) | Modul 13-14 |
| 8 | Security hardening (image non-root, secrets audit, security headers) + final UAS (release v1.0.0, demo backup) | Modul 15 |

## High-Level Architecture (Sprint 1-5: Monolith)

```text
[Browser]
   |
   v
[Frontend React + shadcn/ui]
   |
   v
[Backend FastAPI (monolith)]
   |
   v
[PostgreSQL]
```

## Arsitektur Microservices (Sprint 6+, hybrid 3-service)

Mengikuti DEC-019 (3-service granularity) dan DEC-018 (Tencent VPS primary):

```text
[Browser]
   |
   | https://temuin.pangeransilaen.net
   v
[Cloudflare DNS]
   |
   v
[Tencent VPS 43.156.15.248]
   |
   |  port 443 (TLS via Let's Encrypt)
   v
[Nginx HOST] (reverse proxy + SSL termination)
   |
   |  domain temuin.pangeransilaen.net -> 127.0.0.1:8080
   v
[Nginx Gateway Container] (port 8080 internal)
   |
   |  /api/auth/*       -> auth-service:8001
   |  /api/items/*      -> item-service:8002
   |  /api/categories/* -> item-service:8002
   |  /api/buildings/*  -> item-service:8002
   |  /api/locations/*  -> item-service:8002
   |  /api/security-officers/* -> item-service:8002
   |  /api/claims/*         -> engagement-service:8003
   |  /api/notifications/*  -> engagement-service:8003
   |  /api/audit-logs/*     -> engagement-service:8003
   |  /api/status (aggregator)
   |  /                 -> frontend container (nginx + React static)
   |
   v
[auth-service]   [item-service]   [engagement-service]
       \             |    ^                  |
        \            |    |  retry+CB        |
         \           |    +------------------+
          v          v                       v
       [auth_db]  [item_db]            [engagement_db]
        (1 Postgres instance, 3 logical database)
```

Catatan:
- Hanya 1 jalur cross-service runtime: `engagement-service -> item-service` (validasi item exist, ubah status). Inilah jalur yang butuh retry + circuit breaker (DEC-021)
- JWT verification dilakukan lokal di setiap service via shared secret (DEC-017), tidak ada call HTTP untuk auth check
- Nginx HOST tetap melayani service lain di VPS (`9router`, `enowxai`) di domain berbeda, tidak di-touch

## Prinsip Arsitektur

- Fase awal harus stabil dan mudah dipahami tim
- Struktur file mengikuti pola modular dari modul, tapi boleh lebih rapi
- Frontend hanya mengenal satu base URL aktif untuk API (`VITE_API_BASE_URL`)
- Evolusi ke microservices dilakukan setelah monolith stabil
- Logging, health check, dan audit dipasang bertahap, bukan sejak hari pertama
- Cross-service call menggunakan retry + circuit breaker untuk resilience (DEC-021)
- Observability minimum: structured logging JSON + correlation ID + /metrics endpoint (DEC-022)

## Dokumen Terkait

- [backend-architecture.md](./backend-architecture.md)
- [frontend-architecture.md](./frontend-architecture.md)
- [devops-architecture.md](./devops-architecture.md)
- [database-design.md](./database-design.md)
- [../01-concept/decision-log.md](../01-concept/decision-log.md) (DEC-018, DEC-019, DEC-021, DEC-022, DEC-023)
