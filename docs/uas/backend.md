# Bahan Belajar UAS — Role Backend (Temuin)

> Halo! File ini khusus buat kamu yang pegang **Backend**.
> Ditulis dengan bahasa sederhana. Tidak perlu jago ngoding — yang penting kamu paham apa yang dibangun dan bisa menjelaskannya saat ditanya.
>
> Baca `docs/uas/panduan-uas.md` (panduan bersama) dulu sebelum file ini.

---

## 1. Backend itu ngapain sih?

Backend = **otak/dapur aplikasi yang bekerja di belakang layar.** Pengguna tidak melihatnya langsung, tapi semua logika penting ada di sini.

Analogi restoran: kalau frontend itu ruang makan + pelayan, **backend adalah dapur**. Pelayan (frontend) mencatat pesanan, lalu dapur (backend) yang memasak, menyimpan stok, dan mengatur aturan.

Tugas backend di Temuin:
1. Menyediakan **API** — pintu yang dipanggil frontend untuk ambil/simpan data (contoh: "daftarkan user ini", "ambil semua barang").
2. Mengurus **aturan bisnis** — contoh: "barang found wajib punya petugas keamanan", "tidak boleh mengklaim barang sendiri".
3. Mengurus **database** — menyimpan dan mengambil data user, barang, klaim.
4. Mengurus **keamanan** — login, token JWT, cek email ITK, hash password.

---

## 2. Teknologi yang kamu pakai (dan artinya)

| Teknologi | Apa itu |
| --- | --- |
| **Python 3.12** | Bahasa pemrograman backend |
| **FastAPI** | Framework untuk membuat API dengan cepat |
| **SQLAlchemy** | "Penerjemah" antara Python dan database (ORM), jadi tidak perlu nulis SQL mentah |
| **Pydantic** | Pengecek bentuk data (validasi) — memastikan data masuk benar |
| **PostgreSQL** | Database tempat semua data disimpan |
| **JWT (python-jose)** | Token login |
| **bcrypt (passlib)** | Mengacak password supaya aman disimpan |
| **httpx** | Untuk satu service memanggil service lain |

Istilah penting:
- **API / endpoint** = satu alamat yang bisa dipanggil. Contoh: `POST /auth/login`.
- **ORM** = Object Relational Mapping. Cara mengakses database lewat objek Python, bukan tulis SQL manual. Contoh: `db.query(User)` daripada `SELECT * FROM users`.
- **Model** = gambaran satu tabel database dalam bentuk class Python. Contoh: class `User` = tabel `users`.
- **Schema (Pydantic)** = aturan bentuk data yang masuk/keluar API. Contoh: email harus format email, password minimal 8 karakter.
- **Service layer** = tempat aturan bisnis ditulis (file `service.py`).
- **Router** = tempat daftar endpoint ditulis (file `router.py`).
- **JWT** = JSON Web Token, "tiket masuk" terenkripsi yang membuktikan identitas pengguna.
- **Hash** = mengubah password jadi kode acak yang tidak bisa dibalik, supaya kalau database bocor password asli tetap aman.

---

## 3. Backend kita dipecah jadi 3 service (INTI, wajib hafal)

Awalnya backend itu satu (monolith) di folder `backend/`. Saat Sprint 6, dipecah jadi 3 service di folder `services/`. Tiap service punya tugas dan database sendiri:

| Service | Port | Tugas | Tabel yang dia urus |
| --- | --- | --- | --- |
| **auth-service** | 8001 | Daftar, login, JWT, profil | `users` |
| **item-service** | 8002 | Barang, foto, riwayat, master data | `items`, `item_images`, `item_status_histories`, `categories`, `buildings`, `locations`, `security_officers` |
| **engagement-service** | 8003 | Klaim, notifikasi, audit log | `claims`, `claim_status_histories`, `notifications`, `audit_logs` |

