# Temuin - Dokumen Konsep Final dan Kumpulan User Story

## 1. Tujuan Dokumen

Dokumen ini berfungsi sebagai hasil final brainstorming konsep produk sebelum masuk ke tahap PRD, sprint planning, backlog detail, dan roadmap teknis. Fokus dokumen ini adalah menyatukan keputusan tim agar semua role memiliki pemahaman yang sama terhadap arah produk.

---

## 2. Ringkasan Singkat Produk

**Temuin** adalah platform lost and found internal kampus ITK yang hanya dapat diakses oleh pengguna dengan akun Google dan email kampus. Platform ini digunakan untuk melaporkan barang hilang, melaporkan barang temuan, mencari barang, melakukan klaim barang temuan, serta memproses pengembalian barang melalui satpam atau titik penitipan resmi kampus.

Temuin tidak dirancang sebagai marketplace atau forum publik. Temuin adalah sistem operasional internal kampus dengan kontrol akses, alur klaim, dan status barang yang jelas.

---

## 3. Latar Belakang Masalah

Informasi barang hilang dan barang temuan di lingkungan kampus sering tersebar di grup chat, status WhatsApp, atau komunikasi informal. Akibatnya:

* informasi tidak terpusat
* data mudah tenggelam
* sulit melakukan pencarian ulang
* tidak ada jejak status yang jelas
* proses pengembalian barang tidak terdokumentasi
* potensi miskomunikasi tinggi

Temuin hadir sebagai sistem terpusat untuk membantu civitas ITK dalam melaporkan, menelusuri, dan menyelesaikan kasus barang hilang dan barang temuan secara lebih rapi, aman, dan terdokumentasi.

---

## 4. Visi Produk

Menyediakan platform lost and found internal ITK yang terstruktur, aman, dan mudah digunakan, dengan proses pengembalian barang yang jelas melalui mekanisme penitipan resmi ke satpam.

---

## 5. Tujuan Produk

1. Memusatkan informasi barang hilang dan barang temuan dalam satu platform.
2. Mempermudah civitas kampus untuk mencari barang yang hilang atau pemilik barang yang ditemukan.
3. Menyediakan alur klaim dan pengembalian barang yang terdokumentasi.
4. Memastikan barang temuan tidak dibawa pulang oleh penemu, tetapi dititipkan ke satpam resmi.
5. Memberikan kontrol akses yang jelas melalui login akun Google dengan email kampus.
6. Menyediakan dasar sistem yang siap dikembangkan lebih lanjut untuk dashboard, analitik, dan fitur operasional lainnya.

---

## 6. Ruang Lingkup MVP

Fitur yang masuk MVP:

* login Google menggunakan email kampus
* akses sistem hanya untuk pengguna yang sudah login
* manajemen role: superadmin, admin, user
* membuat posting barang hilang
* membuat posting barang temuan
* upload foto barang
* pencarian barang
* filter barang
* melihat daftar dan detail barang
* klaim barang temuan
* pembatasan satu item hanya satu claim aktif
* pengelolaan status item
* pengelolaan status claim
* riwayat status atau log aktivitas
* master data kategori
* master data gedung
* master data lokasi
* master data satpam
* moderasi posting oleh admin
* konfirmasi returned oleh admin

Fitur yang **tidak masuk** MVP namun dapat dipertimbangkan kemudian:

* broadcast pengumuman
* dashboard statistik lanjutan
* notifikasi lanjutan di luar kebutuhan inti
* integrasi komunikasi otomatis yang kompleks
* analitik publik

Catatan: tim sudah memutuskan notifikasi tetap ada. Karena itu, pada tahap PRD nanti notifikasi perlu dipisahkan menjadi **notifikasi inti MVP** atau **notifikasi lanjutan** agar implementasinya tidak melebar.

---

## 7. Aktor Sistem

### 7.1 Superadmin

Peran tertinggi yang bertanggung jawab terhadap pengelolaan sistem secara menyeluruh.

Hak utama:

* kelola role admin
* kelola master data global
* lihat seluruh data
* bantu audit data
* konfigurasi akun admin dan status aktifnya

### 7.2 Admin

Petugas operasional sistem, misalnya satpam atau pihak yang ditunjuk kampus.

Hak utama:

* moderasi posting
* mengelola kategori, lokasi, dan data satpam sesuai kewenangan
* memproses klaim barang temuan
* mengubah status item sesuai proses nyata
* mengonfirmasi barang telah returned
* menangani sengketa sederhana

