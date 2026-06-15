# Bahan Belajar UAS — Role DevOps (Temuin)

> File ini untuk kamu yang pegang **DevOps** (Lead DevOps @PangeranSilaen).
> Kamu sudah paham dasar Docker dan server, jadi di sini kita masuk lebih dalam — tapi tiap command dan flag tetap dijelaskan artinya supaya kamu bisa menjelaskannya sendiri saat viva, bukan sekadar hafal.
>
> Baca `docs/uas/panduan-uas.md` (panduan bersama) dulu sebelum file ini.

---

## 1. DevOps itu ngapain di Temuin?

DevOps = orang yang memastikan aplikasi **bisa dijalankan, dibangun otomatis, dan hidup di server.** Backend & Frontend menulis kode; kamu yang membungkusnya jadi container, menjalankan di server, dan mengotomasi deploy.

Tanggung jawabmu:
1. **Docker & Compose** — membungkus tiap bagian jadi container, menyalakan semua sekaligus.
2. **CI/CD** — pipeline GitHub Actions: otomatis tes saat ada perubahan, otomatis deploy saat merge ke master.
3. **Deploy ke VPS** — menjalankan aplikasi di server Tencent, mengurus domain, HTTPS, gateway.
4. **Gateway, health check, logging** — pintu masuk API, pemantauan kesehatan, log terstruktur.
5. **Branch protection & CODEOWNERS** — menjaga branch master aman, otomatis menetapkan reviewer PR.

---

## 2. Detail server & deployment (hafalkan angka-angkanya)

| Hal | Nilai |
| --- | --- |
| Penyedia | Tencent Cloud VPS |
| IP | `43.156.15.248` |
| Spesifikasi | 2 vCPU, 1.9 GB RAM, 40 GB disk, swap 2 GB |
| OS | Ubuntu 22.04, Docker 26.x |
| Domain | `temuin.pangeransilaen.net` (lewat Cloudflare, A record, mode DNS-only) |
| HTTPS | Let's Encrypt + Certbot, auto-renew via cron, terminate di nginx host (`:443`) |
| Folder deploy | `/opt/temuin/` (`.env` permission 600) |
| Fallback | Render free tier (monolith) kalau VPS bermasalah |

Aturan penting (DEC-018): container hanya bind ke **loopback** (`127.0.0.1:8080`, `127.0.0.1:3000`), **tidak langsung ke internet**. Yang menghadap internet hanya nginx host. Jangan ganggu service lain di VPS itu (`9router`, `enowxai`).

### Topologi 2 lapis nginx (wajib bisa gambar)

```
Internet
  -> Cloudflare DNS (domain -> IP, DNS-only agar Let's Encrypt bisa verifikasi)
  -> VPS 43.156.15.248
       -> Nginx HOST :443   (SSL termination, reverse proxy)   <- lapisan 1
            -> 127.0.0.1:8080 Nginx GATEWAY (container)          <- lapisan 2
                 -> /api/auth/*        -> auth-service:8001
                 -> /api/items/*       -> item-service:8002
                 -> /api/master-data/* -> item-service:8002
                 -> /api/claims/*      -> engagement-service:8003
                 -> /api/notifications/* -> engagement-service:8003
                 -> /api/status        -> engagement-service:8003
                 -> /                  -> frontend:8080
```

- **SSL termination** = tempat HTTPS "dibuka". Nginx host menerima koneksi terenkripsi dari internet, mendekripsinya, lalu meneruskan sebagai HTTP biasa ke gateway di dalam. Sertifikat dari Let's Encrypt.
- **Reverse proxy** = server yang menerima request lalu meneruskannya ke server lain di belakangnya, sambil menyembunyikan struktur dalam.

---

## 3. Docker Compose (file-file NYATA)

Kita punya beberapa file compose. Ingat: **compose = resep untuk menyalakan banyak container sekaligus.**

| File | Untuk apa |
| --- | --- |
| `docker-compose.yml` | Monolith (Sprint 1-5): db + backend + frontend |
| `docker-compose.dev.yml` | Override untuk development (hot-reload) |
| `docker-compose.prod.yml` | Override untuk production (restart always, dll) |
| `infra/docker-compose.microservices.yml` | **Stack production sebenarnya** (Sprint 6+): 6 container |

