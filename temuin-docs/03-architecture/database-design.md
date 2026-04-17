# Database Design - Temuin

## Tabel Inti

| Tabel | Fungsi |
|------|--------|
| `users` | User internal hasil register/login |
| `items` | Laporan barang lost/found |
| `item_images` | Data gambar item disimpan sebagai base64 (DEC-016) |
| `claims` | Proses klaim item found |
| `categories` | Master kategori |
| `buildings` | Master gedung |
| `locations` | Master lokasi |
| `security_officers` | Master satpam/petugas titipan |
| `notifications` | Notifikasi in-app |
| `item_status_histories` | Riwayat status item |
| `claim_status_histories` | Riwayat status claim |
| `audit_logs` | Jejak aksi admin/superadmin |

## Field Penting

### users
- `id`
- `firebase_uid` (deprecated, nullable - legacy dari Firebase Auth)
- `email`
- `password_hash` (bcrypt hash, nullable untuk user lama yang belum re-register)
- `name`
- `role`
- `phone`
- `created_at`

### items
- `id`
- `type`
- `status`
- `title`
- `description`
- `category_id`
- `building_id`
- `location_id`
- `security_officer_id`
- `created_by`
- `deleted_at`

### claims
- `id`
- `item_id`
- `user_id`
- `status`
- `ownership_answer`
- `created_at`

### item_images
- `id`
- `item_id`
- `image_data` (base64 encoded, maks 2 MB setelah kompresi)
- `display_order`
- `created_at`

## Aturan Data

- `users.firebase_uid` adalah kolom legacy dari Firebase Auth, nullable dan deprecated
- `users.password_hash` menyimpan bcrypt hash password user
- User mendaftar dan login langsung dengan email + password
- `items.type` hanya `lost` atau `found`
- `items.status` dan `claims.status` dipisahkan
- `security_officer_id` wajib untuk item `found`
- Soft delete memakai `deleted_at`
- History tables wajib merekam perubahan penting

## Evolusi Microservices

- Saat split, `users` dan data auth pindah ke auth DB
- Tabel item, claim, master data, notification, history, dan audit tetap di item DB

## Dokumen Terkait

- [backend-architecture.md](./backend-architecture.md)
- [../01-concept/decision-log.md](../01-concept/decision-log.md)
