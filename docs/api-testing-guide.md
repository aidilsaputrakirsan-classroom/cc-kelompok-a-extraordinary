# Panduan Test API Manual

Panduan singkat untuk menguji endpoint backend Temuin secara manual.

## Prasyarat

- Backend berjalan di `http://127.0.0.1:8000` (gunakan `127.0.0.1`, **bukan** `localhost`)
- File `serviceAccountKey.json` ada di folder `backend/`
- Database `temuin_db` sudah dibuat dan migrasi sudah dijalankan

## Swagger UI

Cara tercepat untuk menguji API: buka **http://127.0.0.1:8000/docs** di browser. Swagger UI menyediakan form interaktif untuk semua endpoint.

## Cara Mendapatkan Token

Login Google tidak bisa diotomasi via curl. Gunakan cara berikut:

1. Buka frontend (`http://localhost:5173`) dan login dengan akun Google `@itk.ac.id`
2. Buka browser DevTools (F12) > tab **Application** > **Local Storage** > `http://localhost:5173`
3. Salin nilai `internalToken` -- ini adalah `access_token` JWT internal
4. Gunakan token tersebut di header: `Authorization: Bearer <TOKEN>`

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
# Login (kirim Firebase ID token, dapat JWT internal)
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"id_token": "<FIREBASE_ID_TOKEN>"}'
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
- Endpoint `POST /auth/login` memverifikasi token Firebase dan hanya menerima email `@itk.ac.id` (lihat DEC-002)
- Jika dapat error CORS, pastikan backend berjalan di `127.0.0.1:8000` dan bukan proses lain yang menempati port 8000
