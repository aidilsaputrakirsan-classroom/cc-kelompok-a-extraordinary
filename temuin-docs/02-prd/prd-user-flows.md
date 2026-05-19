# PRD User Flows - Temuin

## 0. Register Flow

1. User membuka halaman register
2. User mengisi form: email kampus (`@itk.ac.id`), password, dan nama
3. Frontend mengirim `POST /api/auth/register` ke backend
4. Backend (auth-service) memvalidasi domain email dan password policy (min 8 char, ada huruf + angka)
5. Backend hash password dengan bcrypt dan simpan user di tabel `users`
6. Backend mengembalikan JWT internal aplikasi
7. Frontend menyimpan JWT di `localStorage` dan redirect ke halaman utama

## 1. Login Flow

1. User membuka halaman login
2. User mengisi form: email kampus dan password
3. Frontend mengirim `POST /api/auth/login` ke backend
4. Backend (auth-service) memverifikasi password terhadap bcrypt hash di `users`
5. Backend mengembalikan JWT internal aplikasi
6. Frontend menyimpan JWT di `localStorage`
7. Frontend fetch profil via `GET /api/auth/me`
8. User masuk ke aplikasi

## 2. Lost Item Flow

1. User login
2. User membuat laporan barang hilang
3. Item tersimpan sebagai `lost` dengan status `open`
4. User lain dapat melihat dan mencari item
5. Jika barang kembali, admin mengubah status menjadi `returned`
6. Jika laporan ditutup karena alasan operasional, admin mengubah status menjadi `closed`

## 3. Found Item Flow

1. User login
2. User menemukan barang
3. User menitipkan barang ke satpam resmi
4. User membuat posting `found`
5. User memilih satpam penerima titipan
6. Item tersimpan sebagai `found` dengan status `open`

## 4. Claim Flow

1. User login
2. User membuka detail item `found`
3. User menjawab pertanyaan verifikasi dan submit claim
4. Claim tersimpan dengan status `pending`
5. Item berubah menjadi `in_claim`
6. Admin memeriksa claim
7. Jika ditolak, claim menjadi `rejected` dan item kembali `open`
8. Jika disetujui, claim menjadi `approved` dan item tetap `in_claim`
9. Setelah serah terima, admin ubah claim menjadi `completed` dan item menjadi `returned`

## 5. Notification Flow

1. Event penting terjadi
2. Backend membuat notifikasi berbasis database
3. Frontend menampilkan daftar notifikasi user
4. User dapat menandai notifikasi sebagai sudah dibaca

## Dokumen Terkait

- [prd-features.md](./prd-features.md)
- [../01-concept/decision-log.md](../01-concept/decision-log.md)
