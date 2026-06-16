# Reflection Paper UAS Cloud Computing - Lead Frontend
**Nama:** Nicholas  
**GitHub Username:** [@nicholasmnrng](https://github.com/nicholasmnrng)  
**Role:** Lead Frontend  
**Proyek:** Temuin - Platform Lost & Found ITK  

---

## 1. Pendahuluan dan Tanggung Jawab Peran

Sebagai Lead Frontend dalam proyek **Temuin**, tanggung jawab utama saya adalah memastikan seluruh fitur yang dirancang oleh tim dapat dipakai secara nyata oleh pengguna melalui antarmuka web yang jelas, responsif, dan terhubung stabil ke backend. Frontend menjadi lapisan yang mempertemukan kebutuhan produk, aturan bisnis, API backend, dan pengalaman pengguna sehari-hari.

Secara berkala dari Sprint 1 hingga Sprint 8, peran saya meliputi:
1. **Scaffold dan arsitektur UI:** Membangun fondasi React + Vite, Tailwind CSS, shadcn/ui, routing, layout, dan struktur folder frontend.
2. **Auth dan user flow utama:** Mengimplementasikan register, login, logout, protected route, admin route, serta penyimpanan JWT internal untuk request berikutnya.
3. **Fitur lost and found:** Membuat halaman daftar barang, detail barang, form laporan lost/found, search/filter, upload gambar, status badge, dan flow klaim.
4. **Dashboard dan operasional admin:** Menyediakan halaman admin untuk memproses klaim, mengelola master data, serta memberi feedback loading, empty, success, dan error state.
5. **Integrasi cloud dan reliability UI:** Menyesuaikan frontend dengan gateway `/api/*`, menangani error service 503/504/429, menampilkan StatusPage, dan menjaga build/test tetap stabil untuk CI/CD.

---

## 2. Kontribusi Utama dalam Proyek

Selama perjalanan Temuin dari monolith hingga microservices, kontribusi konkret yang saya berikan meliputi:

*   **Fondasi Frontend React + Vite + shadcn/ui:** Saya menginisialisasi struktur frontend di [`frontend/`](../../frontend), memakai React, Vite, Tailwind CSS, dan shadcn/ui sesuai DEC-015. Struktur router dibuat di [`router.jsx`](../../frontend/src/app/router.jsx), layout utama di [`RootLayout.jsx`](../../frontend/src/components/layout/RootLayout.jsx), dan komponen UI dasar ditempatkan di [`components/ui`](../../frontend/src/components/ui).
*   **Auth Flow Internal Tanpa Firebase:** Saya membangun halaman [`LoginPage.jsx`](../../frontend/src/pages/LoginPage.jsx) dan [`RegisterPage.jsx`](../../frontend/src/pages/RegisterPage.jsx), lalu menghubungkannya ke endpoint `/api/auth/login`, `/api/auth/register`, dan `/api/auth/me`. State autentikasi disimpan di [`providers.jsx`](../../frontend/src/app/providers.jsx) dengan JWT internal pada `localStorage`, lalu diterapkan ke request melalui axios interceptor di [`api.js`](../../frontend/src/config/api.js).
*   **User Flow Lost and Found:** Saya membuat halaman [`ItemListPage.jsx`](../../frontend/src/pages/ItemListPage.jsx), [`ItemDetailPage.jsx`](../../frontend/src/pages/ItemDetailPage.jsx), [`CreateItemPage.jsx`](../../frontend/src/pages/CreateItemPage.jsx), [`MyItemsPage.jsx`](../../frontend/src/pages/MyItemsPage.jsx), dan [`MyClaimsPage.jsx`](../../frontend/src/pages/MyClaimsPage.jsx). Flow ini mencakup laporan barang hilang/temuan, detail barang, pengajuan klaim, update status, soft delete item milik user, serta status item dan claim yang konsisten.
*   **Search, Filter, Upload Gambar, dan Badge Status:** Saya menyediakan [`SearchFilter.jsx`](../../frontend/src/components/items/SearchFilter.jsx), [`ClaimForm.jsx`](../../frontend/src/components/items/ClaimForm.jsx), [`EditItemDialog.jsx`](../../frontend/src/components/items/EditItemDialog.jsx), [`StatusBadge.jsx`](../../frontend/src/components/ui/StatusBadge.jsx), serta upload gambar dengan batas maksimal 4 foto sesuai DEC-010/DEC-016. Komponen upload memakai kompresi image sebelum data dikirim agar ukuran efektif foto tetap terkendali.
*   **Halaman Admin dan Master Data:** Saya membangun [`AdminClaimsPage.jsx`](../../frontend/src/pages/AdminClaimsPage.jsx), [`AdminClaimDetailPage.jsx`](../../frontend/src/pages/AdminClaimDetailPage.jsx), dan [`AdminMasterDataPage.jsx`](../../frontend/src/pages/AdminMasterDataPage.jsx). Aksesnya dibatasi dengan [`AdminRoute.jsx`](../../frontend/src/components/auth/AdminRoute.jsx), sehingga hanya `admin` dan `superadmin` yang dapat memproses klaim dan mengelola data referensi.
*   **State UX Konsisten:** Saya membuat pola reusable untuk loading, empty, dan error state melalui [`PageState.jsx`](../../frontend/src/components/PageState.jsx), lalu memakai toast Sonner untuk feedback aksi penting seperti login, register, create item, update claim, error validasi, rate limit, dan gangguan service.
*   **Adaptasi Microservices dan Gateway:** Pada Sprint 6, saya mengubah pemanggilan API agar memakai prefix `/api/*` dan `VITE_API_BASE_URL` melalui [`api.js`](../../frontend/src/config/api.js). Perubahan ini membuat frontend tetap memanggil satu base URL, sementara gateway Nginx yang membagi request ke `auth-service`, `item-service`, dan `engagement-service`.
*   **Reliability dan Observability UI:** Pada Sprint 7, saya menambahkan [`AppErrorBoundary.jsx`](../../frontend/src/components/AppErrorBoundary.jsx), [`ServiceErrorBanner.jsx`](../../frontend/src/components/ServiceErrorBanner.jsx), dan [`StatusPage.jsx`](../../frontend/src/pages/StatusPage.jsx). StatusPage mengambil data dari `/api/status`, memakai shadcn `<Card>`, `<Badge>`, dan `<Skeleton>`, bersifat public tanpa auth, serta polling setiap 30 detik.
*   **Testing dan Build Stabil:** Saya menyiapkan Vitest + React Testing Library lewat konfigurasi [`vite.config.js`](../../frontend/vite.config.js). Pada Sprint 5, frontend sudah melewati target minimal 7 test dengan 21 test dan coverage scope 71.08%, di atas threshold 40% yang ditetapkan DEC-020.
*   **Polish Final dan Security Cleanup:** Pada Sprint 8, saya merapikan spacing, copy Bahasa Indonesia, loading state, empty state, bug demo, audit XSS surface, dan memastikan tidak ada penggunaan `dangerouslySetInnerHTML` serta tidak ada `console.log` yang tertinggal untuk demo UAS.

---

## 3. Analisis Keputusan Teknis dan Tantangan Frontend

Perjalanan frontend Temuin tidak hanya soal membuat halaman, tetapi juga menyesuaikan UI dengan perubahan arsitektur backend dan kebutuhan cloud deployment.

### A. Migrasi Auth dari Firebase ke Email dan Password Internal
*   **Tantangan:** Pada fase awal, auth sempat diarahkan ke Firebase/Google login. Namun keputusan final proyek mengganti auth menjadi email kampus `itk.ac.id` + password internal karena Firebase tidak stabil dan tidak sesuai kebutuhan demo akhir.
*   **Analisis & Solusi:** Saya menulis ulang alur login/register agar langsung memakai backend Temuin. Frontend menyimpan JWT internal, mengambil profil lewat `/api/auth/me`, lalu memakai `ProtectedRoute` dan `AdminRoute` untuk membedakan user biasa dan admin. Perubahan ini membuat frontend lebih sederhana, lebih mudah diuji, dan konsisten dengan backend sebagai source of truth.

### B. Menjaga Frontend Tetap Stabil Saat Backend Berubah ke Microservices
*   **Tantangan:** Sprint 6 memecah backend monolith menjadi tiga service. Risiko terbesar di frontend adalah hardcoded endpoint, path lama tanpa prefix `/api`, dan bug production akibat perbedaan routing gateway.
*   **Analisis & Solusi:** Saya memusatkan seluruh request pada axios instance di `config/api.js`, memakai `VITE_API_BASE_URL`, lalu mengganti endpoint menjadi `/api/auth/*`, `/api/items/*`, `/api/claims/*`, `/api/notifications/*`, dan `/api/master-data/*`. Dengan cara ini, halaman tidak perlu tahu service mana yang menangani request; frontend cukup berbicara ke gateway. Ketika ada issue trailing slash pada login production, request frontend ikut dirapikan agar tidak memicu redirect yang mengganggu flow login.

### C. Memberi UX yang Jelas Saat Service Down atau Lambat
*   **Tantangan:** Setelah masuk arsitektur microservices, kegagalan tidak selalu berarti seluruh aplikasi mati. Bisa saja hanya satu service down, gateway rate limit aktif, atau request timeout.
*   **Analisis & Solusi:** Saya menambahkan toast dan banner untuk status 503/504/network error, toast khusus 429 saat rate limit, serta correlation ID logging saat terjadi 5xx. Untuk observability pengguna dan dosen saat demo, saya membuat StatusPage publik di `/status` yang menampilkan `auth`, `item`, dan `engagement` service dengan polling 30 detik. Ini membuat kondisi sistem bisa dipahami dari sisi UI, bukan hanya dari terminal atau log container.

---

## 4. Pembelajaran dan Refleksi Pribadi

Melalui proyek Temuin ini, saya mendapatkan banyak pembelajaran yang sebelumnya hanya saya pahami secara terpisah:

*   **Frontend adalah jembatan antara produk dan sistem terdistribusi:** Saya belajar bahwa UI bukan hanya tampilan. Setiap tombol, form, badge, dan toast harus mengikuti aturan bisnis seperti status item, status claim, role user, batas upload foto, dan kondisi service backend.
*   **Integrasi API perlu disiplin sejak awal:** Setelah backend berubah dari monolith ke microservices, saya semakin paham pentingnya satu axios instance, env var, dan prefix API yang konsisten. Tanpa itu, perubahan arsitektur akan membuat banyak halaman mudah rusak.
*   **Feedback state sangat menentukan rasa stabil aplikasi:** Loading state, empty state, error state, toast, dan tombol retry terlihat kecil, tetapi sangat membantu pengguna memahami apa yang sedang terjadi. Ini terasa penting terutama saat service sedang lambat atau salah satu backend bermasalah.
*   **Testing membuat perubahan frontend lebih percaya diri:** Dengan Vitest dan React Testing Library, saya bisa memvalidasi komponen penting seperti button, dialog, protected route, login page, item list, status badge, service error banner, dan StatusPage. Pengujian ini membantu menjaga build CI tetap hijau.
*   **Cloud deployment mengubah cara saya melihat frontend:** Saat aplikasi sudah berjalan di domain production, detail kecil seperti trailing slash, base URL, route fallback, cache, dan response error menjadi jauh lebih nyata. Saya belajar bahwa frontend production harus siap menghadapi kondisi jaringan dan service yang tidak selalu ideal.

---

## 5. Kesimpulan Kesiapan Ujian

Berdasarkan seluruh proses pembangunan dan verifikasi frontend hingga Sprint 8:
*   Frontend Temuin sudah menyediakan flow utama: register, login, daftar barang, detail barang, buat laporan lost/found, klaim barang, lihat klaim, notifikasi, admin claim, dan admin master data.
*   Frontend sudah terintegrasi dengan gateway production melalui prefix `/api/*`, memakai JWT internal, dan mendukung role-based access untuk user, admin, dan superadmin.
*   UI sudah memiliki loading state, empty state, error state, toast feedback, retry banner, StatusPage `/status`, serta test suite frontend yang memenuhi threshold proyek.
*   Final polish Sprint 8 sudah menutup kebutuhan demo: build production stabil, copy Bahasa Indonesia konsisten, XSS surface diaudit, dan flow utama siap ditunjukkan pada UAS.

Saya menyatakan bahwa **frontend proyek Temuin telah siap untuk didemonstrasikan pada Ujian Akhir Semester (UAS)** sebagai antarmuka utama yang menghubungkan pengguna dengan sistem lost and found Temuin.