### 7.3 User

Semua civitas ITK yang memiliki email kampus valid.

Hak utama:

* login ke sistem
* membuat laporan barang hilang
* membuat laporan barang temuan
* melihat daftar barang
* melakukan pencarian dan filter
* melihat detail barang
* mengajukan claim untuk barang temuan
* melihat riwayat laporan dan klaim milik sendiri
* mengelola data posting milik sendiri dengan aturan tertentu

---

## 8. Aturan Bisnis Final

### 8.1 Aturan Akses

* Sistem hanya dapat diakses setelah login.
* Login menggunakan akun Google.
* Hanya email kampus (itk.ac.id) yang diizinkan masuk ke sistem.
* Semua pengguna yang berhasil login akan dibuat atau disinkronkan ke database internal.
* Role default setelah login pertama adalah `user`.
* Role `admin` dan `superadmin` hanya dapat ditetapkan secara internal.

### 8.2 Aturan Barang Temuan

* User boleh membuat posting barang temuan secara langsung.
* Barang temuan tidak boleh dibawa pulang oleh penemu.
* Barang temuan wajib dititipkan ke satpam resmi.
* Saat membuat posting barang temuan, user harus memilih satpam yang terdaftar sebagai penerima penitipan.
* Sistem perlu memiliki master data satpam agar nama satpam dapat dipilih saat input.

### 8.3 Aturan Klaim

* Hanya pengguna login dengan email kampus yang dapat membuat claim.
* Hanya item bertipe `found` yang dapat di-claim.
* Item bertipe `lost` tidak dapat di-claim.
* Satu item hanya boleh memiliki **maksimal satu claim aktif pada satu waktu**.
* Jika claim ditolak atau dibatalkan, item dapat di-claim lagi oleh user lain.
* Jika claim disetujui dan barang berhasil dikembalikan, claim ditutup permanen.

### 8.4 Aturan Status

* Status item dan status claim harus dipisahkan.
* Status item menunjukkan kondisi barang saat ini.
* Status claim menunjukkan progres proses klaim.
* Riwayat status tetap detail dan berbutir, tetapi disimpan di log atau history, bukan seluruhnya dijadikan status utama.

### 8.5 Aturan Kontak dan Privasi

* Sistem tidak menampilkan WA atau media sosial secara wajib.
* Email kampus dapat menjadi media kontak utama.
* Nomor WhatsApp hanya boleh tampil jika user mengisinya secara sadar.
* Sistem sebaiknya memberi penjelasan bahwa data kontak yang diisi dapat dilihat pengguna internal lain sesuai aturan sistem.

---

## 9. Desain Status yang Disepakati

## 9.1 Tipe Item

Tipe item bukan status. Tipe item digunakan untuk membedakan jenis laporan:

* `lost`
* `found`

## 9.2 Status Item

Status item yang disepakati:

* `open`
* `in_claim`
* `returned`
* `closed`

### Penjelasan

#### `open`

Posting masih aktif.

* untuk item `lost`: barang masih dicari
* untuk item `found`: barang tersedia dan belum ada claim aktif

#### `in_claim`

Khusus item `found`.

* ada claim aktif
* item sedang dalam proses verifikasi atau pengambilan
* item tidak dapat di-claim oleh user lain selama claim aktif berlangsung

#### `returned`

* barang telah resmi diserahkan kembali kepada pemilik
* admin telah mengonfirmasi pengembalian
* claim terkait dianggap selesai permanen

#### `closed`

* posting ditutup
* digunakan untuk kasus seperti data tidak valid, duplikat, dibatalkan, atau ditutup admin karena alasan operasional

## 9.3 Status Claim

Status claim yang disarankan:

* `pending`
* `approved`
* `rejected`
* `completed`
* `cancelled`

### Penjelasan

#### `pending`

Claim baru diajukan dan menunggu proses admin.

#### `approved`

Claim diterima dan sedang menuju proses serah terima.

#### `rejected`

Claim ditolak.

#### `completed`

Claim selesai karena barang telah dikembalikan secara resmi.

#### `cancelled`

Claim dibatalkan sebelum selesai.

---

## 10. Riwayat Status dan Audit Log

Tim memutuskan riwayat status tetap berbutir. Itu adalah keputusan yang baik. Best practice yang dipakai:

* `items.status` menyimpan status aktif saat ini
* `claims.status` menyimpan status aktif claim
* `item_status_histories` menyimpan riwayat detail perubahan status item
* `claim_status_histories` menyimpan riwayat detail perubahan status claim
* `audit_logs` dapat dipakai untuk aksi penting admin atau superadmin

Contoh riwayat item:

* item dibuat
* item diubah
* barang dititipkan ke satpam tertentu
* claim diajukan
* claim disetujui
* barang dikembalikan
* posting ditutup

---

## 11. Saran Struktur Master Data

Karena tim ingin menggunakan master data, maka struktur terbaik untuk tahap awal adalah cukup rapi tetapi tidak berlebihan.

### 11.1 Kategori

Digunakan untuk mengelompokkan barang.

Contoh:

* elektronik
* dokumen
* aksesoris
* pakaian
* alat tulis
* lainnya

### 11.2 Gedung

Digunakan sebagai master utama area kampus.

Contoh field:

* id
* code
* name
* description
* is_active

### 11.3 Lokasi

Digunakan untuk lokasi detail kejadian atau penemuan.

Contoh field:

* id
* building_id nullable
* name
* floor nullable
* room nullable
* area_type
* description
* is_active

Catatan:

* tidak perlu memecah tabel lantai dan ruangan secara terpisah pada MVP
* cukup jadikan bagian dari atribut lokasi
* desain ini lebih ringan dan tetap fleksibel

### 11.4 Satpam

Karena tim ingin ada daftar nama satpam yang dapat dipilih saat penitipan, maka master data satpam memang perlu ada.

Contoh field:

* id
* name
* employee_code optional
* assigned_building_id optional
* assigned_location_id optional
* phone optional
* is_active

Catatan penting:

* tidak semua satpam wajib memiliki akun admin
* master data satpam tetap harus ada agar user bisa memilih nama satpam saat penitipan barang
* akun admin hanya diberikan kepada satpam atau petugas tertentu yang memang bertugas mengelola sistem
* jika satu orang satpam juga merupakan admin sistem, maka perlu relasi antara `users` dan `security_officers`
* pendekatan ini lebih ringan, realistis, dan aman untuk MVP

### 11.5 Saran Praktis

Untuk kebutuhan MVP, minimal butuh:

* kategori
* gedung
* lokasi
* satpam

Jika ingin lebih formal, bisa ditambah:

* titik penitipan atau pos satpam
* mapping admin ke gedung atau pos tertentu

---

## 12. Alur Utama Sistem

### 12.1 Alur Barang Hilang

1. User login.
2. User membuat laporan barang hilang.
3. Item tercatat dengan tipe `lost` dan status `open`.
4. User lain dapat melihat laporan.
5. Jika barang benar-benar kembali ke pemilik, status akhir item diubah menjadi `returned`.
6. Jika laporan ditutup karena alasan operasional seperti duplikat, dibatalkan, tidak valid, atau user tidak lagi melanjutkan proses, status item diubah menjadi `closed`.

### 12.2 Alur Barang Temuan

1. User login.
2. User menemukan barang.
3. User menitipkan barang ke satpam resmi.
4. User membuat posting `found`.
5. User memilih satpam terdaftar saat input laporan.
6. Item tersimpan dengan tipe `found` dan status `open`.
7. User lain dapat mencari dan melihat item tersebut.

### 12.3 Alur Klaim Barang Temuan

1. User login.
2. User melihat item `found`.
3. User mengajukan claim.
4. Claim dibuat dengan status `pending`.
5. Item berubah menjadi `in_claim`.
6. Admin memproses claim.
7. Jika claim ditolak:

   * claim menjadi `rejected`
   * item kembali `open`
8. Jika claim disetujui:

   * claim menjadi `approved`
   * item tetap `in_claim`
9. Setelah barang diserahkan:

   * admin mengubah claim menjadi `completed`
   * item berubah menjadi `returned`
   * claim ditutup permanen

---

## 13. Keputusan Penting yang Sudah Final

* akses sistem wajib login
* login memakai Google dan email kampus
* web tidak dibuka untuk publik anonim
* user boleh membuat posting found secara langsung
* barang found wajib dititipkan ke satpam
* nama satpam harus dapat dipilih dari data terdaftar
* satu item hanya satu claim aktif
* claim baru dapat dibuat lagi jika claim sebelumnya ditolak atau dibatalkan
* posting lost tidak bisa di-claim
* admin yang mengonfirmasi returned
* role sistem terdiri dari superadmin, admin, dan user
* broadcast tidak masuk MVP
* dashboard statistik bukan prioritas utama
* riwayat status tetap detail melalui log atau history

