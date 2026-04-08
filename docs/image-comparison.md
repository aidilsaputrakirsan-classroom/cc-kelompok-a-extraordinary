# Docker Image Comparison - Modul 5

Dokumen ini mencatat perbandingan ukuran antara berbagai varian base image Python 3.12 yang ditarik secara lokal untuk kebutuhan containerization aplikasi Temuin.

## Perbandingan Ukuran Image

| Image Tag | OS Base | Ukuran (Disk) | Keterangan |
|-----------|---------|---------------|------------|
| `python:3.12` | Debian (Full) | **1.62 GB** | Berisi paket build lengkap, compiler, dan library tambahan. Sangat besar tapi paling kompatibel. |
| `python:3.12-slim` | Debian (Minimal) | **179 MB** | Paket esensial saja. Cocok untuk aplikasi yang tidak butuh banyak build tools tambahan. |
| `python:3.12-alpine` | Alpine Linux | **75 MB** | Sangat kecil, menggunakan `musl libc` bukan `glibc`. Bisa bermasalah dengan paket Python yang butuh kompilasi C. |

## Analisis QA

1. **Efisiensi Ruang**: Menggunakan versi `alpine` atau `slim` dapat menghemat ruang penyimpanan hingga **90-95%** dibandingkan versi full.
2. **Kecepatan Deployment**: Image yang lebih kecil mempercepat proses *pull* dan *push* di pipeline CI/CD serta mempercepat waktu *startup* container.
3. **Keamanan**: Base image yang lebih kecil memiliki *attack surface* (celah keamanan) yang lebih sedikit karena paket yang terinstall jauh lebih sedikit.

**Rekomendasi:** Untuk aplikasi Temuin, disarankan menggunakan **`python:3.12-slim`** sebagai jalan tengah antara ukuran yang kecil dan kompatibilitas library (karena masih berbasis Debian/glibc).