### Stack microservices (`infra/docker-compose.microservices.yml`) — yang dipakai di VPS

6 service: `db`, `auth-service`, `item-service`, `engagement-service`, `frontend`, `gateway`. Yang penting kamu paham:

| Service | Image | Port (host:container) | Memori |
| --- | --- | --- | --- |
| db | `postgres:16-alpine` | tidak diekspos | 384M |
| auth-service | `pangeransilaen/temuin-auth-service` | `127.0.0.1:8001:8001` | 200M |
| item-service | `pangeransilaen/temuin-item-service` | `127.0.0.1:8002:8002` | 200M |
| engagement-service | `pangeransilaen/temuin-engagement-service` | `127.0.0.1:8003:8003` | 200M |
| frontend | `pangeransilaen/temuin-frontend:prod` | `127.0.0.1:3000:8080` | 96M |
| gateway | `nginx:alpine` | `127.0.0.1:8080:8080` | 64M |

Konsep penting di file ini:
- **`127.0.0.1:8001:8001`** = port mapping `<host-ip>:<host-port>:<container-port>`. Karena diawali `127.0.0.1`, port hanya bisa diakses dari dalam server (loopback), tidak dari internet. Ini sengaja, demi keamanan.
- **Memory limit (`200M` dll)** = batas RAM tiap container. Penting karena total RAM VPS cuma 1.9 GB. Total dijaga di bawah ~1.4 GB.
- **`healthcheck`** = perintah yang Docker jalankan berkala untuk cek container sehat. Contoh untuk service: `python -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/health', timeout=3)"`. Kalau gagal berkali-kali, container ditandai `unhealthy`.
- **`depends_on` + `condition: service_healthy`** = container ini baru nyala setelah container yang dibutuhkan sehat. Contoh: service nunggu `db` sehat dulu.
- **Volume `temuin_pgdata`** = penyimpanan permanen data PostgreSQL. Ditandai **`external: true`**, artinya volume harus sudah dibuat duluan (`docker volume create temuin_pgdata`), tidak dibuat otomatis oleh compose. Ini supaya data lama (dari era monolith) tetap kepakai.
- **Logging** (DEC-022): pakai driver `json-file` dengan `max-size: 10m` dan `max-file: 3`. Artinya tiap container simpan log maksimal 3 file x 10 MB, lalu yang lama dibuang otomatis (biar disk tidak penuh).
- **Gateway pakai bind mount**: `../gateway/nginx.conf:/etc/nginx/conf.d/default.conf:ro`. Tanda `:ro` = read-only (container tidak boleh mengubah file itu).

> **Gotcha penting (sering jadi pertanyaan/jebakan):** karena config gateway cuma di-bind-mount ke image `nginx:alpine` standar, `docker compose up -d` TIDAK otomatis memuat ulang nginx saat isi file `nginx.conf` berubah (definisi service-nya tidak berubah). Makanya saat deploy harus eksplisit jalankan `docker exec temuin-gateway nginx -s reload`.

---

## 4. Dockerfile (multi-stage build) — wajib paham konsepnya

Tiap service Python pakai **multi-stage build**. Artinya Dockerfile punya 2 tahap: tahap "builder" untuk memasang dependency, tahap "production" yang ramping untuk dijalankan.

```
# Tahap 1: builder
FROM python:3.12-alpine AS builder
RUN apk add --no-cache gcc musl-dev libffi-dev postgresql-dev   # alat untuk compile dependency
RUN python -m venv /opt/venv                                     # bikin virtual environment
RUN pip install --no-cache-dir -r requirements.txt              # pasang library

# Tahap 2: production (ramping)
FROM python:3.12-alpine
RUN apk add --no-cache libpq postgresql-client                  # cuma yang dibutuhkan saat jalan
COPY --from=builder /opt/venv /opt/venv                          # ambil hasil dari tahap 1
RUN adduser -D -u 1000 appuser                                   # bikin user non-root
USER appuser                                                     # jalankan sebagai non-root
EXPOSE 8001
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 CMD ...
ENTRYPOINT ["/app/entrypoint.sh"]
```

