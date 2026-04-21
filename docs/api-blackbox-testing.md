# 🧪 Laporan Blackbox Testing - Swagger API (Backend)
**Tanggal:** 21 April 2026
**Tester:** Lead QA & Docs
**Lokasi Testing:** `http://localhost:8000/docs`

---

## 📚 Glosarium Status Code (Arti Respon Server)
Berikut adalah arti kode status HTTP yang muncul dalam pengujian ini:
*   **`200 OK`**: Permintaan berhasil. Data berhasil diambil atau diperbarui.
*   **`201 Created`**: Berhasil membuat data baru.
*   **`204 No Content`**: Permintaan sukses dilakukan (umumnya untuk **Hapus**) dan server tidak mengirimkan data balik karena data sudah terhapus.
*   **`400 Bad Request`**: Ada kesalahan pada input.
*   **`401 Unauthorized`**: Token akses tidak ada atau sudah kedaluwarsa.
*   **`403 Forbidden`**: Akses ditolak (biasanya karena memerlukan role Admin).
*   **`404 Not Found`**: Data yang dicari (ID barang/klaim) tidak ditemukan.
*   **`422 Unprocessable Entity`**: Error validasi data (misal email duplikat atau kolom wajib kosong).

---

## 🏗️ 0. Health Check & Root System
Verifikasi dasar operasional server.

### GET / (Read Root)
*   **Penjelasan:** Mengecek konektivitas dasar ke server backend.
*   **Hasil:** **`200 OK`**. Server merespon dengan informasi dasar aplikasi.
![Input](../image/Testing%20Swagger/GET%20Read%20Root%201.png) ![Output](../image/Testing%20Swagger/GET%20Read%20Root%202.png)

### GET /health
*   **Penjelasan:** Verifikasi status kesehatan aplikasi dan database.
*   **Hasil:** **`200 OK`**. Status `healthy` menandakan database terkoneksi dengan benar.
![Input](../image/Testing%20Swagger/Health%20Check%201.png) ![Output](../image/Testing%20Swagger/Health%20Check%202.png)

---

## 🔐 1. Modul Autentikasi (Auth)
Manajemen identitas dan hak akses pengguna.

### POST /auth/register
*   **Penjelasan:** Pendaftaran pengguna baru.
*   **Input:** Email itk.ac.id, Nama, Password.
*   **Hasil:** **`201 Created`**. User berhasil didaftarkan ke sistem.
![Input](../image/Testing%20Swagger/POST%20Auth%20Register%201.png) ![Output](../image/Testing%20Swagger/POST%20Auth%20Register%202.png)

### POST /auth/login
*   **Penjelasan:** Autentikasi untuk mendapatkan JWT Token.
*   **Input:** Kredensial email/password.
*   **Hasil:** **`200 OK`**. Server memberikan `access_token` untuk digunakan pada endpoint lain.
![Input](../image/Testing%20Swagger/POST%20Auth%20Login%201.png) ![Output](../image/Testing%20Swagger/POST%20Auth%20Login%202.png)

### GET /auth/me
*   **Penjelasan:** Mengambil informasi profil diri sendiri.
*   **Hasil:** **`200 OK`**. Menampilkan detail data user yang sedang aktif.
![Input](../image/Testing%20Swagger/GET%20Auth%20me%20Get%20Me%201.png) ![Output](../image/Testing%20Swagger/GET%20Auth%20me%20Get%20me%202.png)

### PUT /auth/me
*   **Penjelasan:** Memperbarui profil (Nama, No HP).
*   **Hasil:** **`200 OK`**. Profil berhasil diperbarui di database.
![Input](../image/Testing%20Swagger/PUT%20auth%20me%201.png) ![Output](../image/Testing%20Swagger/PUT%20auth%20me%202.png)

---

## 📦 2. Modul Barang (Items)
Manajemen utama laporan barang lost & found.

### GET /items (List All Items)
*   **Penjelasan:** Mengambil seluruh daftar barang (Lost/Found).
*   **Hasil:** **`200 OK`**. Menampilkan koleksi barang yang ada di sistem.
![Input](../image/Testing%20Swagger/GET%20items%20list%20item%201.png) ![Output](../image/Testing%20Swagger/GET%20items%20list%20item%202.png)

### POST /items (Create Item)
*   **Penjelasan:** Melaporkan barang hilang atau temuan baru.
*   **Hasil:** **`201 Created`**. Laporan tersimpan dan berstatus `open`.
![Input](../image/Testing%20Swagger/POST%20items%2c%20create%20item%201.png) ![Output](../image/Testing%20Swagger/POST%20items%2c%20create%20item%202.png)

### GET /items/me (My Items)
*   **Penjelasan:** Lihat barang yang dilaporkan oleh diri sendiri.
*   **Hasil:** **`200 OK`**. Menampilkan daftar barang milik user aktif.
![Input](../image/Testing%20Swagger/GET%20items%20me%20List%20my%20items%201.png) ![Output](../image/Testing%20Swagger/GET%20items%20me%20List%20my%20items%202.png)

### GET /items/{id} (Detail Item)
*   **Penjelasan:** Melihat detail spesifik satu barang.
*   **Hasil:** **`200 OK`**. Menampilkan detail spesifik sesuai ID yang diminta.
![Input](../image/Testing%20Swagger/GET%20items%20(item_id)%20Get%20Item%201.png) ![Output](../image/Testing%20Swagger/GET%20items%20(item_id)%20Get%20Item%202.png)