---

## 14. Keputusan Final Tambahan untuk Masuk PRD

Berikut keputusan tambahan yang dapat langsung dipakai sebagai default saat menyusun PRD:

1. Validasi email kampus menggunakan suffix `itk.ac.id`.
2. Tidak semua satpam wajib memiliki akun admin. Master data satpam tetap ada, tetapi akun admin hanya untuk satpam atau petugas tertentu.
3. User boleh mengedit posting setelah ada claim aktif, tetapi perubahan harus tercatat di history atau audit log.
4. User boleh menghapus posting, namun implementasi terbaik adalah **soft delete** agar jejak data tidak hilang.
5. Status `closed` sebaiknya hanya dapat diubah oleh `admin` atau `superadmin` karena sifatnya operasional. User cukup diberi aksi hapus atau tarik posting miliknya sendiri.
6. Notifikasi MVP sebaiknya dibatasi pada notifikasi penting saja, yaitu:

   * user mendapat notifikasi saat claim `approved`, `rejected`, atau `completed`
   * user mendapat notifikasi saat posting dimoderasi atau ditutup
   * admin mendapat notifikasi saat ada claim baru
7. Aturan foto untuk MVP:

   * ukuran file per hasil upload maksimal `< 2 MB`
   * jumlah foto per item disarankan maksimal 4
   * gambar diproses lebih dulu di client side sebelum upload
   * bila user mengunggah beberapa foto, sistem boleh membuat kolase atau grid 2x2 agar hanya satu file hasil akhir yang disimpan untuk menghemat storage
8. Untuk item `lost`, jika barang akhirnya kembali ke pemilik maka gunakan status `returned`. Status `closed` dipakai untuk penutupan non-pengembalian seperti duplikat, batal, atau tidak dilanjutkan.
9. Untuk verifikasi claim, MVP lebih baik memakai **pertanyaan verifikasi kepemilikan** atau jawaban deskriptif singkat daripada lampiran file. Lampiran bukti dapat dijadikan pengembangan lanjutan bila benar-benar dibutuhkan.

Poin-poin di atas membuat konsep sudah cukup final dan siap diturunkan ke PRD.

---

# 15. Kumpulan User Story Lengkap

Di bawah ini adalah kumpulan user story yang mungkin terjadi, dikelompokkan berdasarkan aktor dan area proses. Ini dipakai untuk bahan review sebelum masuk backlog dan sprint.

## 15.1 User Story Autentikasi dan Akses

### Sebagai user

* Saya ingin login menggunakan akun Google agar dapat masuk ke sistem dengan mudah.
* Saya ingin hanya email kampus yang bisa dipakai agar platform benar-benar khusus untuk civitas ITK.
* Saya ingin sistem menolak akun non-kampus agar akses tetap terbatas.
* Saya ingin sistem membuat akun saya otomatis saat login pertama agar saya tidak perlu registrasi manual.
* Saya ingin logout dari sistem agar akun saya aman saat memakai perangkat bersama.

### Sebagai admin

* Saya ingin login menggunakan akun yang terdaftar agar dapat menjalankan tugas operasional.

### Sebagai superadmin

* Saya ingin mengatur role user tertentu menjadi admin agar petugas kampus bisa mengelola sistem.
* Saya ingin menonaktifkan admin tertentu agar akses petugas lama dapat dihentikan.

---

## 15.2 User Story Profil dan Data Diri

### Sebagai user

* Saya ingin melihat profil saya agar tahu data akun yang tersimpan.
* Saya ingin melengkapi kontak opsional seperti nomor WhatsApp agar orang lain bisa menghubungi saya bila perlu.
* Saya ingin memahami bahwa nomor kontak yang saya isi dapat terlihat oleh pengguna internal lain agar saya sadar terhadap konsekuensinya.
* Saya ingin memperbarui kontak saya agar data tetap relevan.

### Sebagai admin atau superadmin

* Saya ingin melihat identitas dasar pelapor atau pengklaim agar bisa memproses laporan dengan benar.

---

## 15.3 User Story Membuat Laporan Barang Hilang

### Sebagai user

