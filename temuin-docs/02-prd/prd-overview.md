# PRD Overview - Temuin

## Problem Statement

Civitas kampus ITK belum memiliki sistem terpusat untuk mengelola barang hilang dan barang temuan. Informasi tersebar di grup chat dan komunikasi informal, sehingga sulit ditelusuri dan tidak terdokumentasi dengan baik.

## Target Users

| User Segment | Kebutuhan Utama |
|-------------|-----------------|
| Mahasiswa | Lapor barang hilang/temuan, cari barang, klaim |
| Dosen dan Staff | Lapor barang, cari barang, verifikasi informasi |
| Satpam/Petugas | Menerima titipan, membantu proses pengembalian |
| Admin Sistem | Moderasi, proses klaim, konfirmasi returned |

## Product Goals

1. Sentralisasi informasi barang hilang dan temuan
2. Alur klaim yang jelas dan terdokumentasi
3. Akuntabilitas penitipan barang temuan
4. Akses terkontrol hanya untuk civitas kampus
5. Jejak audit yang cukup untuk kebutuhan operasional dan pembelajaran

## Success Criteria MVP

| Kriteria | Target |
|---------|--------|
| Login via Google kampus | Berfungsi end-to-end |
| Buat posting lost/found | Bisa dilakukan dalam alur yang sederhana |
| Pencarian dan filter | Bisa dipakai untuk menemukan item relevan |
| Klaim item found | Bisa berjalan dari pending sampai completed |
| Moderasi admin | Admin bisa approve, reject, close, dan mark returned |

## Scope MVP

### In Scope
- Login Google dan validasi email kampus
- CRUD posting lost dan found
- Upload foto dengan pemrosesan client-side
- Search dan filter
- Klaim barang temuan
- Status item dan status claim
- Riwayat status
- Master data kategori, gedung, lokasi, satpam
- Moderasi posting dan klaim
- Notifikasi in-app sederhana

### Out Of Scope
- Push notification atau email notification
- Broadcast pengumuman
- Dashboard statistik publik
- Upload bukti file untuk verifikasi claim
- Mobile app native

## Dokumen Terkait

- [prd-features.md](./prd-features.md)
- [prd-user-flows.md](./prd-user-flows.md)
- [prd-non-functional.md](./prd-non-functional.md)