Hal penting yang sering ditanya dosen:
- **Kenapa cuma 3 service?** Tim backend cuma 1 orang, RAM server 1.9 GB, dan cuma ada satu jalur antar-service yang rawan. Jadi 3 itu pas. (Keputusan DEC-019.)
- **1 PostgreSQL, 3 database logis** (`auth_db`, `item_db`, `engagement_db`). Hemat RAM. Tiap service hanya sentuh database miliknya. **Tidak ada foreign key antar-database** — referensi antar-service diselesaikan lewat panggilan HTTP.
- **Token JWT dicek lokal di tiap service** pakai `SECRET_KEY` yang sama. Jadi item-service & engagement-service tidak perlu nelpon auth-service hanya untuk verifikasi token. (DEC-017.)

### Struktur tiap service (polanya sama)

```
services/auth-service/app/
├── main.py           (titik mulai FastAPI + health + metrics)
├── config.py         (pengaturan: DATABASE_URL, SECRET_KEY, dll)
├── database.py       (koneksi ke database)
├── dependencies.py   (cek token, cek role admin)
├── auth/
│   ├── router.py     (daftar endpoint /auth/*)
│   ├── schemas.py    (aturan bentuk data masuk/keluar)
│   └── service.py    (aturan bisnis: register, login)
└── models/
    └── user.py       (class User = tabel users)
```

item-service dan engagement-service punya pola sama, hanya isi domainnya beda (items/master_data, claims/notifications/status).

---

## 4. Model database (tabel-tabel NYATA)

Database diakses pakai **SQLAlchemy ORM**. Tabel dibuat otomatis saat service nyala (`Base.metadata.create_all`). Model utama:

**auth-service — `User`** (tabel `users`):
- `id` (UUID), `email` (unik), `password_hash`, `name`, `role` (default `"user"`), `phone`, `created_at`.

**item-service — `Item`** (tabel `items`):
- `type` (`lost`/`found`), `status` (default `open`, nilai: `open`/`in_claim`/`returned`/`closed`).
- `category_id`, `building_id`, `location_id`, `security_officer_id` (referensi master data).
- `created_by` (id pembuat, lintas-service jadi tanpa FK), `deleted_at` (untuk soft delete).
- Relasi ke `ItemImage` (foto, disimpan sebagai base64) dan `ItemStatusHistory` (riwayat status).
- Master data: `Category`, `Building`, `Location`, `SecurityOfficer` (masing-masing punya `id` + `name`).

**engagement-service — `Claim`** (tabel `claims`):
- `item_id`, `user_id` (lintas-service tanpa FK), `status` (default `pending`), `ownership_answer` (jawaban bukti kepemilikan).
- `Notification` (`user_id`, `title`, `message`, `is_read`).
- `AuditLog` (`user_id`, `action`, `entity_type`, `entity_id`, `details`).

> **Soft delete** = data tidak benar-benar dihapus dari database, hanya ditandai `deleted_at` terisi. Saat menampilkan daftar, yang `deleted_at` terisi disembunyikan. Aman kalau perlu dipulihkan.

---

## 5. Endpoint NYATA (hafalkan yang utama)

### auth-service (prefix `/auth`)
- `POST /auth/register` -> daftar, balikannya token.
- `POST /auth/login` -> login, balikannya token.
- `GET /auth/me` -> ambil profil sendiri (butuh login).
- `PUT /auth/me` -> ubah nama/HP.
- `GET /health` -> cek kesehatan (sekalian cek database).

### item-service (prefix `/items`)
- `POST /items/` -> buat barang (butuh login).
- `GET /items/` -> daftar barang (publik, bisa difilter: search, type, status, kategori, dll).
- `GET /items/{id}` -> detail satu barang.
- `GET /items/me` -> barang yang aku buat.
- `PUT /items/{id}` -> ubah barang.
- `PUT /items/{id}/status` -> ubah status barang.
- `DELETE /items/{id}` -> hapus (soft delete), balik kode 204.
- master data (`/master-data/...`) -> admin kelola kategori/gedung/lokasi/petugas.

