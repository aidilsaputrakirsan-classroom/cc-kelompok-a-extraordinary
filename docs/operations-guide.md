# Operations & Observability Guide - Temuin

Panduan ini ditujukan bagi Administrator, DevOps, dan QA untuk memantau kesehatan sistem, melakukan pelacakan bug lintas layanan mikro (*request tracing*), membaca metrik, serta mengelola operasional kontainer Temuin pada lingkungan produksi.

---

## 1. Structured JSON Logging

Setiap layanan mikro Temuin (`auth-service`, `item-service`, dan `engagement-service`) memformat log mereka dalam bentuk **Structured JSON** satu baris per event. Hal ini memudahkan proses parsing, pengindeksan, dan pencarian log.

### 1.1 Struktur Bidang Log JSON
Setiap entri log JSON berisi bidang-bidang standar berikut:
* `timestamp`: Waktu perekaman log dalam format ISO 8601 UTC (contoh: `2026-05-25T10:15:30.123Z`).
* `level`: Tingkat keseriusan log (`INFO`, `WARNING`, `ERROR`, `CRITICAL`).
* `service`: Nama microservice pengirim log (`auth-service`, `item-service`, atau `engagement-service`).
* `correlation_id`: ID unik 12-karakter untuk melacak alur request lintas service.
* `message`: Pesan deskriptif mengenai event yang terjadi.
* `method` (opsional): HTTP Method (`GET`, `POST`, dst) jika log dipicu oleh request masuk.
* `path` (opsional): Endpoint HTTP yang dipanggil (contoh: `/api/items/`).
* `status_code` (opsional): Status HTTP response (contoh: `200`, `429`, `503`).
* `duration_ms` (opsional): Latensi pemrosesan request di dalam service dalam mili-detik.

### 1.2 Contoh Log JSON
Berikut adalah contoh log JSON saat request berhasil diproses:
```json
{"timestamp": "2026-05-25T10:15:30.123Z", "level": "INFO", "service": "item-service", "correlation_id": "abc123xyz456", "message": "Successfully fetched item details", "method": "GET", "path": "/api/items/12", "status_code": 200, "duration_ms": 45.2}
```

Jika terjadi error, log akan memuat informasi exception:
```json
{"timestamp": "2026-05-25T10:16:00.789Z", "level": "ERROR", "service": "engagement-service", "correlation_id": "def789vwx012", "message": "Failed to connect to item-service: Timeout connection", "method": "POST", "path": "/api/claims/", "status_code": 503, "duration_ms": 5000.0, "exception": "httpx.ConnectTimeout"}
```

---

## 2. Request Tracing Menggunakan Correlation ID

Untuk melacak kesalahan yang terjadi lintas layanan mikro (misalnya client memanggil `engagement-service` yang kemudian memanggil `item-service` di backend), Temuin menggunakan **Correlation ID**.

### 2.1 Alur Pembuatan dan Penerusan ID
1. **Pemicu Awal**: Saat request masuk melalui `temuin-gateway` (Nginx), gateway memeriksa apakah header `X-Correlation-ID` sudah dikirim oleh client.
2. **Generasi ID**: Jika tidak ada, gateway akan men-generate string ID unik sepanjang 12 karakter.
3. **Penerusan ke Upstream**: Gateway memasukkan ID tersebut ke dalam header `X-Correlation-ID` saat meneruskan request ke microservice backend.
4. **Penerusan Antar Service**: Backend service akan meneruskan header `X-Correlation-ID` yang sama ketika memanggil API service lain (misal dari `engagement-service` ke `item-service`).
5. **Pencatatan Log**: Setiap service mencantumkan `correlation_id` tersebut di setiap baris log yang dihasilkan selama memproses request tersebut.

