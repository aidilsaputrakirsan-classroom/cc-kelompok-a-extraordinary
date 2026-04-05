# Decision Log - Temuin

Dokumen ini mencatat keputusan final yang tidak boleh dilanggar tanpa keputusan tim baru.

## Keputusan Produk

### DEC-001: Login wajib
- Sistem hanya dapat diakses setelah login
- Tidak ada mode anonim atau publik

### DEC-002: Login via Google dan email kampus
- Hanya akun Google dengan suffix `itk.ac.id` yang boleh masuk
- User pertama kali otomatis dibuat di database internal dengan role default `user`

### DEC-003: Role sistem
- Role aktif adalah `user`, `admin`, dan `superadmin`
- Role `admin` dan `superadmin` hanya bisa diatur secara internal

### DEC-004: Barang temuan wajib dititipkan
- User boleh membuat posting `found` langsung
- Barang temuan wajib dititipkan ke satpam resmi
- Posting `found` wajib memilih `security_officer_id`

### DEC-005: Aturan klaim
- Hanya item `found` yang bisa diklaim
- Satu item hanya boleh punya satu claim aktif
- Jika claim ditolak atau dibatalkan, item boleh diklaim lagi
- Verifikasi claim MVP memakai jawaban deskriptif singkat, bukan upload file

### DEC-006: Status item
- Status item yang valid: `open`, `in_claim`, `returned`, `closed`
- Status `closed` hanya boleh dipakai admin atau superadmin

### DEC-007: Status claim
- Status claim yang valid: `pending`, `approved`, `rejected`, `completed`, `cancelled`
- Status item dan status claim harus dipisahkan

### DEC-008: Audit trail
- Soft delete dipakai untuk posting milik user
- Riwayat perubahan item dan claim disimpan terpisah
- Audit log dipakai untuk aksi penting admin dan superadmin

### DEC-009: Notifikasi MVP
- Notifikasi MVP berbentuk in-app notification berbasis database
- Event inti: claim approved/rejected/completed, posting dimoderasi/ditutup, claim baru untuk admin

### DEC-010: Aturan foto
- Maksimal 4 foto per item
- Maksimal ukuran efektif per foto kurang dari 2 MB
- Resize dan kompresi dilakukan di frontend sebelum upload

## Keputusan Delivery Dan Workflow

### DEC-011: Base branch project final
- Branch integrasi project final adalah `master`
- `praktikum` adalah branch histori practicum

### DEC-012: Status task sprint
- Status yang valid hanya `todo`, `in_progress`, `blocked`, `done`
- `done` berarti perubahan sudah di-commit dan di-push

### DEC-013: Auto-selection agent
- Jika user hanya menyebut role, agent memilih task pertama yang dependency-nya aman di sprint aktif
- Lompatan sprint boleh dilakukan hanya jika sprint aktif tidak punya task aman, dan harus disertai peringatan

### DEC-014: QA disederhanakan
- QA fokus pada blackbox testing, bukti screenshot, dan update dokumentasi seperlunya
- Tidak ada issue tracker formal, bug template formal, atau known issues doc panjang sebagai kewajiban

### DEC-015: Frontend stack wajib
- Frontend final project wajib memakai `React + Vite + Tailwind CSS + shadcn/ui`
- Gunakan JavaScript/JSX agar tetap dekat dengan modul praktikum

### DEC-016: Image storage
- Gambar item disimpan sebagai base64 di kolom `image_data` pada tabel `item_images` di PostgreSQL
- Frontend melakukan resize dan kompresi sebelum upload (sesuai DEC-010)
- Tidak ada external storage (S3, GCS, dsb.) untuk MVP
- Batas per foto tetap kurang dari 2 MB setelah kompresi

### DEC-017: Cross-service token verification
- Saat microservices split (Sprint 6), verifikasi JWT antar service menggunakan shared JWT secret
- Masing-masing service memvalidasi JWT secara lokal tanpa memanggil service lain
- Secret disimpan di env vars, bukan hardcoded

## Dokumen Terkait

- [concept.md](./concept.md)
- [../02-prd/prd-overview.md](../02-prd/prd-overview.md)
- [../03-architecture/frontend-architecture.md](../03-architecture/frontend-architecture.md)
- [../03-architecture/database-design.md](../03-architecture/database-design.md)
