# Panduan UAS Cloud Computing — Tim Temuin

> Dokumen ini panduan bersama untuk SEMUA anggota tim saat UAS Cloud Computing.
> Tujuannya: kamu tinggal baca, tiru, dan praktik. Tidak perlu mikir dari nol.
>
> Baca dokumen ini dulu sampai habis. Setelah itu buka file role kamu:
> - QA & Docs -> `docs/uas/qa.md`
> - Frontend -> `docs/uas/frontend.md`
> - Backend -> `docs/uas/backend.md`
> - DevOps -> `docs/uas/devops.md`

---

## 1. Apa itu UAS ini (baca pelan-pelan)

UAS Cloud Computing ini **bukan ujian tulis**. Kamu dan tim akan:

1. **Presentasi** proyek Temuin di depan dosen (slide 5-7 halaman).
2. **Live demo** aplikasi Temuin yang sudah online (buka website, register, login, lapor barang, klaim, dll).
3. **Viva / tanya jawab** — dosen tanya satu per satu ke tiap anggota. Ini bagian paling penting: kamu harus bisa menjelaskan bagianmu sendiri DAN paham gambaran besar proyek.

Total waktu kira-kira: **12 menit presentasi + demo, lalu 8 menit tanya jawab.**

### Cara dosen kasih nilai (penting, hafalkan persentasenya)

| Komponen | Bobot | Maksudnya apa |
| --- | --- | --- |
| Live Demo | 25% | Aplikasi jalan dari awal sampai akhir tanpa error |
| Arsitektur & Kode | 20% | Microservices, struktur kode rapi, monitoring |
| CI/CD Pipeline | 15% | Pipeline otomatis di GitHub hijau (lulus semua) |
| Individual Viva | 25% | Tiap orang bisa jawab pertanyaan dosen sendiri-sendiri |
| Dokumentasi & Reflection | 15% | README lengkap, diagram, refleksi pelajaran |

Perhatikan: **Individual Viva 25%**. Artinya nilai kamu sebagian besar ditentukan oleh seberapa lancar KAMU menjawab, bukan cuma kerja tim. Makanya tiap role punya file belajar sendiri.

---

## 2. Apa itu Temuin (proyek kita) — wajib hafal

**Temuin** adalah aplikasi web **lost & found (barang hilang & ditemukan) untuk kampus ITK** (Institut Teknologi Kalimantan).

Cerita simpelnya: di kampus ada orang yang **kehilangan** barang, dan ada yang **menemukan** barang. Temuin mempertemukan mereka. Yang menemukan barang melapor ("aku nemu dompet di Gedung A"), yang kehilangan bisa **mengklaim** ("itu dompetku, ciri-cirinya begini"), lalu **admin** memverifikasi dan barang dikembalikan.

Hal-hal khas Temuin yang harus kamu tahu:

- **Hanya warga ITK** yang bisa daftar. Email wajib berakhiran `itk.ac.id` (contoh: `budi@student.itk.ac.id`). Email Gmail biasa ditolak.
- **Wajib login**, tidak ada mode anonim. Semua orang yang pakai aplikasi pasti punya akun.
- Password minimal **8 karakter, harus ada huruf dan angka**.
- Ada **3 jenis pengguna (role)**: `user` (mahasiswa/dosen biasa), `admin` (yang verifikasi klaim), dan `superadmin`.
- Barang punya **tipe**: `lost` (hilang) atau `found` (ditemukan).
- Status barang berubah-ubah: `open` (baru dilapor) -> `in_claim` (sedang ada yang klaim & disetujui) -> `returned` (sudah dikembalikan) / `closed`.
- Status klaim: `pending` (menunggu) -> `approved` (disetujui admin) -> `completed` (barang diserahkan) atau `rejected`/`cancelled`.

### Alamat penting (hafalkan)

- **Website live:** `https://temuin.pangeransilaen.net`
- **Halaman status sistem:** `https://temuin.pangeransilaen.net/status` (menampilkan 3 service hidup atau tidak)
- **Server:** VPS Tencent Cloud, IP `43.156.15.248`

