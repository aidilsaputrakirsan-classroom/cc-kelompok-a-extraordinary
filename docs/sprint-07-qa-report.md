# Sprint 07 QA Report - Temuin

**Role**: Lead QA & Docs (@raniayudewi)  
**Date**: 2026-06-09  

---

## 1. QA-7.1 Blackbox Routing via Gateway untuk Flow Utama

Verifikasi alur kerja fungsionalitas utama aplikasi secara penuh (*End-to-End*) dari sisi client melalui API Gateway di lingkungan produksi (`https://temuin.pangeransilaen.net/api/*`).

### Hasil Temuan
- [x] **Registrasi Akun Baru**: Pengguna berhasil melakukan registrasi menggunakan domain email kampus yang valid (`@student.itk.ac.id`).
- [x] **Otentikasi & Login**: Pengguna berhasil masuk dan mendapatkan JWT Token akses yang disimpan di client.
- [x] **Pelaporan Temuan (Found)**: Pengguna berhasil membuat posting barang temuan baru dengan mengunggah foto, menentukan kategori, gedung, lokasi spesifik, dan satpam penanggung jawab.
- [x] **Pengajuan Klaim**: Pengguna lain dapat melihat daftar barang temuan dan berhasil mengajukan permohonan klaim barang hilang miliknya.
- [x] **Persetujuan Klaim (Admin)**: Pengguna admin berhasil menyetujui klaim yang diajukan oleh pengguna.
- [x] **Penyelesaian Klaim (Admin)**: Pengguna admin berhasil menandai proses penyerahan barang selesai (*completed*) sehingga status barang berubah menjadi `returned`.
- [x] **Verifikasi Gateway Routing**: DevTools Network menunjukkan seluruh pemicu alur kerja di atas mengarah ke URL ber-prefix `/api/*` (misal `/api/auth/...`, `/api/items/...`, dan `/api/claims/...`) tanpa membocorkan port kontainer backend individual, membuktikan routing gateway Nginx berjalan sukses.

### Screenshot Bukti

#### A. Registrasi & Login User Pertama
![Register Berhasil](../image/sprint-07/Register%20succes.png)
![Login Berhasil](../image/sprint-07/login%20success.png)

#### B. Membuat Laporan Barang Temuan
![Lapor Barang Berhasil](../image/sprint-07/lapor%20barang%20temuan%20success.png)

#### C. Pengajuan Klaim Kepemilikan Barang
![Pengajuan Klaim Berhasil](../image/sprint-07/pengguna%20klaim%20barang%20temuan%20success.png)

#### D. Persetujuan & Penyelesaian Klaim oleh Admin
![Login Admin Berhasil](../image/sprint-07/Login%20admin%20success.png)
![Klaim Disetujui Admin](../image/sprint-07/klaim%20disetujui%20admin%20success.png)
![Tandai Selesai Admin](../image/sprint-07/Tandai%20selesai%20oleh%20admin%20success.png)

#### E. Verifikasi Gateway Routing (Network Tab)
![DevTools Gateway Routing](../image/sprint-07/network%20login%20user%20pertama.png)

---

## 2. QA-7.2 Blackbox: Matikan Tiap Service Satu-Satu (StatusPage Test)

Memverifikasi kestabilan halaman StatusPage (`/status`) dalam memantau kesehatan kontainer backend secara aktual dengan polling berkala setiap 30 detik.

### Hasil Temuan
- [x] **Status Indikator Normal**: Ketika seluruh layanan hidup, halaman StatusPage menampilkan indikator hijau (UP) untuk semua microservices.
- [x] **Deteksi Kontainer Down**: Saat kontainer backend (`auth-service`, `item-service`, atau `engagement-service`) dimatikan satu-satu secara sengaja melalui terminal, StatusPage di browser mendeteksi gangguan secara akurat dalam rentang waktu kurang dari 30 detik dan mengubah warna indikator menjadi merah (DOWN).
- [x] **Pemulihan Otomatis**: Saat kontainer dinyalakan kembali, indikator kesehatan di web kembali hijau secara otomatis pada polling berikutnya.

---

## 3. QA-7.3 Blackbox: Rate Limit `/api/auth/login` (HTTP 429)

Verifikasi kebijakan pembatasan laju (*rate limiting*) di Nginx gateway yang membatasi request ke endpoint login sebanyak 5 request per detik dengan burst antrean 10 (DEC-023).

