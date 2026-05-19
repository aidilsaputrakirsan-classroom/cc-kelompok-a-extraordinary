# Decision Log - Temuin

Dokumen ini mencatat keputusan final yang tidak boleh dilanggar tanpa keputusan tim baru.

## Keputusan Produk

### DEC-001: Login wajib
- Sistem hanya dapat diakses setelah login
- Tidak ada mode anonim atau publik

### DEC-002: Login via email kampus
- Login dan register menggunakan email + password biasa
- Hanya email dengan suffix `itk.ac.id` yang boleh mendaftar dan masuk
- Password minimal 8 karakter, harus mengandung huruf dan angka
- User mendaftar via form register, lalu login via form login
- Firebase Auth dihapus karena instabilitas (API key suspension, network error di mobile, intermittent failures)

### DEC-003: Role sistem
- Role aktif adalah `user`, `admin`, dan `superadmin`
- Role `admin` dan `superadmin` hanya bisa diatur secara internal

### DEC-004: Barang temuan wajib dititipkan
- User boleh membuat posting `found` langsung
- Barang temuan wajib dititipkan ke satpam resmi
- Posting `found` wajib memilih `security_officer_id`

### DEC-005: Aturan klaim
- Hanya item `found` yang bisa diklaim
- Satu item hanya boleh punya satu claim aktif
- Jika claim ditolak atau dibatalkan, item boleh diklaim lagi
- Verifikasi claim MVP memakai jawaban deskriptif singkat, bukan upload file

### DEC-006: Status item
- Status item yang valid: `open`, `in_claim`, `returned`, `closed`
- Status `closed` hanya boleh dipakai admin atau superadmin

### DEC-007: Status claim
- Status claim yang valid: `pending`, `approved`, `rejected`, `completed`, `cancelled`
- Status item dan status claim harus dipisahkan

### DEC-008: Audit trail
- Soft delete dipakai untuk posting milik user
- Riwayat perubahan item dan claim disimpan terpisah
- Audit log dipakai untuk aksi penting admin dan superadmin

### DEC-009: Notifikasi MVP
- Notifikasi MVP berbentuk in-app notification berbasis database
- Event inti: claim approved/rejected/completed, posting dimoderasi/ditutup, claim baru untuk admin

### DEC-010: Aturan foto
- Maksimal 4 foto per item
- Maksimal ukuran efektif per foto kurang dari 2 MB
- Resize dan kompresi dilakukan di frontend sebelum upload

## Keputusan Delivery Dan Workflow

### DEC-011: Base branch project final
- Branch integrasi project final adalah `master`
- `praktikum` adalah branch histori practicum

### DEC-012: Status task sprint
- Status yang valid hanya `todo`, `in_progress`, `blocked`, `done`
- `done` berarti perubahan sudah di-commit dan di-push

### DEC-013: Auto-selection agent
- Jika user hanya menyebut role, agent memilih task pertama yang dependency-nya aman di sprint aktif
- Lompatan sprint boleh dilakukan hanya jika sprint aktif tidak punya task aman, dan harus disertai peringatan

### DEC-014: QA disederhanakan
- QA fokus pada blackbox testing, bukti screenshot, dan update dokumentasi seperlunya
- Tidak ada issue tracker formal, bug template formal, atau known issues doc panjang sebagai kewajiban

### DEC-015: Frontend stack wajib
- Frontend final project wajib memakai `React + Vite + Tailwind CSS + shadcn/ui`
- Gunakan JavaScript/JSX agar tetap dekat dengan modul praktikum

### DEC-016: Image storage
- Gambar item disimpan sebagai base64 di kolom `image_data` pada tabel `item_images` di PostgreSQL
- Frontend melakukan resize dan kompresi sebelum upload (sesuai DEC-010)
- Tidak ada external storage (S3, GCS, dsb.) untuk MVP
- Batas per foto tetap kurang dari 2 MB setelah kompresi

### DEC-017: Cross-service token verification
- Saat microservices split (Sprint 6), verifikasi JWT antar service menggunakan shared JWT secret
- Masing-masing service memvalidasi JWT secara lokal tanpa memanggil service lain
- Secret disimpan di env vars, bukan hardcoded

## Keputusan Cloud Dan Infrastruktur

