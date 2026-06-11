# Pre-Demo UAS Readiness Checklist - Temuin

Dokumen ini memuat daftar kesiapan operasional teknis untuk demo UAS aplikasi Temuin. Wajib diperiksa oleh QA & DevOps minimal 30 menit sebelum presentasi.

---

## 🖥️ 1. Infrastruktur & Deployment (VPS Tencent)
- [x] VPS Tencent Cloud aktif dan lancar diakses (`temuin.pangeransilaen.net`).
- [x] 6 Container berjalan sehat (`docker ps` di server):
  - `temuin-gateway` (Nginx Gateway)
  - `auth-service` (FastAPI)
  - `item-service` (FastAPI)
  - `engagement-service` (FastAPI)
  - `temuin-frontend` (Nginx/Vite build)
  - `temuin-db` (PostgreSQL)
- [x] Total RAM container di bawah 1.4 GB (`docker stats`).
- [x] SSL/HTTPS aktif dan valid (Certbot Let's Encrypt).
- [x] Security headers terinjeksi dengan benar (HSTS, CSP, X-Frame-Options, X-Content-Type-Options).

---

## 🗄️ 2. Data Benih Database (Database Seeding)
- [x] Master data referensi telah terisi lengkap:
  - Minimal 5 Gedung ITK (Gedung A, B, C, D, Laboratorium Terpadu).
  - Minimal 5 Kategori Barang (Elektronik, Dokumen/Dompet, Kunci, Pakaian, Lainnya).
  - Minimal 3 Data Satpam (Security Officer) resmi terdaftar.
- [x] Data postingan dummy disiapkan untuk diperlihatkan saat membuka dashboard.

---

## 🔑 3. Kredensial Demo UAS (Demo Credentials)
Gunakan data kredensial berikut untuk demonstrasi agar mempercepat alur pengetesan di depan dosen penguji:

| Peran | Email | Sandi | Deskripsi |
|-------|-------|-------|-----------|
| **User A (Pelapor)** | `demo.found@student.itk.ac.id` | `Password123` | Membuat postingan barang temuan (`found`) |
| **User B (Pengklaim)** | `demo.claim@student.itk.ac.id` | `Password123` | Mengajukan klaim bukti kepemilikan |
| **Admin / Satpam** | `admin.temuin@itk.ac.id` | `AdminSecure123` | Menyetujui dan menyelesaikan klaim |

---

## 🌐 4. Sisi Klien (Client Browser)
- [x] Bersihkan cache browser (Clear Cache) sebelum demo dimulai.
- [x] Gunakan jendela browser **Incognito / Private Window** untuk memperagakan alur login multi-user secara bergantian.
- [x] DevTools Network tab siap dipantau untuk membuktikan respons Gateway di endpoint `/api/` dan keberadaan correlation ID `X-Correlation-ID`.

---

## 📼 5. Rencana Cadangan (Safety Net)
- [x] Video backup demo 5 menit (hasil rekaman DO-8.4) sudah diunggah ke Google Drive dan siap ditayangkan apabila terjadi kendala koneksi internet atau server mati saat presentasi.
- **Link Google Drive Video Backup:** *[User dapat menempelkan link video Drive di sini setelah rekaman selesai diunggah]*