---

## 3. Perjalanan arsitektur (ini sering ditanya dosen)

Dosen suka tanya: "Ceritakan evolusi arsitektur kalian." Jawabannya: proyek ini **tidak langsung jadi microservices**. Kita mulai dari yang sederhana lalu berkembang. Hafalkan urutan ini:

| Tahap | Bentuk sistem | Penjelasan singkat |
| --- | --- | --- |
| Sprint 1-4 | **Monolith** | Satu aplikasi backend (FastAPI), satu database, satu frontend (React). Semua jadi satu. |
| Sprint 5 | Monolith + CI | Ditambah pipeline otomatis di GitHub (cek kode tiap ada perubahan). |
| Sprint 6 | **Deploy + dipecah jadi microservices** | Aplikasi naik ke server VPS, lalu backend dipecah jadi **3 service** di belakang sebuah gateway. |
| Sprint 7 | Production gateway + monitoring | Gateway dikasih rate limit, retry, circuit breaker, correlation ID, dan halaman status. |
| Sprint 8 | Security + rilis v1.0.0 | Container non-root, audit secret, security headers, lalu rilis versi final. |

### 3 microservice kita (WAJIB hafal nama, port, dan tugasnya)

Saat Sprint 6, backend monolith dipecah jadi 3 bagian kecil yang masing-masing punya tugas sendiri:

| Service | Port | Tugasnya | Database miliknya |
| --- | --- | --- | --- |
| **auth-service** | 8001 | Daftar, login, JWT (token), profil pengguna | `auth_db` |
| **item-service** | 8002 | Barang, foto barang, riwayat, master data (kategori/gedung/lokasi/petugas) | `item_db` |
| **engagement-service** | 8003 | Klaim, notifikasi, audit log | `engagement_db` |

Catatan penting yang sering ditanya:
- **Kenapa cuma 3 service, bukan banyak?** Karena tim backend cuma 1 orang, RAM server cuma 1.9 GB, dan cuma ada satu jalur antar-service yang rawan. Jadi 3 service itu pas, tidak berlebihan. (Ini keputusan DEC-019.)
- **Satu Postgres, tiga database logis.** Kita tidak bikin 3 server database terpisah (boros RAM). Cukup 1 PostgreSQL, di dalamnya ada 3 database: `auth_db`, `item_db`, `engagement_db`. Tiap service hanya boleh menyentuh database miliknya.
- **Token (JWT) dicek di tiap service secara lokal**, pakai kunci rahasia yang sama (`SECRET_KEY`). Jadi item-service tidak perlu nelpon auth-service hanya untuk cek "token ini valid atau tidak". (Ini DEC-017, hemat dan cepat.)
- **Cuma ada satu jalur antar-service saat runtime:** engagement-service memanggil item-service (untuk cek barang ada/tidak dan mengubah status barang saat klaim disetujui). Jalur inilah yang dikasih retry + circuit breaker.

---

## 4. Bagaimana request berjalan (dari klik sampai balik lagi)

Ini gambaran besar yang harus bisa kamu ceritakan. Bayangkan kamu buka website lalu login:

```
Browser kamu
  -> https://temuin.pangeransilaen.net   (alamat website)
  -> Cloudflare (DNS, mengubah nama domain jadi alamat IP server)
  -> VPS Tencent 43.156.15.248
       -> Nginx HOST (port 443, mengurus HTTPS/SSL)        <- lapisan 1
            -> Nginx GATEWAY (container, port 8080)         <- lapisan 2
                 -> /api/auth/*    diteruskan ke auth-service:8001
                 -> /api/items/*   diteruskan ke item-service:8002
                 -> /api/claims/*  diteruskan ke engagement-service:8003
                 -> /              diteruskan ke frontend (React)
```

