# Glossary - Temuin

## Istilah Produk

| Istilah | Definisi |
|--------|----------|
| Item | Entitas laporan barang hilang atau temuan |
| Item Type | Jenis item: `lost` atau `found` |
| Item Status | Status aktif item: `open`, `in_claim`, `returned`, `closed` |
| Claim | Permohonan kepemilikan atas item `found` |
| Claim Status | Status claim: `pending`, `approved`, `rejected`, `completed`, `cancelled` |
| Security Officer | Satpam atau petugas penerima titipan barang temuan |
| Master Data | Data referensi seperti kategori, gedung, lokasi, dan satpam |
| Audit Log | Catatan aksi penting admin atau superadmin |
| History | Riwayat perubahan status item atau claim |
| Image Data | Data gambar item disimpan sebagai base64 di PostgreSQL (DEC-016) |

## Istilah Teknis

| Istilah | Definisi |
|--------|----------|
| Base Branch | Branch integrasi utama project final, yaitu `master` |
| Feature Branch | Branch kerja per task, dibuat dari `master` |
| Source of Truth | Dokumen aktif yang menjadi acuan utama implementasi |
| Active Sprint | Sprint yang menjadi prioritas auto-selection agent saat ini |
| Branch/Ref | Nama branch remote tempat task terakhir didorong |
| shadcn/ui | Sistem komponen UI yang wajib dipakai pada frontend |

## Catatan Bahasa

- Gunakan istilah di tabel ini secara konsisten
- UI dan dokumentasi kerja tim menggunakan Bahasa Indonesia
- Istilah teknis umum seperti branch, commit, push, dan sprint tetap boleh dipakai
