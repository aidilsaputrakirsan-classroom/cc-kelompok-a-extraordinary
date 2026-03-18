# PRD Features - Temuin

## Fitur MVP Utama

### 1. Authentication And Access
- Login Google
- Validasi email `@itk.ac.id`
- Auto-create user internal
- Role-based access: user, admin, superadmin

### 2. Item Reporting
- Buat posting barang hilang
- Buat posting barang temuan
- Upload foto
- Edit posting
- Soft delete posting

### 3. Item Discovery
- Daftar item
- Detail item
- Search by keyword
- Filter by type, category, location, status

### 4. Claim And Return Flow
- Ajukan claim untuk item `found`
- Jawaban verifikasi kepemilikan
- Proses approve/reject claim oleh admin
- Konfirmasi returned oleh admin

### 5. Supporting Features
- Riwayat status item
- Riwayat status claim
- Master data kategori, gedung, lokasi, satpam
- Notifikasi in-app dasar
- Audit log admin

## User Stories Ringkas

### User
- Saya ingin login dengan akun kampus agar bisa memakai sistem
- Saya ingin membuat laporan barang hilang atau temuan agar informasi tercatat
- Saya ingin mencari barang dengan kata kunci dan filter agar lebih cepat menemukan item relevan
- Saya ingin mengajukan claim untuk barang temuan yang saya yakini milik saya
- Saya ingin melihat status claim dan status item agar tahu progresnya

### Admin
- Saya ingin memoderasi posting agar data sistem tetap rapi
- Saya ingin memproses claim agar barang kembali ke pemilik yang benar
- Saya ingin mengelola master data agar form dan alur sistem tetap valid

### Superadmin
- Saya ingin mengelola role admin agar akses operasional tetap terkendali
- Saya ingin melihat audit log untuk menelusuri tindakan penting

## Scope Per Sprint

| Sprint | Fokus |
|-------|-------|
| 1 | Setup project dan fondasi data |
| 2 | Auth dan core item flow |
| 3 | Search, claim, notifications, master data |
| 4 | Docker dan kesiapan UTS |
| 5 | CI/CD dan test automation backend |
| 6 | Deploy dan microservices split |
| 7 | Gateway, monitoring, audit |
| 8 | Security hardening dan final polish |

## Dokumen Terkait

- [prd-overview.md](./prd-overview.md)
- [prd-user-flows.md](./prd-user-flows.md)
- [../06-sprints/sprint-01.md](../06-sprints/sprint-01.md)
