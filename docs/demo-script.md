# Demo Script — Temuin (Backup Video UAS, DO-8.4)

Panduan rekam layar 5 menit untuk safety-net demo UAS. Rekam seluruh alur utama secara berurutan, lalu upload ke Google Drive dan tempel link-nya di `docs/final-checklist.md` (QA-8.3).

- **Live URL:** https://temuin.pangeransilaen.net
- **Target durasi:** ~5 menit
- **Tool rekam:** OBS / screen recorder bawaan OS (1080p, sertakan audio narasi opsional)
- **Sebelum rekam:** clear browser cache / pakai jendela incognito, tutup tab lain, pastikan VPS up (`/api/status` 3 service `up`), dan DB sudah ter-seed (kategori, gedung, lokasi, petugas).

---

## Persiapan kredensial (sebelum mulai rekam)

Siapkan 2 akun untuk menunjukkan alur klaim antar-pengguna + 1 akun admin:

| Peran           | Email (contoh)                | Catatan                                   |
| --------------- | ----------------------------- | ----------------------------------------- |
| User A (pelapor found) | `demo.found@itk.ac.id`        | Yang menemukan & melaporkan barang        |
| User B (pengklaim)     | `demo.claim@itk.ac.id`        | Yang merasa barang itu miliknya           |
| Admin           | (akun admin yang sudah ada)   | Verifikasi & approve klaim, kelola master data |

Password contoh: `Password123` (min 8 char, ada huruf + angka).

---

## Alur rekaman (urutan adegan)

### 1. Landing + Status page (~20 dtk)
1. Buka `https://temuin.pangeransilaen.net`.
2. Tunjukkan halaman utama (SPA load cepat).
3. Buka halaman `/status` — perlihatkan 3 service `up` (bukti microservices hidup via gateway).

### 2. Register + Login (~40 dtk)
1. Register **User A** (`demo.found@itk.ac.id`). Tunjukkan validasi: coba email non-ITK → ditolak pesan jelas; coba password lemah → ditolak.
2. Register dengan data valid → otomatis login / dapat token.
3. (Opsional) tunjukkan logout lalu login ulang untuk menegaskan auth bekerja.

### 3. Lapor barang DITEMUKAN (found) — User A (~50 dtk)
1. Masuk menu buat laporan, pilih tipe **found**.
2. Isi judul, deskripsi, kategori, gedung, lokasi, petugas (master data dari dropdown).
3. Upload gambar barang.
4. Submit → barang muncul di daftar. Buka detailnya.

### 4. Lapor barang HILANG (lost) — User A (~25 dtk)
1. Buat satu laporan tipe **lost** (tunjukkan kedua tipe didukung).
2. Submit → tampil di daftar dengan label `lost`.

### 5. Ajukan klaim — User B (~50 dtk)
1. Logout User A, login **User B** (`demo.claim@itk.ac.id`).
2. Buka barang **found** milik User A dari daftar.
3. Klik ajukan klaim → isi jawaban bukti kepemilikan (ciri spesifik barang).
4. Submit klaim → status klaim `pending`.

### 6. Verifikasi & approve klaim — Admin (~60 dtk)
1. Logout, login **Admin**.
2. Buka panel admin → daftar klaim.
3. Buka detail klaim User B, baca jawaban bukti kepemilikan.
4. **Approve** klaim → status berubah `approved`.
5. Tandai **completed** (barang diserahkan) → status `completed`, item jadi `returned`/`closed`.

### 7. Notifikasi (~25 dtk)
1. Logout, login **User B**.
2. Buka halaman notifikasi → tunjukkan notifikasi klaim disetujui/selesai.

### 8. Profile (~20 dtk)
1. Buka halaman profil User B.
2. Edit nama / no HP → simpan → perlihatkan perubahan tersimpan.

### 9. Admin master data (~30 dtk)
1. Login Admin → panel master data.
2. Tambah satu entitas (mis. kategori baru) → muncul di daftar.
3. (Opsional) edit / hapus untuk menunjukkan CRUD admin.

### 10. Penutup (~15 dtk)
1. Kembali ke `/status` → 3 service tetap `up`.
2. (Opsional) singgung security: HTTPS aktif, rate limit, container non-root.

---

## Checklist pasca-rekam
- [ ] Durasi ≤ ~5 menit, semua adegan jelas terlihat.
- [ ] Tidak ada kredensial sensitif asli yang tampil mencolok.
- [ ] Upload ke Google Drive (akses: anyone with link / sesuai kebutuhan dosen).
- [ ] Tempel link video di `docs/final-checklist.md` (QA-8.3).

---

## Catatan teknis (jika ada kendala saat rekam)
- Kalau muncul toast error, salin `X-Correlation-ID` dari DevTools → Network, lalu trace di VPS: `cd /opt/temuin && ./scripts/logs.sh trace <id>`.
- Kalau `/status` tidak 3 `up`, cek container: `docker ps --filter name=temuin` (semua harus `healthy`).
- Rate limit (429) bisa muncul kalau spam login; tunggu beberapa detik.
