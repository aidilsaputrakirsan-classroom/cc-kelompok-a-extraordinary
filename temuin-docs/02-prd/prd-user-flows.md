# PRD User Flows - Temuin

## 1. Login Flow

1. User membuka halaman login
2. User klik login Google
3. Frontend menerima token dari Google
4. Frontend kirim token ke backend
5. Backend validasi token dan email kampus
6. Backend membuat atau sinkronkan user internal
7. Backend kirim JWT internal ke frontend
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