* Saya ingin membuat laporan barang hilang agar orang lain dapat membantu menemukan barang saya.
* Saya ingin memilih kategori barang agar laporan lebih mudah dicari.
* Saya ingin mengisi nama barang agar laporan lebih jelas.
* Saya ingin menambahkan deskripsi barang agar ciri-cirinya mudah dikenali.
* Saya ingin mengunggah foto barang agar identifikasi lebih akurat.
* Saya ingin memilih lokasi terakhir barang terlihat agar pencarian lebih terarah.
* Saya ingin memilih gedung dan lokasi agar informasi tempat lebih terstruktur.
* Saya ingin menyimpan laporan dan melihatnya muncul di daftar agar yakin laporan berhasil dibuat.
* Saya ingin mengedit laporan saya jika ada informasi yang salah, termasuk saat proses masih berjalan.
* Saya ingin menghapus laporan milik saya bila diperlukan tanpa benar-benar menghilangkan jejak data sistem.
* Saya ingin menutup laporan ketika masalah selesai agar daftar tetap bersih.

### Sebagai admin

* Saya ingin memoderasi laporan barang hilang agar tidak ada spam atau data tidak pantas.
* Saya ingin menutup laporan yang duplikat atau tidak valid agar kualitas data terjaga.

---

## 15.4 User Story Membuat Laporan Barang Temuan

### Sebagai user

* Saya ingin membuat laporan barang temuan agar pemilik barang dapat menemukannya.
* Saya ingin mengunggah foto barang temuan agar pemilik lebih mudah mengenali barang tersebut.
* Saya ingin memilih kategori barang agar laporan rapi.
* Saya ingin mengisi lokasi barang ditemukan agar konteks kejadian jelas.
* Saya ingin memilih satpam terdaftar yang menerima titipan barang agar penitipan tercatat resmi.
* Saya ingin memasukkan deskripsi tambahan agar pemilik bisa memastikan barang tersebut miliknya.
* Saya ingin laporan barang temuan saya langsung tersimpan agar bisa segera dilihat pemilik.
* Saya ingin memperbarui laporan bila ada kesalahan data awal, termasuk saat claim aktif, selama perubahan tercatat di riwayat.
* Saya ingin menghapus laporan milik saya bila diperlukan tanpa menghilangkan audit trail sistem.

### Sebagai admin

* Saya ingin memoderasi laporan barang temuan agar data tidak palsu.
* Saya ingin memastikan barang temuan benar-benar dititipkan ke satpam yang dipilih.
* Saya ingin menutup laporan temuan yang duplikat atau bermasalah.

---

## 15.5 User Story Pencarian dan Eksplorasi Barang

### Sebagai user

* Saya ingin melihat daftar barang hilang dan barang temuan agar bisa melakukan penelusuran.
* Saya ingin mencari barang berdasarkan kata kunci agar lebih cepat menemukan barang yang relevan.
* Saya ingin memfilter berdasarkan tipe item `lost` atau `found` agar hasil lebih tepat.
* Saya ingin memfilter berdasarkan kategori agar pencarian lebih ringkas.
* Saya ingin memfilter berdasarkan lokasi atau gedung agar sesuai area kejadian.
* Saya ingin melihat detail item agar saya bisa menilai apakah barang tersebut relevan.
* Saya ingin tahu status item agar saya tahu apakah barang masih tersedia, sedang diklaim, sudah returned, atau sudah ditutup.

---

## 15.6 User Story Detail Item dan Kontak

### Sebagai user

* Saya ingin melihat detail barang secara lengkap agar bisa memastikan kecocokan.
* Saya ingin melihat email kampus pelapor atau informasi kontak yang diizinkan agar saya bisa menghubungi pihak terkait jika dibutuhkan.
* Saya ingin hanya melihat informasi kontak yang memang diizinkan oleh sistem agar privasi tetap terjaga.
* Saya ingin tahu satpam penerima titipan untuk item found agar saya paham lokasi proses pengambilan barang.

---

## 15.7 User Story Klaim Barang Temuan

### Sebagai user

* Saya ingin mengajukan claim pada item found agar saya bisa meminta pengembalian barang yang saya yakini milik saya.
* Saya ingin sistem hanya mengizinkan claim saat item masih tersedia agar tidak terjadi tumpang tindih.
* Saya ingin mendapatkan kejelasan saat item tidak bisa diklaim karena sudah ada claim aktif.
* Saya ingin melihat status claim saya agar saya tahu prosesnya sedang menunggu, disetujui, ditolak, atau selesai.
* Saya ingin membatalkan claim jika saya sadar barang tersebut bukan milik saya.
* Saya ingin sistem menolak claim saya pada item lost agar aturan sistem tetap konsisten.
* Saya ingin menjawab pertanyaan verifikasi kepemilikan saat membuat claim agar admin bisa memprosesnya dengan lebih yakin.

