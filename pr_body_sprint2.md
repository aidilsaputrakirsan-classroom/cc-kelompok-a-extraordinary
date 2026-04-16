## Description
Sprint 2 - Lead Frontend Implementation (FE-2.1 to FE-2.4)

### Fitur yang Diimplementasikan
- Login Google menggunakan Firebase SDK dan konversi ke Session JWT internal.
- Protected Route untuk menjaga keamanan halaman.
- Halaman katalog utama (HomePage, ItemListPage, ItemDetailPage) dengan integrasi dummy API.
- Halaman pembuat form (CreateItemPage) dengan validasi gambar Base64 (< 2MB) dan logic required field Satpam.

### Ringkasan File Utama
- `src/pages/LoginPage.jsx` & `src/config/firebase.js`: Setup Google OAuth.
- `src/app/providers.jsx` & `src/components/auth/ProtectedRoute.jsx`: Global Auth State.
- `src/pages/HomePage.jsx`, `src/pages/ItemListPage.jsx`, `src/pages/ItemDetailPage.jsx`: UI display item.
- `src/pages/CreateItemPage.jsx`: Interactive reporting form.

### Ringkasan Log Task
1. **FE-2.1**: Instalasi Google Auth provider & UI Login.
2. **FE-2.2**: State Management Auth dan Protected Routes.
3. **FE-2.3**: Pembuatan list & detail mockup untuk katalog barang.
4. **FE-2.4**: Form tambah data interaktif dengan image shrink automation.
