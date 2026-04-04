# Frontend Architecture - Temuin

## Stack Wajib

- React 19
- Vite 7
- JavaScript / JSX
- React Router
- Tailwind CSS 4
- shadcn/ui
- Axios
- Firebase Auth SDK

Catatan:
- `shadcn/ui` wajib dipakai sebagai basis komponen UI
- Jangan membuat sistem UI custom besar jika komponen shadcn sudah cukup

## Struktur Awal Frontend

```text
frontend/
├── components.json
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── lib/
    │   └── utils.js
    ├── app/
    │   ├── router.jsx
    │   └── providers.jsx
    ├── config/
    │   ├── api.js
    │   └── firebase.js
    ├── components/
    │   ├── ui/
    │   ├── layout/
    │   ├── auth/
    │   ├── items/
    │   └── claims/
    ├── pages/
    ├── hooks/
    └── styles/
```

## Halaman Utama

- `LoginPage`
- `HomePage`
- `ItemListPage`
- `ItemDetailPage`
- `CreateItemPage`
- `MyItemsPage`
- `MyClaimsPage`
- `ProfilePage`
- `NotificationsPage`
- Halaman admin untuk claim, master data, dan user management

## Aturan UI

- Gunakan Bahasa Indonesia pada copy utama
- Gunakan komponen shadcn untuk button, input, dialog, card, badge, toast, table, dropdown, dan layout pendukung
- Responsiveness wajib diperhatikan sejak awal
- Form validasi harus jelas dan ringan
- Status item dan claim ditampilkan konsisten

## Routing Dan Data Flow

- Frontend memanggil satu base URL API aktif
- Pada fase awal base URL menuju backend monolith
- Pada fase gateway, base URL dialihkan ke Nginx gateway
- Auth state menyimpan user dan JWT internal

## Auth Flow Frontend

1. User klik login Google
2. Firebase Auth SDK membuka popup Google
3. Frontend menerima Firebase ID token
4. Frontend mengirim token itu ke backend
5. Backend memverifikasi token dan mengembalikan JWT internal aplikasi
6. Frontend menyimpan JWT internal dan data user internal
7. Semua request API selanjutnya memakai JWT internal, bukan token Firebase langsung

Catatan:
- Firebase dipakai untuk proses sign-in
- PostgreSQL tetap menjadi tempat data user internal dan seluruh data domain Temuin

## Dokumen Terkait

- [backend-architecture.md](./backend-architecture.md)
- [../05-roles/frontend.md](../05-roles/frontend.md)
- [../04-implementation-plan/environment-setup.md](../04-implementation-plan/environment-setup.md)
