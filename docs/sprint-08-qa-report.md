# Sprint 08 QA Report - Temuin

**Role**: Lead QA & Docs (@raniayudewi)  
**Date**: 2026-06-12  

---

## 1. QA-8.1 Full Blackbox Regression Seluruh Flow Utama

Melakukan verifikasi menyeluruh terhadap fungsionalitas utama aplikasi secara *End-to-End* pada lingkungan produksi (`https://temuin.pangeransilaen.net`). Pengujian ini memastikan tidak ada regresi dan seluruh batasan produk (seperti validasi email/password, pembatasan klaim, dan manajemen master data) berfungsi sesuai dengan spesifikasi.

### Hasil Temuan

#### A. Registrasi Akun
- [x] **Registrasi User Biasa (Isi Form)**: User menginput data registrasi dengan benar.
- [x] **Registrasi User Biasa Berhasil**: Registrasi berhasil menggunakan domain email kampus yang valid (`@student.itk.ac.id` / `@itk.ac.id`).
- [x] **Gagal Registrasi (Domain Salah)**: Registrasi diblokir ketika mencoba mendaftar dengan domain non-ITK (`@gmail.com`).
- [x] **Gagal Registrasi (Password Tanpa Huruf & Angka)**: Registrasi diblokir ketika password tidak memenuhi kriteria keamanan (harus mengandung kombinasi huruf dan angka).
- [x] **Gagal Registrasi (Password Kurang Panjang)**: Registrasi diblokir ketika password kurang dari 8 karakter.

#### B. Otentikasi & Login
- [x] **Gagal Login (Sandi Salah)**: Sistem menolak akses masuk saat user memasukkan password yang salah dan menampilkan pesan error yang relevan.
- [x] **Login User Biasa Berhasil**: User berhasil login ke sistem dengan kredensial yang valid dan mendapatkan token akses JWT.

#### C. Pelaporan Barang (Lost & Found)
- [x] **Pembuatan Laporan (Isi Form)**: User mengisi form laporan barang temuan (`found`) dengan memilih Gedung, Kategori, Lokasi Spesifik, dan Satpam Penanggung Jawab dari data master.
- [x] **Pembuatan Laporan Berhasil**: Laporan barang berhasil disubmit dan disimpan dengan gambar terkompresi otomatis di frontend (<2MB).

#### D. Pengajuan Klaim Barang Temuan
- [x] **Pembuatan Klaim (Isi Form)**: User lain membuka barang temuan di dashboard dan mengisi form deskripsi bukti kepemilikan.
- [x] **Klaim Berhasil**: Klaim berhasil disubmit ke sistem dengan status awal `pending` dan mengunci item agar tidak bisa diklaim user lain selama proses verifikasi.

#### E. Persetujuan & Penyelesaian Klaim (Admin)
- [x] **Admin Melihat Detail Klaim**: Admin/Satpam membuka panel admin dan melihat detail klaim beserta deskripsi bukti kepemilikan.
- [x] **Klaim Disetujui & Ditandai Selesai**: Admin berhasil menyetujui klaim dan menandai penyerahan barang selesai. Status klaim berubah menjadi `completed` dan status barang berubah menjadi `returned`.

#### F. Sistem Notifikasi In-App
- [x] **Notifikasi Admin**: Admin menerima notifikasi in-app untuk mengulas klaim baru yang masuk.
- [x] **Notifikasi User**: Pengguna menerima notifikasi in-app ketika klaim barang miliknya disetujui dan diserahkan.

#### G. Sunting Profil
- [x] **Ubah Profil Berhasil**: Pengguna berhasil mengedit data profil mereka (Nama/No Telepon) dan perubahannya berhasil disimpan secara real-time.

#### H. Manajemen Master Data (Admin Panel)
- [x] **Tambah Data Master**: Admin berhasil menambah data master (seperti Gedung baru atau Kategori baru).
- [x] **Edit Data Master**: Admin berhasil memperbaharui data master yang telah ada.
- [x] **Hapus Data Master**: Admin berhasil menghapus/menonaktifkan data master dari sistem.
- [x] **Konfirmasi Penghapusan**: Data master berhasil dibersihkan dari daftar aktif sistem.

---

### Screenshot Bukti Pengujian