Arti tiap bagian:
- **`FROM python:3.12-alpine`** = pakai image dasar Python versi alpine (alpine = Linux super kecil, hemat ukuran).
- **`AS builder`** = beri nama tahap ini "builder" supaya bisa diambil hasilnya nanti.
- **`apk add --no-cache ...`** = pasang paket sistem; `--no-cache` artinya tidak menyimpan cache index paket (biar image lebih kecil).
- **Kenapa multi-stage?** Alat compile (gcc, dll) cuma dibutuhkan saat memasang library, tidak saat aplikasi jalan. Dengan 2 tahap, image akhir tidak membawa alat berat itu -> lebih kecil & aman.
- **`adduser -D -u 1000 appuser` + `USER appuser`** = bikin dan pakai user biasa (uid 1000), BUKAN root. Ini hardening Sprint 8 (DEC-018/DO-8.1): kalau container dibobol, penyerang tidak langsung dapat akses root.
- **`EXPOSE 8001`** = menandai port yang dipakai container (dokumentasi, tidak otomatis membuka).
- **`HEALTHCHECK`** = cara Docker cek kesehatan. `--start-period=40s` = beri waktu 40 detik untuk aplikasi nyala sebelum mulai dicek.
- **`ENTRYPOINT`** = perintah yang dijalankan saat container start (di sini `entrypoint.sh` yang menunggu database siap lalu menjalankan uvicorn).

**Frontend Dockerfile** beda sedikit: tahap 1 pakai `node:20-alpine` untuk `npm run build`, tahap 2 pakai `nginxinc/nginx-unprivileged:alpine` (nginx yang jalan sebagai user non-root uid 101, listen di port 8080).

---

## 5. Makefile (shortcut perintah)

`Makefile` = kumpulan shortcut. Daripada ketik perintah panjang, cukup `make <target>`. Target penting:

| Perintah | Yang dijalankan | Gunanya |
| --- | --- | --- |
| `make up` | `docker compose up -d` | Nyalakan semua container di latar belakang (`-d` = detached) |
| `make down` | `docker compose down` | Matikan & hapus container |
| `make logs` | `docker compose logs -f` | Lihat log mengalir (`-f` = follow) |
| `make lint` | ruff (backend) + eslint (frontend) | Cek gaya kode |
| `make test-backend` | `pytest /app/tests -v` di container | Tes backend |
| `make ci-local` | lint + test | Tiru CI di laptop sebelum push |
| `make up-micro` | up stack microservices | Nyalakan 3 service + gateway |
| `make stats-micro` | `docker stats ...` | Lihat pemakaian RAM/CPU tiap container |

Untuk stack microservices, ada juga script `scripts/temuin.sh` (start/stop/restart/status/logs/seed/make-admin). Contoh berguna: `./scripts/temuin.sh make-admin <email>` mengubah role user jadi admin lewat `psql`.

---

## 6. Gateway Nginx (`gateway/nginx.conf`) — jantung Sprint 7

Gateway adalah container `nginx:alpine` yang jadi satu pintu masuk semua API. Konfigurasinya menerapkan beberapa fitur penting:

**Rate limit (DEC-023)** — batas jumlah request per detik per IP:
```
limit_req_zone $binary_remote_addr zone=auth_zone:10m rate=5r/s;
limit_req_zone $binary_remote_addr zone=general_zone:10m rate=30r/s;
```
- `auth_zone` = 5 request/detik (ketat) untuk login & register, supaya tidak ada brute-force.
- `general_zone` = 30 request/detik untuk endpoint biasa.
- `burst=10`/`burst=50` = boleh sedikit melonjak sesaat (antrian) sebelum ditolak.
- Kalau lewat batas -> balas **HTTP 429** dengan JSON `{"detail":"Too many requests"}`.

**Correlation ID (DEC-022)** — tiap request dikasih nomor unik:
- Pakai header `X-Correlation-ID` dari klien kalau ada, kalau tidak pakai `$request_id` bawaan nginx, lalu dipotong jadi 12 karakter.
- Diteruskan ke service lewat header `X-Correlation-ID`, dan dikembalikan ke klien. Gunanya melacak satu request lintas semua service di log.

**Retry / failover** — `proxy_next_upstream error timeout http_502 http_503 http_504;` artinya kalau service tujuan error/timeout, nginx otomatis coba teruskan ke upstream lain (kalau ada).

**Routing dengan rewrite** — contoh: `/api/auth/login` diteruskan ke `auth_upstream/auth/login`. Perhatikan prefix `/api` dibuang saat diteruskan ke service (service-nya sendiri pakai prefix `/auth`, bukan `/api/auth`).

