# 🎨 Laporan Blackbox Testing - Frontend UI
**Tanggal:** 21 April 2026
**Tester:** Lead QA & Docs
**Fokus:** User Experience (UX), UI Flow, & Penanganan Error

Laporan ini mendokumentasikan pengujian antarmuka pengguna (UI) Temuin secara menyeluruh, mencakup alur autentikasi, pelaporan barang, hingga manajemen klaim oleh Admin.

---

## 🔐 1. Modul Autentikasi (Register & Login)
Memastikan keamanan pintu masuk aplikasi baik untuk User baru maupun Admin.

### A. Alur Registrasi (User Baru)
*   **Halaman Register:** Form pendaftaran dengan Nama, Email, dan Password.
*   **Validasi Domain:** Sistem menolak jika email bukan `@student.itk.ac.id` atau `@itk.ac.id`.
*   **Validasi Password:** Muncul peringatan jika password kurang dari 8 karakter.
*   **Pengecekan Akun:** Muncul error jika email sudah pernah terdaftar.

![Halaman Register](../image/sprint-02/08-register-page.png)
![Validasi Domain ITK](../image/sprint-02/06-register-itk-only.png)
![Error Password](../image/sprint-02/07-register-password-length.png)
![Error Akun Terdaftar](../image/sprint-02/09-register-already-exists.png)

### B. Alur Login & Penanganan Error
*   **Login Page:** Tampilan bersih dengan opsi masuk.
*   **Negative Test:** Feedback saat email tidak ditemukan atau password salah.
*   **Positive Test (Admin):** Tampilan setelah login sebagai Admin (Dashboard Lengkap).
*   **Positive Test (User):** Tampilan setelah login sebagai User Mahasiswa.

![Login Page](../image/sprint-02/02-admin-login-page.png)
![Login Error Email](../image/sprint-02/04-login-error-email.png)
![Login Error Password](../image/sprint-02/05-login-error-password.png)
![Admin Dashboard](../image/sprint-02/01-admin-login-success.png)
![User Dashboard](../image/sprint-02/03-user-login-success.png)

---

## 📦 2. Pelaporan Barang (Item Reporting)
Alur pengisian form laporan barang hilang (lost) atau temuan (found).

### Pengisian Laporan
*   **Input Data:** Pengguna mengisi judul, deskripsi, kategori, dan lokasi detail.
*   **Feedback:** Muncul notifikasi "Laporan Berhasil Dibuat" setelah menekan tombol submit.

![User Fill Form](../image/sprint-02/13-user-fill-item-found.png)
![Create Success](../image/sprint-02/14-item-created-success.png)

### Galeri & Detail Barang
Seluruh laporan muncul dalam bentuk kartu item dan bisa dilihat detailnya oleh siapa saja.

![Item Gallery](../image/sprint-02/15-item-list-user.png)
![Item Detail Detail](../image/sprint-02/18-item-detail-found-user.png)

### C. Alur Edit Laporan (Update Item)
*   **Aksi:** Pengguna menekan tombol "Edit" pada barang yang pernah dilaporkan.
*   **Hasil:** Perubahan deskripsi atau status berhasil disimpan dan terupdate secara real-time.
*(Note: Menjamin validitas data jika ada informasi barang yang perlu dikoreksi).*

---

## 🛡️ 3. Manajemen Master Data (Admin Only)
Fitur khusus Admin untuk mengelola data referensi sistem agar data inputan seragam.

### A. Kelola Gedung & Lokasi
*   **Tambah Gedung:** Form untuk menambah nama gedung baru di ITK.
*   **Edit Lokasi:** Mengubah detail ruangan atau nama titik lokasi.
*   **Hapus Data:** Menghapus gedung/lokasi yang sudah tidak digunakan.

![Daftar Gedung Master](../image/sprint-03/01-master-data-building.png)
![Tambah Gedung](../image/sprint-04/Sprint%202%20Tambah%20master%20data%20gedung%20admin.png)
![Edit Gedung](../image/sprint-04/Sprint%202%20Edit%20gedung%20(1).png)
![Hapus Lokasi](../image/sprint-04/Sprint%202%20Hapus%20Lokasi.png)

### B. Kelola Data Satpam (Petugas)
Manajemen nama-nama satpam yang bertugas sebagai titik penitipan barang temuan.

![Daftar Satpam](../image/sprint-03/02-master-data-security.png)
![Tambah Satpam](../image/sprint-04/Sprint%202%20Tambah%20nama%20satpam.png)
![Edit Satpam](../image/sprint-04/Sprint%202%20edit%20nama%20satpam.png)
![Hapus Satpam](../image/sprint-04/Sprint%202%20Menghapus%20data%20master%20satpam.png)

---

## 🤝 4. Alur Klaim Barang (Claim Flow)
Proses user membuktikan kepemilikan barang yang ditemukan (`found`).

### A. Pengajuan Klaim (User Side)
*   **Submit Claim:** User mengisi bukti kepemilikan melalui form jawaban verifikasi.
*   **Hasil:** Klaim berhasil dikirim dan user mendapatkan notifikasi status `pending`.

![Submit Claim](../image/sprint-02/23-user-submit-claim.png)
![Detail Klaim User](../image/sprint-02/26-user-claim-detail.png)

### B. Kelola Klaim (Admin Side)
Admin meninjau, menyetujui, dan menyelesaikan serah terima barang.
*   **Approve:** Admin memverifikasi jawaban dan memberikan persetujuan.
*   **Complete:** Proses akhir setelah barang fisik diterima pemilik.

![Admin Review List](../image/sprint-02/22-admin-claim-list.png)
![Admin Detail Review](../image/sprint-02/25-admin-claim-detail.png)
![Admin Approve](../image/sprint-02/27-admin-approve-claim.png)
![Process Complete](../image/sprint-02/29-admin-complete-claim.png)

---

## 🔔 5. Notifikasi & Feedback Sistem
Memastikan alur komunikasi in-app berjalan lancar.

![User Notifications](../image/sprint-03/03-user-notifications.png)
![Success Feedback Toast](../image/sprint-02/24-claim-notif-success.png)

---

## 📋 Kesimpulan Frontend Testing
Berdasarkan pengujian UI menyeluruh ini, Frontend Temuin sudah sangat stabil:
1.  **Validasi Kuat**: Menghalangi data sampah masuk (Register/Login/Form).
2.  **Manajemen Mudah**: Admin bisa mengontrol data master dan klaim dengan UI yang intuitif.
3.  **Real-Time**: Feedback (Toast) dan Notifikasi memberikan kepastian aksi pada user.