### Sebagai admin

* Saya ingin melihat daftar claim masuk agar dapat memprosesnya satu per satu.
* Saya ingin meninjau detail pengklaim dan item terkait agar dapat memverifikasi dengan benar.
* Saya ingin menyetujui claim yang valid agar proses pengembalian bisa berjalan.
* Saya ingin menolak claim yang tidak valid agar item dapat diklaim user lain.
* Saya ingin mengubah status item otomatis menjadi `in_claim` saat claim aktif agar item tidak diklaim pihak lain.
* Saya ingin item kembali ke `open` saat claim ditolak atau dibatalkan agar claim baru bisa masuk.
* Saya ingin menandai claim menjadi `completed` saat serah terima selesai agar proses terdokumentasi.

---

## 15.8 User Story Pengembalian Barang

### Sebagai admin

* Saya ingin mengonfirmasi bahwa barang benar-benar telah dikembalikan kepada pemilik agar status akhir sah.
* Saya ingin mengubah item menjadi `returned` saat serah terima selesai agar data akurat.
* Saya ingin claim otomatis dianggap selesai saat item returned agar tidak ada proses menggantung.

### Sebagai user

* Saya ingin mengetahui bahwa barang saya sudah resmi dikembalikan agar saya yakin kasus selesai.
* Saya ingin melihat riwayat pengembalian agar ada jejak penyelesaian.

---

## 15.9 User Story Riwayat dan Aktivitas

### Sebagai user

* Saya ingin melihat daftar laporan yang pernah saya buat agar saya bisa melacak aktivitas saya.
* Saya ingin melihat riwayat claim saya agar saya tahu apa saja yang pernah saya ajukan.
* Saya ingin melihat perubahan status item saya agar saya paham perkembangan kasus.

### Sebagai admin

* Saya ingin melihat riwayat perubahan status suatu item agar saya dapat menelusuri alur kejadiannya.
* Saya ingin melihat riwayat status claim agar mudah melakukan audit operasional.

### Sebagai superadmin

* Saya ingin melihat audit log aksi penting admin agar pengelolaan sistem tetap terkontrol.

---

## 15.10 User Story Moderasi

### Sebagai admin

* Saya ingin menyembunyikan atau menutup posting yang melanggar aturan agar sistem tetap bersih.
* Saya ingin menangani posting duplikat agar data tidak membingungkan user.
* Saya ingin menangani sengketa sederhana terkait status item agar kasus bisa diselesaikan.

### Sebagai user

* Saya ingin mendapat informasi jika posting saya dimoderasi atau ditutup agar saya tahu alasannya.

---

## 15.11 User Story Master Data Kategori

### Sebagai admin

* Saya ingin menambah kategori barang agar daftar kategori tetap relevan.
* Saya ingin mengubah kategori barang agar penamaan konsisten.
* Saya ingin menonaktifkan kategori yang tidak dipakai lagi agar form tetap rapi.

### Sebagai superadmin

* Saya ingin memastikan struktur kategori sesuai kebutuhan sistem agar data mudah dikelola.

---

## 15.12 User Story Master Data Gedung dan Lokasi

### Sebagai admin

* Saya ingin menambah data gedung agar lokasi kampus dapat dipilih user.
* Saya ingin menambah data lokasi detail agar laporan menjadi lebih spesifik.
* Saya ingin mengubah data lokasi jika ada kesalahan penamaan.
* Saya ingin menonaktifkan lokasi yang tidak digunakan lagi agar dropdown tetap valid.

### Sebagai user

* Saya ingin memilih gedung dan lokasi dari data yang tersedia agar saya tidak perlu mengetik bebas dan menyebabkan data berantakan.

---

## 15.13 User Story Master Data Satpam

### Sebagai admin atau superadmin

* Saya ingin menambahkan nama satpam ke sistem agar user bisa memilih satpam penerima titipan.
* Saya ingin mengedit data satpam agar informasi selalu akurat.
* Saya ingin menonaktifkan data satpam yang sudah tidak bertugas agar tidak muncul lagi di pilihan.
* Saya ingin mengaitkan satpam ke gedung atau lokasi tertentu agar data lebih terstruktur.