**Log JSON terstruktur** — `log_format gateway escape=json` mencatat tiap request dalam format JSON: waktu, method, path, status, `duration_ms`, upstream, `correlation_id`. Memudahkan analisis log.

---

## 7. CI/CD — GitHub Actions (bobot UAS 15%)

Ada 2 file workflow di `.github/workflows/`.

### `ci.yml` (CI — jalan tiap push & PR ke master)

CI = Continuous Integration: tiap ada perubahan, otomatis dicek. Ada **5 job**:

1. **lint** — cek gaya kode: `ruff check` untuk backend & services, eslint untuk frontend.
2. **backend-test** — jalankan pytest monolith dengan database `postgres:16-alpine` sementara (service container). Target coverage `--cov-fail-under=60`.
3. **frontend-test** — jalankan vitest + `npm run build` (pastikan bisa di-build).
4. **services-tests** — pakai **matrix** `[auth-service, item-service, engagement-service]`: tiap service dites pytest sendiri. (Matrix = jalankan job yang sama untuk beberapa nilai berbeda secara paralel.)
5. **integration-test** — hanya saat PR: nyalakan stack microservices + gateway, lalu jalankan `scripts/integration-test.sh` ke `http://localhost:8080` (cek health, status, register-login, klaim).

Istilah: **job** = satu tugas terpisah; **step** = langkah dalam job; **service container** = container bantuan (misal database) yang nyala selama job.

### `cd.yml` (CD — jalan tiap push ke master)

CD = Continuous Deployment: otomatis deploy. Ada **2 job**:

1. **build-and-push** — pakai matrix 4 image (3 service + frontend): `docker build` lalu `docker push` ke Docker Hub. Pakai login `docker/login-action` dengan secret `DOCKER_HUB_USERNAME` & `DOCKER_HUB_TOKEN`. Pakai cache registry biar build cepat.
2. **deploy** (`needs: build-and-push`, jalan setelah build sukses):
   - Setup SSH: tulis `secrets.TENCENT_VPS_SSH_KEY` ke `~/.ssh/id_ed25519` (chmod 600), `ssh-keyscan` host.
   - `scp` file config (`infra/docker-compose.microservices.yml`, `gateway/nginx.conf`, `infra/postgres-init/*`) ke `/opt/temuin/`.
   - Di server: `docker compose -p temuin -f infra/docker-compose.microservices.yml pull` lalu `up -d` (tarik image baru, nyalakan ulang).
   - `docker exec temuin-gateway nginx -t && nginx -s reload` (validasi config gateway lalu reload — ingat gotcha bind mount tadi).
   - Health check: curl `https://temuin.pangeransilaen.net/api/{auth,items,engagement}/health`, `/`, dan `/api/status` (pastikan 3 service), retry 3x. Semua harus 200.

Istilah: **`-p temuin`** = nama project compose dipatok "temuin" supaya konsisten dengan stack lama. **Secret** = nilai rahasia (kunci SSH, token) yang disimpan aman di GitHub, tidak muncul di kode.

**Rollback manual** (kalau deploy bermasalah): di server `cd /opt/temuin && cp docker-compose.monolith.yml.bak docker-compose.yml && docker compose down && docker compose up -d`.

---

## 8. Observability (DEC-022) — pemantauan

Tiga pilar yang harus bisa kamu jelaskan:

- **Logging terstruktur** — tiap service kirim log dalam format JSON (lewat `services/shared/logging_config.py`): ada `timestamp`, `level`, `service`, `correlation_id`, `message`. Mudah dicari/difilter.
- **Metrics** — tiap service punya endpoint `GET /metrics` format Prometheus: `request_total`, `error_total`, `request_duration_seconds`. Siap di-scrape Prometheus (belum dipasang, tapi endpoint sudah ada).
- **Health & status** — tiap service punya `/health` (cek database + dependency). engagement-service `/health` juga ping auth & item; kalau salah satu mati, statusnya `degraded`. `GET /api/status` menggabungkan kesehatan 3 service + latency, dipakai halaman Status frontend.

Script bantu: `scripts/logs.sh` punya subcommand `all`, `errors` (cari log error), `trace <id>` (lacak satu correlation ID lintas service), `metrics` (ambil metrics semua service).