### DEC-018: Cloud platform deployment
- Primary deployment: VPS Tencent Cloud milik @PangeranSilaen di domain `temuin.pangeransilaen.net`
- Spesifikasi: 2 vCPU, 1.9 GB RAM, 40 GB disk, Ubuntu 22.04, Docker 26.x, swap 2 GB
- DNS via Cloudflare A record ke IP VPS, SSL via Let's Encrypt + Certbot
- Arsitektur 2-layer Nginx: host nginx (reverse proxy + SSL termination) → container gateway/frontend
- Direktori deployment: `/opt/temuin/` dengan `docker-compose.yml` production
- Fallback: Render free tier untuk versi monolith bila VPS bermasalah atau dosen meminta cloud-managed PaaS
- Konfirmasi 1× ke dosen apakah VPS dianggap sah sebagai "deploy to cloud" Modul 11 sebelum eksekusi Sprint 6

### DEC-019: Microservices granularity (hybrid 3-service)
- Sprint 6 split monolith jadi 3 service, bukan 5 granular
- `auth-service` (port 8001): identity, register, login, JWT issuance
- `item-service` (port 8002): items, item_images, history, dan master data (categories, buildings, locations, security_officers)
- `engagement-service` (port 8003): claims, claim history, notifications, audit logs
- 1 instance Postgres shared dengan 3 logical database: `auth_db`, `item_db`, `engagement_db`
- Reasoning: 1 BE Lead, timeline 4 sprint sisa, RAM VPS 1.9 GB, hanya 1 jalur cross-service runtime (`engagement → item`) yang fragile

### DEC-020: CI/CD pipeline dan threshold
- 3 job CI paralel di `.github/workflows/ci.yml`: `lint` (ruff backend + eslint frontend), `backend-test` (pytest), `frontend-test` (vitest)
- Backend coverage minimal 60% dengan `pytest --cov-fail-under=60`
- Frontend coverage minimal 40% dengan Vitest threshold di `vitest.config.js`
- Tambahan job `integration-test` di Sprint 7: spin compose 3-service di GH Actions runner, jalankan `scripts/integration-test.sh`
- Job `deploy` di Sprint 6+: trigger hanya untuk push ke master (`if: github.ref == 'refs/heads/master'`)
- Branch protection memerlukan semua status check passing sebelum merge ke master

### DEC-021: Reliability pattern cross-service
- Retry pada cross-service HTTP call: 3x dengan exponential backoff 0.5s, 1s, 2s
- Status code retryable: 500, 502, 503, 504, connection error, timeout
- Status code non-retryable: 400, 401, 403, 404
- Circuit breaker in-memory per service caller: state CLOSED → OPEN setelah 5 failure dalam 30 detik, cooldown 60 detik sebelum HALF_OPEN
- Graceful degradation: bila `item-service` down, listing claims tetap return data (tanpa info item enrichment) atau return cached snapshot
- Berlaku untuk jalur `engagement-service → item-service` (jalur cross-service utama hybrid 3-service)

### DEC-022: Observability stack MVP
- Structured logging JSON via Python `logging` stdlib + `JSONFormatter` custom (timestamp ISO UTC, level, service name, correlation_id, method, path, status_code, duration_ms, optional exception)
- `X-Correlation-ID` header: nginx gateway generate UUID 12 karakter bila tidak ada di request, lalu forward ke upstream
- Backend service forward correlation_id ke outbound HTTP call dan log di setiap response
- Endpoint `/metrics` per service: format Prometheus text exposition (counter request, histogram latency, counter error) tanpa Prometheus deployment
- Endpoint aggregator `/api/status`: JSON status 3 service untuk konsumsi StatusPage frontend
- StatusPage frontend di route `/status`: shadcn `<Card>` + `<Badge>` (variant success/destructive) + `<Skeleton>` saat loading, polling 30 detik
- Tooling tambahan (Prometheus, Grafana, Loki, Jaeger) di luar scope, hanya disebut sebagai referensi

### DEC-023: Rate limiting di gateway
- Nginx zone `auth_zone`: 5 req/s burst 10 untuk `POST /api/auth/login` dan `POST /api/auth/register`
- Nginx zone `general_zone`: 30 req/s burst 50 untuk endpoint lain
- Response 429 bila exceeded dengan body JSON `{"detail":"Too many requests"}`
- Threshold dapat ditune via env var bila perlu sebelum demo UAS

## Dokumen Terkait

- [concept.md](./concept.md)
- [../02-prd/prd-overview.md](../02-prd/prd-overview.md)
- [../03-architecture/frontend-architecture.md](../03-architecture/frontend-architecture.md)
- [../03-architecture/database-design.md](../03-architecture/database-design.md)