### engagement-service
- `POST /claims/` -> ajukan klaim.
- `GET /claims/me` -> klaim yang aku ajukan.
- `PUT /claims/{id}/status` -> ubah status klaim (approve/reject/complete/cancel).
- `GET /notifications/me` -> notifikasiku.
- `GET /status` -> kesehatan 3 service (dipakai halaman Status frontend).

---

## 6. Keamanan auth (cara login bekerja, wajib paham)

Logika ini ada di `services/auth-service/app/auth/service.py`. Saat viva sering ditanya.

**Saat register:**
1. **Cek email ITK** (`validate_itk_email`): hanya `itk.ac.id` atau subdomain seperti `student.itk.ac.id` yang diterima. Email seperti `itk.ac.id.evil.com` ditolak (anti tipuan). Kalau bukan ITK -> error 403.
2. **Cek password** (`validate_password`): minimal 8 karakter, harus ada huruf DAN angka.
3. **Hash password** pakai bcrypt sebelum disimpan. Jadi yang tersimpan di database bukan password asli, tapi kode acak.
4. Kalau email sudah ada -> error 409 ("Email sudah terdaftar").

**Saat login:**
1. Cari user berdasarkan email.
2. Cocokkan password dengan yang di-hash (`verify_password`).
3. Kalau cocok, buat **JWT** (`create_access_token`) berisi: email (`sub`), role, id user, dan waktu kedaluwarsa (default 60 menit). Diacak pakai algoritma HS256 + `SECRET_KEY`.
4. Kalau salah -> error 401 ("Email atau password salah").

**Cek token di tiap request** (`dependencies.py`): fungsi `get_current_user` membuka JWT, ambil identitas. `require_admin` memastikan role-nya `admin`/`superadmin` untuk endpoint khusus admin.

---

## 7. Aturan bisnis klaim (logika paling rumit, NYATA)

Ada di `services/engagement-service/app/claims/service.py`. Ini contoh aturan bisnis yang bagus untuk diceritakan.

**Saat ajukan klaim (`create_claim`):**
- Tidak boleh klaim barang yang bukan tipe `found`.
- Tidak boleh klaim barang sendiri.
- Tidak boleh klaim barang yang sudah dikembalikan/ditutup.
- Tidak boleh klaim kalau barang sudah ada klaim aktif.
- Kalau lolos: buat `Claim` status `pending`, catat riwayat, lalu kirim notifikasi ke pemilik barang + semua admin.

**Saat ubah status klaim (`update_claim_status`):**
- `approved`/`rejected`/`completed` -> hanya boleh oleh pemilik barang atau admin.
- `cancelled` -> hanya boleh oleh pengaju klaim atau admin.
- Status barang ikut berubah otomatis: klaim `approved` -> barang `in_claim`; `completed` -> barang `returned`; `rejected`/`cancelled` -> barang kembali `open`.
- Kalau yang melakukan admin, dicatat ke `AuditLog`.

---

## 8. Komunikasi antar-service + ketahanan (DEC-021)

Ini satu-satunya jalur antar-service saat runtime: **engagement-service memanggil item-service** (untuk cek barang & ubah status saat klaim). Filenya `services/engagement-service/app/utils/httpx_client.py`.

Karena panggilan jaringan bisa gagal, ada pengaman:
- **Retry**: kalau gagal sesaat, dicoba ulang sampai **3 kali** dengan jeda makin lama (0.5, 1, 2 detik).
- **Tidak di-retry** kalau errornya jelas salah permintaan (400/401/403/404) — percuma diulang.
- **Circuit breaker**: kalau gagal **5 kali dalam 30 detik**, "sekring putus" — berhenti memanggil selama **60 detik** biar tidak makin parah, lalu coba lagi.
- **Correlation ID** ikut dikirim supaya satu request bisa dilacak lintas service.