#### A. Registrasi Akun & Validasi Keamanan
| Skenario | Screenshot |
|----------|------------|
| Form Register User Biasa | ![Register User Biasa](../image/sprint-08/Register%20user%20biasa.png) |
| Register Berhasil | ![Register Berhasil](../image/sprint-08/Register%20user%20biasa%20berhasil.png) |
| Gagal: Domain Non-ITK | ![Gagal Domain](../image/sprint-08/gagal%20register%20dengan%20gmail.com.png) |
| Gagal: Password Tanpa Huruf & Angka | ![Gagal Kriteria Password](../image/sprint-08/gagal%20register%20karena%20password%20tidak%20huruf%20dan%20angka.png) |
| Gagal: Password Kurang Panjang | ![Gagal Panjang Password](../image/sprint-08/register%20kurang%20password.png) |

#### B. Login & Otentikasi
| Skenario | Screenshot |
|----------|------------|
| Gagal Login: Password Salah | ![Gagal Login](../image/sprint-08/login%20dengan%20password%20salah.png) |
| Login Berhasil | ![Login Berhasil](../image/sprint-08/Login%20user%20biasa%20berhasil.png) |

#### C. Pembuatan Laporan Barang
| Skenario | Screenshot |
|----------|------------|
| Isi Laporan Barang Temuan | ![Lapor Barang](../image/sprint-08/Buat%20laporan%20barang%20temuan%20dari%20user.png) |
| Laporan Berhasil Dibuat | ![Laporan Berhasil](../image/sprint-08/berhasil%20membuat%20laporan%20temuan%20dari%20user.png) |

#### D. Pengajuan & Pemrosesan Klaim
| Skenario | Screenshot |
|----------|------------|
| Form Pengajuan Klaim | ![Isi Klaim](../image/sprint-08/Pengajuan%20klaim%20barang%20temuan%20dari%20user%20lain.png) |
| Klaim Berhasil Diajukan | ![Klaim Berhasil](../image/sprint-08/pengajuan%20klaim%20berhasil%20.png) |
| Admin Review Detail Klaim | ![Admin Detail Klaim](../image/sprint-08/Admin%20melihat%20detail%20klaim%20.png) |
| Klaim Disetujui & Selesai | ![Klaim Selesai](../image/sprint-08/klaim%20berhasil%20disetujui%20dan%20ditandai%20selesai%20oleh%20admin.png) |

#### E. Notifikasi & Sunting Profil
| Skenario | Screenshot |
|----------|------------|
| Notifikasi Masuk Admin | ![Notif Admin](../image/sprint-08/Notifikasi%20admin.png) |
| Notifikasi Masuk User | ![Notif User](../image/sprint-08/notifikasi%20user%20yang%20berhasi%20klaim%20barang%20yg%20sudah%20ditandai%20selesai.png) |
| Edit Profil Berhasil | ![Edit Profil](../image/sprint-08/edit%20berhasil%20diperbaharui.png) |

#### F. Manajemen Master Data (Admin)
| Skenario | Screenshot |
|----------|------------|
| Tambah Data Master | ![Tambah Master](../image/sprint-08/Tambah%20data%20master.png) |
| Edit Data Master | ![Edit Master](../image/sprint-08/Edit%20data%20master.png) |
| Hapus Data Master | ![Hapus Master](../image/sprint-08/Hapus%20Data%20master.png) |
| Master Berhasil Dihapus | ![Hapus Master Sukses](../image/sprint-08/data%20master%20berhasil%20dihapus.png) |

---

## N. Status Task Sprint 08 (QA)

| Task ID | Nama Task | Status | Hasil | Bukti (Image Path) |
|---------|-----------|--------|-------|---------------------|
| **QA-8.1** | Full blackbox regression seluruh flow utama | **done** | ✅ Pass | Tersimpan di [image/sprint-08/](../image/sprint-08/) |
| **QA-8.2** | Tulis `docs/api-contract.md` | **done** | ✅ Pass | Lihat [api-contract.md](./api-contract.md) |
| **QA-8.3** | Tulis `docs/final-checklist.md` | **done** | ✅ Pass | Lihat [final-checklist.md](./final-checklist.md) |
| **QA-8.4** | Final verification: `/api/status` up | **done** | ✅ Pass | Terverifikasi dinamis via status page |
| **QA-8.5** | Update comprehensive README.md | **done** | ✅ Pass | Terverifikasi di [README.md](../README.md) |
| **QA-8.6** | Audit konsistensi dokumen aktif `temuin-docs/` | **done** | ✅ Pass | Terverifikasi sinkron |

---

## N+1. Catatan Tambahan

* **Regresi Berhasil Diselesaikan**: Seluruh flow penting E2E telah terverifikasi aman tanpa adanya regresi pada fungsionalitas utama.
* **Master Data Management**: CRUD master data berhasil ditangani admin/satpam dengan validasi konsisten.
* **Security Validation**: Validasi email ITK dan password policy berjalan dengan baik, baik dari sisi frontend maupun backend validator.
