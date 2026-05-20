# Frontend Architecture - Temuin

## Stack Wajib

- React 19
- Vite 7
- JavaScript / JSX
- React Router
- Tailwind CSS 4
- shadcn/ui
- Axios
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
    │   └── api.js
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
- `StatusPage` (Sprint 7+, public, no auth)
- Halaman admin untuk claim, master data, dan user management

## Aturan UI

- Gunakan Bahasa Indonesia pada copy utama
- Gunakan komponen shadcn untuk button, input, dialog, card, badge, toast, table, dropdown, dan layout pendukung
- Responsiveness wajib diperhatikan sejak awal
- Form validasi harus jelas dan ringan
- Status item dan claim ditampilkan konsisten

## Routing Dan Data Flow

- Frontend memanggil satu base URL API aktif via `VITE_API_BASE_URL`
- Pada fase awal (Sprint 1-5) base URL menuju backend monolith (`http://localhost:8000` dev, `https://temuin.pangeransilaen.net` production)
- Pada fase gateway (Sprint 6+) base URL tetap sama, gateway nginx yang routing internal ke 3 service
- Path API selalu prefix `/api/*` untuk konsistensi: `/api/auth/*`, `/api/items/*`, `/api/claims/*`, `/api/notifications/*`
- Auth state menyimpan user dan JWT internal di `localStorage`

## Halaman Sistem & Observability (Sprint 7)

- `StatusPage` di route `/status`: tampilkan kesehatan 3 service backend dengan polling 30 detik
  - Komponen wajib pakai shadcn: `<Card>`, `<Badge>` (variant `success` untuk up, `destructive` untuk down), `<Skeleton>` saat loading
  - Sumber data: `GET /api/status` aggregator endpoint (DEC-022)
  - Accessibility: `role="status"` untuk live region polling, `aria-label` per badge

## Error Handling Cross-Service (Sprint 7)

- Axios interceptor catat header `X-Correlation-ID` dari response (untuk debugging)
- Status 5xx (terutama 503): tampilkan banner shadcn `<Alert variant="destructive">` dengan tombol Retry
- Status 429 (rate limit): tampilkan toast Sonner "Terlalu banyak permintaan, coba lagi sebentar lagi"
- Timeout cross-service: tampilkan toast Sonner "Layanan sementara terganggu, coba lagi"
- Error boundary global di App.jsx: render fallback `<Alert>` dengan link refresh

## Auth Flow Frontend

1. User register dengan email `itk.ac.id`, password, dan nama via form
2. Atau user login dengan email dan password via form
3. Frontend mengirim credentials ke backend (`POST /auth/register` atau `POST /auth/login`)
4. Backend memverifikasi dan mengembalikan JWT internal aplikasi
5. Frontend menyimpan JWT internal di `localStorage` dan fetch profil user dari `GET /auth/me`
6. Semua request API selanjutnya memakai JWT internal via axios interceptor

Catatan:
- Tidak ada dependency eksternal untuk autentikasi (Firebase dihapus)
- PostgreSQL adalah satu-satunya tempat data user dan seluruh data domain Temuin

## Dokumen Terkait

- [backend-architecture.md](./backend-architecture.md)
- [../05-roles/frontend.md](../05-roles/frontend.md)
- [../04-implementation-plan/environment-setup.md](../04-implementation-plan/environment-setup.md)
- [../01-concept/decision-log.md](../01-concept/decision-log.md) (DEC-022 StatusPage component)