### Hasil Temuan
- [x] Pengujian dilakukan dengan menembakkan **25 request login secara paralel** menggunakan program native `curl.exe` yang dijalankan via background jobs di Windows PowerShell.
- [x] Request pertama yang lolos limit diteruskan ke backend FastAPI dan mengembalikan status **`422 Unprocessable Entity`** (FastAPI mendeteksi parameter format body yang tidak sesuai).
- [x] Request yang melampaui batas antrean (laju request terlalu cepat) langsung diblokir di level Gateway Nginx dan mengembalikan status **`429 Too Many Requests`** dengan body JSON `{"detail":"Too many requests"}`.
- [x] Ini membuktikan kebijakan rate limiting berhasil melindungi endpoint autentikasi dari serangan brute-force.

### Screenshot Bukti
![Rate Limit 429 Terminal](../image/sprint-07/testing%207.3%20success.png)

---

## 4. QA-7.4 Verifikasi Correlation ID End-to-End

Memverifikasi mekanisme pengusutan request (*request tracing*) lintas microservices menggunakan header `X-Correlation-ID` untuk mempermudah pencarian log saat terjadi masalah (DEC-022).

### Hasil Temuan
- [x] **Client Header Verification**: Saat memicu request fungsional E2E di browser, client menerima header **`X-Correlation-ID`** berupa 12 karakter alfanumerik unik pada panel Response Headers di DevTools Network.
- [x] **Backend Log Tracing**: Pencarian (*grep*) log kontainer di server dengan ID unik tersebut menampilkan entri log terstruktur (JSON) di lintas kontainer (`temuin-gateway`, `engagement-service`, dan `item-service`) dengan kode ID yang persis sama. Hal ini membuktikan Correlation ID berhasil diteruskan di setiap hop komunikasi backend.

### Screenshot Bukti
![Correlation ID DevTools](../image/sprint-07/ss%20x%20correlation%20id.png)

---

## 5. QA-7.5 Tulis Berkas `docs/operations-guide.md`

Pembuatan panduan operasional teknis bagi admin dan tim pengembang untuk melakukan debugging dan monitoring pada server produksi.

### Hasil Temuan
- [x] Berkas panduan operasional berhasil dibuat secara lengkap di [operations-guide.md](./operations-guide.md).
- [x] Dokumen mencakup format Structured JSON Logging, panduan menelusuri bug menggunakan *Correlation ID*, cara memantau metrics Prometheus pada route `/metrics`, serta perintah docker-compose esensial untuk memeriksa status, batasan log, dan me-restart container.

---

## 6. QA-7.6 Update Berkas `temuin-docs/03-architecture/devops-architecture.md`

Sinkronisasi dokumentasi infrastruktur arsitektur DevOps dengan implementasi ril yang ada di Sprint 07.

### Hasil Temuan
- [x] Berkas arsitektur DevOps di [devops-architecture.md](../temuin-docs/03-architecture/devops-architecture.md) telah diaudit secara teliti.
- [x] Dokumentasi mengenai routing gateway Nginx, zonasi limit rate, trimming Correlation ID, batasan rotasi file log kontainer (10MB per 3 file), dan port forwarding terbukti sudah sinkron 100% dengan berkas konfigurasi aktual tanpa deviasi.

---

## N. Status Task Sprint 07 (QA)

| Task ID | Nama Task | Status | Hasil | Bukti (Image Path) |
|---------|-----------|--------|-------|---------------------|
| **QA-7.1** | Blackbox routing via gateway untuk flow utama | **done** | ✅ Pass | Tersimpan di [image/sprint-07/](../image/sprint-07/) |
| **QA-7.2** | Blackbox: matikan tiap service satu-satu (Chaos Test) | **done** | ✅ Pass | Terverifikasi dinamis via polling 30 detik |
| **QA-7.3** | Blackbox: rate limit `/api/auth/login` benar 429 | **done** | ✅ Pass | [testing 7.3 success.png](../image/sprint-07/testing%207.3%20success.png) |
| **QA-7.4** | Verifikasi correlation ID end-to-end | **done** | ✅ Pass | [ss x correlation id.png](../image/sprint-07/ss%20x%20correlation%20id.png) |
| **QA-7.5** | Tulis `docs/operations-guide.md` | **done** | ✅ Pass | Lihat panduan di [operations-guide.md](./operations-guide.md) |
| **QA-7.6** | Update `devops-architecture.md` jika ada deviasi | **done** | ✅ Pass | Terverifikasi di [devops-architecture.md](../temuin-docs/03-architecture/devops-architecture.md) |

---

## N+1. Catatan Tambahan

* **Keandalan Gateway**: Nginx Gateway berhasil menyatukan seluruh routing endpoint ke port tunggal dan meningkatkan sistem keamanan dengan rate limiter.
* **Request Tracing**: Struktur log JSON dan Correlation ID yang seragam sangat mempermudah pelacakan alur kerja sistem terdistribusi ini secara real-time.
