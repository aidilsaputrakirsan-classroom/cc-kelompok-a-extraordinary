# Reflection Paper UAS Cloud Computing — Lead DevOps
**Nama:** Pangeran Borneo Silaen  
**GitHub Username:** [@PangeranSilaen](https://github.com/PangeranSilaen)  
**Role:** Lead DevOps & Infrastructure  
**Proyek:** Temuin — Platform Lost & Found ITK  

---

## 1. Pendahuluan dan Tanggung Jawab Peran

Sebagai Lead DevOps & Infrastructure dalam proyek **Temuin**, tanggung jawab utama saya berfokus pada satu hal mendasar: **memastikan aplikasi yang ditulis tim Backend dan Frontend benar-benar bisa dibangun secara otomatis, berjalan stabil, dan hidup di internet**. Jika Backend dan Frontend menulis kode, peran saya adalah membungkus kode itu menjadi container, menjalankannya di server, dan mengotomasi seluruh proses pengirimannya ke produksi.

Secara berkala dari Sprint 1 hingga Sprint 8, peran saya meliputi:
1. **Containerization (Docker & Compose):** Membungkus tiap komponen (database, service, frontend, gateway) menjadi container dan mengorkestrasinya agar bisa dinyalakan serempak dengan satu perintah.
2. **Continuous Integration / Continuous Deployment (CI/CD):** Merancang pipeline GitHub Actions yang otomatis menjalankan pengujian saat ada perubahan dan otomatis men-deploy saat kode di-merge ke `master`.
3. **Deployment & Operasional Server:** Menjalankan aplikasi di VPS Tencent Cloud, mengurus domain, sertifikat HTTPS, gateway, dan menjaga keterbatasan sumber daya server.
4. **Gateway, Observability & Security:** Membangun API Gateway Nginx sebagai pintu masuk tunggal, menerapkan rate limiting, correlation ID, structured logging, serta hardening keamanan infrastruktur.
5. **Tata Kelola Repositori:** Menerapkan branch protection pada `master`, CODEOWNERS, dan disiplin tracking pekerjaan melalui GitHub Issues.

---

## 2. Kontribusi Utama dalam Proyek

Selama perjalanan Temuin dari arsitektur Monolith hingga bertransformasi menjadi Microservices, kontribusi konkret yang saya berikan meliputi:

*   **Containerization Penuh dengan Multi-Stage Build:** Saya menyusun [Dockerfile](file:///D:/Data/Documents/Semester%206/Cloud%20Computing/cc-kelompok-a-extraordinary/services/auth-service/Dockerfile) multi-stage untuk tiap service Python (tahap *builder* untuk dependency, tahap *production* yang ramping), sehingga ukuran image kecil dan permukaan serangan minimal. Frontend memakai pola serupa dengan `node:20-alpine` untuk build dan `nginx-unprivileged` untuk penyajian.
*   **Orkestrasi 6 Container di Satu VPS:** Saya merancang [stack microservices production](file:///D:/Data/Documents/Semester%206/Cloud%20Computing/cc-kelompok-a-extraordinary/infra/docker-compose.microservices.yml) berisi `db`, `auth-service`, `item-service`, `engagement-service`, `frontend`, dan `gateway`. Karena RAM VPS hanya 1.9 GB, saya menetapkan *memory limit* per container dan menjaga total konsumsi di bawah ~1.4 GB.
*   **API Gateway Nginx (Sprint 7):** Saya membangun [gateway/nginx.conf](file:///D:/Data/Documents/Semester%206/Cloud%20Computing/cc-kelompok-a-extraordinary/gateway/nginx.conf) sebagai satu pintu masuk yang mengarahkan `/api/*` ke tiga service, sekaligus menerapkan **rate limiting** (`auth_zone` 5r/s untuk login/register, `general_zone` 30r/s untuk endpoint umum) yang menolak kelebihan request dengan HTTP 429, mencegah server kewalahan oleh request yang tidak perlu maupun brute-force.
*   **Pipeline CI/CD Otomatis:** Saya menulis dua workflow GitHub Actions — [ci.yml](file:///D:/Data/Documents/Semester%206/Cloud%20Computing/cc-kelompok-a-extraordinary/.github/workflows/ci.yml) (5 job: lint, test backend, test frontend, test tiap service via matrix, dan integration test) serta [cd.yml](file:///D:/Data/Documents/Semester%206/Cloud%20Computing/cc-kelompok-a-extraordinary/.github/workflows/cd.yml) (build & push 4 image ke Docker Hub, lalu SSH deploy ke VPS dan health check ke domain produksi).
*   **Observability & Reliability:** Saya menerapkan correlation ID lintas service, structured JSON logging, endpoint `/metrics` format Prometheus, serta `proxy_next_upstream` untuk failover transient 5xx, sehingga satu request bisa dilacak utuh lintas tiga service.
*   **Dokumentasi Infrastruktur:** Saya menyusun [Docker Guide](file:///D:/Data/Documents/Semester%206/Cloud%20Computing/cc-kelompok-a-extraordinary/docs/docker-guide.md), [Deployment Guide](file:///D:/Data/Documents/Semester%206/Cloud%20Computing/cc-kelompok-a-extraordinary/docs/deployment-guide.md), dan [Branch Protection Guide](file:///D:/Data/Documents/Semester%206/Cloud%20Computing/cc-kelompok-a-extraordinary/docs/branch-protection-guide.md) agar pengetahuan infrastruktur tidak terkunci di satu kepala.

---

## 3. Analisis Keputusan Teknis dan Tantangan DevOps

Transisi arsitektur dari Monolith (Sprint 1–5) ke Microservices yang di-deploy ke VPS (Sprint 6+) membawa tantangan infrastruktur yang nyata:

### A. Keterbatasan Sumber Daya VPS dan Topologi Dua Lapis
*   **Tantangan:** VPS hanya memiliki 2 vCPU dan 1.9 GB RAM, namun harus menampung enam container sekaligus tanpa mengganggu service lain yang sudah berjalan di server itu. Selain itu, sertifikat Let's Encrypt perlu diverifikasi sementara service internal tidak boleh terekspos ke internet.
*   **Analisis & Solusi:** Saya merancang topologi **dua lapis Nginx**: Nginx *host* menangani SSL termination di port 443 dan meneruskan ke Nginx *gateway* (container) di `127.0.0.1:8080`. Semua container hanya *bind* ke loopback, sehingga hanya Nginx host yang menghadap internet. Untuk RAM, saya memakai image alpine, satu instance PostgreSQL dengan tiga database logis (alih-alih tiga instance terpisah), dan memory limit ketat per container.

### B. Gotcha Bind Mount Gateway saat Deploy Otomatis
*   **Tantangan:** Konfigurasi gateway di-*bind-mount* ke image `nginx:alpine` standar. Akibatnya, `docker compose up -d` tidak otomatis memuat ulang Nginx saat isi `nginx.conf` berubah, karena definisi service-nya sendiri tidak berubah. Ini sempat membuat perubahan routing/rate-limit tidak ikut ter-deploy.
*   **Analisis & Solusi:** Saya menambahkan langkah eksplisit di pipeline CD: `docker exec temuin-gateway nginx -t && nginx -s reload` — memvalidasi config terlebih dahulu lalu memuat ulang Nginx. Saya juga menambahkan health check bertahap (retry 3x ke domain produksi) sebagai jaring pengaman agar deploy yang gagal langsung terdeteksi, bukan diketahui dari laporan pengguna.

---

## 4. Pembelajaran dan Refleksi Pribadi

Melalui proyek Temuin ini, saya mendapatkan banyak wawasan berharga yang sebelumnya hanya saya pahami sebatas teori:

*   **Dari Konsep ke Praktik Container:** Saya benar-benar memahami Docker dan container bukan dari membaca, tetapi dari membungkus aplikasi nyata, menemui error, dan memperbaikinya. Konsep seperti named volume yang terpisah dari siklus hidup container (sehingga data tetap utuh saat container di-restart) jadi sangat melekat karena saya mengalaminya sendiri.
*   **Nginx, Gateway, dan Perlindungan Server:** Saya belajar bahwa gateway bukan sekadar pengarah lalu lintas, tetapi juga garis pertahanan pertama. Menerapkan rate limit agar server tidak kewalahan oleh request berlebih mengajarkan saya bahwa keandalan sistem cloud sama pentingnya dengan fungsionalitasnya.
*   **Git, GitHub, dan Otomasi yang Memberdayakan:** Saya jadi mendalami fitur Git dan GitHub yang sangat membantu — GitHub Actions yang ternyata bisa dipicu lewat `gh` CLI, serta GitHub Issues untuk melacak tiap pekerjaan agar progres tiap sprint jelas dan terdokumentasi. Disiplin branch protection dan PR membuat saya paham bahwa otomasi yang baik justru memberi kebebasan, bukan mengekang.
*   **Fondasi Linux dan Workflow Industri (CI/CD):** Latihan deployment microservices beberapa minggu lalu memaksa saya menguasai dasar-dasar Linux secara langsung. Dari sana saya akhirnya memahami bentuk nyata workflow standar industri: dari satu commit kecil, kode bisa otomatis diuji, dibangun, dan sampai ke produksi tanpa langkah manual.
*   **Nilai dari Trial and Error:** Banyak sekali percobaan yang gagal sebelum berhasil — container yang tidak mau `healthy`, deploy yang macet, config yang tidak ter-reload. Namun justru di situ pembelajaran terbesar terjadi, dan saat akhirnya semuanya berjalan mulus, rasanya benar-benar menyenangkan dan sepadan.

---

## 5. Kesimpulan Kesiapan Ujian

Berdasarkan seluruh proses pembangunan dan verifikasi infrastruktur hingga Sprint 8:
*   Aplikasi Temuin pada URL Produksi (`https://temuin.pangeransilaen.net`) telah berjalan stabil di VPS Tencent Cloud dengan HTTPS aktif.
*   Pipeline CI/CD (GitHub Actions) berfungsi otomatis dari push hingga deploy, lengkap dengan health check ke domain produksi.
*   Gateway, rate limiting, correlation ID, structured logging, dan hardening keamanan (container non-root, security headers, manajemen secret) telah diterapkan sesuai spesifikasi arsitektur.

Saya menyatakan bahwa **infrastruktur, pipeline CI/CD, dan deployment proyek Temuin telah siap 100% untuk didemonstrasikan pada Ujian Akhir Semester (UAS)**.