---

## 9. Security hardening (Sprint 8, DEC-023) — yang kamu kerjakan

- **Container non-root** — service jalan sebagai uid 1000 (`appuser`), frontend sebagai uid 101. Cara cek di server: `docker exec temuin-auth id -u` -> harus `1000`. Kalau dibobol, tidak langsung dapat root.
- **Security headers** — tiap service set `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security` (HSTS), dan CSP.
- **Rate limit di gateway** — sudah dibahas (auth 5r/s, general 30r/s).
- **Audit secret** — `.gitignore` mengabaikan `.env` & `.env.*` (kecuali `.env.example` & `.env.docker`). Secret asli (`SECRET_KEY`, `DB_PASSWORD`) hanya di `/opt/temuin/.env` permission 600 di server, tidak pernah di-commit. Catatan jujur: SECRET_KEY sempat ter-commit di Sprint 3 lalu diganti placeholder + dirotasi; tercatat sebagai tech debt di `docs/release-notes.md`.
- **`.dockerignore`** — mencegah file sensitif (`.env`, kredensial JSON, `__pycache__`) ikut masuk image.

> **Hardening** = membuat sistem lebih sulit dibobol dengan menutup celah-celah umum.

---

## 10. Branch protection & CODEOWNERS

- Branch `master` dilindungi: PR wajib **1 approval**, **force push diblokir**.
- Merge strategy: **squash and merge** (semua commit PR digabung jadi satu commit rapi di master).
- `.github/CODEOWNERS` otomatis menetapkan reviewer berdasarkan path file yang diubah.

---

## 11. Variabel environment (key-nya saja, jangan tulis nilai rahasia)

