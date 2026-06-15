# Bahan Belajar UAS — Role Frontend (Temuin)

> Halo! File ini khusus buat kamu yang pegang **Frontend**.
> Ditulis dengan bahasa paling sederhana. Tidak perlu jago ngoding — yang penting kamu paham apa yang kamu buat dan bisa menjelaskannya.
>
> Baca `docs/uas/panduan-uas.md` (panduan bersama) dulu sebelum file ini.

---

## 1. Frontend itu ngapain sih?

Frontend = **bagian yang dilihat dan dipakai langsung oleh pengguna.** Semua yang tampil di layar browser — tombol, form, halaman, warna, teks — itu frontend.

Analogi: kalau aplikasi itu restoran, frontend adalah **ruang makan + pelayan** (yang dilihat tamu), sedangkan backend adalah **dapur** (yang masak di belakang). Kamu mengurus ruang makannya.

Tugas kamu di Temuin:
1. Membuat **tampilan** (halaman register, login, daftar barang, detail, dll).
2. **Menghubungkan tampilan ke backend** — saat pengguna klik "Login", frontend mengirim email & password ke backend, lalu menampilkan hasilnya.
3. Mengurus **alur pengguna** — setelah login mau ke mana, kalau belum login diarahkan ke halaman login, dll.
4. Menampilkan **loading, error, dan pesan** dengan jelas.

---

## 2. Teknologi yang kamu pakai (dan artinya)

| Teknologi | Apa itu | Versi di proyek |
| --- | --- | --- |
| **React** | Library untuk membangun tampilan dari potongan kecil (komponen) | 19 |
| **Vite** | Alat yang menjalankan & membangun aplikasi React (cepat) | 6 |
| **Tailwind CSS** | Cara memberi gaya/style pakai class langsung di HTML | 4 |
| **shadcn/ui** | Kumpulan komponen siap pakai (tombol, dialog, dll) yang cantik | - |
| **React Router** | Mengatur perpindahan antar halaman (URL mana tampilkan apa) | 7 |
| **Axios** | Alat untuk mengirim request ke backend (ambil/kirim data) | 1.x |
| **JavaScript/JSX** | Bahasa pemrograman frontend (sengaja BUKAN TypeScript) | - |

Istilah penting:
- **Komponen (component)** = potongan tampilan yang bisa dipakai ulang. Contoh: satu tombol, satu kartu barang.
- **Halaman (page)** = satu layar penuh. Contoh: halaman login, halaman daftar barang.
- **State** = data yang bisa berubah di tampilan. Contoh: daftar barang yang sedang ditampilkan.
- **Props** = data yang dikirim dari komponen induk ke komponen anak.
- **API call** = saat frontend minta data ke backend.
- **Token** = "tiket masuk" digital yang didapat setelah login, dipakai untuk membuktikan kamu sudah login di tiap request berikutnya.

---

## 3. Struktur folder frontend (yang NYATA di proyek)

Semua kode frontend ada di folder `frontend/src/`. Ini isinya:

```
frontend/src/
├── main.jsx            (titik mulai aplikasi)
├── App.jsx             (komponen utama)
├── app/
│   ├── router.jsx      (daftar semua halaman & URL-nya)
│   └── providers.jsx   (AuthProvider — mengingat siapa yang login)
├── config/
│   └── api.js          (PENTING: pengatur semua request ke backend)
├── components/
│   ├── ui/             (komponen shadcn: button, dialog, card, badge, dll)
│   ├── auth/           (ProtectedRoute, AdminRoute)
│   ├── items/          (ClaimForm, EditItemDialog, SearchFilter)
│   └── layout/         (RootLayout)
└── pages/              (13 halaman, lihat di bawah)
```

### Daftar halaman NYATA (di `frontend/src/pages/`)

| File halaman | Untuk apa |
| --- | --- |
| `LoginPage.jsx` | Halaman login |
| `RegisterPage.jsx` | Halaman daftar akun |
| `HomePage.jsx` | Beranda |
| `ItemListPage.jsx` | Daftar semua barang |
| `ItemDetailPage.jsx` | Detail satu barang |
| `CreateItemPage.jsx` | Form lapor barang baru |
| `MyItemsPage.jsx` | Barang yang aku lapor |
| `MyClaimsPage.jsx` | Klaim yang aku ajukan |
| `NotificationsPage.jsx` | Notifikasi |
| `StatusPage.jsx` | Status sistem (3 service hidup/tidak) |
| `AdminClaimsPage.jsx` | Daftar klaim (admin) |
| `AdminClaimDetailPage.jsx` | Detail klaim untuk diverifikasi (admin) |
| `AdminMasterDataPage.jsx` | Kelola kategori/gedung/lokasi/petugas (admin) |

---

## 4. Bagaimana frontend ngobrol ke backend (INTI, wajib paham)

