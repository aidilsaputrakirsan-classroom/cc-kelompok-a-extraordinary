# Dokumentasi Optimasi Docker Image - Backend

## Perbandingan Ukuran Image

### Before Optimization (Single-Stage)
- **Base Image:** `python:3.12-slim`
- **Build Strategy:** Single-stage build
- **Image Size:** **304 MB**
- **Dockerfile:** `Dockerfile.single-stage`

### After Optimization (Multi-Stage with Alpine)
- **Base Image:** `python:3.12-alpine`
- **Build Strategy:** Multi-stage build
- **Image Size:** **157 MB**
- **Dockerfile:** `Dockerfile` (current)

## Hasil Optimasi

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Image Size | 304 MB | 157 MB | **-147 MB (-48.4%)** |
| Base Image | python:3.12-slim (~50 MB) | python:3.12-alpine (~5 MB) | -45 MB |
| Build Strategy | Single-stage | Multi-stage | Cleaner separation |

## Strategi Optimasi yang Diterapkan

### 1. Multi-Stage Build
- **Stage 1 (Builder):** Install dependencies dengan build tools
- **Stage 2 (Production):** Copy hanya runtime files, tanpa build tools

### 2. Alpine Linux Base Image
- Menggunakan `python:3.12-alpine` yang jauh lebih kecil dari `python:3.12-slim`
- Alpine: ~5 MB vs Slim: ~50 MB

### 3. Virtual Environment
- Install dependencies di virtual environment
- Copy hanya venv ke production stage
- Tidak perlu install ulang di production

### 4. Aggressive Cleanup
- Uninstall pip, setuptools, wheel (tidak perlu di production)
- Hapus `__pycache__` dan `.pyc` files
- Hapus test directories
- Hapus documentation files

### 5. Runtime Optimization
- `--no-cache-dir`: Tidak simpan pip cache
- `--no-compile`: Skip bytecode compilation
- `PYTHONDONTWRITEBYTECODE=1`: Disable bytecode generation

### 6. Minimal Runtime Dependencies
- Production stage hanya install `libpq` (PostgreSQL client library)
- Tidak install gcc, musl-dev, dll (hanya perlu di builder stage)

## Testing

### Functionality Test
✅ Container berjalan dengan baik
✅ API endpoints berfungsi normal
✅ Database connection berhasil
✅ Authentication & authorization works
✅ CRUD operations tested

### Performance
- Startup time: ~3-5 detik
- Healthcheck: Passing
- Memory usage: Normal (tidak ada overhead)

## Kesimpulan

Optimasi berhasil mengurangi ukuran image dari **304 MB** menjadi **157 MB** (pengurangan **48.4%**). 

Meskipun target awal adalah < 150 MB, hasil 157 MB sudah sangat baik mengingat:
- Aplikasi menggunakan banyak dependencies (FastAPI, SQLAlchemy, Pydantic, Cryptography, dll)
- Semua functionality tetap berjalan dengan baik
- Tidak ada trade-off dalam performance atau features

Untuk mencapai < 150 MB, diperlukan trade-off seperti:
- Mengurangi dependencies (misal: ganti cryptography dengan library lebih ringan)
- Compile Python ke binary (PyInstaller/Nuitka)
- Menggunakan distroless images (tapi lebih sulit di-debug)

## Rekomendasi

Image Alpine dengan ukuran 157 MB sudah optimal untuk production use. Trade-off untuk mencapai < 150 MB tidak sebanding dengan effort dan potential issues.

---

**Generated:** 2026-04-08
**Author:** DevOps Team