Kenapa ada **2 lapis nginx**?
- **Nginx host** (lapisan 1): mengurus HTTPS (sertifikat SSL dari Let's Encrypt) dan jadi pintu masuk dari internet. Juga melayani aplikasi lain di server itu.
- **Nginx gateway** (lapisan 2, di dalam container): jadi "satpam pintu" microservices. Dia yang memutuskan `/api/auth/*` ke service mana, plus rate limit dan correlation ID.

Istilah penting yang harus kamu paham (bahasa manusia):
- **Gateway** = satu pintu masuk untuk semua API. Dari luar kelihatan satu alamat, padahal di dalam ada 3 service. Pengguna tidak perlu tahu ada 3 service.
- **Rate limit** = batas berapa kali boleh request per detik. Biar tidak ada yang spam (misalnya nyoba login ribuan kali). Login dibatasi 5 request/detik.
- **Correlation ID** = nomor unik yang ditempel di tiap request. Kalau ada error, kita bisa lacak satu request itu lewat semua service pakai nomor ini. Seperti nomor resi paket.
- **Retry** = kalau panggilan antar-service gagal sesaat, dicoba ulang otomatis (sampai 3x).
- **Circuit breaker** = kalau satu service rusak terus-terusan, berhenti dulu memanggilnya sebentar (60 detik) biar tidak makin parah. Seperti sekring listrik yang putus saat korslet.

---

## 5. Cara aplikasi ini di-deploy (dijalankan di server)

- **Semua dibungkus Docker.** Tiap bagian (auth, item, engagement, frontend, database, gateway) jalan di "container" sendiri. Container = kotak terisolasi berisi aplikasi + semua kebutuhannya.
- **Docker Compose** = file resep yang menyalakan semua container sekaligus dengan satu perintah.
- **Deploy otomatis (CI/CD):** setiap kali kode di-merge ke branch `master`, GitHub Actions otomatis: membangun image Docker baru -> mengunggahnya ke Docker Hub -> masuk ke server VPS lewat SSH -> menarik image baru -> menyalakan ulang container -> mengecek kesehatan. Tidak ada langkah manual.
- **Database:** 1 PostgreSQL versi 16, datanya disimpan di "volume" (penyimpanan permanen) bernama `temuin_pgdata` supaya data tidak hilang saat container restart.

---

## 6. Tech stack (teknologi yang dipakai) — cukup tahu garis besarnya

| Bagian | Teknologi | Buat apa |
| --- | --- | --- |
| Frontend | React 19 + Vite + Tailwind CSS + shadcn/ui | Tampilan website yang dilihat pengguna |
| Frontend (bahasa) | JavaScript/JSX | (sengaja bukan TypeScript) |
| Backend | Python 3.12 + FastAPI | Logika aplikasi & API |
| Database | PostgreSQL 16 | Menyimpan data (user, barang, klaim) |
| ORM | SQLAlchemy | Cara Python ngobrol dengan database tanpa nulis SQL mentah |
| Auth | Email + password, bcrypt, JWT | Login & keamanan |
| Gateway | Nginx | Pintu masuk API, rate limit |
| Container | Docker + Docker Compose | Membungkus & menjalankan aplikasi |
| CI/CD | GitHub Actions | Otomatis tes & deploy |
| Server | Tencent Cloud VPS, Ubuntu | Tempat aplikasi hidup |
| HTTPS | Let's Encrypt + Certbot | Sertifikat SSL (gembok hijau di browser) |

Jumlah cepat (kalau ditanya angka):
- **6 container** jalan di production: db, auth-service, item-service, engagement-service, frontend, gateway.
- **3 microservice** backend + 1 database (3 database logis) + 1 gateway + 1 frontend.
- **12 tabel** database inti (users, items, item_images, item_status_histories, categories, buildings, locations, security_officers, claims, claim_status_histories, notifications, audit_logs).

---

## 7. Live demo bersama (urutan yang ditunjukkan ke dosen)

Ini alur demo utama. Tim kita sudah punya skrip lengkapnya di `docs/demo-script.md`. Saat UAS, **Backend + Frontend** biasanya yang pegang demo, tapi semua harus paham urutannya.

**Sebelum mulai (cek dulu):**
1. Buka `https://temuin.pangeransilaen.net/status` -> pastikan **3 service `up`** (hijau).
2. Pakai jendela incognito biar bersih.
3. Siapkan 3 akun: User A (pelapor), User B (pengklaim), Admin.

**Urutan demo:**
1. Buka website -> tunjukkan halaman utama load cepat.
2. Buka `/status` -> tunjukkan 3 service hidup (bukti microservices jalan).
3. **Register User A** -> sekalian tunjukkan validasi: coba email non-ITK (ditolak), coba password lemah (ditolak), lalu daftar dengan data benar.
4. **Lapor barang `found`** (ditemukan): isi judul, deskripsi, kategori, gedung, lokasi, petugas, upload foto -> submit.
5. **Lapor barang `lost`** (hilang) sebagai contoh tipe kedua.
6. **Logout, login User B** -> buka barang `found` milik User A -> **ajukan klaim** + isi bukti kepemilikan -> status klaim jadi `pending`.
7. **Logout, login Admin** -> buka panel klaim -> baca bukti -> **approve** -> tandai **completed** -> status barang jadi `returned`.
8. **Login User B** -> buka notifikasi -> tunjukkan notifikasi klaim disetujui.
9. Buka profil -> edit nama/HP -> tersimpan.
10. **Login Admin** -> panel master data -> tambah kategori baru (CRUD admin).
11. Tutup dengan buka GitHub -> tunjukkan **pipeline CI hijau** dan struktur repo.

**Kalau internet bermasalah:** ada video backup demo di Google Drive (link di `docs/final-checklist.md`). Putar itu.

---

## 8. Pembagian presenter (saran dari modul)

| Slide | Siapa | Durasi |
| --- | --- | --- |
| 1-2 (Judul, Problem & Solution) | QA & Docs | 1.5 menit |
| 3 (Architecture Journey) | DevOps | 2 menit |
| 4 (Tech Stack & Infrastructure) | DevOps / CI/CD | 2 menit |
| 5 (Live Demo) | Backend + Frontend | 3 menit |
| 6-7 (Challenges & Kontribusi) | Semua bergiliran | 3 menit |

> Aturan emas: **tiap anggota harus bisa menjelaskan keseluruhan arsitektur, bukan cuma bagiannya.** Saat viva, dosen bisa tanya apa saja ke siapa saja.

---

## 9. Saat live demo, tiap role jelaskan bagiannya

Walau demo dijalankan Backend + Frontend, idealnya tiap role ikut menjelaskan bagian yang jadi tanggung jawabnya saat layar relevan muncul. Ini biar dosen lihat tiap orang paham kerjaannya. Kalimat detail "tinggal baca" ada di file masing-masing role; ini ringkasannya:

- **QA & Docs** menjelaskan saat: validasi input ditunjukkan (email non-ITK ditolak, password lemah ditolak). Contoh kalimat: "Bagian ini kami uji secara blackbox. Saya cek email selain `itk.ac.id` harus ditolak, password di bawah 8 karakter ditolak. Semua hasil tes ada di laporan QA per sprint di folder `docs/`."
- **Frontend** menjelaskan saat: halaman dibuka, form diisi, navigasi. Contoh kalimat: "Tampilan ini React + shadcn/ui. Token login saya simpan di localStorage, lalu dipasang otomatis di tiap request lewat axios interceptor di `src/config/api.js`."
- **Backend** menjelaskan saat: data tersimpan, status berubah, klaim diproses. Contoh kalimat: "Saat klaim disetujui admin, engagement-service memanggil item-service untuk mengubah status barang jadi `in_claim`, lalu `returned` saat selesai. Aturan bisnisnya ada di `claims/service.py`."
- **DevOps** menjelaskan saat: halaman `/status` dibuka atau GitHub pipeline ditunjukkan. Contoh kalimat: "Halaman status ini membuktikan 3 microservice hidup di belakang gateway. Tiap push ke master, GitHub Actions otomatis build image dan deploy ke VPS lewat SSH."

---

## 10. Pertanyaan dosen yang sering muncul (siapkan jawaban)

Ini pertanyaan umum yang ditujukan ke siapa saja. Hafalkan inti jawabannya. Pertanyaan khusus per-role ada di file role.

**"Kenapa pakai microservices, bukan monolith saja?"**
> Awalnya kami memang monolith (Sprint 1-4) karena lebih simpel untuk mulai. Saat Sprint 6 kami pecah jadi 3 service supaya tiap bagian (auth, item, engagement) bisa dikembangkan dan di-deploy terpisah, dan supaya beban bisa dipisah. Kami sengaja hanya 3 service, tidak berlebihan, karena tim kecil dan RAM server terbatas.

**"Apa kelebihan dan kekurangan microservices kalian?"**
> Kelebihan: tiap service fokus satu domain, lebih mudah dipahami, dan kalau satu rusak yang lain masih jalan. Kekurangan: lebih rumit (ada gateway, ada komunikasi antar-service), butuh monitoring lebih, dan satu request bisa melewati beberapa service.

**"Kalau pengguna naik 10x lipat, apa yang kalian lakukan?"**
> Kami akan scale service yang paling sibuk dulu (kemungkinan item-service untuk lihat daftar barang). Karena sudah pakai Docker + gateway, kami bisa menjalankan beberapa salinan service itu dan gateway membagi beban. Database bisa dikasih read-replica kalau perlu.

**"Bagaimana kalau satu service mati?"**
> Gateway punya `proxy_next_upstream` untuk failover, dan jalur antar-service (engagement ke item) punya retry 3x + circuit breaker. Halaman `/status` akan menunjukkan service yang mati sebagai `down`, dan health check engagement-service akan melaporkan status `degraded`.

**"Bagaimana keamanan aplikasi kalian?"**
> Login pakai JWT, password di-hash bcrypt, hanya email ITK yang bisa daftar. Di Sprint 8 kami tambah: container jalan sebagai non-root, security headers (HSTS, X-Frame-Options, dll), rate limit di gateway, dan audit secret. Semua HTTPS lewat Let's Encrypt.

**"Apa itu CI/CD di proyek kalian?"**
> CI (Continuous Integration): tiap push/PR ke master, GitHub Actions otomatis cek lint, jalankan tes backend (target coverage 60%) dan frontend (target 40%), plus tes tiap microservice. CD (Continuous Deployment): tiap merge ke master, image dibangun dan otomatis dideploy ke VPS.

---

## 11. Checklist H-1 sebelum UAS

- [ ] Website `https://temuin.pangeransilaen.net` bisa dibuka.
- [ ] `/status` menunjukkan 3 service `up`.
- [ ] 3 akun demo siap (User A, User B, Admin) dan password-nya diingat.
- [ ] Database sudah ter-seed (kategori, gedung, lokasi, petugas muncul di dropdown).
- [ ] Pipeline CI di GitHub hijau (cek tab Actions).
- [ ] Slide presentasi 5-7 halaman siap.
- [ ] Video backup demo sudah direkam dan link-nya ada di `docs/final-checklist.md`.
- [ ] Tiap anggota sudah baca file role-nya dan latihan jawab pertanyaan.
- [ ] Sudah latihan presentasi minimal sekali (dry run) dengan timer 12 menit.

---

## 12. Kalau panik saat demo (darurat)

- **`/status` tidak hijau semua:** buka HP/laptop lain, minta DevOps cek `docker ps --filter name=temuin` di server (semua harus `healthy`).
- **Muncul toast error merah:** salin `X-Correlation-ID` dari DevTools tab Network, DevOps bisa lacak di server: `cd /opt/temuin && ./scripts/logs.sh trace <id>`.
- **Kena rate limit (error 429):** berhenti spam, tunggu beberapa detik, coba lagi.
- **Internet ruangan mati:** langsung putar video backup. Jangan panik, ini sudah diantisipasi.

---

Selesai. Sekarang buka file role kamu dan pelajari detailnya. Semangat! 🎓
