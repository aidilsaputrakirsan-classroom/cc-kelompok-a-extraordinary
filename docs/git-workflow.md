# Panduan Git Workflow — Temuin Team

Dokumen ini berisi panduan standar penggunaan Git dan GitHub untuk tim proyek Temuin. Semua anggota wajib mengikuti aturan ini untuk menjaga kualitas kode dan histori repository yang bersih.

## 1. Branching Strategy

Kita menggunakan **GitHub Flow** yang disederhanakan. Semua pengembangan fitur dilakukan di branch terpisah sebelum di-merge ke `master`.

### Konvensi Penamaan Branch
Format: `tipe/deskripsi-singkat` (lowercase, kebab-case)

| Tipe | Kegunaan | Contoh |
|------|----------|--------|
| `feature/` | Menambah fitur baru | `feature/login-page` |
| `fix/` | Memperbaiki bug | `fix/api-timeout` |
| `docs/` | Update dokumentasi | `docs/update-readme` |
| `refactor/` | Perbaikan struktur kode | `refactor/api-cleanup` |
| `chore/` | Maintenance / config | `chore/add-gitignore` |

---

## 2. Commit Message Convention

Kita menggunakan standar **Conventional Commits**.

**Format:** `tipe: deskripsi singkat`

| Tipe | Contoh |
|------|--------|
| `feat` | `feat: add email notification for found items` |
| `fix` | `fix: resolve crash on image upload` |
| `docs` | `docs: add deployment instructions` |
| `style` | `style: fix button alignment in mobile view` |
| `refactor` | `refactor: simplify database connection logic` |

---

## 3. Pull Request (PR) Process

Setiap perubahan **WAJIB** melalui Pull Request. Tidak diperbolehkan push langsung ke branch `master`.

### Langkah Pembuatan PR:
1. Pastikan branch sudah di-push ke GitHub.
2. Klik **Compare & pull request** di halaman GitHub.
3. Gunakan template PR yang sudah tersedia.
4. Pilih minimal **1 Reviewer** sesuai dengan pembagian peran.
5. Tunggu status **Approved** sebelum melakukan merge.

---

## 4. Code Review Guidelines

Reviewer bertanggung jawab memastikan kode berkualitas sebelum masuk ke `master`.

### Hal yang Perlu Diperiksa:
* **Fungsionalitas:** Apakah fitur berjalan sesuai kebutuhan?
* **Readability:** Apakah kode mudah dibaca dan dipahami?
* **Security:** Apakah ada *hardcoded secrets* atau celah keamanan?

### Cara Memberikan Feedback:
* Gunakan komentar yang konstruktif dan sopan.
* Berikan saran perbaikan (Suggestion) jika memungkinkan.
* Berikan pujian (Praise) untuk kode yang ditulis dengan sangat baik.

---

## 5. Merge Strategy

* Kita menggunakan **Squash and Merge** sebagai standar.
* Ini akan menggabungkan semua commit di branch fitur menjadi satu commit bersih di branch `master`.
* Hapus branch fitur setelah merge selesai untuk menjaga kebersihan repository.

---

## 6. CODEOWNERS

Gunakan file `.github/CODEOWNERS` untuk mengatur reviewer otomatis:
* `/backend/` -> @Lead-Backend
* `/frontend/` -> @Lead-Frontend
* `/docs/` -> @Lead-QA-Docs
