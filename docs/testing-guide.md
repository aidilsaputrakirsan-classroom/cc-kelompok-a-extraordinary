# 🧪 Panduan Testing — Temuin Project

Dokumen ini berisi panduan bagi seluruh anggota tim untuk menjalankan pengujian otomatis (*automated testing*) di lingkungan lokal maupun cloud (GitHub Actions).

---

## 1. Backend Testing (Python & pytest)

Kita menggunakan framework **pytest** untuk menguji logika API di sisi backend.

### Prasyarat
Pastikan dependensi testing sudah terinstall:
```powershell
cd backend
pip install pytest pytest-cov httpx
```

### Menjalankan Test
Jalankan perintah ini di dalam folder `backend`:
```powershell
pytest
```

### Melihat Test Coverage
Untuk melihat seberapa banyak kode yang sudah tercover oleh test:
```powershell
pytest --cov=. --cov-report=term-missing
```
*Target coverage tim: Minimal 60%*

---

## 2. Frontend Testing (React & Vitest)

*(Bagian ini akan di-update setelah Lead Frontend melakukan push konfigurasi Vitest)*

### Menjalankan Test
Jalankan perintah ini di dalam folder `frontend`:
```powershell
npm test
```

---

## 3. Monitoring CI di GitHub Actions

Setiap kali kamu melakukan **Push** atau membuat **Pull Request (PR)**, GitHub akan otomatis menjalankan seluruh test di cloud.

### Cara Membaca Log CI:
1. Buka repository di GitHub.
2. Klik tab **Actions**.
3. Pilih workflow run terbaru (biasanya berjudul sesuai commit message kamu).
4. Klik job yang gagal (bertanda ❌ merah) untuk melihat detail error-nya.
5. Scroll ke bawah pada bagian log untuk menemukan baris yang menyebabkan kegagalan.

---

## 4. Cara Menambah Test Baru

Jika kamu menambah fitur baru, wajib menambahkan unit test:
1. Buat file baru di `backend/tests/` dengan awalan `test_*.py`.
2. Gunakan *fixture* dari `conftest.py` untuk mempermudah akses database test.
3. Jalankan `pytest` secara lokal sebelum melakukan push untuk memastikan fitur baru tidak merusak fitur lama.

---

## 5. Tips Debugging Test Failure
* Jika test gagal hanya di GitHub tapi berhasil di lokal, cek apakah ada file yang lupa di-commit (misal: `.env` atau file baru di `tests/`).
* Gunakan perintah `pytest -vv` untuk melihat detail perbandingan data yang menyebabkan error.