### 2.2 Cara Mengusut Masalah dengan Correlation ID
Jika pengguna melaporkan error (misal muncul toast error di web):
1. Buka **DevTools browser (F12)** -> Tab **Network**.
2. Cari request yang gagal (berwarna merah / status 5xx).
3. Klik request tersebut, masuk ke tab **Headers**, dan cari nilai **`X-Correlation-ID`** pada *Response Headers* atau *Request Headers*. Salin nilai tersebut (misalnya: `c8d9e2f1a3b5`).
4. SSH ke server VPS produksi, masuk ke `/opt/temuin/`, lalu jalankan helper script untuk melacak log di seluruh kontainer:
   ```bash
   ./scripts/logs.sh trace c8d9e2f1a3b5
   ```
5. Perintah di atas akan mengeluarkan baris log dari seluruh kontainer yang memiliki kecocokan ID tersebut. Anda dapat melihat tepat di kontainer mana dan pada baris kode mana error mulai terjadi.

---

## 3. Memantau Metrik Kesehatan (`/metrics`)

Setiap microservice mengekspos metrik internal dalam format **Prometheus Text Exposition** pada route `/metrics`.

### 3.1 Endpoint Metrik via Gateway
Anda dapat menembak metrik langsung via API Gateway tanpa perlu menyasar port internal kontainer:
* **Auth Service Metrics**: `http://localhost:8080/api/auth/metrics` (lokal) atau `https://temuin.pangeransilaen.net/api/auth/metrics`
* **Item Service Metrics**: `http://localhost:8080/api/items/metrics` (lokal) or `https://temuin.pangeransilaen.net/api/items/metrics`
* **Engagement Service Metrics**: `http://localhost:8080/api/engagement/metrics` (lokal) atau `https://temuin.pangeransilaen.net/api/engagement/metrics`

### 3.2 Menembak Metrik via Helper Script
Untuk melihat rangkuman metrik dari semua service secara cepat, jalankan perintah berikut di server VPS:
```bash
./scripts/logs.sh metrics
```

### 3.3 Metrik Utama yang Disediakan
* `http_requests_total`: Counter yang mencatat total request masuk berdasarkan path dan status code.
* `http_request_duration_seconds`: Histogram yang mencatat durasi respons request.
* `http_errors_total`: Counter yang mencatat jumlah error HTTP (status 4xx/5xx).

---

## 4. Manajemen Kontainer dan Log

Berikut adalah perintah-perintah penting untuk mengelola kontainer dan siklus hidup log di server produksi.

### 4.1 Melihat Status Kesehatan Kontainer
Gunakan Makefile helper untuk melihat status hidup kontainer microservices:
```bash
make ps-micro
```
Perintah di atas setara dengan `docker compose -f infra/docker-compose.microservices.yml ps`.

### 4.2 Melihat Penggunaan RAM dan CPU
Untuk memastikan penggunaan memori server tetap efisien dan tidak menyentuh batas OOM (Out Of Memory):
```bash
make stats-micro
```
Perintah ini akan mengeluarkan data konsumsi RAM dan CPU dari kelima kontainer (`temuin-db`, `temuin-auth`, `temuin-item`, `temuin-engagement`, dan `temuin-frontend`).

### 4.3 Log Rotation (Rotasi Berkas Log)
Untuk mencegah disk server penuh akibat berkas log kontainer yang membengkak, Temuin telah mengonfigurasi rotasi log otomatis di `docker-compose.microservices.yml` menggunakan driver bawaan Docker:
* **Log Limit**: Maksimal ukuran file log per kontainer adalah **10 MB**.
* **Log Backups**: Docker akan menyimpan maksimal **3 file cadangan** log yang telah dirotasi per kontainer sebelum menghapus log terlama.

### 4.4 Restart Kontainer Tertentu
Jika salah satu service hang atau memori meningkat drastis, lakukan restart mandiri tanpa mematikan service lainnya:
```bash
# Contoh merestart auth-service
docker compose -f infra/docker-compose.microservices.yml restart auth-service
```
