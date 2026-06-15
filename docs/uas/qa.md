# Bahan Belajar UAS — Role QA & Docs (Temuin)

> Halo! File ini khusus buat kamu yang pegang **QA & Docs**.
> Ditulis dengan bahasa paling sederhana. Baca pelan-pelan, tidak perlu jago ngoding.
>
> Sebelum baca ini, pastikan kamu sudah baca `docs/uas/panduan-uas.md` (panduan bersama) dulu.

---

## 1. QA & Docs itu ngapain sih?

QA = **Quality Assurance** (penjamin mutu). Tugas kamu sederhana: **memastikan aplikasi Temuin benar-benar jalan dan dipakai pengguna tanpa masalah.**

Di tim kita, kamu TIDAK perlu:
- Bikin kode aplikasi (itu Backend & Frontend).
- Bikin unit test rumit di kode (itu juga Backend & Frontend).
- Bikin issue tracker formal atau template bug yang ribet.

Yang kamu LAKUKAN:
1. **Blackbox testing** — coba pakai aplikasi seperti pengguna biasa, lihat apakah hasilnya benar. "Blackbox" artinya kamu tidak lihat kodenya, kamu cuma lihat dari luar: klik tombol, isi form, lihat apakah hasilnya sesuai harapan.
2. **Screenshot bukti** — saat sebuah fitur kamu tes, screenshot hasilnya sebagai bukti.
3. **Catatan tes singkat** — tulis hasil tes tiap sprint (lulus/gagal) dalam laporan singkat.
4. **Update dokumentasi** — kalau cara pakai aplikasi berubah, perbarui dokumennya.

Singkatnya: **kamu adalah pengguna pertama yang teliti.** Kamu mencoba aplikasi sebelum dosen mencobanya.

---

## 2. Istilah yang harus kamu paham (bahasa manusia)

- **Blackbox testing** = tes dari sisi pengguna tanpa lihat kode. Contoh: "Saya isi email salah, apakah muncul pesan error yang benar?"
- **Whitebox testing** = tes dengan lihat kode (BUKAN tugas kamu, itu Backend/Frontend).
- **Test case / skenario** = satu situasi yang dites. Contoh: "Register pakai email Gmail harus ditolak."
- **Expected result** = hasil yang seharusnya. Contoh: "Muncul pesan: email harus pakai itk.ac.id."
- **Actual result** = hasil yang benar-benar terjadi saat kamu coba.
- **Pass** = actual = expected (lulus). **Fail** = beda (gagal, ada bug).
- **Smoke test** = tes cepat untuk pastikan "asapnya keluar", maksudnya aplikasi nyala dan fitur utama jalan. Tes paling dasar.
- **Regression test** = tes ulang fitur lama untuk pastikan fitur baru tidak merusak yang lama.
- **Bug** = kesalahan/error di aplikasi.

---

## 3. Apa yang sudah kamu kerjakan di Temuin (contoh NYATA)

Ini bukan teori. Ini hal asli yang ada di proyek kita. Kamu harus bisa cerita ini saat viva.

### 3.1 Laporan QA per sprint

Kamu menulis satu laporan tiap sprint, namanya pola `docs/sprint-XX-qa-report.md`. Yang sudah ada:
- `docs/sprint-01-qa-report.md` sampai `docs/sprint-07-qa-report.md` (7 laporan).

Tiap laporan isinya: satu bagian per task (misalnya `QA-6.1`, `QA-6.2`), lalu **tabel ringkasan** di akhir dengan kolom:

| Task ID | Nama Task | Status | Hasil | Bukti (Image Path) |
| --- | --- | --- | --- | --- |

Screenshot bukti disimpan di folder `image/sprint-XX/` (contoh: `image/sprint-01/backend-health-1.png`).

### 3.2 Dua laporan blackbox utama (hafalkan ini)

**`docs/api-blackbox-testing.md`** — tes API lewat Swagger UI (halaman `http://localhost:8000/docs`). Kamu cek tiap endpoint balikannya benar:
- `POST /auth/register` -> kode 200 (berhasil, balikannya token)
- `POST /auth/login` -> kode 200 (berhasil)
- `GET /auth/me` -> kode 200 (dapat profil)
- `PUT /auth/me` -> kode 200 (profil terupdate)
- `GET /health` -> kode 200 (aplikasi sehat)

**`docs/frontend-blackbox-testing.md`** — tes tampilan dari sisi pengguna:
- Register: email harus `@student.itk.ac.id` atau `@itk.ac.id`, cek password pendek ditolak, cek email dobel ditolak.
- Lapor barang.
- Kelola klaim.

