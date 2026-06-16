# Reflection Paper UAS Cloud Computing — Lead QA & Docs
**Nama:** Rani Ayu Dewi  
**GitHub Username:** [@raniayudewi](https://github.com/raniayudewi)  
**Role:** Lead Quality Assurance & Documentation  
**Proyek:** Temuin — Platform Lost & Found ITK  

---

## 1. Pendahuluan dan Tanggung Jawab Peran

Sebagai Lead Quality Assurance (QA) & Documentation dalam proyek **Temuin**, tanggung jawab utama saya berfokus pada dua pilar penting dalam siklus pengembangan perangkat lunak (SDLC): **penjaminan kualitas fungsional sistem** dan **pemeliharaan dokumentasi sebagai *source of truth***. 

Secara berkala dari Sprint 1 hingga Sprint 8, peran saya meliputi:
1. **Penyusunan Rencana Pengujian (Test Plan) & Skenario Uji (Test Cases):** Merancang skenario pengujian fungsional terperinci untuk tipe pengguna (User, Admin, dan Superadmin) serta memetakan alur bisnis utama (*Lost & Found reporting, Claim flow, Verification, dan Audit logs*).
2. **Eksekusi Pengujian Fungsional (Blackbox Testing):** Melakukan verifikasi endpoint API backend secara manual via Swagger/Postman serta menguji antarmuka frontend (UI/UX) untuk mendeteksi bug, inkonsistensi status, atau celah validasi input.
3. **Penyusunan Laporan QA Per Sprint:** Melacak dan mendokumentasikan hasil pengujian di akhir setiap sprint ke dalam folder `docs/` guna memastikan tidak terjadi regresi fungsi (kegagalan fitur lama akibat penambahan fitur baru).
4. **Manajemen Pengetahuan & Dokumentasi Proyek:** Mengorganisasi struktur repositori dokumentasi teknis (`docs/` dan `temuin-docs/`) agar selalu selaras dengan kode program yang di-deploy ke server produksi.

---

## 2. Kontribusi Utama dalam Proyek

Selama perjalanan proyek Temuin dari arsitektur Monolith hingga bertransformasi menjadi Microservices, kontribusi konkret yang saya berikan meliputi:

*   **Penyusunan 8 Laporan QA Sprint Terstruktur:** Saya menulis laporan QA formal dari [Sprint 01 QA Report](file:///c:/Users/Rani%20Ayu%20Dewi/OneDrive/Documents/GitHub/cc-kelompok-a-extraordinary/docs/sprint-01-qa-report.md) hingga [Sprint 08 QA Report](file:///c:/Users/Rani%20Ayu%20Dewi/OneDrive/Documents/GitHub/cc-kelompok-a-extraordinary/docs/sprint-08-qa-report.md) lengkap dengan bukti screenshot pengujian (*evidence*).
*   **Blackbox Testing Terpadu:** Saya menyusun laporan komprehensif untuk pengujian backend ([API Blackbox Testing Report](file:///c:/Users/Rani%20Ayu%20Dewi/OneDrive/Documents/GitHub/cc-kelompok-a-extraordinary/docs/api-blackbox-testing.md)) dan pengujian frontend ([Frontend Blackbox Testing Report](file:///c:/Users/Rani%20Ayu%20Dewi/OneDrive/Documents/GitHub/cc-kelompok-a-extraordinary/docs/frontend-blackbox-testing.md)).
*   **Pengamanan Skema Validasi Input (Kolaborasi Backend):** Saya mengidentifikasi celah keamanan pada Sprint 2 dan 3 di mana email umum (Gmail/Yahoo) masih bisa melakukan pendaftaran. Saya mendorong penerapan aturan validasi ketat menggunakan Pydantic regex di backend agar hanya domain email `@itk.ac.id` dan `@student.itk.ac.id` yang diizinkan mendaftar.
*   **Pengujian Integrasi Lintas Layanan & API Gateway:** Pada Sprint 7, saat API Gateway Nginx dan Request Tracing diperkenalkan, saya menguji validitas pengiriman header `X-Correlation-ID` untuk memastikan log aktivitas pengguna dapat dilacak lintas service secara konsisten.
*   **Penyusunan Panduan Demo & Kesiapan UAS:** Menyusun [final-checklist.md](file:///c:/Users/Rani%20Ayu%20Dewi/OneDrive/Documents/GitHub/cc-kelompok-a-extraordinary/docs/final-checklist.md) untuk meminimalkan risiko kegagalan live demo di hadapan dosen penguji.

---

## 3. Analisis Keputusan Teknis dan Tantangan QA

Proses transisi arsitektur dari Monolith (Sprint 1–4) ke Microservices (Sprint 6+) membawa tantangan yang sangat besar bagi aktivitas QA:

### A. Pengujian Integrasi yang Flaky di Lingkungan CI
*   **Tantangan:** Pada awal pemecahan layanan menjadi 3 microservices, integrasi pengujian otomatis (*integration tests*) di GitHub Actions sering mengalami kegagalan (*flaky*). Hal ini terjadi karena container gateway telah dinyatakan sehat (*healthy*), namun service internal (seperti `item-service`) masih dalam proses inisialisasi koneksi database.
*   **Analisis & Solusi:** Berkolaborasi dengan DevOps untuk menambahkan parameter `start_period` dan penundaan waktu tunggu (*timeout*) pada dependensi container di berkas Docker Compose. Di sisi QA, saya juga menyusun naskah pengujian cadangan (*video backup demo*) sebagai jaring pengaman jika terjadi kendala serupa saat live demo.

### B. Validasi Konsistensi Status Lintas Service
*   **Tantangan:** Tidak ada foreign key fisik di database pasca pemisahan skema PostgreSQL menjadi 3 database logis (`auth_db`, `item_db`, `engagement_db`). Kami harus memastikan bahwa status suatu item (di `item-service`) secara otomatis berubah (misal dari `open` menjadi `in_claim` atau `returned`) begitu admin memproses data klaim (di `engagement-service`).
*   **Analisis & Solusi:** Saya merancang skenario uji khusus untuk memvalidasi sinkronisasi status ini. Pengujian dilakukan dengan memicu error buatan pada `item-service` untuk melihat apakah `engagement-service` dapat menerapkan *Circuit Breaker* (memutus sementara sambungan) dan melakukan *graceful degradation* (menampilkan pesan kesalahan terstruktur tanpa merusak sesi pengguna).

---

## 4. Pembelajaran dan Refleksi Pribadi

Melalui proyek Temuin ini, saya mendapatkan banyak wawasan berharga:
*   **Pentingnya Kolaborasi Lintas Peran:** QA tidak bisa bekerja terisolasi di akhir proses. Koordinasi intensif dengan Backend (mengenai format respons error 422/429) dan Frontend (mengenai penangkapan toast notifications) sangat krusial untuk menghasilkan UX aplikasi yang stabil.
*   **Shift-Left Testing:** Menunggu sistem selesai dideploy ke VPS baru diuji adalah kesalahan besar. Melakukan pengujian seawal mungkin pada level skema API (via Swagger lokal) membantu kami menemukan bug logika bisnis sebelum kode digabungkan ke branch utama (`master`).
*   **Keandalan Sistem di Cloud:** Saya belajar bahwa aplikasi cloud yang andal tidak hanya tentang bebas bug, tetapi juga tentang bagaimana sistem menangani kegagalan jaringan secara anggun (*resilience*) dan bagaimana aktivitas di dalamnya dapat dipantau (*observability*).

---

## 5. Kesimpulan Kesiapan Ujian

Berdasarkan seluruh pengujian fungsional akhir yang saya lakukan pada Sprint 8:
*   Aplikasi Temuin pada URL Produksi (`https://temuin.pangeransilaen.net`) telah dinyatakan stabil.
*   Log terstruktur JSON dan Correlation ID berfungsi baik.
*   Skenario kegagalan/kemacetan jaringan (*circuit breaker*) telah diuji dan berjalan sesuai spesifikasi arsitektur.

Saya menyatakan bahwa **kualitas perangkat lunak dan kelengkapan dokumentasi proyek Temuin telah siap 100% untuk didemonstrasikan pada Ujian Akhir Semester (UAS)**.
