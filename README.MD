# ☁️ Cloud App - Temuin (Lost & Found Platform)

Deskripsi Singkat : 
Temuin adalah platform Lost & Found berbasis web yang dirancang untuk membantu civitas kampus dalam melaporkan dan menemukan barang hilang atau barang temuan secara terpusat dan transparan. Aplikasi ini memungkinkan pengguna untuk membuat laporan kehilangan atau penemuan barang, melakukan pencarian berdasarkan kategori dan lokasi, serta melacak status barang hingga kembali ke pemiliknya.  

Platform ini ditujukan untuk mahasiswa, dosen, dan seluruh civitas kampus agar proses pencarian barang menjadi lebih cepat, terorganisir, dan terdokumentasi dengan baik dibandingkan metode manual seperti bertanya langsung atau menyebar informasi melalui grup chat.  

## 🎯 Latar Belakang Masalah
Kehilangan barang di lingkungan kampus merupakan kejadian yang sering terjadi, baik di ruang kelas, laboratorium, perpustakaan, maupun area umum lainnya. Saat ini proses pencarian barang hilang masih dilakukan secara manual, seperti bertanya kepada teman, menghubungi satpam, atau memposting di media sosial yang informasinya tidak terstruktur dan sulit dilacak.

Tidak adanya sistem terpusat menyebabkan:
- Informasi barang hilang dan ditemukan tersebar dan tidak terdokumentasi dengan baik.
- Sulitnya memverifikasi status barang apakah sudah dikembalikan atau belum.
- Kurangnya transparansi dalam proses klaim dan pengembalian barang.

Oleh karena itu, diperlukan sebuah platform digital yang dapat mengelola laporan lost & found secara terstruktur, transparan, dan mudah diakses oleh seluruh civitas kampus.

## 🎯 Tujuan Pengembangan
Tujuan pengembangan aplikasi Temuin adalah:  

- Membangun sistem terpusat untuk pelaporan barang hilang dan barang ditemukan.
- Mempermudah proses pencarian dan pencocokan barang lost & found.
- Menyediakan fitur pelacakan status barang secara transparan.
- Meningkatkan efisiensi dan kecepatan pengembalian barang kepada pemiliknya.
- Mengimplementasikan arsitektur cloud-native menggunakan containerization dan CI/CD sebagai bagian dari pembelajaran Cloud Computing.

## 🚀 Target Pengguna 
Aplikasi Temuin ditujukan untuk:

- Mahasiswa
- Dosen
- Staff dan tenaga kependidikan
- Petugas keamanan kampus

Secara umum, seluruh civitas kampus yang beraktivitas di lingkungan kampus dan berpotensi mengalami kehilangan atau menemukan barang.

## 👥 Tim Pengembang

| Nama | NIM | Peran |
|------|-----|-------|
| Raisha Alika Irwandira | 10231077 | Lead Backend |
| Nicholas Christian Samuel Manurung | 10231069 | Lead Frontend |
| Pangeran Borneo Silaen | 10231073 | Lead DevOps |
| Rani Ayu Dewi | 10231079 | Lead QA & Docs |

---

## 🛠️ Tech Stack

| Teknologi | Fungsi |
|-----------|--------|
| FastAPI | Backend REST API |
| React + Vite | Frontend SPA |
| PostgreSQL | Database laporan barang |
| Docker | Containerization |
| GitHub Actions | CI/CD Pipeline |
| Railway / Render | Cloud Deployment |

---

## 🏗️ Arsitektur Sistem (Week 1)
tambahkan....... (Diagram ini akan berkembang setiap minggu)

---

## 🔌 API Endpoint (Week 1)
Tolong dilengkapi........ tabel ini 

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | / | Status API |
| GET | /health | Health Check |
| GET | /team | Informasi anggota tim |

Endpoint `/team` digunakan untuk memverifikasi kontribusi anggota sesuai instruksi modul.

---

## 🚀 Cara Menjalankan Project

### 1️⃣ Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2️⃣ Frontend 
```bash
cd frontend
npm install
npm run dev
```

## 📌 Roadmap Milestone & Project Structure

### 📅 Roadmap Pengembangan
contoh roadmap seperti tabel dibawah ini .....

| Minggu | Target | Status |
|--------|--------|--------|
| 1 | Setup & Hello World | ✅ |
| 2 | REST API + Database | ⬜ |
| 3 | React Frontend | ⬜ |
| 4 | Full-Stack Integration | ⬜ |
| 5–7 | Docker & Compose | ⬜ |
| 8 | UTS Demo | ⬜ |
| 9–11 | CI/CD Pipeline | ⬜ |
| 12–14 | Microservices | ⬜ |
| 15–16 | Final & UAS | ⬜ |

---

### 📁 Project Structure
...........