File paling penting buat kamu: **`frontend/src/config/api.js`**. Ini adalah "pos pengiriman" — semua request ke backend lewat sini.

### 4.1 Alamat backend (base URL)

Frontend tidak menulis alamat backend di tiap tempat. Cukup sekali di `api.js`:
- Dia pakai variabel `VITE_API_BASE_URL`.
- Saat development di laptop, ini kosong, dan Vite otomatis meneruskan `/api/*` ke backend di `http://127.0.0.1:8000`.
- Saat production, request `/api/*` masuk ke gateway, yang lalu meneruskan ke service yang tepat.

### 4.2 Interceptor (ini sering ditanya, hafalkan konsepnya)

**Interceptor** = "penyadap" yang otomatis ikut campur di tiap request/response. Kita punya dua:

**Request interceptor** — sebelum tiap request dikirim, dia otomatis menempelkan token:
> Ambil token dari `localStorage` (key-nya `internalToken`), lalu pasang di header `Authorization: Bearer <token>`. Jadi kamu tidak perlu menempel token manual tiap kali.

**Response interceptor** — saat balikan dari backend datang, dia cek error:
- Kalau error **429** (terlalu banyak request) -> munculkan toast "Terlalu banyak permintaan, coba lagi sebentar lagi".
- Kalau **503/504** (layanan terganggu) -> toast "Layanan sementara terganggu, coba lagi".
- Kalau error server **5xx** -> catat `X-Correlation-ID` di console (untuk dilacak DevOps).

### 4.3 Alur login (langkah demi langkah, NYATA)

Ini yang terjadi saat pengguna login di `LoginPage.jsx`:

1. Pengguna isi email + password, klik Login.
2. Frontend kirim: `api.post("/api/auth/login", { email, password })`.
3. Backend balas dengan `access_token` (token).
4. Frontend simpan token: `localStorage.setItem("internalToken", access_token)`.
5. Frontend ambil profil: `api.get("/api/auth/me")`.
6. Simpan data user ke AuthProvider, lalu pindah ke beranda.

Saat aplikasi dibuka lagi nanti, `AuthProvider` cek token di localStorage, panggil `/api/auth/me` untuk pastikan masih valid. Kalau token rusak/expired, token dihapus dan pengguna diarahkan ke login.

### 4.4 ProtectedRoute & AdminRoute (penjaga halaman)

- **`ProtectedRoute`** = pembungkus halaman yang mewajibkan login. Kalau belum login, otomatis lempar ke `/login`. Hampir semua halaman dibungkus ini.
- **`AdminRoute`** = lebih ketat, hanya untuk admin. Halaman admin (kelola klaim, master data) dibungkus ini.

---

## 5. Halaman Status (bukti microservices, sering dipakai saat demo)

`StatusPage.jsx` adalah halaman spesial. Dia:
- Memanggil `GET /api/status` setiap 30 detik (polling otomatis).
- Menampilkan kartu (shadcn `Card`) untuk tiap service dengan badge warna: hijau (`up`), abu-abu, atau merah (`down`).
- Menampilkan `latency_ms` (seberapa cepat tiap service merespons).

Saat demo, halaman ini bukti kuat bahwa **3 microservice benar-benar hidup dan terpisah**. Kalau ada yang `down`, langsung kelihatan.

---

## 6. Testing frontend (yang perlu kamu tahu)

- Frontend pakai **Vitest** + **React Testing Library** untuk tes otomatis.
- Target coverage minimal **40%** (aturan DEC-020).
- Ada 9 file tes di `frontend/src/__tests__/`, contohnya: `LoginPage.test.jsx`, `ItemListPage.test.jsx`, `ProtectedRoute.test.jsx`, `StatusPage.test.jsx`, `Button.test.jsx`.
- Cara jalankan (kalau diminta): `cd frontend` lalu `npm run test:run`. Untuk lihat coverage: `npm run test:coverage`.

Kamu tidak harus hafal isi tesnya, cukup tahu: "kami punya 9 file tes Vitest, coverage di atas 40%, dan dicek otomatis di CI."

---

## 7. Bagian kamu saat live demo (skrip siap baca)

Saat demo, Frontend + Backend pegang **Slide 5 (Live Demo)**. Kamu yang mengklik dan menjelaskan tampilan.

### 7.1 Saat buka website & status

> "Ini Temuin, dibuat dengan React dan komponen shadcn/ui. Saya buka halaman status dulu — di sini terlihat tiga service: auth, item, engagement, semuanya `up`. Ini membuktikan microservices kami hidup di belakang gateway."

### 7.2 Saat register (sambil tunjukkan validasi)

> "Saya coba daftar. Kalau saya pakai email biasa seperti gmail, lihat — langsung muncul pesan bahwa email harus pakai itk.ac.id. Validasi ini ada di frontend dan juga dicek lagi di backend. Sekarang saya pakai email ITK yang benar dan password yang memenuhi syarat, dan berhasil daftar."

