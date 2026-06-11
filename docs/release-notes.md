# Release Notes — Temuin v1.0.0

**Tanggal rilis:** 2026-06-11
**Live URL:** https://temuin.pangeransilaen.net
**Kode:** tag `v1.0.0` di branch `master`

Temuin adalah platform lost & found kampus ITK: pengguna melaporkan barang hilang/ditemukan, mengajukan klaim dengan bukti kepemilikan, dan admin memverifikasi sampai barang kembali ke pemiliknya.

---

## Highlights

### Arsitektur
- **Microservices (3 service)** di belakang satu API gateway:
  - `auth-service` (8001) — identity, register, login, JWT issuance
  - `item-service` (8002) — items, item images, master data (kategori, gedung, lokasi, petugas)
  - `engagement-service` (8003) — claims, notifications, audit log, status aggregator
- **Production gateway** (`nginx`) sebagai single entry point: reverse proxy `/api/*` ke 3 service dan `/` ke frontend SPA.
- **Frontend** React + Vite + Tailwind CSS + shadcn/ui, disajikan via nginx.
- **Database** PostgreSQL 16 dengan 3 logical DB (`auth_db`, `item_db`, `engagement_db`).

### Fitur utama
- Register/login dengan email domain `itk.ac.id` (termasuk subdomain) + JWT.
- Lapor barang hilang (`lost`) dan ditemukan (`found`) lengkap dengan gambar dan master data.
- Alur klaim end-to-end: ajukan klaim → verifikasi bukti kepemilikan → approve/reject → completed.
- Notifikasi in-app dan riwayat status.
- Panel admin: kelola klaim dan master data.

### Keamanan (Sprint 8 — Modul 15)
- **Input validation** menyeluruh via Pydantic `field_validator`: password min 8 char (huruf + angka), batas panjang nama/judul/deskripsi, regex email ITK ter-anchor.
- **Security headers** di semua service: `X-Content-Type-Options`, `X-Frame-Options`, `HSTS`, `Content-Security-Policy` (docs-aware agar Swagger tetap jalan).
- **Image hardening**: seluruh container berjalan sebagai non-root (backend uid 1000, frontend nginx uid 101).
- **Rate limiting** di gateway: zona auth 5r/s (burst 10), umum 30r/s (burst 50), respons 429 JSON.
- **Correlation ID** lintas service untuk tracing.
- **Secret hygiene**: `.env*` di-gitignore; secret production tidak masuk log maupun response.

### Operasional
- **CI** (GitHub Actions): lint, unit/smoke test per service, frontend build + vitest, integration test gateway + microservices (khusus PR).
- **CD** (GitHub Actions): build & push 4 image ke Docker Hub → deploy ke Tencent VPS → health check otomatis (3 service + frontend + `/api/status`).
- **Observability**: log JSON terstruktur, rotasi 10m × 3, helper `scripts/logs.sh` (all/errors/trace/metrics).
- **Deployment**: Tencent VPS Ubuntu 22.04, host nginx (SSL termination via Certbot) → gateway `:8080`.

---

## Migration Notes

> Catatan untuk siapa pun yang melakukan deploy/upgrade dari versi sebelum v1.0.0.

- **Port internal frontend berubah `80` → `8080`** (akibat image nginx non-root, DO-8.1). Yang ikut berubah dan sudah disinkronkan:
  - `gateway/nginx.conf`: upstream `frontend:8080`
  - `infra/docker-compose.microservices.yml`: mapping `127.0.0.1:3000:8080`
  - `docker-compose.yml` (monolith fallback): `3000:8080`
- **Gateway perlu reload setelah deploy.** Karena `gateway/nginx.conf` di-bind-mount ke `nginx:alpine`, `docker compose up -d` tidak otomatis memuat ulang config saat hanya isi file yang berubah. CD sudah menambahkan `nginx -s reload` eksplisit (fallback force-recreate). Untuk deploy manual: `docker exec temuin-gateway nginx -t && docker exec temuin-gateway nginx -s reload`.
- **Tidak ada perubahan skema database** yang merusak (semua tabel dibuat otomatis saat startup via `Base.metadata.create_all`). Tidak ada migrasi destruktif.
- **`SECRET_KEY` production** harus tetap di-set di `/opt/temuin/.env` (bukan placeholder). Jangan pakai nilai contoh dari `.env.docker`.

---

## Known Limitations

- **Frontend `:3000` masih dipertahankan** sebagai jalur transisi zero-downtime di samping gateway `:8080`. Bisa dibersihkan di iterasi berikutnya setelah gateway terbukti stabil.
- **Log backend menampilkan `"service":"unknown-service"`** pada sebagian entri (ranah BE-7.3); tidak memengaruhi fungsionalitas, hanya label observability.
- **Secret bocor di git history**: sebuah `SECRET_KEY` asli pernah ter-commit di `.env.docker` pada Sprint 3 lalu diganti placeholder. Secret production **sudah berbeda** dari nilai bocor (sudah ter-rotate), jadi tidak ter-eksploitasi. Pembersihan history (rewrite) belum dilakukan karena berisiko tinggi terhadap clone tim; dicatat sebagai utang teknis.
- **Integration test CI kadang flaky** karena race startup upstream (gateway healthy lebih dulu dari item-service). Mitigasi disarankan: tunggu seluruh upstream healthy sebelum smoke test.
- **Validasi kepemilikan klaim** berbasis jawaban teks bebas (manual review oleh admin), belum ada scoring otomatis.

---

## Tim

| Role     | Anggota          |
| -------- | ---------------- |
| Backend  | @disnejy         |
| Frontend | @nicholasmnrng   |
| DevOps   | @PangeranSilaen  |
| QA & Docs | @raniayudewi    |
