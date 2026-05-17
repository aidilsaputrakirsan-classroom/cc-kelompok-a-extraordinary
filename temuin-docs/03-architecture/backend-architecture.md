# Backend Architecture - Temuin

## Stack

- Python 3.12+
- FastAPI
- SQLAlchemy
- Pydantic
- PostgreSQL

## Auth Architecture

Temuin memakai **email + password** untuk autentikasi dan **PostgreSQL untuk penyimpanan data internal aplikasi**.

Artinya:
- User mendaftar dan login dengan email kampus (`itk.ac.id`) dan password
- Backend memverifikasi password dengan bcrypt (via `passlib`)
- Backend menyimpan `password_hash` di tabel `users` di PostgreSQL
- Backend mengeluarkan JWT internal aplikasi untuk request selanjutnya

PostgreSQL adalah satu-satunya source of truth untuk data user dan seluruh data domain Temuin.

## Auth Flow Singkat

1. User register via form dengan email `itk.ac.id`, password, dan nama
2. Backend validasi domain email dan password policy
3. Backend hash password dengan bcrypt dan simpan user di PostgreSQL
4. Backend mengembalikan JWT internal ke frontend
5. Untuk login, user kirim email + password
6. Backend verifikasi password terhadap hash di database
7. Backend mengembalikan JWT internal ke frontend
8. Frontend memakai JWT internal untuk semua request API berikutnya

## Struktur Monolith Awal

```text
backend/
└── app/
    ├── main.py
    ├── config.py
    ├── database.py
    ├── dependencies.py
    ├── auth/
    │   ├── router.py
    │   ├── service.py
    │   └── schemas.py
    ├── items/
    │   ├── router.py
    │   ├── service.py
    │   └── schemas.py
    ├── claims/
    │   ├── router.py
    │   ├── service.py
    │   └── schemas.py
    ├── master_data/
    │   ├── router.py
    │   └── service.py
    ├── notifications/
    │   ├── router.py
    │   └── service.py
    ├── models/
    └── utils/
```

## Boundary Per Modul

- `auth` menangani register, login email+password, dan JWT internal
- `items` menangani laporan lost/found dan item status
- `claims` menangani alur klaim
- `master_data` menangani kategori, gedung, lokasi, dan satpam
- `notifications` menangani notifikasi in-app

## Evolusi Ke Microservices

Mengikuti DEC-019 (hybrid 3-service granularity), pada Sprint 6 monolith dipecah jadi 3 service:

| Service | Port | Domain | Tabel di-own | Cross-service call |
|---------|------|--------|--------------|--------------------|
| `auth-service` | 8001 | identity, register, login, JWT issuance, profile | `users` | tidak ada |
| `item-service` | 8002 | items, item images, history, master data references | `items`, `item_images`, `item_status_histories`, `categories`, `buildings`, `locations`, `security_officers` | tidak ada |
| `engagement-service` | 8003 | claim workflow, notifications, audit logs | `claims`, `claim_status_histories`, `notifications`, `audit_logs` | memanggil `item-service` (validasi item, ubah status item) |

Service di-host di 1 instance Postgres shared dengan 3 logical database (`auth_db`, `item_db`, `engagement_db`). Lihat `database-design.md` section "Microservices Split" untuk detail.

JWT verification dilakukan lokal di tiap service pakai shared secret JWT (DEC-017). Tidak ada call HTTP ke `auth-service` untuk verifikasi token.

## Reliability Pattern (Sprint 7, DEC-021)

Untuk jalur cross-service `engagement-service -> item-service`:

- **Retry**: 3x dengan exponential backoff 0.5s, 1s, 2s. Status retryable: 500, 502, 503, 504, connection error, timeout. Non-retryable: 400, 401, 403, 404
- **Circuit Breaker**: state CLOSED → OPEN setelah 5 failure dalam 30 detik, cooldown 60 detik sebelum HALF_OPEN. State disimpan in-memory per process
- **Graceful Degradation**: bila `item-service` down, listing claims tetap return data (tanpa info item enrichment), dan endpoint `/items/public` tersedia untuk read tanpa auth saat circuit OPEN
- **Aggregated Health Check**: endpoint `/health` di tiap service melaporkan status dependency (DB connectivity, downstream service circuit state). Status overall: healthy / degraded / unhealthy

Implementasi: helper `httpx_client.py` shared yang dimport setiap service yang punya outbound call. Tidak butuh library eksternal.

## Observability (Sprint 7, DEC-022)

### Structured Logging
- Format JSON satu baris per event via `JSONFormatter` di `services/shared/logging_config.py`
- Field wajib: `timestamp` (ISO UTC), `level`, `service` (env `SERVICE_NAME`), `correlation_id`, `method`, `path`, `status_code`, `duration_ms`
- Field optional: `user_id`, `exception` (traceback)
- Level via env `LOG_LEVEL=INFO`

### Correlation ID
- Header: `X-Correlation-ID`, format UUID 12 karakter
- Generated di Nginx gateway bila tidak ada di request user
- Forward via middleware `RequestLoggingMiddleware` ke setiap log entry
- Backend service propagate ke outbound HTTP call lewat `httpx_client.py`

### Metrics Endpoint
- Endpoint `GET /metrics` per service, format Prometheus text exposition
- Counter: `request_total{method,path,status}`, `error_total{type}`
- Histogram: `request_duration_seconds{method,path}`
- Tidak deploy Prometheus, hanya format text supaya bisa di-scrape kalau dibutuhkan
- Endpoint `/api/status` aggregator: JSON status 3 service untuk konsumsi StatusPage

## Public Endpoints (no JWT required)

| Endpoint | Service | Tujuan |
|----------|---------|--------|
| `GET /health` | semua | Docker healthcheck |
| `GET /metrics` | semua | Scrape metrics |
| `GET /api/status` | gateway / engagement-service | StatusPage frontend |
| `POST /api/auth/register` | auth-service | Pendaftaran user baru |
| `POST /api/auth/login` | auth-service | Login user |

Semua endpoint lain memerlukan `Authorization: Bearer <jwt>` valid.

## Aturan Backend

- Gunakan env vars untuk seluruh config
- Business rule utama wajib mengikuti `decision-log.md`
- Soft delete untuk item milik user
- History dan audit log tidak dicampur ke tabel utama
- Autentikasi ditangani langsung oleh backend (email+password dengan bcrypt), tanpa dependency eksternal
- Setelah Sprint 6 split, setiap service punya struktur identik (`main.py`, `database.py`, `models.py`, `schemas.py`, `routers/`, `services/`, `Dockerfile`)
- Cross-service call wajib pakai `httpx_client.py` yang sudah include retry + circuit breaker (DEC-021)
- Semua service wajib middleware structured logging + correlation ID (DEC-022)
- Pydantic schema wajib pakai `field_validator` untuk input validation (DEC-023, Sprint 8)

## Dokumen Terkait

- [database-design.md](./database-design.md)
- [../02-prd/prd-user-flows.md](../02-prd/prd-user-flows.md)
- [../05-roles/backend.md](../05-roles/backend.md)
- [../01-concept/decision-log.md](../01-concept/decision-log.md) (DEC-017, DEC-019, DEC-021, DEC-022)