> **Circuit breaker** = seperti sekring listrik. Kalau ada korslet (service tujuan rusak terus), sekring putus sementara supaya kerusakan tidak menyebar. Setelah cooldown, dicoba lagi.

---

## 9. Validasi & penanganan error (DEC-023)

- **Pydantic `field_validator`** mengecek bentuk data masuk. Contoh: `ItemCreate` memastikan `type` hanya `lost` atau `found`, judul 1-200 karakter, deskripsi maksimal 2000 karakter. Foto: maksimal 4 per barang, tiap foto maksimal sekitar 2.8 MB.
- Semua error validasi (422) diseragamkan jadi bentuk `{"detail": "<pesan>"}` supaya frontend gampang membacanya.
- **Security headers** ditambahkan di tiap service: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, dan CSP.

---

## 10. Testing backend (yang perlu kamu tahu)

- Backend pakai **pytest**, target coverage minimal **60%** (DEC-020).
- Monolith punya `backend/conftest.py` dengan fixture siap pakai: `client` (test client FastAPI), `db_session` (database SQLite di memori untuk tes), `auth_headers`/`admin_headers`. Password default tes: `TestPass123`.
- Tiap service punya folder `tests/` sendiri, contoh `services/auth-service/tests/test_smoke.py` (tes: health check, register email tidak valid ditolak, alur register-login, dll).
- Cara jalankan: `make test-backend` atau `pytest tests -v` di dalam folder service.
- Kamu cukup bisa cerita: "Tiap service punya tes pytest sendiri, dijalankan otomatis di CI lewat matrix job services-tests."

---

## 11. Bagian kamu saat live demo (skrip siap baca)

Saat demo, Backend + Frontend pegang **Slide 5 (Live Demo)**. Frontend yang klik, kamu yang menjelaskan apa yang terjadi di belakang layar.

### 11.1 Saat register & login

> "Saat klik daftar, frontend mengirim email dan password ke endpoint `/api/auth/register` di auth-service. Di sana saya cek emailnya harus domain itk.ac.id, password minimal 8 karakter dengan huruf dan angka, lalu password di-hash pakai bcrypt sebelum disimpan. Setelah login, auth-service membuat JWT yang berisi email, role, dan id pengguna, berlaku 60 menit."

### 11.2 Saat lapor barang

> "Saat barang found dilapor, item-service menyimpannya ke tabel items di item_db. Ada aturan: barang found wajib punya petugas keamanan. Fotonya disimpan sebagai base64, maksimal 4 foto per barang."

### 11.3 Saat klaim disetujui (poin paling kuat)

> "Ini bagian menarik dari microservices. Saat admin menyetujui klaim, engagement-service tidak menyimpan status barang sendiri — dia memanggil item-service lewat HTTP untuk mengubah status barang jadi `in_claim`, lalu `returned` saat selesai. Panggilan ini saya kasih retry tiga kali dan circuit breaker, supaya kalau item-service sempat bermasalah, sistem tetap tahan. Tiap aksi admin juga dicatat ke audit log."

### 11.4 Saat tunjukkan Swagger (opsional)

> "Tiap service punya dokumentasi API otomatis di /docs lewat Swagger. Ini memudahkan menguji endpoint tanpa frontend."

---

## 12. Pertanyaan viva untuk Backend (dosen tanya KAMU) + jawaban

**"Apa peran kamu di tim?"**
> Saya Backend. Saya merancang API, model database, aturan bisnis, dan keamanan. Saya juga yang memecah monolith jadi 3 microservice di Sprint 6.

**"Bagaimana autentikasi bekerja?"**
> Email plus password. Password di-hash bcrypt. Saat login berhasil, saya buat JWT berisi email, role, dan id, ditandatangani pakai SECRET_KEY dengan algoritma HS256. Token dikirim di header Authorization tiap request, dan tiap service memverifikasinya secara lokal.

