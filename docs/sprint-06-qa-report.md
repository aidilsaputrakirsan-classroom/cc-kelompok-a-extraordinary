# Sprint 06 QA Report - Temuin

**Role**: Lead QA & Docs (@raniayudewi)  
**Date**: 2026-05-29  

---

## 1. QA-6.1 Smoke Test 3 Endpoint Health di Production

Verifikasi ketersediaan dan status kesehatan dari 3 layanan mikro backend yang baru didekomposisi (`auth-service`, `item-service`, `engagement-service`) pada Tencent VPS produksi.

### Hasil Temuan
- [x] `/api/auth/health` mengembalikan status `200 OK` dengan respons status kesehatan layanan.
- [x] `/api/items/health` mengembalikan status `200 OK` dengan respons status kesehatan layanan.
- [x] `/api/engagement/health` mengembalikan status `200 OK` dengan respons status kesehatan layanan.

*Pengujian dilakukan menggunakan REST client dan browser secara langsung ke domain produksi `https://temuin.pangeransilaen.net`, semuanya mengembalikan respons `healthy` dengan latensi rendah.*

---

## 2. QA-6.2 Regression Blackbox Flow Penuh (E2E)

Pengujian fungsionalitas utama aplikasi secara penuh lintas layanan mikro (auth -> item -> engagement) pasca migrasi di VPS produksi untuk memastikan tidak terjadi regresi fungsional.

### Hasil Temuan
- [x] **Registrasi Akun Baru**: Pengguna berhasil mendaftar menggunakan email mahasiswa `@student.itk.ac.id`.
- [x] **Otentikasi & Login**: Pengguna berhasil login dan mendapatkan akses token.
- [x] **Pelaporan Temuan (Found)**: Pengguna berhasil membuat posting barang temuan baru lengkap dengan kompresi foto base64, kategori, lokasi gedung, dan data satpam.
- [x] **Pengajuan Klaim**: Pengguna lain berhasil melihat detail barang tersebut dan mengajukan permohonan klaim kepemilikan.
- [x] **Persetujuan & Penyerahan oleh Admin**: Pengguna Admin berhasil memoderasi klaim, menyetujui (*approve*), dan menyelesaikan (*complete*) proses klaim hingga status barang berubah menjadi `returned`.

### Screenshot Bukti

#### A. Registrasi & Login Akun Pertama (User 1)
![Register Sukses](../image/sprint-06/Register%20berhasil.png)
![Login Sukses](../image/sprint-06/Login%20Berhasil.png)

#### B. Membuat Laporan Barang Temuan (Found)
![Membuat Laporan](../image/sprint-06/Membuat%20Laporan.png)
![Laporan Berhasil Dibuat](../image/sprint-06/Laporan%20barang%20temuan%20berhasil%20dibuat.png)

#### C. Registrasi & Login Akun Kedua (User 2)
![Register Akun 2 Sukses](../image/sprint-06/Register%20akun%20ke%202%20berhasil.png)
![Login Akun 2 Sukses](../image/sprint-06/berhasil%20login%20akun%20ke2.png)

#### D. Pengajuan Klaim Kepemilikan Barang
![Melihat Barang Temuan](../image/sprint-06/Klaim%20barang%20temuan.png)
![Mengajukan Klaim](../image/sprint-06/Klaim%20barang%20berhasil%20diajukan.png)

#### E. Persetujuan & Penyelesaian Klaim oleh Admin
![Klaim Diselesaikan](../image/sprint-06/Klaim%20barang%20ditandai%20selesai.png)

---

## 3. QA-6.3 Tulis/Update `docs/deployment-guide.md`

Penyusunan dokumen panduan deployment komprehensif bagi tim pengembang untuk memelihara kestabilan server Tencent VPS dan menyediakan rencana cadangan deployment.

### Hasil Temuan
- [x] Dokumen panduan deployment berhasil ditulis lengkap di [deployment-guide.md](./deployment-guide.md).
- [x] Panduan mencakup konfigurasi prasyarat (swap, docker group), deployment monolith, migrasi & deploy microservices, konsumsi RAM idle (~278 MB), konfigurasi CD pipeline, penanganan OOM, dan alternatif fallback menggunakan PaaS Render.

---

## 4. QA-6.4 Production Smoke Test setelah CD Deploy Auto-Trigger

Memverifikasi kestabilan pipeline *Continuous Deployment* (CD) otomatis di GitHub Actions untuk menjamin pembaharuan kode secara aman.

### Hasil Temuan
- [x] Berkas CD workflow `.github/workflows/cd.yml` terpicu secara otomatis pada push/merge perubahan ke branch `master`.
- [x] Tahapan build dan push 4 Docker images paralel serta update container di VPS produksi berjalan sukses (Hijau).
- [x] Smoke test pasca deployment otomatis menunjukkan website produksi tetap menyala normal dan berhasil memuat update kode terbaru.

### Screenshot Bukti
![CD Pipeline Success](../image/sprint-06/SS%20an%20github%20CD.png)

---

## 5. QA-6.5 Update `temuin-docs/03-architecture/system-architecture.md`

Melakukan audit dan pembaruan berkas diagram arsitektur untuk menjamin keakuratan dokumentasi arsitektur sistem.

### Hasil Temuan
- [x] Diagram arsitektur microservices hybrid 3-service di [system-architecture.md](../temuin-docs/03-architecture/system-architecture.md) telah diaudit secara seksama.
- [x] Penjelasan ports, reverse proxy (2-layer Nginx), routing endpoints, dan logical databases telah diverifikasi sinkron secara akurat dengan implementasi rill DevOps saat ini.

---

## N. Status Task Sprint 06 (QA)

| Task ID | Nama Task | Status | Hasil | Bukti (Image Path) |
|---------|-----------|--------|-------|---------------------|
| **QA-6.1** | Smoke test 3 endpoint health di production | **done** | ✅ Pass | Terverifikasi di `https://temuin.pangeransilaen.net` |
| **QA-6.2** | Regression blackbox flow penuh: 3 service hidup | **done** | ✅ Pass | Tersimpan di [image/sprint-06/](../image/sprint-06/) |
| **QA-6.3** | Tulis/update `docs/deployment-guide.md` | **done** | ✅ Pass | Lihat panduan di [deployment-guide.md](./deployment-guide.md) |
| **QA-6.4** | Production smoke test setelah CD deploy auto-trigger | **done** | ✅ Pass | [SS an github CD.png](../image/sprint-06/SS%20an%20github%20CD.png) |
| **QA-6.5** | Update `temuin-docs/03-architecture/system-architecture.md` | **done** | ✅ Pass | Terverifikasi di [system-architecture.md](../temuin-docs/03-architecture/system-architecture.md) |

---

## N+1. Catatan Tambahan

* **Keberhasilan Migrasi Microservices**: Alur fungsional penuh berjalan mulus di lingkungan terdistribusi tanpa ada masalah cors maupun inter-service routing.
* **CD Pipeline**: Berfungsi dengan sangat baik, mengeliminasi proses deployment manual oleh pengembang.
