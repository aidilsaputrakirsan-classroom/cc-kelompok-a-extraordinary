# Glossary - Temuin

## Istilah Produk

| Istilah | Definisi |
|--------|----------|
| Item | Entitas laporan barang hilang atau temuan |
| Item Type | Jenis item: `lost` atau `found` |
| Item Status | Status aktif item: `open`, `in_claim`, `returned`, `closed` |
| Claim | Permohonan kepemilikan atas item `found` |
| Claim Status | Status claim: `pending`, `approved`, `rejected`, `completed`, `cancelled` |
| Security Officer | Satpam atau petugas penerima titipan barang temuan |
| Master Data | Data referensi seperti kategori, gedung, lokasi, dan satpam |
| Audit Log | Catatan aksi penting admin atau superadmin |
| History | Riwayat perubahan status item atau claim |
| Image Data | Data gambar item disimpan sebagai base64 di PostgreSQL (DEC-016) |

## Istilah Teknis

| Istilah | Definisi |
|--------|----------|
| Base Branch | Branch integrasi utama project final, yaitu `master` |
| Feature Branch | Branch kerja per task, dibuat dari `master` |
| Source of Truth | Dokumen aktif yang menjadi acuan utama implementasi |
| Active Sprint | Sprint yang menjadi prioritas auto-selection agent saat ini |
| Branch/Ref | Nama branch remote tempat task terakhir didorong |
| shadcn/ui | Sistem komponen UI yang wajib dipakai pada frontend |

## Istilah Cloud Dan Microservices

| Istilah | Definisi |
|--------|----------|
| API Gateway | Nginx container di depan service backend, menangani routing, rate limiting, dan correlation ID |
| Microservice | Service backend independen dengan database sendiri dan deployment terpisah |
| Bounded Context | Batas domain bisnis yang membatasi tanggung jawab satu service (misalnya engagement = claim + notif + audit) |
| Logical Database | Database terpisah secara skema di dalam satu Postgres instance shared (`auth_db`, `item_db`, `engagement_db`) |
| Shared JWT Secret | Secret JWT yang di-share via env var antar service untuk verifikasi token tanpa call HTTP (DEC-017) |
| Reverse Proxy | Server perantara yang meneruskan request user ke service belakang (host nginx atau gateway container) |
| 2-Layer Nginx | Pola di Tencent VPS: nginx host (SSL + domain routing) di depan nginx container (frontend + API forward) |

## Istilah Reliability

| Istilah | Definisi |
|--------|----------|
| Retry Backoff | Mekanisme retry HTTP call dengan jeda yang naik (0.5s, 1s, 2s) bila terjadi error sementara |
| Circuit Breaker | Pola untuk menghentikan call ke service yang terus gagal (state CLOSED, OPEN, HALF_OPEN) |
| Graceful Degradation | Kondisi sistem tetap merespons walau salah satu dependensi down (DEC-021) |
| Healthcheck | Endpoint `/health` per service yang dipanggil Docker untuk menentukan status container |

## Istilah Observability

| Istilah | Definisi |
|--------|----------|
| Correlation ID | UUID 12 karakter yang menempel pada satu request lintas service via header `X-Correlation-ID` |
| Structured Logging | Log dalam format JSON satu baris per event, mudah di-query (timestamp, level, service, correlation_id, dst) |
| Metrics Endpoint | Endpoint `/metrics` di setiap service yang return counter dan histogram dalam format Prometheus text |
| StatusPage | Halaman frontend di route `/status` yang menampilkan kesehatan tiap service, polling 30 detik |

## Istilah CI/CD Dan Security

| Istilah | Definisi |
|--------|----------|
| Branch Protection | Aturan GitHub yang melarang push langsung ke master dan mewajibkan status check + approval |
| Coverage Threshold | Persentase minimum test coverage yang harus dicapai agar CI hijau (backend 60%, frontend 40%) |
| Integration Test | Test yang menjalankan beberapa service bersama (compose `up`) lalu memanggil endpoint nyata |
| Rate Limiting | Pembatasan jumlah request per detik per IP di nginx gateway untuk mitigasi brute force |

## Catatan Bahasa

- Gunakan istilah di tabel ini secara konsisten
- UI dan dokumentasi kerja tim menggunakan Bahasa Indonesia
- Istilah teknis umum seperti branch, commit, push, dan sprint tetap boleh dipakai