Dari `.env.docker` (template): `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `SECRET_KEY`, `ALGORITHM` (HS256), `ACCESS_TOKEN_EXPIRE_MINUTES` (60), `CORS_ORIGINS`, `VITE_API_BASE_URL`.

Cara membuat SECRET_KEY baru: `python -c "import secrets; print(secrets.token_hex(32))"`.

---

## 12. Bagian kamu saat live demo (skrip siap baca)

Saat presentasi, kamu (DevOps) pegang **Slide 3 (Architecture Journey)** dan **Slide 4 (Tech Stack & Infrastructure)**, plus menjelaskan saat halaman `/status` dan GitHub pipeline ditunjukkan.

### 12.1 Saat slide architecture journey

> "Arsitektur kami berkembang bertahap. Awalnya monolith: satu backend, satu database. Di Sprint 6 kami deploy ke VPS Tencent dan memecahnya jadi tiga microservice: auth, item, dan engagement, di belakang satu gateway Nginx. Di Sprint 7 kami tambahkan rate limit, correlation ID, retry, dan circuit breaker. Sprint 8 fokus security hardening dan rilis v1.0.0."

### 12.2 Saat slide tech stack & infrastructure

> "Semua dibungkus Docker dan dijalankan dengan Docker Compose. Di production ada enam container: database, tiga service, frontend, dan gateway, semua di satu VPS dengan RAM 1.9 GB, jadi tiap container kami beri batas memori. Ada dua lapis nginx: nginx host mengurus HTTPS lewat Let's Encrypt, lalu meneruskan ke gateway container di port 8080. Deploy otomatis lewat GitHub Actions."

### 12.3 Saat tunjukkan halaman /status

> "Halaman status ini memanggil endpoint /api/status yang menggabungkan kesehatan tiga service. Ketiganya `up`, ini bukti microservices kami benar-benar hidup dan terpisah di belakang gateway."

### 12.4 Saat tunjukkan GitHub Actions

> "Ini pipeline CI/CD kami. Tiap push ke master, CI menjalankan lint, tes backend, tes frontend, dan tes tiap service. Kalau hijau, CD otomatis membangun image Docker, push ke Docker Hub, lalu SSH ke VPS untuk pull image baru dan menyalakan ulang, diakhiri health check ke domain production."

---

## 13. Pertanyaan viva untuk DevOps (dosen tanya KAMU) + jawaban

**"Apa peran kamu di tim?"**
> Saya DevOps. Saya menangani containerization dengan Docker, pipeline CI/CD di GitHub Actions, deployment ke VPS Tencent, gateway, monitoring, dan keamanan infrastruktur.

**"Jelaskan alur deploy dari kode sampai production."**
> Developer merge PR ke master. GitHub Actions CD membangun empat image Docker, push ke Docker Hub, lalu SSH ke VPS, menyalin file compose dan config gateway, menjalankan docker compose pull dan up -d, reload gateway, lalu health check ke domain. Semua otomatis tanpa langkah manual.

**"Kenapa pakai multi-stage build di Dockerfile?"**
> Supaya image akhir kecil dan aman. Tahap builder memasang dependency dengan alat compile, lalu tahap production hanya menyalin hasil yang dibutuhkan tanpa alat berat itu. Image jadi lebih ringan dan permukaan serangan lebih kecil.

**"Kenapa container jalan sebagai non-root?"**
> Keamanan. Kalau container dibobol, penyerang tidak otomatis punya akses root. Service kami jalan sebagai uid 1000, frontend sebagai uid 101.

**"Bagaimana kamu menjaga RAM server yang cuma 1.9 GB?"**
> Saya pasang memory limit per container di compose, total dijaga di bawah sekitar 1.4 GB, pakai image alpine yang kecil, dan satu PostgreSQL dengan tiga database logis daripada tiga instance database terpisah. Server juga punya swap 2 GB.

**"Apa fungsi gateway, kenapa tidak langsung ke service?"**
> Gateway jadi satu pintu masuk: klien cukup tahu satu alamat. Gateway yang membagi request ke service yang tepat, sekaligus menerapkan rate limit, correlation ID, dan failover. Service juga tidak perlu diekspos ke internet, hanya gateway.

**"Apa itu correlation ID dan kenapa penting di microservices?"**
> Nomor unik yang ditempel di tiap request dan diteruskan ke semua service yang dilewati. Saat ada error, saya bisa melacak satu request lintas service lewat nomor itu pakai scripts/logs.sh trace. Penting karena di microservices satu request bisa melewati beberapa service.

**"Bagaimana CI memastikan kualitas sebelum deploy?"**
> CI menjalankan lint, tes backend dengan target coverage 60%, tes frontend 40%, tes tiap service, dan saat PR ada integration test ke gateway. Kalau ada yang merah, kode tidak akan di-merge, jadi yang sampai production sudah lolos semua.

**"Bagaimana kamu mengamankan secret?"**
> Secret seperti SECRET_KEY dan kunci SSH disimpan di GitHub Secrets dan di file .env server dengan permission 600, tidak pernah di-commit. .gitignore dan .dockerignore mencegah file env ikut masuk repo atau image.

**"Kalau VPS mati saat UAS, rencana kamu?"**
> Kami punya fallback ke Render free tier untuk versi monolith, dan video backup demo. Untuk masalah container, saya bisa cek docker ps dan health, restart lewat scripts/temuin.sh, atau rollback ke stack monolith yang ada backupnya.

---

## 14. Pemahaman proyek keseluruhan (DevOps juga harus paham fitur)

Walau fokusmu infra, dosen bisa tanya soal aplikasinya. Minimal:
- Temuin: lost & found ITK, hanya email itk.ac.id, wajib login, ada role user/admin/superadmin.
- Alur inti: lapor barang -> klaim -> admin verifikasi -> dikembalikan.
- Backend 3 service (auth/item/engagement), frontend React, database PostgreSQL.

---

## 15. Checklist persiapan DevOps sebelum UAS

- [ ] Sudah baca `docs/uas/panduan-uas.md`.
- [ ] Bisa gambar topologi 2 lapis nginx + gateway dari ingatan.
- [ ] Hafal isi stack microservices (6 container, port, memory limit).
- [ ] Bisa jelaskan multi-stage build & kenapa non-root.
- [ ] Bisa jelaskan alur CI (5 job) dan CD (build-push + deploy).
- [ ] Paham gotcha bind mount gateway (perlu `nginx -s reload`).
- [ ] Bisa jelaskan rate limit, correlation ID, retry, circuit breaker.
- [ ] Cek `/status` hijau + pipeline GitHub hijau H-1.
- [ ] Latihan jawab 9 pertanyaan viva di atas minimal sekali.

Semangat! Kamu yang membuat aplikasi ini benar-benar hidup di internet. Infrastruktur adalah fondasi yang menahan semuanya. 🎓