### Sebagai user

* Saya ingin memilih satpam yang terdaftar saat membuat posting found agar penitipan tercatat resmi.

---

## 15.14 User Story Manajemen Role dan Admin

### Sebagai superadmin

* Saya ingin mengangkat user tertentu menjadi admin agar mereka dapat mengelola operasional sistem.
* Saya ingin menurunkan admin menjadi user biasa bila masa tugasnya berakhir.
* Saya ingin melihat daftar admin aktif agar pengelolaan role lebih mudah.
* Saya ingin menonaktifkan akun tertentu jika diperlukan karena alasan keamanan atau operasional.

### Sebagai admin

* Saya ingin memiliki akses sesuai kewenangan saya tanpa bisa mengubah role pengguna lain jika itu bukan hak saya.

---

## 15.15 User Story Notifikasi

### Sebagai user

* Saya ingin mendapatkan notifikasi saat claim saya disetujui agar saya tahu proses pengambilan bisa dilanjutkan.
* Saya ingin mendapatkan notifikasi saat claim saya ditolak agar saya tahu hasil verifikasi.
* Saya ingin mendapatkan notifikasi saat claim saya selesai agar saya tahu kasus telah tuntas.
* Saya ingin mendapatkan notifikasi saat laporan saya dimoderasi atau ditutup agar saya tidak bingung.

### Sebagai admin

* Saya ingin mendapatkan notifikasi saat ada claim baru agar bisa segera diproses.

Catatan:

* untuk MVP, notifikasi difokuskan pada notifikasi penting saja
* bentuk notifikasi yang paling aman untuk MVP adalah notifikasi in-app yang tersimpan di sistem

## 15.16 User Story Kondisi Khusus atau Edge Case

### Sebagai user

* Saya ingin tahu jika item tidak bisa diklaim karena sudah ada claim aktif agar saya tidak bingung.
* Saya ingin tahu jika laporan saya ditutup karena duplikat agar saya bisa memahami alasan sistem.
* Saya ingin tahu jika akun saya tidak memenuhi syarat login karena bukan email kampus agar tidak terjadi kebingungan.

### Sebagai admin

* Saya ingin menangani item yang salah kategori agar data tetap benar.
* Saya ingin menangani item yang ternyata tidak pernah benar-benar dititipkan ke satpam agar tidak menyesatkan pengguna.
* Saya ingin menangani claim palsu atau tidak valid agar barang tetap aman.

### Sebagai superadmin

* Saya ingin menelusuri perubahan data pada kasus bermasalah agar bisa dilakukan audit.

---

## 16. Penutup

Secara keseluruhan, konsep Temuin sudah cukup matang untuk masuk ke tahap berikutnya. Aturan inti produk, aktor, alur utama, batasan MVP, serta user story dasar sudah cukup jelas untuk dijadikan fondasi PRD.

Tahap selanjutnya yang paling tepat adalah menyusun:

1. PRD terstruktur
2. daftar fitur prioritas
3. backlog per modul atau per sprint
4. pembagian kerja per role
5. rancangan file dan logic per bagian sistem

Dokumen ini menjadi dasar agar tahap berikutnya tidak lagi bersifat menebak-nebak, melainkan benar-benar mengacu pada keputusan final tim.

## 17. Catatan Rekomendasi Implementasi Praktis

Agar keputusan konsep ini tetap realistis saat masuk implementasi, berikut rekomendasi praktis yang bisa dijadikan acuan awal:

* validasi login cukup memeriksa email hasil OAuth Google yang berakhiran `itk.ac.id`
* penghapusan posting oleh user sebaiknya berupa soft delete
* perubahan posting setelah claim aktif tetap diizinkan, tetapi seluruh perubahan wajib tercatat di history
* status `closed` hanya dapat dilakukan admin atau superadmin
* notifikasi MVP cukup berupa notifikasi in-app berbasis database
* verifikasi claim MVP cukup memakai pertanyaan deskriptif, belum perlu upload bukti file
* upload gambar sebaiknya diproses di frontend terlebih dahulu, misalnya resize, kompresi, dan penggabungan menjadi grid bila multi-foto

Dengan keputusan ini, dokumen konsep dapat dianggap final dan siap dijadikan dasar penyusunan PRD.
