# Temuin Testing Guide

Panduan lengkap untuk menjalankan pengujian otomatis (*automated testing*) dan memeriksa cakupan kode (*code coverage*) pada proyek **Temuin**, baik di backend maupun frontend, serta langkah penyelesaian kendala (*troubleshooting*).

---

## 📋 Daftar Isi
1. [Prasyarat Sistem (Prerequisites)](#-prasyarat-sistem-prerequisites)
2. [Pengujian Backend (FastAPI + Pytest)](#-pengujian-backend-fastapi--pytest)
3. [Pengujian Frontend (React + Vitest)](#-pengujian-frontend-react--vitest)
4. [Batas Minimal Coverage (Thresholds Reference)](#-batas-minimal-coverage-thresholds-reference)
5. [Troubleshooting Kegagalan CI](#-troubleshooting-kegagalan-ci)

---

## 🛠️ Prasyarat Sistem (Prerequisites)

Sebelum menjalankan pengujian, pastikan Anda telah menyiapkan komponen berikut:

### A. Untuk Backend
- Python `3.12+` terinstall.
- Dependensi backend di-install dalam virtual environment:
  ```powershell
  cd backend
  python -m venv .venv
  # Windows
  .\.venv\Scripts\activate
  # Linux/Mac
  source .venv/bin/activate
  pip install -r requirements.txt
  ```

### B. Untuk Frontend
- Node.js `20+` dan npm terinstall.
- Dependensi frontend di-install:
  ```powershell
  cd frontend
  npm install
  ```

---

## 🐍 Pengujian Backend (FastAPI + Pytest)

Backend Temuin menggunakan **Pytest** sebagai framework testing utama dan **Pytest-Cov** untuk melacak cakupan kode (*code coverage*).

### 1. Menjalankan Tes Secara Manual
Aktifkan virtual environment backend Anda, lalu jalankan perintah berikut:
```powershell
# Menjalankan seluruh pengujian backend
pytest tests -v --tb=short
```

Jika menggunakan **Docker & Makefile** di root folder:
```powershell
make test-backend
```

### 2. Memeriksa Coverage Backend
Untuk menguji cakupan kode sekaligus memvalidasi apakah telah memenuhi standar minimal **60%**, jalankan:
```powershell
pytest tests --cov=app --cov-report=term-missing --cov-fail-under=60
```
*Perintah ini akan memicu error/kegagalan jika cakupan kode di bawah 60%.*

Jika menggunakan **Docker & Makefile**:
```powershell
make test-coverage
```

---

## ⚛️ Pengujian Frontend (React + Vitest)

Frontend Temuin menggunakan **Vitest** dan **React Testing Library** untuk pengujian komponen reaktif.

### 1. Menjalankan Tes Secara Manual
Buka folder `frontend` di terminal Anda, lalu jalankan script berikut:

* **Mode Interaktif (Watch Mode)**:
  ```powershell
  cd frontend
  npm run test
  ```
* **Mode Satu Kali Jalan (Single Run)**:
  ```powershell
  cd frontend
  npm run test:run
  ```

Jika menggunakan **Docker & Makefile** di root folder:
```powershell
make test-frontend
```

### 2. Memeriksa Coverage Frontend
Untuk melihat cakupan pengujian frontend, jalankan:
```powershell
cd frontend
npm run test:coverage
```
Laporan cakupan pengujian lengkap akan dibuat di terminal dan HTML report di folder `frontend/coverage/`.

---

## 📊 Batas Minimal Coverage (Thresholds Reference)

Berdasarkan keputusan arsitektur **DEC-020**, proyek Temuin menetapkan standar minimal cakupan pengujian otomatis berikut yang divalidasi langsung di Pipeline CI (GitHub Actions):

| Service | Tooling | Coverage Target (Threshold) | Kegunaan |
|---------|---------|-----------------------------|----------|
| **Backend** | Pytest-Cov | **≥ 60%** | Memastikan keandalan API CRUD, autentikasi, dan logika database. |
| **Frontend** | Vitest Coverage | **≥ 40%** | Memastikan komponen UI utama dan status navigasi teruji dengan baik. |

---

## 🔍 Troubleshooting Kegagalan CI

Jika alur *Continuous Integration* (CI) di GitHub Actions Anda berwarna **Merah (Failed)** pada job linting atau testing, ikuti panduan berikut:

### 1. Kegagalan Job Linting (Backend Ruff / Frontend ESLint)
* **Penyebab**: Kode Anda melanggar gaya penulisan kode atau aturan standardisasi.
* **Solusi Backend (Ruff)**:
  Jalankan auto-fix menggunakan Ruff secara lokal di root folder:
  ```powershell
  make lint-fix
  ```
* **Solusi Frontend (ESLint)**:
  Jalankan manual linting di folder `frontend` untuk mendeteksi pelanggaran:
  ```powershell
  cd frontend
  npm run lint
  ```
  Perbaiki warning atau error yang tercatat pada file spesifik yang dilaporkan di terminal.

### 2. Kegagalan Job Backend-Test (Coverage atau Assertion Error)
* **Penyebab**: Ada tes yang gagal (*failed assertion*) atau cakupan kode turun di bawah **60%** setelah Anda menambahkan fitur baru tanpa menulis tes baru.
* **Solusi**:
  1. Jalankan `pytest tests -v` lokal untuk melihat detail assertion yang gagal.
  2. Tulis test cases baru di folder `backend/tests/` untuk file kode baru Anda agar nilai cakupan naik kembali ke atas threshold.

### 3. Kegagalan Job Frontend-Test (Vitest atau Build)
* **Penyebab**: Pengujian komponen gagal karena perubahan state, atau proses kompilasi bundel production (`npm run build`) error karena tipe data/sintaksis tidak valid.
* **Solusi**:
  1. Jalankan `npm run test:run` di lokal folder `frontend` dan perbaiki test case yang terganggu.
  2. Lakukan manual build secara lokal untuk memastikan kebersihan bundel:
     ```powershell
     cd frontend
     npm run build
     ```
     Perbaiki seluruh error transpilasi yang dilaporkan sebelum melakukan push ulang.
