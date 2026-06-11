# API Contract - Temuin Microservices

Dokumen ini mendokumentasikan kontrak API resmi untuk seluruh microservices Temuin yang diakses melalui API Gateway produksi (`https://temuin.pangeransilaen.net/api`).

---

## 🔑 Autentikasi & Otorisasi (JWT)
Hampir seluruh endpoint (kecuali publik/status) membutuhkan header JWT:
```http
Authorization: Bearer <access_token>
```
Token diperoleh dari endpoint registrasi (`POST /api/auth/register`) atau login (`POST /api/auth/login`).

---

## 🛡️ Kebijakan Rate Limiting (DEC-023)
- **Rute Autentikasi** (`/api/auth/register`, `/api/auth/login`): Maksimal **5 request per detik** per IP dengan **burst 10**.
- **Rute Umum**: Maksimal **30 request per detik** per IP dengan **burst 50**.
- Jika limit terlampaui, gateway mengembalikan status HTTP **`429 Too Many Requests`** dengan body:
  ```json
  {"detail": "Too many requests"}
  ```

---

## 1. Auth Service (`/api/auth`)
Menangani manajemen pengguna, pendaftaran, dan login.

### A. Register Akun Baru
- **Path & Method**: `POST /api/auth/register`
- **Auth Required**: No (Rate limited via `auth_zone`)
- **Request Body**:
  ```json
  {
    "email": "username@student.itk.ac.id",
    "password": "Password123",
    "name": "Nama Lengkap"
  }
  ```
  *(Catatan: email wajib menggunakan suffix `itk.ac.id` / `student.itk.ac.id` dan password minimal 8 karakter dengan huruf + angka).*
- **Response (201 Created)**:
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer"
  }
  ```

### B. Login
- **Path & Method**: `POST /api/auth/login`
- **Auth Required**: No (Rate limited via `auth_zone`)
- **Request Body**:
  ```json
  {
    "email": "username@student.itk.ac.id",
    "password": "Password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer"
  }
  ```

### C. Dapatkan Profil Saat Ini
- **Path & Method**: `GET /api/auth/me`
- **Auth Required**: Yes
- **Response (200 OK)**:
  ```json
  {
    "id": "u90b4d45-6673-42e7-9d7a-d04b901a14b5",
    "email": "username@student.itk.ac.id",
    "name": "Nama Lengkap",
    "phone": "08123456789",
    "role": "user"
  }
  ```

### D. Update Profil
- **Path & Method**: `PUT /api/auth/me`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "name": "Nama Diubah",
    "phone": "08987654321"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "id": "u90b4d45-6673-42e7-9d7a-d04b901a14b5",
    "email": "username@student.itk.ac.id",
    "name": "Nama Diubah",
    "phone": "08987654321",
    "role": "user"
  }
  ```

---

## 2. Item Service (`/api/items` & `/api/master-data`)
Mengelola data barang hilang (lost), barang temuan (found), gambar barang, serta data master lokasi.

### A. List Items
- **Path & Method**: `GET /api/items/`
- **Auth Required**: No (Rate limited via `general_zone`)
- **Query Params**: `skip` (default 0), `limit` (default 10), `type` (optional: `lost`/`found`)
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "i90b4d45-6673-42e7-9d7a-d04b901a14b5",
      "type": "found",
      "title": "Kunci Motor Honda",
      "description": "Ditemukan kunci motor tergeletak di meja kantin.",
      "status": "open",
      "category_id": "c1f77d33-...",
      "building_id": "b1f77d33-...",
      "location_id": "l1f77d33-...",
      "security_officer_id": "s1f77d33-...",
      "created_at": "2026-06-12T00:00:00Z"
    }
  ]
  ```

### B. Buat Laporan Barang
- **Path & Method**: `POST /api/items/`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "type": "found",
    "title": "Kunci Motor Honda",
    "description": "Ditemukan kunci motor tergeletak di meja kantin.",
    "category_id": "c1f77d33-7123-441f-823c-c90a19e2fb42",
    "building_id": "b1f77d33-7123-441f-823c-c90a19e2fb42",
    "location_id": "l1f77d33-7123-441f-823c-c90a19e2fb42",
    "security_officer_id": "s1f77d33-7123-441f-823c-c90a19e2fb42",
    "images": ["data:image/jpeg;base64,..."]
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "id": "i90b4d45-6673-42e7-9d7a-d04b901a14b5",
    "title": "Kunci Motor Honda",
    "status": "open"
  }
  ```

### C. Kelola Master Data (CRUD Admin)
Endpoint ini digunakan untuk mengelola data referensi (Categories, Buildings, Locations, Security Officers) di bawah prefix `/api/master-data/`.
- **Paths**:
  - `GET /api/master-data/categories` (Publik)
  - `POST /api/master-data/categories` (Admin)
  - `PUT /api/master-data/categories/{id}` (Admin)
  - `DELETE /api/master-data/categories/{id}` (Admin)
  - *(Pola yang sama berlaku untuk `buildings`, `locations`, dan `security-officers`)*

---

## 3. Engagement Service (`/api/claims`, `/api/notifications`, `/api/status`)
Mengelola permohonan klaim barang temuan, notifikasi pengguna, dan pemantauan sistem.

### A. Ajukan Klaim (Claim)
- **Path & Method**: `POST /api/claims/`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "item_id": "i90b4d45-6673-42e7-9d7a-d04b901a14b5",
    "proof_description": "Kunci motor ada gantungan bertuliskan inisial R."
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "id": "e7c2e0b5-7123-441f-823c-c90a19e2fb42",
    "item_id": "i90b4d45-6673-42e7-9d7a-d04b901a14b5",
    "status": "pending",
    "created_at": "2026-06-12T00:05:00Z"
  }
  ```

### B. Proses Klaim (Approve / Reject / Complete - Admin)
- **Path & Method**: `PUT /api/claims/{id}`
- **Auth Required**: Yes (Hanya Admin / Satpam)
- **Request Body**:
  ```json
  {
    "status": "approved" 
  }
  ```
  *(Status yang valid: `approved`, `rejected`, `completed`, `cancelled`)*
- **Response (200 OK)**:
  ```json
  {
    "id": "e7c2e0b5-7123-441f-823c-c90a19e2fb42",
    "status": "approved"
  }
  ```

### C. Ambil Notifikasi In-App
- **Path & Method**: `GET /api/notifications/`
- **Auth Required**: Yes
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "n1c2e0b5-7123-...",
      "user_id": "u90b4d45-...",
      "message": "Klaim Anda untuk Kunci Motor Honda telah disetujui.",
      "is_read": false,
      "created_at": "2026-06-12T00:10:00Z"
    }
  ]
  ```

### D. Status Kesehatan Global (Aggregator)
- **Path & Method**: `GET /api/status`
- **Auth Required**: No
- **Response (200 OK)**:
  ```json
  {
    "status": "UP",
    "services": {
      "auth-service": "UP",
      "item-service": "UP",
      "engagement-service": "UP"
    }
  }
  ```
