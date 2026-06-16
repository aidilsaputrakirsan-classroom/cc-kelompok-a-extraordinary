# Reflection Paper UAS Cloud Computing — Lead Backend
**Nama:** Raisha Alika Irwandira  
**GitHub Username:** [@disnejy](https://github.com/disnejy)  
**Role:** Lead Backend Developer  
**Proyek:** Temuin — Platform Lost & Found ITK  

---

## 1. Pendahuluan dan Tanggung Jawab Peran

Sebagai Lead Backend Developer dalam proyek **Temuin**, tanggung jawab utama saya adalah merancang, membangun, dan memelihara seluruh logika bisnis (*business rules*), skema database, antarmuka pemrograman aplikasi (API), serta memastikan keandalan komunikasi antar-layanan (*inter-service communication*). 

Secara berkala dari Sprint 1 hingga Sprint 8, peran saya meliputi:
1. **Perancangan API & Struktur Modular:** Membangun RESTful API menggunakan framework FastAPI dengan pendekatan arsitektur modular yang stabil pada fase awal monolith, sebelum akhirnya melakukan dekomposisi layanan.
2. **Desain & Migrasi Database:** Mengelola skema database PostgreSQL menggunakan SQLAlchemy ORM, mendefinisikan relasi antar-entitas (User, Items, Item Images, Claims, Notifications, Audit Logs) serta menyiapkan struktur database logis untuk tiap layanan.
3. **Autentikasi & Otorisasi:** Mengimplementasikan alur pendaftaran dan login berbasis email kampus (`itk.ac.id`), enkripsi password dengan bcrypt (`passlib`), penerbitan token JWT, serta mekanisme verifikasi token tanpa memicu overhead komunikasi jaringan (*shared JWT verification*).
4. **Implementasi Resilience & Reliability:** Membangun mekanisme toleransi kegagalan (*fault tolerance*) pada komunikasi antar-layanan microservices melalui pola Retry dengan Exponential Backoff dan Circuit Breaker untuk mencegah kegagalan sistem yang berseri (*cascading failure*).
5. **Observability Stack:** Mengintegrasikan structured JSON logging, middleware pelacakan aktivitas (*Correlation ID*), metrik aplikasi format Prometheus, serta API health status aggregator.
6. **Kualitas Kode & Keamanan (Security Hardening):** Menerapkan pengujian unit (*unit testing*) menggunakan Pytest, melakukan pembersihan kode, serta melakukan penguatan validasi input (*Pydantic field validator*) untuk meminimalkan celah keamanan (OWASP Top 10).

---

## 2. Kontribusi Utama dalam Proyek

Selama siklus pengembangan proyek Temuin dari fase Monolith hingga bertransformasi menjadi Microservices, kontribusi konkret yang saya berikan meliputi:

*   **FastAPI Modular API (Sprint 1–5):** Saya merancang dan mengimplementasikan seluruh endpoint fungsional utama mulai dari autentikasi, manajemen barang hilang/temuan (*items*), klaim barang (*claims*), notifikasi in-app, hingga master data (kategori barang, gedung, lokasi, dan petugas keamanan).
*   **Penyusunan Arsitektur Microservices (Sprint 6, DEC-019):** Saya melakukan dekomposisi sistem monolitik menjadi 3 layanan hybrid terdistribusi:
    *   `auth-service` (Port 8001): Mengelola identitas pengguna, register, login, dan profil.
    *   `item-service` (Port 8002): Mengelola data postingan lost & found, gambar barang (disimpan sebagai base64 di tabel database untuk menyederhanakan MVP sesuai DEC-016), riwayat perubahan status, dan referensi master data.
    *   `engagement-service` (Port 8003): Mengurus alur verifikasi klaim, notifikasi, dan logs audit aktivitas admin.
*   **Shared JWT Verification Helper (Sprint 6, DEC-017):** Saya menulis helper verifikasi token JWT yang bersifat modular untuk diimpor oleh ketiga service. Verifikasi dilakukan secara lokal di setiap service menggunakan shared secret key, sehingga service lain tidak perlu melakukan pemanggilan jaringan ke `auth-service` hanya untuk mengecek validitas token.
*   **Reliability Client (Sprint 7, DEC-021):** Saya membangun [services/engagement-service/app/utils/httpx_client.py](file:///Users/raishaalika/Documents/GitHub/cc-kelompok-a-extraordinary/services/engagement-service/app/utils/httpx_client.py) menggunakan `httpx`. Di dalamnya terdapat class `CircuitBreaker` dan helper `request_with_retry_and_cb` yang menerapkan:
    *   **Retry:** Melakukan 3 kali percobaan ulang otomatis dengan jeda exponential backoff (`0.5s`, `1.0s`, `2.0s`) hanya untuk error berkategori *retryable* (5xx, timeout, network error).
    *   **Circuit Breaker:** Memutus panggilan jaringan secara instan jika terjadi 5 kegagalan berturut-turut dalam 30 detik (transisi ke state `OPEN`), dan menunggu 60 detik (cooldown) sebelum mencoba kembali ke state `HALF_OPEN`.
    *   **Graceful Degradation:** Merancang penanganan fallback di mana jika `item-service` mengalami kegagalan, `engagement-service` tetap menyajikan data daftar klaim pengguna tanpa menggagalkan request (enrichment data barang dilewati secara anggun).
*   **Observability Stack Integration (Sprint 7, DEC-022):** 
    *   Mengintegrasikan `JSONFormatter` kustom pada logging python standar untuk menghasilkan output log JSON satu baris yang siap di-scrape oleh pengumpul log.
    *   Menerapkan penjalaran `X-Correlation-ID` lintas service. Log di setiap service dapat dihubungkan berdasarkan correlation ID unik 12 karakter yang dikirimkan melalui HTTP header.
    *   Menyediakan endpoint `/metrics` di setiap service untuk mengekspos metrik internal (HTTP requests, durations, error counter) berformat Prometheus text exposition, serta endpoint `/api/status` untuk mengumpulkan status kesehatan ketiga service secara real-time.
*   **Unit Testing & Coverage (Sprint 5, DEC-020):** Membangun lingkungan pengujian menggunakan `pytest` dengan mockup database menggunakan fixture di `conftest.py`. Mengamankan coverage testing backend di atas batas minimal 60% (`pytest --cov-fail-under=60`) di pipeline CI untuk menjamin integritas logika bisnis.
*   **Security Hardening & Input Validation (Sprint 8, DEC-023):** Memperketat validasi skema input Pydantic menggunakan `field_validator`. Membatasi panjang karakter input text (misal password minimal 8 karakter dengan kombinasi huruf dan angka, deskripsi barang maks 2000 karakter) serta memperketat pendaftaran agar hanya menerima domain email kampus `@itk.ac.id` dan `@student.itk.ac.id`.

---

## 3. Analisis Keputusan Teknis dan Tantangan Backend

Transformasi arsitektur dari monolith ke microservices menghadirkan tantangan teknis tersendiri di sisi backend:

### A. Keputusan Granularitas Microservices Hybrid (DEC-019)
*   **Tantangan:** Awalnya terdapat wacana untuk membagi sistem menjadi 5 microservices granular. Namun, spesifikasi hardware VPS Tencent Cloud yang digunakan untuk deployment sangat terbatas (RAM 1.9 GB). Menjalankan 5 instance Python FastAPI terpisah beserta database-nya masing-masing berisiko menyebabkan pemakaian memori berlebih dan kegagalan startup server (*Out of Memory*).
*   **Analisis & Solusi:** Kami mengambil keputusan (DEC-019) untuk menggunakan skema **3 hybrid services** (`auth`, `item`, dan `engagement`) serta menampungnya di dalam **satu instance PostgreSQL dengan 3 logical database** (`auth_db`, `item_db`, `engagement_db`). Pendekatan ini secara drastis mengurangi konsumsi overhead RAM VPS (menjaga total alokasi memori di kisaran ~1.4 GB) tanpa mengorbankan isolasi logis data antar-layanan.

### B. Konsistensi Status Lintas Batas Database Tanpa Foreign Key Fisik
*   **Tantangan:** Dengan pemisahan skema database menjadi 3 database logis terpisah, kami kehilangan kemampuan penegakan integritas referensial data secara fisik via SQL foreign key. Padahal, alur bisnis mewajibkan perubahan status klaim barang di `engagement-service` harus disinkronkan dengan pembaruan status barang di `item-service`.
*   **Analisis & Solusi:** Sinkronisasi status dilakukan melalui panggilan HTTP internal menggunakan `httpx_client.py`. Untuk mencegah inkonsistensi akibat kegagalan transaksi terdistribusi, saya merancang skema *fault tolerance* di mana client akan mendeteksi status kegagalan. Jika `item-service` gagal merespons, `engagement-service` tidak akan menggantung atau mengalami error total (*crash*), melainkan mengaktifkan *Circuit Breaker* ke status `OPEN` dan menerapkan penanganan kegagalan secara anggun (*graceful degradation*), sehingga sistem tetap aman dan responsif.

---

## 4. Pembelajaran dan Refleksi Pribadi

Selama mengerjakan sisi backend dari proyek Temuin, saya memperoleh banyak wawasan berharga dan pengalaman praktis:

*   **Penerapan Nyata Pola Microservices:** Saya menyadari bahwa memecah aplikasi menjadi microservices bukan sekadar memisahkan folder kode, melainkan harus merancang boundary modul dengan matang. Saya belajar bagaimana mengelola siklus hidup data terdistribusi dan pentingnya local JWT verification untuk performa aplikasi.
*   **Pentingnya Aspek Ketahanan Aplikasi (Resilience):** Cloud computing mengajarkan saya bahwa kegagalan jaringan atau layanan down adalah hal yang lumrah terjadi. Menulis kode pertahanan seperti Circuit Breaker dan Retry secara manual memberikan pemahaman mendalam tentang bagaimana aplikasi skala industri menjaga ketersediaannya (*high availability*).
*   **Observability sebagai Navigasi Utama:** Dulu, menelusuri bug di microservices terasa sangat sulit. Melalui structured JSON logging dan Correlation ID, saya belajar bahwa melacak alur eksekusi request lintas service menjadi sangat terorganisir dan instan.
*   **Disiplin Pengujian & Validasi Ketat:** Membaca error di console logs produksi mengajarkan saya pentingnya validasi skema input di pintu gerbang utama aplikasi (API layer). Mengombinasikan validasi ketat Pydantic dengan unit testing Pytest yang berjalan otomatis di pipeline CI/CD memberi rasa aman saat kode dideploy ke server produksi.

---

## 5. Kesimpulan Kesiapan Ujian

Berdasarkan seluruh hasil pengembangan, integrasi, dan pengujian backend hingga Sprint 8:
*   Ketiga service (`auth-service`, `item-service`, `engagement-service`) telah didekomposisi dengan sukses dan berjalan stabil di VPS produksi Tencent Cloud (`https://temuin.pangeransilaen.net`).
*   Mekanisme keamanan backend seperti local JWT verification, enkripsi bcrypt, validasi email kampus ITK, dan pertahanan Pydantic schema telah diimplementasikan 100%.
*   Pola ketahanan inter-service (Circuit Breaker & Retry) dan observability stack (structured logging, correlation ID, metrik Prometheus, dan `/api/status` endpoint) berfungsi optimal dan telah lolos uji integrasi otomatis.

Saya menyatakan bahwa **sistem backend, arsitektur database, dan mekanisme integrasi antar-layanan proyek Temuin telah siap 100% untuk didemonstrasikan pada Ujian Akhir Semester (UAS)**.
