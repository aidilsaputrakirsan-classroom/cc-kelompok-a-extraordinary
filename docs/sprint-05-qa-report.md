# Sprint 05 QA Report - Temuin

**Role**: Lead QA & Docs (@raniayudewi)  
**Date**: 2026-05-20  

---

## 1. QA-5.1 Blackbox Regression Setelah Bugfix Sprint 05

Verifikasi fungsionalitas aplikasi secara menyeluruh pasca perbaikan bug UTS di frontend (`FE-5.1`) dan optimalisasi testing backend (`BE-5.3`). Pengujian dilakukan langsung di lingkungan containerized Docker.

### A. Registrasi Pengguna & Notifikasi Sukses
- **Temuan**: Pengguna dapat mendaftarkan akun baru secara mandiri melalui form registrasi dengan validasi email kampus (`@itk.ac.id`) dan menampilkan notifikasi sukses/pop-up berhasil register dengan benar.
- **Bukti**:
  ![Register Pengguna](../image/sprint-05/Register%20pengguna.png)
  ![Notif Berhasil Register](../image/sprint-05/Notif%20berhasil%20register.png)

### B. Otentikasi Admin
- **Temuan**: Setelah akun dipromosikan melalui command `.\scripts\temuin.ps1 make-admin`, admin dapat melakukan login dengan kredensial yang didaftarkan dan mendapatkan hak akses administratif.
- **Bukti**:
  ![Login Admin](../image/sprint-05/Login%20Admin.png)

### C. Pembuatan Laporan Barang Temuan (Found)
- **Temuan**: Admin/User berhasil membuat laporan barang temuan baru melalui formulir input dengan data kategori, lokasi detail, satpam penitipan, dan upload gambar. Laporan tersimpan di database dan muncul di daftar pencarian.
- **Bukti**:
  ![Buat Laporan Temuan](../image/sprint-05/Buat%20laporan%20temuan.png)
  ![Berhasil Buat Laporan](../image/sprint-05/Berhasil%20buat%20laporan.png)

### D. Pencarian & Detail Laporan Barang
- **Temuan**: Pengguna biasa dapat membuka daftar barang temuan, melakukan pencarian dinamis (misal mencari *"charger"*), dan melihat informasi detail dari barang temuan tersebut secara lengkap.
- **Bukti**:
  ![Pengguna Membuka Daftar Barang](../image/sprint-05/Pengguna%20membuka%20daftar%20barang%20.png)
  ![Pengguna Mencari Charger](../image/sprint-05/Pengguna%20mencari%20charger%20di%20pencaharian.png)
  ![Pengguna Lihat Detail](../image/sprint-05/Pengguna%20Lihat%20Detail%20barang%20temuan.png)

### E. Pengajuan Klaim Kepemilikan Barang
- **Temuan**: Pengguna dapat mengajukan klaim kepemilikan atas barang temuan dengan mengisi formulir jawaban verifikasi detail (deskripsi pencocokan ciri fisik barang).
- **Bukti**:
  ![Pengguna Mengajukan Klaim](../image/sprint-05/Pengguna%20mengajukan%20klaim%20barang.png)

### F. Persetujuan & Penyelesaian Klaim oleh Admin
- **Temuan**: Admin dapat memoderasi klaim masuk, melihat detail jawaban klaim, menyetujui klaim (*approve*), dan menyelesaikan proses serah terima barang (*complete claim*) sehingga status barang berubah menjadi **`returned`** (dikembalikan).
- **Bukti**:
  ![Admin Daftar Klaim](../image/sprint-05/Admin%20membuka%20daftar%20klaim.png)
  ![Admin Setujui Klaim](../image/sprint-05/Admin%20setujui%20klaim.png)
  ![Admin Sukses Setujui](../image/sprint-05/Admin%20berhasil%20setujui%20klaim.png)
  ![Admin Selesaikan Klaim](../image/sprint-05/Admin%20berhasil%20menyelesaikan%20klaim.png)

---

## 2. QA-5.2 Verifikasi CI 3-Job Berjalan Hijau & Tambah CI Badge di README

Pengujian pipeline *Continuous Integration* (CI) menggunakan GitHub Actions untuk memastikan build stabil, aturan linting dipatuhi, dan seluruh unit test (backend + frontend) lolos secara otomatis.

### Hasil Temuan
- **CI Workflow**: File `.github/workflows/ci.yml` berhasil dikonfigurasi dengan 3 job paralel:
  - **Lint**: Memeriksa kualitas penulisan kode dengan ruff (backend) dan eslint (frontend).
  - **Backend-test**: Menjalankan pytest dengan verifikasi cakupan kode minimum 60% (realisasi 77.40%).
  - **Frontend-test**: Menjalankan pengujian Vitest dengan minimal coverage 40% (realisasi 71.08%) dan build bundle production.
- **Verifikasi**: Semua commit dan Pull Request berhasil melewati check CI ini secara otomatis dengan status **Sukses (Hijau)** di GitHub.
- **Pemasangan Badge**: CI status badge telah disematkan di halaman paling atas [README.md](../README.md) agar visibilitas status build terpantau secara transparan oleh seluruh tim.

---

## 3. QA-5.3 Tulis `docs/testing-guide.md`

Penyusunan dokumentasi teknis panduan pengujian otomatis (*automated testing*) sebagai bekal tim pengembang untuk melakukan uji lokal dan integrasi CI.

### Hasil Temuan
- **Dokumentasi Terbuat**: Panduan pengujian telah terdokumentasi rapi di file [testing-guide.md](./testing-guide.md).
- **Cakupan Panduan**:
  - Prasyarat sistem (dependensi backend/frontend).
  - Cara instalasi virtual environment dan modul testing.
  - Command menjalankan test backend (Pytest) dan frontend (Vitest), baik di lokal maupun containerized Docker (menggunakan Makefile targets).
  - Referensi ambang batas pengujian (*coverage thresholds*) sesuai standard proyek (Backend >=60%, Frontend >=40%).
  - Panduan pemecahan masalah (*troubleshooting*) jika ada job build/lint/test yang gagal pada CI.

---

## N. Status Task Sprint 05 (QA)

| Task ID | Nama Task | Status | Hasil | Bukti (Image Path) |
|---------|-----------|--------|-------|---------------------|
| **QA-5.1** | Blackbox regression setelah bugfix sprint 05 | **done** | ✅ Pass | Tersimpan lengkap di folder [image/sprint-05/](../image/sprint-05/) |
| **QA-5.2** | Verifikasi CI 3-job berjalan hijau dan tambah CI badge di README | **done** | ✅ Pass | Badge disematkan pada [README.md](../README.md) |
| **QA-5.3** | Tulis `docs/testing-guide.md` (cara run test, threshold, troubleshoot) | **done** | ✅ Pass | File terbuat di [docs/testing-guide.md](./testing-guide.md) |

---

## N+1. Catatan Tambahan

* **Regresi Berhasil Lepas**: Seluruh alur regresi berjalan lancar di lingkungan Docker lokal. Tidak ada fitur yang terganggu setelah perbaikan kode front-end maupun integrasi library Vitest baru.
* **Kualitas Kode Sangat Tinggi**: Realisasi test coverage backend (77.40%) dan frontend (71.08%) jauh melampaui batas minimum threshold proyek (60% backend / 40% frontend), membuktikan stabilitas yang sangat baik untuk fase pengembangan selanjutnya di Sprint 06.