### 3.3 Arti kode status (WAJIB hafal, sering ditanya)

Saat tes API, kamu lihat angka "status code". Ini artinya:

| Kode | Arti | Contoh |
| --- | --- | --- |
| 200 | OK, berhasil | Login & register sukses (di proyek kita register balik 200, bukan 201) |
| 201 | Created, data baru dibuat | (kode standar; di proyek kita tidak dipakai eksplisit) |
| 204 | Berhasil, tidak ada isi balikan | Hapus barang sukses |
| 400 | Bad Request, permintaan salah | Barang `found` tanpa pilih petugas keamanan |
| 401 | Unauthorized, belum login / token salah | Akses tanpa login, atau email/password login salah |
| 403 | Forbidden, dilarang | Akses endpoint khusus admin padahal cuma user biasa |
| 404 | Not Found, tidak ketemu | Buka barang yang tidak ada |
| 409 | Conflict, bentrok | Daftar pakai email yang sudah terdaftar |
| 422 | Data tidak valid bentuknya | Register email bukan ITK, atau password lemah (divalidasi di schema) |

Cara mudah ingat: **2xx = sukses, 4xx = salahnya pengguna, 5xx = salahnya server.**

### 3.4 Tugas QA per sprint (yang sudah dilakukan)

- **Sprint 5:** pastikan pipeline CI 3-job hijau, ada badge CI di README, tulis `docs/testing-guide.md`.
- **Sprint 6:** smoke test di production `https://temuin.pangeransilaen.net` setelah deploy, tulis `docs/deployment-guide.md`. (Contoh: cek 3 health endpoint `/api/auth/health`, `/api/items/health`, `/api/engagement/health` semua balik 200.)
- **Sprint 7:** cek correlation ID jalan dari ujung ke ujung, tulis `docs/operations-guide.md`.
- **Sprint 8:** regresi final 20 skenario, tulis `docs/api-contract.md` dan `docs/final-checklist.md`, rapikan README.

---

## 4. Tools yang kamu pakai (sederhana)

Kamu **tidak menulis kode tes**. Tapi kamu memverifikasi bahwa tes otomatis tim lain hijau. Tools-mu:

- **Browser** (Chrome) — buka aplikasi, klik-klik, isi form. Ini alat utama blackbox kamu.
- **Swagger UI** — halaman `/docs` di backend. Tempat coba API tanpa coding, tinggal klik "Try it out".
- **DevTools browser** (tekan F12) — lihat tab Network untuk cek request gagal/sukses dan lihat `X-Correlation-ID`.
- **Screenshot tool** — bawaan OS (Win+Shift+S di Windows).
- **GitHub** — lihat tab **Actions** untuk cek pipeline CI hijau atau merah.

Kamu juga perlu TAHU (tapi tidak menjalankan sendiri) bahwa tim punya tes otomatis:
- Backend pakai **pytest** (target coverage minimal 60%).
- Frontend pakai **Vitest** (target coverage minimal 40%).
- Tugas kamu cuma memastikan di GitHub Actions semua job-nya **hijau (lulus)**.

---

## 5. Bagian kamu saat live demo (skrip siap baca)

Saat demo, kamu (QA & Docs) biasanya pegang **Slide 1-2 (Judul + Problem & Solution)** dan ikut menjelaskan saat bagian **validasi/pengujian** muncul di layar.

### 5.1 Saat slide judul & problem (kamu yang bicara dulu)

> "Selamat siang. Kami tim Temuin. Temuin adalah aplikasi lost and found untuk kampus ITK. Masalah yang kami selesaikan: di kampus sering ada barang hilang dan ditemukan, tapi tidak ada tempat resmi untuk mempertemukan yang menemukan dengan yang kehilangan. Solusinya, Temuin: yang menemukan barang melapor, yang kehilangan bisa mengklaim dengan bukti, lalu admin memverifikasi. Hanya warga ITK yang bisa pakai, login wajib pakai email itk.ac.id."

### 5.2 Saat demo register (kamu jelaskan sisi pengujian)

Saat Frontend mengetik email yang salah, kamu bilang:

> "Bagian register ini saya uji secara blackbox. Saya pastikan email selain itk.ac.id ditolak — sekarang kita coba email biasa, dan benar, muncul pesan harus pakai email ITK. Lalu password di bawah 8 karakter juga ditolak. Email yang sudah terdaftar tidak bisa daftar dua kali. Semua hasil tes ini saya catat di laporan QA per sprint di folder docs."

### 5.3 Saat menutup demo (tunjukkan dokumentasi)