### 7.3 Saat login

> "Saat login berhasil, backend memberi kami token. Token ini saya simpan di localStorage, lalu setiap request berikutnya otomatis membawa token itu lewat axios interceptor di file config/api.js. Jadi pengguna tidak perlu login ulang tiap pindah halaman."

### 7.4 Saat lapor barang & upload foto

> "Ini form lapor barang. Kategori, gedung, lokasi, dan petugas diambil dari master data backend lewat dropdown. Untuk foto, gambar dikompres dulu di browser sebelum dikirim supaya tidak terlalu besar. Setelah submit, barang langsung muncul di daftar."

### 7.5 Saat alur klaim & notifikasi

> "Sekarang sebagai pengguna lain, saya buka barang yang ditemukan tadi dan ajukan klaim dengan mengisi bukti kepemilikan. Setelah admin menyetujui, saya dapat notifikasi di halaman notifikasi — ini juga ditarik dari backend."

---

## 8. Pertanyaan viva untuk Frontend (dosen tanya KAMU) + jawaban

**"Apa peran kamu di tim?"**
> Saya Frontend. Saya membangun seluruh tampilan dan alur pengguna pakai React, shadcn/ui, dan Tailwind, lalu menghubungkannya ke API backend.

**"Bagaimana frontend berkomunikasi dengan backend?"**
> Lewat Axios. Saya punya satu instance axios terpusat di `src/config/api.js`. Semua request lewat sana, dengan base URL dari environment variable `VITE_API_BASE_URL`.

**"Bagaimana kamu menangani autentikasi di frontend?"**
> Setelah login, backend memberi JWT. Saya simpan di localStorage dengan key `internalToken`. Request interceptor menempelkannya otomatis ke header Authorization di tiap request. Halaman yang butuh login saya bungkus `ProtectedRoute`; kalau tidak ada token valid, diarahkan ke halaman login.

**"Apa itu interceptor dan kenapa dipakai?"**
> Interceptor adalah fungsi yang otomatis berjalan di tiap request atau response. Saya pakai request interceptor untuk menempel token, dan response interceptor untuk menangani error global seperti 429 (rate limit) atau 503 dengan menampilkan notifikasi toast.

**"Bagaimana kamu menangani error supaya pengguna tidak bingung?"**
> Saya tampilkan loading state saat menunggu, pesan kosong saat data tidak ada, dan toast error yang jelas dalam bahasa Indonesia saat ada masalah. Ada juga ServiceErrorBanner untuk masalah layanan.

**"Kenapa pakai shadcn/ui, bukan bikin komponen sendiri?"**
> Supaya konsisten, cepat, dan rapi. shadcn/ui memberi komponen siap pakai yang accessible. Aturan tim juga mengutamakan shadcn/ui sebelum membuat markup custom.

**"Bagaimana routing/perpindahan halaman bekerja?"**
> Pakai React Router. Daftar URL dan halamannya ada di `src/app/router.jsx`. Halaman publik seperti login dan register bebas; sisanya dibungkus ProtectedRoute, dan halaman admin dibungkus AdminRoute.

**"Apa itu halaman /status dan kenapa penting?"**
> Halaman yang memanggil `/api/status` tiap 30 detik dan menampilkan kesehatan 3 microservice. Penting untuk memantau apakah semua service hidup, dan jadi bukti arsitektur microservices saat demo.

---

## 9. Pemahaman proyek keseluruhan (Frontend juga wajib bisa)

Detail lengkap di `docs/uas/panduan-uas.md`. Minimal kamu hafal:

- Temuin: lost & found kampus ITK, hanya email `itk.ac.id`, wajib login.
- Awalnya **monolith**, Sprint 6 jadi **3 microservice**: auth (8001), item (8002), engagement (8003).
- Frontend memanggil semua lewat prefix `/api/*` ke **gateway**, gateway yang membagi ke service.
- Di-deploy via **Docker** di **VPS Tencent**, otomatis lewat **CI/CD**.
- Saat ditanya hal backend yang dalam, arahkan: "Itu sisi backend rekan saya, tapi dari frontend saya memanggilnya lewat endpoint `/api/...`."

---

## 10. Checklist persiapan Frontend sebelum UAS

- [ ] Sudah baca `docs/uas/panduan-uas.md`.
- [ ] Paham fungsi `src/config/api.js` (base URL + interceptor + token).
- [ ] Bisa jelaskan alur login langkah demi langkah.
- [ ] Paham beda ProtectedRoute vs AdminRoute.
- [ ] Bisa jelaskan fungsi halaman `/status`.
- [ ] Tahu frontend pakai Vitest, coverage >= 40%.
- [ ] Hafal skrip demo bagian frontend.
- [ ] Latihan jawab 8 pertanyaan viva di atas minimal sekali.

Semangat! Kamu yang membuat aplikasi ini bisa dilihat dan dirasakan pengguna. 🎓
