# Konsep Produk - Temuin

## Ringkasan

Temuin adalah platform lost and found internal kampus ITK. Sistem ini hanya bisa diakses oleh civitas kampus dengan akun Google dan email `@itk.ac.id`.

Temuin dipakai untuk:
- melaporkan barang hilang
- melaporkan barang temuan
- mencari barang
- mengajukan klaim barang temuan
- memproses pengembalian barang lewat satpam atau titik penitipan resmi

## Latar Belakang

Informasi barang hilang dan temuan di kampus sering tersebar di grup chat dan komunikasi informal. Akibatnya data tidak terpusat, sulit dicari ulang, dan tidak ada jejak status yang jelas.

## Visi

Menyediakan platform lost and found internal kampus yang rapi, aman, dan mudah digunakan, dengan proses penitipan dan pengembalian yang terdokumentasi.

## Tujuan Produk

1. Memusatkan informasi barang hilang dan temuan dalam satu platform
2. Mempermudah pencarian dan pencocokan barang
3. Menyediakan alur klaim dan pengembalian yang jelas
4. Menjaga akuntabilitas penitipan barang temuan ke satpam resmi
5. Menyediakan fondasi teknis yang cocok untuk pembelajaran cloud, containerization, CI/CD, dan microservices

## Aktor Sistem

| Aktor | Peran |
|------|-------|
| User | Membuat laporan, mencari barang, klaim, lihat riwayat |
| Admin | Moderasi posting, proses klaim, konfirmasi returned |
| Superadmin | Kelola role admin, master data global, audit |

## Prinsip MVP

- Sistem bersifat internal, bukan platform publik
- Login wajib, tidak ada akses anonim
- Barang temuan wajib dititipkan ke satpam resmi
- Alur klaim harus terdokumentasi dan tidak boleh ganda
- Fitur dibuat bertahap per sprint, selaras dengan modul kuliah

## Dokumen Terkait

- [decision-log.md](./decision-log.md)
- [glossary.md](./glossary.md)
- [../02-prd/prd-overview.md](../02-prd/prd-overview.md)