> "Semua fitur yang tadi didemokan sudah saya uji per sprint. Bukti screenshot ada di folder image, laporannya di docs/sprint-XX-qa-report.md. Untuk UAS ini, regresi final 20 skenario sudah lulus dan tercatat di docs/final-checklist.md."

---

## 6. Pertanyaan viva untuk QA (dosen tanya KAMU) + jawaban

**"Apa peran kamu di tim?"**
> Saya QA dan Docs. Saya menguji fitur secara blackbox dari sisi pengguna, mengumpulkan bukti screenshot, menulis laporan tes tiap sprint, dan menjaga dokumentasi tetap sesuai.

**"Apa itu blackbox testing, bedanya dengan whitebox?"**
> Blackbox: saya menguji dari luar tanpa melihat kode, fokus ke apakah hasilnya sesuai harapan pengguna. Whitebox: menguji dengan melihat kode bagian dalam, itu dilakukan Backend dan Frontend lewat unit test.

**"Bagaimana kamu menguji fitur register?"**
> Saya coba beberapa skenario: email ITK valid harus berhasil (kode 200); email non-ITK harus ditolak dengan kode 422; password kurang dari 8 karakter atau tanpa angka juga ditolak dengan 422 (karena divalidasi di schema); email yang sudah terdaftar ditolak dengan kode 409. Saya screenshot tiap hasil.

**"Bagaimana kamu memastikan aplikasi di production benar-benar jalan?"**
> Saya lakukan smoke test ke `https://temuin.pangeransilaen.net`. Saya cek halaman `/status` menunjukkan 3 service `up`, dan tiga health endpoint balik 200. Lalu saya jalankan alur lengkap: register, login, lapor barang, klaim, admin approve.

**"Apa arti kode 200, 401, 403, 422?"**
> 200 berhasil; 401 belum login atau email/password salah; 403 dilarang misalnya user biasa mengakses endpoint admin; 422 data tidak valid bentuknya, misalnya register dengan email bukan ITK atau password lemah.

**"Apa itu regression testing dan kenapa penting?"**
> Menguji ulang fitur lama setelah ada perubahan, untuk memastikan fitur baru tidak merusak yang sudah jalan. Penting karena di proyek besar satu perubahan bisa diam-diam merusak bagian lain.

**"Kalau kamu menemukan bug, apa yang kamu lakukan?"**
> Saya catat di laporan QA sprint itu dalam bentuk blockquote di bawah task terkait, sertakan langkah reproduksi dan screenshot, lalu saya kabari Backend/Frontend untuk diperbaiki. Kami juga pakai GitHub Issues untuk tracking.

**"Bagaimana kamu tahu pipeline CI lulus?"**
> Saya buka tab Actions di GitHub. Kalau semua job (lint, backend-test, frontend-test, services-tests) tanda centang hijau, berarti lulus. Kalau ada yang merah, ada tes yang gagal.

---

## 7. Pemahaman proyek keseluruhan (QA juga wajib bisa)

Walau kamu QA, dosen tetap bisa tanya soal arsitektur. Minimal kamu bisa jawab ini (detail lengkap di `docs/uas/panduan-uas.md`):

- Temuin awalnya **monolith**, lalu Sprint 6 dipecah jadi **3 microservice**: auth-service (8001), item-service (8002), engagement-service (8003).
- Semua API masuk lewat **satu gateway** (Nginx) di depan.
- Di-deploy pakai **Docker** di **VPS Tencent**, otomatis lewat **CI/CD GitHub Actions**.
- Login pakai **JWT**, hanya email **itk.ac.id**.

Kalau ditanya hal teknis dalam yang kamu tidak yakin, jawab jujur sambil arahkan: "Untuk detail implementasinya, rekan Backend kami yang menangani, tapi dari sisi pengujian saya memastikan hasilnya benar."

---

## 8. Checklist persiapan QA sebelum UAS

- [ ] Sudah baca `docs/uas/panduan-uas.md`.
- [ ] Bisa jelaskan beda blackbox vs whitebox.
- [ ] Hafal arti kode 200, 401, 403, 409, 422 (ingat: register sukses = 200, register email non-ITK/password lemah = 422, email dobel = 409).
- [ ] Bisa cerita isi laporan QA sprint (tabel ringkasan + bukti screenshot).
- [ ] Bisa buka tab Actions GitHub dan baca status hijau/merah.
- [ ] Hafal skrip slide judul & problem.
- [ ] Sudah cek `docs/final-checklist.md` lengkap.
- [ ] Latihan jawab 7 pertanyaan viva di atas minimal sekali.

Semangat! Kamu adalah penjaga kualitas. Tanpa kamu, tim tidak tahu aplikasinya benar-benar jalan. 🎓
