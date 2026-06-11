## Ringkasan

Dokumentasi penyelesaian dan laporan akhir pekerjaan Lead QA & Docs (@raniayudewi) untuk **Sprint 08 (Security Hardening + UAS Final)**. Seluruh skenario pengujian regresi telah berhasil diverifikasi, dokumen teknis telah diterbitkan, dan perubahan telah di-push ke remote branch.

| Task ID | Deskripsi | Status | Branch / PR |
|---------|-----------|--------|-------------|
| **QA-8.1**  | Full blackbox regression seluruh flow utama | done   | `feat/qa/sprint-08-docs-and-reports` |
| **QA-8.2**  | Tulis `docs/api-contract.md` (API contract) | done   | `feat/qa/sprint-08-docs-and-reports` |
| **QA-8.3**  | Tulis `docs/final-checklist.md` (Pre-demo checklist) | done   | `feat/qa/sprint-08-docs-and-reports` |
| **QA-8.4**  | Final verification: gateway `/api/status` up | done   | `feat/qa/sprint-08-docs-and-reports` |
| **QA-8.5**  | Update comprehensive README.md (versi & arsitektur) | done   | `feat/qa/sprint-08-docs-and-reports` |
| **QA-8.6**  | Audit konsistensi dokumen aktif `temuin-docs/` | done   | `feat/qa/sprint-08-docs-and-reports` |

---

## Detail Per Task

### 1. QA-8.1 — Full Blackbox Regression Seluruh Flow Utama
**Deskripsi:** Melakukan verifikasi fungsionalitas menyeluruh E2E pada website produksi untuk mendeteksi regresi sebelum rilis final UAS.

**Yang Dikerjakan:**
- Menguji 20 skenario regression test secara manual di browser pada domain produksi `https://temuin.pangeransilaen.net`.
- Menyusun laporan lengkap hasil temuan pengujian fungsionalitas pada berkas [docs/sprint-08-qa-report.md](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary/blob/feat/qa/sprint-08-docs-and-reports/docs/sprint-08-qa-report.md).
- Mengunggah 20 screenshot bukti pengujian ke folder [image/sprint-08/](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary/tree/feat/qa/sprint-08-docs-and-reports/image/sprint-08) dengan pemetaan:
  1. *Registrasi*: Form register, registrasi sukses (@itk.ac.id), gagal domain non-ITK (@gmail.com), gagal kriteria password (tanpa angka/huruf), dan gagal panjang password (<8 karakter).
  2. *Login*: Login gagal (sandi salah), login sukses.
  3. *Laporan Barang*: Pengisian lapor barang found, lapor barang temuan berhasil.
  4. *Klaim*: Pengisian form pengklaim, klaim berhasil disubmit (pending).
  5. *Persetujuan Admin*: Detail klaim masuk admin panel, persetujuan dan penyelesaian klaim (returned/completed).
  6. *Notifikasi & Profil*: Notifikasi masuk admin (klaim baru), notifikasi masuk user (klaim disetujui), edit profil sukses.
  7. *Master Data Admin*: Tambah master data, edit master data, hapus master data, dan verifikasi data master berhasil dihapus.

**Acceptance Criteria:**
- [x] Laporan [sprint-08-qa-report.md](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary/blob/feat/qa/sprint-08-docs-and-reports/docs/sprint-08-qa-report.md) selesai ditulis.
- [x] 20 screenshot bukti pengujian tersimpan rapi di repositori remote.

---

### 2. QA-8.2 — Tulis `docs/api-contract.md`
**Deskripsi:** Menyusun kontrak API resmi yang merinci endpoint, parameter request/response payload, otentikasi JWT, dan konfigurasi rate limits microservices.

**Yang Dikerjakan:**
- Membuat dokumentasi [docs/api-contract.md](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary/blob/feat/qa/sprint-08-docs-and-reports/docs/api-contract.md).
- Menjabarkan API contract per microservice (`auth-service`, `item-service`, `engagement-service`) yang diekspos oleh API Gateway.
- Mencantumkan kebijakan pembatasan rate limit (5 req/s pada rute auth, 30 req/s pada rute umum) serta respons HTTP 429 (DEC-023).

**Acceptance Criteria:**
- [x] Dokumen [api-contract.md](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary/blob/feat/qa/sprint-08-docs-and-reports/docs/api-contract.md) terdokumentasi lengkap dan rapi.

---

### 3. QA-8.3 — Tulis `docs/final-checklist.md`
**Deskripsi:** Menyusun panduan operasional pre-demo untuk kelancaran presentasi UAS.