**"Kenapa token diverifikasi lokal, bukan tanya ke auth-service tiap kali?"**
> Karena semua service punya SECRET_KEY yang sama, mereka bisa membuka dan memverifikasi JWT sendiri. Ini menghindari satu panggilan HTTP tambahan di tiap request, jadi lebih cepat dan auth-service tidak jadi titik kemacetan.

**"Bagaimana service saling berkomunikasi?"**
> Lewat HTTP pakai httpx. Satu-satunya jalur runtime adalah engagement-service memanggil item-service untuk cek barang dan ubah status saat klaim. Jalur ini saya beri retry dan circuit breaker.

**"Apa itu circuit breaker dan kenapa dipakai?"**
> Pengaman seperti sekring. Kalau panggilan ke item-service gagal 5 kali dalam 30 detik, breaker terbuka dan berhenti memanggil selama 60 detik supaya kegagalan tidak menumpuk, lalu mencoba lagi. Ini mencegah satu service yang rusak menyeret yang lain.

**"Bagaimana kamu menjaga konsistensi status barang dan klaim?"**
> Status keduanya saya sinkronkan di service layer. Saat klaim approved, barang jadi in_claim; completed jadi returned; rejected atau cancelled mengembalikan barang ke open. Semua perubahan dicatat di tabel riwayat status.

**"Kenapa pakai SQLAlchemy ORM, bukan SQL langsung?"**
> ORM membuat kode lebih aman dari SQL injection, lebih mudah dibaca, dan portable. Saya cukup bekerja dengan objek Python seperti User dan Item daripada menulis query mentah.

**"Bagaimana kamu mencegah input berbahaya?"**
> Pakai validasi Pydantic dengan field_validator: tipe barang dibatasi lost/found, panjang teks dibatasi, jumlah dan ukuran foto dibatasi. Email dan password divalidasi ketat di auth-service.

**"Kalau dua orang mengklaim barang yang sama bersamaan?"**
> Aturan create_claim menolak klaim baru kalau barang sudah punya klaim aktif (pending, approved, atau completed), jadi hanya satu klaim aktif per barang.

---

## 13. Pemahaman proyek keseluruhan (Backend wajib paling kuat di sini)

Sebagai backend, kamu paling sering ditanya arsitektur. Detail di `docs/uas/panduan-uas.md`. Inti:

- Temuin: lost & found ITK, hanya email itk.ac.id, wajib login.
- Monolith (Sprint 1-4) -> 3 microservice (Sprint 6): auth (8001), item (8002), engagement (8003), 1 Postgres 3 database logis.
- Semua API lewat **gateway Nginx**; gateway membagi ke service + rate limit + correlation ID.
- Deploy **Docker** di **VPS Tencent**, otomatis lewat **CI/CD GitHub Actions**.
- Observability: tiap service punya `/health`, `/metrics` (format Prometheus), dan ada `/status` agregat.

---

## 14. Checklist persiapan Backend sebelum UAS

- [ ] Sudah baca `docs/uas/panduan-uas.md`.
- [ ] Hafal 3 service, port, dan tabel yang diurus masing-masing.
- [ ] Bisa jelaskan alur register & login (validasi, hash, JWT).
- [ ] Bisa jelaskan kenapa token diverifikasi lokal di tiap service.
- [ ] Bisa jelaskan jalur engagement -> item + retry + circuit breaker.
- [ ] Bisa jelaskan aturan bisnis klaim & sinkronisasi status.
- [ ] Tahu backend pakai pytest, coverage >= 60%.
- [ ] Hafal skrip demo bagian backend.
- [ ] Latihan jawab 8 pertanyaan viva di atas minimal sekali.

Semangat! Kamu otak di balik aplikasi ini. Kuasai arsitektur, karena dosen akan menggali paling dalam ke kamu. 🎓
