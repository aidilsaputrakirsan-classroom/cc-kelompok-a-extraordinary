# Panduan Test API Manual

Panduan singkat untuk menguji endpoint backend Temuin secara manual.

## Prasyarat

- Backend berjalan di `http://127.0.0.1:8000` (gunakan `127.0.0.1`, **bukan** `localhost`)
- Database `temuin_db` sudah dibuat dan migrasi sudah dijalankan
- Untuk endpoint protected, gunakan token dari `POST /auth/register` atau `POST /auth/login`

## Swagger UI

Cara tercepat untuk menguji API: buka **http://127.0.0.1:8000/docs** di browser. Swagger UI menyediakan form interaktif untuk semua endpoint.

## Cara Mendapatkan Token

Gunakan endpoint register atau login, lalu salin nilai `access_token` dari response untuk dipakai sebagai header:

`Authorization: Bearer <TOKEN>`

## Endpoint Reference

### Health & Info (tanpa auth)

```bash
# Root - cek API hidup
curl http://127.0.0.1:8000/

# Health check - cek koneksi database
curl http://127.0.0.1:8000/health
```

### Auth

```bash
# Register user baru (email harus berakhiran itk.ac.id)
curl -X POST http://127.0.0.1:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@student.itk.ac.id", "password": "test1234", "name": "Test User"}'
# Response: {"access_token": "...", "token_type": "bearer"}

# Login (email + password, dapat JWT internal)
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@student.itk.ac.id", "password": "test1234"}'
# Response: {"access_token": "...", "token_type": "bearer"}

# Get profil user saat ini
curl http://127.0.0.1:8000/auth/me \
  -H "Authorization: Bearer <TOKEN>"

# Update profil
curl -X PUT http://127.0.0.1:8000/auth/me \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Nama Baru", "phone": "08123456789"}'
```

### Items

```bash
# List items (tanpa auth, dengan pagination)
curl "http://127.0.0.1:8000/items/?skip=0&limit=10"

# Get item by ID (tanpa auth)
curl http://127.0.0.1:8000/items/<ITEM_ID>

# Create item (perlu auth)
curl -X POST http://127.0.0.1:8000/items/ \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "lost",
    "title": "Dompet Hitam",
    "description": "Hilang di gedung C lantai 2",
    "images": []
  }'

# Update item (perlu auth, harus pemilik atau satpam)
curl -X PUT http://127.0.0.1:8000/items/<ITEM_ID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Dompet Hitam (Updated)"}'

# Delete item (perlu auth, harus pemilik atau satpam)
curl -X DELETE http://127.0.0.1:8000/items/<ITEM_ID> \
  -H "Authorization: Bearer <TOKEN>"
# Response: 204 No Content
```

## Catatan

- Semua ID (item, user) bertipe string UUID, bukan integer
- Field `type` pada create item hanya menerima `"lost"` atau `"found"`
- Endpoint auth backend hanya menerima email `@itk.ac.id` dan memakai password policy minimal 8 karakter yang mengandung huruf dan angka
- Jika dapat error CORS, pastikan backend berjalan di `127.0.0.1:8000` dan bukan proses lain yang menempati port 8000
