# Sprint 04 QA Report - Temuin

**Role**: Lead QA & Docs (@raniayudewi)
**Date**: 2026-04-20

---

## 1. QA-4.1 Blackbox full flow di Docker: login hingga returned

Verifikasi alur lengkap (*End-to-End*) mulai dari autentikasi hingga penyelesaian klaim barang di lingkungan Docker Compose.

### A. Autentikasi (Login & Dashboard)
- **Temuan**: Sistem login baru menggunakan Email & Password (menggantikan Firebase) berfungsi dengan baik. Akun baru dapat didaftarkan dan masuk ke sistem.
- **Bukti**:
![Login Page](../image/sprint-04/Login%20User%20.png)
![Dashboard](../image/sprint-04/Login%20user%20berhasil%20ke%20dashboard.png)

### B. Pelaporan Barang (Found Item)
- **Temuan**: User berhasil membuat laporan barang temuan (Found) melalui form yang disediakan. Data tersimpan di database dan muncul di daftar barang.
- **Bukti**:
![Isi Laporan](../image/sprint-04/User%20isi%20laporan%20barang%20temuan.png)

### C. Pengajuan Klaim oleh User Lain
- **Temuan**: User yang berbeda dapat melihat barang temuan dan mengajukan klaim dengan mengisi formulir verifikasi.
- **Bukti**:
![Login User Klaim](../image/sprint-04/Login%20dengan%20user%20baru%20untuk%20melakukan%20klaim%20.png)
![Ajukan Klaim](../image/sprint-04/User%20lain%20mengajukan%20klaim%20barang.png)

### D. Manajemen Klaim oleh Admin
- **Temuan**: Admin dapat melihat daftar klaim yang masuk, memeriksa detailnya, dan melakukan persetujuan (Approval).
- **Bukti**:
![Daftar Klaim](../image/sprint-04/Admin%20melihat%20daftar%20klaim%20.png)
![Detail Klaim](../image/sprint-04/Admin%20melihat%20detail%20ajuan%20klaim%20barang%20temuan.png)
![Approve Klaim](../image/sprint-04/Admin%20menyetujui%20klaim%20barang%20temuan.png)

### E. Penyelesaian Klaim & Status Akhir
- **Temuan**: Setelah serah terima, Admin dapat menyelesaikan klaim. Status barang otomatis berubah menjadi `returned` (dikembalikan).
- **Bukti**:
![Selesaikan Klaim](../image/sprint-04/Admin%20menyelesaikan%20status%20klaim%20setelah%20di%20setujui.png)
![Status Returned](../image/sprint-04/Barang%20yang%20hilang%20sudah%20dinyatakan%20dikembalikan.png)

---

## 2. QA-4.2 Blackbox Admin Pages Utama (Master Data & Claims)

Pengujian mendalam terhadap fitur pengelolaan data oleh Admin.

### A. Pengelolaan Klaim (Admin View)
- **Temuan**: Admin memiliki kontrol penuh atas klaim yang diajukan user, termasuk fitur tolak klaim jika data tidak sesuai.
- **Bukti**:
![Admin Daftar Klaim](../image/sprint-04/Sprint%202%20Admin%20melihat%20daftar%20kelola%20klaim%20.png)
![Admin Detail](../image/sprint-04/Sprint%202%20Admin%20melihat%20detail%20klaim%20barang%20yang%20diinput%20user.png)
![Admin Approve](../image/sprint-04/Sprint%202%20Admin%20menyetujui%20klaim%20barang%20dari%20user.png)
![Admin Tolak](../image/sprint-04/Sprint%202%20Admin%20tolak%20ajuan%20klaim%20dari%20user.png)

### B. Master Data Gedung & Lokasi
- **Temuan**: Fitur CRUD (Tambah, Edit, Hapus) untuk data Gedung dan Lokasi berfungsi 100%. Notifikasi berhasil/gagal muncul dengan benar.
- **Bukti**:
![Tambah Gedung](../image/sprint-04/Sprint%202%20Tambah%20master%20data%20gedung%20admin.png)
![Edit Lokasi](../image/sprint-04/Sprint%202%20Edit%20lokasi%20data%20master.png)
![Daftar Gedung Baru](../image/sprint-04/Sprint%202%20daftar%20gedung%20setelah%20diperbaharui.png)
![Hapus Lokasi](../image/sprint-04/Sprint%202%20Hapus%20Lokasi.png)
![Notif Sukses](../image/sprint-04/Sprint%202%20notifikasi%20lokasi%20berhasil%20ditambahkan.png)

### C. Master Data Satpam (Security Officers)
- **Temuan**: Admin dapat mengelola database personil satpam yang bertugas menerima titipan barang temuan.
- **Bukti**:
![Tambah Satpam](../image/sprint-04/Sprint%202%20Tambah%20nama%20satpam.png)
![Satpam Berhasil di Tambah](../image/sprint-04/Sprint%202%20Satpam%20berhasil%20di%20tambahkan.png)
![Edit Satpam](../image/sprint-04/Sprint%202%20edit%20nama%20satpam.png)
![Hapus Satpam](../image/sprint-04/Sprint%202%20Menghapus%20data%20master%20satpam.png)

---

## 3. QA-4.3 Persiapan Demo UTS (Sprint Screenshot Pack)

Seluruh screenshot alur utama telah dikumpulkan dan diorganisir untuk kebutuhan presentasi UTS.

**Key Milestone Screenshots:**
1. Autentikasi Baru (Email/Pass) ✅
2. Siklus Hidup Barang (Lost/Found -> Claim -> Returned) ✅
3. Dashboard Admin & Master Data Management ✅

---

## 4. QA-4.4 Update Langkah Demo & Dokumen

Terdapat perubahan signifikan pada alur demo akibat migrasi dari Firebase Auth ke Internal Auth:
- **Langkah Baru**: Demo dimulai dengan registrasi email kampus di halaman `/register`.
- **Admin**: Script `.\scripts\temuin.ps1 make-admin` sekarang menjadi mandatory part dalam setup demo untuk menunjukkan fitur admin.
- **Docker**: Demo dijalankan sepenuhnya via Docker Compose untuk membuktikan portabilitas sistem.

**Bukti Eksekusi Docker:**
![Terminal Docker](../image/sprint-04/jalankan%20di%20backend.png)

---

## N. Status Task Sprint 04 (QA)

| Task ID | Nama Task | Status | Hasil | Bukti (Image Path) |
|---------|-----------|--------|-------|---------------------|
| QA-4.1  | Blackbox full flow di Docker: login hingga returned | done   | ✅ Pass | [link](../image/sprint-04/Barang%20yang%20hilang%20sudah%20dinyatakan%20dikembalikan.png) |
| QA-4.2  | Blackbox admin pages utama | done   | ✅ Pass | [link](../image/sprint-04/Sprint%202%20Admin%20melihat%20daftar%20kelola%20klaim%20.png) |
| QA-4.3  | Simpan screenshot flow utama untuk UTS | done   | ✅ Pass | Tersimpan di folder `image/sprint-04/` |
| QA-4.4  | Update langkah demo / dokumen | done   | ✅ Pass | Update pada guide demo & report ini |

---

## N+1. Catatan Tambahan

- Semua fungsionalitas inti untuk UTS sudah terverifikasi stabil di Docker.
- Tidak ditemukan bug kritikal (blocker) pada alur utama.