**Yang Dikerjakan:**
- Membuat check-list verifikasi VPS (6 kontainer running, RAM limit < 1.4 GB, SSL Let's Encrypt aktif).
- Menyusun check-list seeding database (kategori, lokasi, satpam).
- Menyediakan akun demo UAS siap pakai (User A, User B, Admin) lengkap dengan password-nya agar mempercepat simulasi alur.
- Menyediakan tautan backup video demo 5 menit sebagai safety net (DO-8.4).

**Acceptance Criteria:**
- [x] Berkas [docs/final-checklist.md](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary/blob/feat/qa/sprint-08-docs-and-reports/docs/final-checklist.md) terbit di repositori.

---

### 4. QA-8.4 — Final verification: `/api/status` up
**Deskripsi:** Memverifikasi kesehatan sistem produksi secara global melalui API Gateway.

**Yang Dikerjakan:**
- Menjalankan uji tembak status produksi via curl: `curl -i https://temuin.pangeransilaen.net/api/status`.
- Respons sukses **`HTTP/1.1 200 OK`** diperoleh dengan data:
  ```json
  {"services":[{"name":"auth","status":"up","latency_ms":19.68},{"name":"item","status":"up","latency_ms":29.24},{"name":"engagement","status":"up","latency_ms":0.69}]}
  ```
- Memverifikasi bahwa Gateway menyuntikkan header keamanan secara benar:
  - `x-content-type-options: nosniff`
  - `x-frame-options: DENY`
  - `strict-transport-security: max-age=63072000`
  - `content-security-policy` (DEC-018)
  - `X-Correlation-ID: a6ef9247f015`

**Acceptance Criteria:**
- [x] Seluruh service berstatus `up` (UP).
- [x] Security headers dan Correlation ID aktif di respon Gateway.

---

### 5. QA-8.5 — Update comprehensive README.md
**Deskripsi:** Memperbarui README utama untuk memenuhi 8 kriteria penilaian UAS dari dosen penguji.

**Yang Dikerjakan:**
- Menambahkan menu **Akses Cepat (Quick Access)** di bagian paling atas [README.md](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary/blob/feat/qa/sprint-08-docs-and-reports/README.md).
- Menambahkan diagram Mermaid **Microservices Architecture (Current Stage)** pada arsitektur sistem.
- Melengkapi nomor versi riil pada tabel *Tech Stack* (React v19, FastAPI v0.111, dll.).
- Menambahkan bab baru **Panduan Deployment** (2-Layer Nginx) dan **Project Journey (Monolith to Microservices)** lengkap dengan diagram timeline Mermaid.

**Acceptance Criteria:**
- [x] README.md ter-update dengan 8 standar kriteria penilaian UAS.

---

### 6. QA-8.6 — Audit konsistensi dokumen aktif `temuin-docs/`
**Deskripsi:** Audit folders arsitektur dan perencanaan untuk menjaga konsistensi dokumen.

**Yang Dikerjakan:**
- Memperbarui [temuin-docs/06-sprints/ACTIVE_SPRINT.md](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary/blob/feat/qa/sprint-08-docs-and-reports/temuin-docs/06-sprints/ACTIVE_SPRINT.md) untuk memprioritaskan Sprint 08.
- Memperbarui status seluruh task QA di [temuin-docs/06-sprints/sprint-08.md](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary/blob/feat/qa/sprint-08-docs-and-reports/temuin-docs/06-sprints/sprint-08.md) menjadi `done` pada branch `feat/qa/sprint-08-docs-and-reports`.

**Acceptance Criteria:**
- [x] `ACTIVE_SPRINT.md` ter-update.
- [x] `sprint-08.md` ter-update menjadi done.

---

## Files Changed

<details>
<summary>Daftar file yang berubah (klik untuk expand)</summary>

- [README.md](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary/blob/feat/qa/sprint-08-docs-and-reports/README.md)
- [docs/api-contract.md](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary/blob/feat/qa/sprint-08-docs-and-reports/docs/api-contract.md)
- [docs/final-checklist.md](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary/blob/feat/qa/sprint-08-docs-and-reports/docs/final-checklist.md)
- [docs/sprint-08-qa-report.md](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary/blob/feat/qa/sprint-08-docs-and-reports/docs/sprint-08-qa-report.md)
- [temuin-docs/06-sprints/ACTIVE_SPRINT.md](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary/blob/feat/qa/sprint-08-docs-and-reports/temuin-docs/06-sprints/ACTIVE_SPRINT.md)
- [temuin-docs/06-sprints/sprint-08.md](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary/blob/feat/qa/sprint-08-docs-and-reports/temuin-docs/06-sprints/sprint-08.md)
- [image/sprint-08/](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary/tree/feat/qa/sprint-08-docs-and-reports/image/sprint-08)

</details>

## Verifikasi

- [x] Semua task sudah `done` di sprint file
- [x] Branch `feat/qa/sprint-08-docs-and-reports` sudah di-push ke remote
- [x] PR siap dibuat
- [x] Verifikasi endpoint gateway `/api/status` lulus (UP & HTTP Security Headers aktif)

## Status Sprint 08 (QA)
Sprint 08 untuk role Lead QA & Docs sudah **selesai 100%**.