### PUT /items/{id} (Update Item)
*   **Penjelasan:** Memperbarui informasi laporan barang.
*   **Hasil:** **`200 OK`**. Data laporan berhasil diubah.
![Input](../image/Testing%20Swagger/PUT%20items%20(item_id)%20update%20item%201.png) ![Output](../image/Testing%20Swagger/PUT%20items%20(item_id)%20update%20item%202.png)

### DELETE /items/{id} (Delete Item)
*   **Penjelasan:** Menghapus laporan barang (Soft Delete).
*   **Hasil:** **`204 No Content`**. Barang berhasil ditandai sebagai dihapus di database.
![Input](../image/Testing%20Swagger/DELETE%20items%20(item_id)%20Delete%20Item%201.png) ![Output](../image/Testing%20Swagger/DELETE%20items%20(item_id)%20Delete%20Item%202.png)

---

## 🤝 3. Modul Klaim (Claims)
Alur verifikasi dan transaksi pengembalian barang.

### POST /claims (Create Claim)
*   **Penjelasan:** Mengajukan klaim kepemilikan.
*   **Hasil:** **`201 Created`**. Klaim tercatat sebagai `pending`.
![Input](../image/Testing%20Swagger/POST%20claims%20Create%20Claim%201.png) ![Output](../image/Testing%20Swagger/POST%20claims%20Create%20Claim%202.png)

### GET /claims/me (My Claims)
*   **Penjelasan:** Melihat status klaim yang pernah diajukan user.
*   **Hasil:** **`200 OK`**. Menampilkan list klaim beserta status terbarunya.
![Input](../image/Testing%20Swagger/GET%20claim%20me%20Get%20My%20Claims%201.png) ![Output](../image/Testing%20Swagger/GET%20claim%20me%20Get%20My%20Claims%202.png)

### GET /claims (List Claims for Item)
*   **Penjelasan:** (Admin Only) Melihat daftar klaim yang masuk untuk barang tertentu.
![Input](../image/Testing%20Swagger/GET%20claim%20Get%20Claims%20For%20Item%201.png) ![Output](../image/Testing%20Swagger/GET%20claim%20Get%20Claims%20For%20Item%202.png)

### GET /claims/{id} (Claim Detail)
*   **Penjelasan:** Melihat detail satu klaim tertentu.
![Input](../image/Testing%20Swagger/GET%20claims%20(claim_id)%20Get%20Claim%20Detail%201.png) ![Output](../image/Testing%20Swagger/GET%20claims%20(claim_id)%20Get%20Claim%20Detail%202.png)

### PUT /claims/{id}/status (Update Status)
*   **Penjelasan:** (Admin Only) Menyetujui atau menolak klaim.
*   **Hasil:** **`200 OK`**. Status klaim berubah.
![Input](../image/Testing%20Swagger/PUT%20claims%20(claim_id)%20status%20Update%20Claim%20Status%201.png) ![Output](../image/Testing%20Swagger/PUT%20claims%20(claim_id)%20status%20Update%20Claim%20Status%202.png)

---

## 🗂️ 4. Modul Master Data (Resources)
Data referensi yang mendukung konsistensi sistem.

### GET Master Data (All Types)
*   **Penjelasan:** Mengambil list kategori, gedung, lokasi, atau satpam.
![Buildings](../image/Testing%20Swagger/Master%20data%20entity_type%20buildings%201.png) ![Buildings Out](../image/Testing%20Swagger/Master%20data%20entity_type%20buildings%202.png)
![Location](../image/Testing%20Swagger/Master%20data%20entity_type%20location%201.png) ![Location Out](../image/Testing%20Swagger/Master%20data%20entitiy_type%20location%202.png)
![Security](../image/Testing%20Swagger/Master%20data%20entity_type%20security%201.png) ![Security Out](../image/Testing%20Swagger/Master%20data%20entity_type%20security%202.png)

### POST Master Data (Create)
*   **Penjelasan:** Menambah entitas master baru.
![Input Create Master](../image/Testing%20Swagger/POST%20master%20data%20entity_type%20create%20master%20data%201.png) ![Output Create Master](../image/Testing%20Swagger/POST%20master%20data%20entity_type%20create%20master%20data%202.png)

### PUT Master Data (Update)
*   **Penjelasan:** Mengubah data master yang sudah ada.
![Input Update Master](../image/Testing%20Swagger/PUT%20master%20data%20entity%20type%20Update%20master%20data%201.png) ![Output Update Master](../image/Testing%20Swagger/PUT%20master%20data%20entity%20type%20Update%20master%20data%202.png)

### DELETE Master Data (Delete)
*   **Penjelasan:** Menghapus data referensi seperti kategori, gedung, atau lokasi berdasarkan ID (Admin Only).
*   **Hasil:** **`204 No Content`**. Data berhasil dihapus dari sistem referensi.
![Input](../image/Testing%20Swagger/DELETE%20master%20data%20entity%20type%20delete%201.png)
![Output](../image/Testing%20Swagger/DELETE%20master%20data%20entity%20type%20delete%202.png)

---

## 📝 Penutup
Seluruh pengujian menunjukkan bahwa API backend Temuin telah memenuhi syarat fungsionalitas PRD. Sistem autentikasi, manajemen barang, alur klaim, dan manajemen data master berfungsi dengan stabil dengan penanganan status code yang tepat.
