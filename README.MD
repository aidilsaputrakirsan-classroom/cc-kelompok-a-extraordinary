# ☁️ Cloud App - Temuin (Lost & Found Platform)

Deskripsi Singkat : 
Temuin adalah platform Lost & Found berbasis web yang dirancang untuk membantu civitas kampus dalam melaporkan dan menemukan barang hilang atau barang temuan secara terpusat dan transparan. Aplikasi ini memungkinkan pengguna untuk membuat laporan kehilangan atau penemuan barang, melakukan pencarian berdasarkan kategori dan lokasi, serta melacak status barang hingga kembali ke pemiliknya.  

Platform ini ditujukan untuk mahasiswa, dosen, dan seluruh civitas kampus agar proses pencarian barang menjadi lebih cepat, terorganisir, dan terdokumentasi dengan baik dibandingkan metode manual seperti bertanya langsung atau menyebar informasi melalui grup chat.  

## 🎯 Latar Belakang Masalah
Kehilangan barang di lingkungan kampus merupakan kejadian yang sering terjadi, baik di ruang kelas, laboratorium, perpustakaan, maupun area umum lainnya. Saat ini proses pencarian barang hilang masih dilakukan secara manual, seperti bertanya kepada teman, menghubungi satpam, atau memposting di media sosial yang informasinya tidak terstruktur dan sulit dilacak.

Tidak adanya sistem terpusat menyebabkan:
- Informasi barang hilang dan ditemukan tersebar dan tidak terdokumentasi dengan baik.
- Sulitnya memverifikasi status barang apakah sudah dikembalikan atau belum.
- Kurangnya transparansi dalam proses klaim dan pengembalian barang.

Oleh karena itu, diperlukan sebuah platform digital yang dapat mengelola laporan lost & found secara terstruktur, transparan, dan mudah diakses oleh seluruh civitas kampus.

## 🎯 Tujuan Pengembangan
Tujuan pengembangan aplikasi Temuin adalah:  

- Membangun sistem terpusat untuk pelaporan barang hilang dan barang ditemukan.
- Mempermudah proses pencarian dan pencocokan barang lost & found.
- Menyediakan fitur pelacakan status barang secara transparan.
- Meningkatkan efisiensi dan kecepatan pengembalian barang kepada pemiliknya.
- Mengimplementasikan arsitektur cloud-native menggunakan containerization dan CI/CD sebagai bagian dari pembelajaran Cloud Computing.

## 🚀 Target Pengguna 
Aplikasi Temuin ditujukan untuk:

- Mahasiswa
- Dosen
- Staff dan tenaga kependidikan
- Petugas keamanan kampus

Secara umum, seluruh civitas kampus yang beraktivitas di lingkungan kampus dan berpotensi mengalami kehilangan atau menemukan barang.

## 👥 Tim Pengembang

| Nama | NIM | Peran |
|------|-----|-------|
| Raisha Alika Irwandira | 10231077 | Lead Backend |
| Nicholas Christian Samuel Manurung | 10231069 | Lead Frontend |
| Pangeran Borneo Silaen | 10231073 | Lead DevOps |
| Rani Ayu Dewi | 10231079 | Lead QA & Docs |

---

## 🛠️ Tech Stack

| Teknologi | Fungsi |
|-----------|--------|
| FastAPI | Backend REST API |
| React + Vite | Frontend SPA |
| PostgreSQL | Database laporan barang |
| Docker | Containerization |
| GitHub Actions | CI/CD Pipeline |
| Railway / Render | Cloud Deployment |

---

## 🏗️ Arsitektur Sistem (Week 1)
```
[Client / User - Civitas Kampus]
           │
        (HTTPS)
           │
           ▼
[React Frontend (Vite)]
           │
    REST API (HTTP)
           │
           ▼
[Python Backend (FastAPI)]
           │
           ▼
[Database (PostgreSQL)]
```

**Penjelasan Arsitektur**

Client/user (civitas kampus) dapat mengakses aplikasi Temuin melalui browser menggunakan protokol HTTPS agar memastikan komunikasi aman.

React Frontend (Vite) berfungsi sebagai antarmuka pengguna dengan menampilkan dashboard laporan, form input barang hilang/ditemukan, fitur pencarian, serta berkomunikasi dengan backend untuk mengambil dan mengirim data.

Python Backend (FastAPI) berfungsi dalam menjalankan logika bisnis aplikasi seperti autentikasi pengguna, CRUD laporan barang, pencarian dan pencocokan barang hilang-ditemukan, serta tracking status pengembalian barang.

PostgreSQL Database berfungsi untuk menyimpan data terstruktur seperti data pengguna, laporan barang hilang, laporan barang ditemukan, kategori, lokasi, dan riwayat aktivitas.

---

## 🚀 Cara Menjalankan Project

### 1️⃣ Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2️⃣ Frontend 
```bash
cd frontend
npm install
npm run dev
```

## 📌 Roadmap Milestone & Project Structure

### 📅 Roadmap Pengembangan

| Minggu | Target | Status |
|--------|--------|--------|
| 1 | Setup & Hello World | ✅ |
| 2 | REST API + Database | ✅ |
| 3 | React Frontend | ⬜ |
| 4 | Full-Stack Integration | ⬜ |
| 5–7 | Docker & Compose | ⬜ |
| 8 | UTS Demo | ⬜ |
| 9–11 | CI/CD Pipeline | ⬜ |
| 12–14 | Microservices | ⬜ |
| 15–16 | Final & UAS | ⬜ |

---

### 📁 Project Structure
```
cc-kelompok-a-extraordinary/
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   ├── schemas.py
├── docs/
│   ├── .gitkeep
│   ├── member-nicholas.md
│   ├── member-pangeran.md
│   ├── member-raisha.md
│   └── member-rani.md
├── frontend/
│   ├── node_modules/
│   ├── public/
│   │   ├── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   │    ├── react.svg
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html 
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
├── .gitignore
├── .python-version
└── README.MD
```

## 🔌 API Endpoint Documentation

Bagian ini menyediakan dokumentasi teknis mendalam mengenai arsitektur backend, skema data, dan endpoint REST API yang digunakan dalam platform Temuin. Dokumentasi ini mencakup seluruh proses dari konfigurasi database PostgreSQL, definisi model data, hingga daftar endpoint yang tersedia beserta hasil pengujiannya untuk memastikan kehandalan sistem.

### 1️⃣ PostgreSQL Database Configuration

Pada tahap awal pengembangan backend aplikasi **Temuin**, dilakukan konfigurasi database menggunakan **PostgreSQL**. Database ini berfungsi sebagai tempat penyimpanan seluruh data yang berkaitan dengan laporan barang hilang maupun barang yang ditemukan di lingkungan kampus. Dengan adanya database, data dapat disimpan secara terstruktur sehingga sistem dapat melakukan proses pencarian, pengelolaan, dan pengolahan informasi secara lebih efisien melalui API yang dibangun.

Proses konfigurasi ini dilakukan melalui beberapa langkah utama, yaitu membuat database baru, menyiapkan file konfigurasi lingkungan (.env), serta menginstall dependencies yang diperlukan agar backend dapat terhubung dengan database PostgreSQL.

#### Membuat Database

Database baru dibuat di PostgreSQL dengan nama **cloudapp** yang akan digunakan oleh aplikasi untuk menyimpan data laporan barang.

Masuk ke PostgreSQL melalui terminal:

```bash
psql -U postgres
```

Setelah masuk ke PostgreSQL shell, jalankan perintah berikut untuk membuat database:

```sql
CREATE DATABASE cloudapp;
```

Untuk memastikan database berhasil dibuat, jalankan perintah berikut:

```sql
\l
```

Perintah tersebut akan menampilkan daftar database yang tersedia. Pastikan database **cloudapp** muncul dalam daftar.

Jika sudah selesai, keluar dari PostgreSQL dengan perintah:

```sql
\q
```

💡 Jika menggunakan **pgAdmin**, database juga dapat dibuat melalui antarmuka GUI dengan memilih:

```
Databases → Create → Database → Name: cloudapp
```

#### Membuat File Environment (.env)

Setelah database dibuat, langkah selanjutnya adalah menyiapkan file **.env** yang berisi konfigurasi koneksi database. File ini digunakan untuk menyimpan informasi sensitif seperti username, password, dan alamat database sehingga tidak perlu dituliskan langsung di dalam kode program.

Buat file berikut pada folder backend:

```
backend/.env
```

Isi konfigurasi koneksi database sebagai berikut:

```env
DATABASE_URL=postgresql://postgres:PASSWORD_ANDA@localhost:5432/cloudapp
```

⚠️ Ganti `PASSWORD_ANDA` dengan password PostgreSQL yang digunakan pada komputer Anda.

File `.env` **tidak boleh diunggah ke repository Git** karena berisi informasi sensitif. Oleh karena itu, dibuat juga file template bernama **.env.example** agar anggota tim lain dapat mengetahui format konfigurasi yang diperlukan.

Buat file berikut:

```
backend/.env.example
```

Isi contoh konfigurasi:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/cloudapp
```

Selain itu, pastikan file `.env` sudah dimasukkan ke dalam `.gitignore` agar tidak ikut ter-commit ke repository.

#### Menginstall Dependencies Backend

Agar backend dapat berkomunikasi dengan database PostgreSQL, beberapa **dependencies tambahan** perlu diinstall. Dependencies ini digunakan untuk menjalankan server backend, mengelola koneksi database, serta membaca konfigurasi dari file `.env`.

Update file berikut:

```
backend/requirements.txt
```

Tambahkan dependencies berikut:

```txt
fastapi==0.115.0
uvicorn==0.30.0
sqlalchemy==2.0.35
psycopg2-binary==2.9.9
python-dotenv==1.0.1
pydantic[email]==2.9.0
```

Kemudian install dependencies dengan menjalankan perintah berikut:

```bash
cd backend
pip install -r requirements.txt
```

Dependencies yang digunakan memiliki fungsi sebagai berikut:

* **FastAPI** → framework backend untuk membangun REST API
* **Uvicorn** → server untuk menjalankan aplikasi FastAPI
* **SQLAlchemy** → ORM (Object Relational Mapping) untuk mengelola interaksi dengan database PostgreSQL
* **psycopg2-binary** → driver PostgreSQL untuk Python
* **python-dotenv** → membaca konfigurasi dari file `.env`
* **Pydantic** → validasi data pada request dan response API

### 2️⃣ Database Connection & Models
Setelah database PostgreSQL berhasil dikonfigurasi, tahap berikutnya adalah menghubungkan aplikasi backend dengan database serta membangun struktur backend yang akan digunakan untuk mengelola data dalam sistem. Pada proyek **Temuin**, backend dikembangkan menggunakan framework **FastAPI** dan beberapa komponen utama yang saling terhubung untuk menangani proses pengelolaan data barang hilang dan barang ditemukan.

Struktur backend pada proyek ini terdiri dari beberapa file utama yang memiliki fungsi berbeda, yaitu untuk mengelola koneksi database, mendefinisikan struktur data, melakukan operasi CRUD, serta menyediakan endpoint API yang dapat diakses oleh frontend.

Beberapa file utama yang digunakan dalam backend antara lain:

- **database.py**  
  File ini bertanggung jawab untuk mengatur koneksi antara aplikasi backend dengan database PostgreSQL menggunakan SQLAlchemy. File ini juga mengelola session database yang akan digunakan oleh komponen backend lainnya.

- **models.py**  
  File ini berisi definisi **database models** yang merepresentasikan struktur tabel dalam database. Models ditulis dalam bentuk kelas Python menggunakan SQLAlchemy ORM sehingga tabel database dapat dikelola melalui objek dalam program.

- **schemas.py**  
  File ini digunakan untuk mendefinisikan **struktur data request dan response API** menggunakan Pydantic. Schema membantu memastikan bahwa data yang dikirim dan diterima oleh API memiliki format yang valid.

- **crud.py**  
  File ini berisi implementasi **operasi CRUD (Create, Read, Update, Delete)** yang digunakan untuk mengelola data barang di dalam database. Fungsi-fungsi dalam file ini bertindak sebagai penghubung antara models dan endpoint API.

- **main.py**  
  File ini merupakan **entry point dari aplikasi FastAPI** yang mendefinisikan endpoint API yang dapat diakses oleh pengguna atau frontend. Endpoint ini menggunakan fungsi dari file CRUD untuk mengambil atau memproses data dari database.

Dengan adanya pembagian struktur backend seperti ini, kode program menjadi lebih terorganisir, mudah.

#### 🗄️ Membuat database.py
File database.py dibuat sebagai komponen utama untuk mengatur koneksi antara aplikasi dengan database yang digunakan, yaitu PostgreSQL. Pada bagian ini dilakukan konfigurasi alamat database, pembuatan engine SQLAlchemy, serta pengaturan session yang akan digunakan untuk menjalankan operasi pada database. Dengan adanya file ini, aplikasi dapat terhubung dengan database secara terstruktur sehingga proses pengambilan, penyimpanan, maupun pengolahan data dapat berjalan dengan baik.

File: ``` backend/database.py ```

```
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load environment variables dari .env
load_dotenv()

# Ambil DATABASE_URL dari environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL tidak ditemukan di .env!")

# Buat engine (koneksi ke database)
engine = create_engine(DATABASE_URL)

# Buat session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class untuk models
Base = declarative_base()


# Dependency: dapatkan database session
def get_db():
    """
    Dependency injection untuk FastAPI.
    Membuka session saat request masuk, menutup saat selesai.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

#### 🧩 Membuat models.py

Setelah koneksi database berhasil dikonfigurasi, langkah berikutnya adalah membuat **models.py**. File ini digunakan untuk mendefinisikan struktur tabel yang akan disimpan di dalam database menggunakan ORM (Object Relational Mapping) dari SQLAlchemy. Dengan adanya model, setiap tabel dalam database dapat direpresentasikan sebagai sebuah class di dalam kode Python sehingga memudahkan proses pengelolaan data.

Dengan mendefinisikan model menggunakan SQLAlchemy, backend dapat melakukan operasi database seperti menambah, membaca, memperbarui, dan menghapus data secara lebih terstruktur tanpa harus menuliskan query SQL secara langsung. Model ini nantinya juga akan digunakan oleh bagian CRUD dan API endpoint untuk memproses data yang masuk dan keluar dari sistem.

File: ``` backend/models.py ```

```
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from database import Base


class Item(Base):
    """
    Model untuk tabel 'items' di database.
    Setiap atribut = satu kolom di tabel.
    """
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Item(id={self.id}, name='{self.name}', price={self.price})>"

```

#### 📂 Membuat schemas.py

File **schemas.py** digunakan untuk mendefinisikan **struktur data request dan response API** menggunakan Pydantic. Schema membantu memastikan bahwa data yang dikirim oleh client dan diterima oleh API memiliki format yang valid. Tanpa schema, backend berisiko memproses data yang tidak lengkap atau tidak sesuai tipe data.

File: ``` backend/schemas.py ```
```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# === BASE SCHEMA ===
class ItemBase(BaseModel):
    """Base schema — field yang dipakai untuk create & update."""
    name: str = Field(..., min_length=1, max_length=100, examples=["Laptop"])
    description: Optional[str] = Field(None, examples=["Laptop untuk cloud computing"])
    price: float = Field(..., gt=0, examples=[15000000])
    quantity: int = Field(0, ge=0, examples=[10])


# === CREATE SCHEMA (untuk POST request) ===
class ItemCreate(ItemBase):
    """Schema untuk membuat item baru. Mewarisi semua field dari ItemBase."""
    pass


# === UPDATE SCHEMA (untuk PUT request) ===
class ItemUpdate(BaseModel):
    """
    Schema untuk update item. Semua field optional 
    karena user mungkin hanya ingin update sebagian field.
    """
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=0)


# === RESPONSE SCHEMA (untuk output) ===
class ItemResponse(ItemBase):
    """Schema untuk response. Termasuk id dan timestamp dari database."""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # Agar bisa convert dari SQLAlchemy model


# === LIST RESPONSE (dengan metadata) ===
class ItemListResponse(BaseModel):
    """Schema untuk response list items dengan total count."""
    total: int
    items: list[ItemResponse]
```

#### 📂 Membuat crud.py

Setelah struktur tabel didefinisikan pada file `models.py`, langkah selanjutnya adalah membuat file **crud.py**. File ini digunakan untuk menuliskan fungsi-fungsi yang berhubungan dengan operasi dasar pada database, yaitu **Create, Read, Update, dan Delete (CRUD)**. Dengan memisahkan logika CRUD ke dalam file tersendiri, kode program menjadi lebih terorganisir, mudah dipelihara, serta memudahkan pengembangan fitur di kemudian hari.

Dengan adanya `crud.py`, proses interaksi antara API dan database menjadi lebih terstruktur. API yang dibuat di `main.py` nantinya hanya perlu memanggil fungsi-fungsi yang ada di file ini untuk melakukan operasi pada database tanpa harus menuliskan ulang logika query secara langsung.

File: ``` backend/crud.py ```
```
from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Item
from schemas import ItemCreate, ItemUpdate


def create_item(db: Session, item_data: ItemCreate) -> Item:
    """Buat item baru di database."""
    db_item = Item(**item_data.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_items(db: Session, skip: int = 0, limit: int = 20, search: str = None):
    """
    Ambil daftar items dengan pagination & search.
    - skip: jumlah data yang di-skip (untuk pagination)
    - limit: jumlah data per halaman
    - search: cari berdasarkan nama atau deskripsi
    """
    query = db.query(Item)
    
    if search:
        query = query.filter(
            or_(
                Item.name.ilike(f"%{search}%"),
                Item.description.ilike(f"%{search}%")
            )
        )
    
    total = query.count()
    items = query.order_by(Item.created_at.desc()).offset(skip).limit(limit).all()
    
    return {"total": total, "items": items}


def get_item(db: Session, item_id: int) -> Item | None:
    """Ambil satu item berdasarkan ID."""
    return db.query(Item).filter(Item.id == item_id).first()


def update_item(db: Session, item_id: int, item_data: ItemUpdate) -> Item | None:
    """
    Update item berdasarkan ID.
    Hanya update field yang dikirim (bukan None).
    """
    db_item = db.query(Item).filter(Item.id == item_id).first()
    
    if not db_item:
        return None
    
    # Hanya update field yang dikirim (exclude_unset=True)
    update_data = item_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_item, field, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item


def delete_item(db: Session, item_id: int) -> bool:
    """Hapus item berdasarkan ID. Return True jika berhasil."""
    db_item = db.query(Item).filter(Item.id == item_id).first()
    
    if not db_item:
        return False
    
    db.delete(db_item)
    db.commit()
    return True

def get_items_stats(db: Session):
    """
    Hitung statistik inventory: total item, total nilai, item termahal & termurah.
    Handle edge cases: data kosong, price/quantity null.
    """
    items = db.query(Item).all()
    
    if not items:
        return {
            "total_items": 0,
            "total_value": 0.0,
            "most_expensive": None,
            "cheapest": None
        }

    # Filter hanya item yang price dan quantity valid (tidak None)
    valid_items = [item for item in items if item.price is not None and item.quantity is not None]

    if not valid_items:
        return {
            "total_items": len(items),  # tetap hitung semua item
            "total_value": 0.0,
            "most_expensive": None,
            "cheapest": None
        }

    total_items = len(valid_items)
    total_value = sum(item.price * item.quantity for item in valid_items)
    
    most_expensive_item = max(valid_items, key=lambda x: x.price)
    cheapest_item = min(valid_items, key=lambda x: x.price)

    return {
        "total_items": total_items,
        "total_value": float(total_value),
        "most_expensive": {
            "name": most_expensive_item.name,
            "price": float(most_expensive_item.price)
        },
        "cheapest": {
            "name": cheapest_item.name,
            "price": float(cheapest_item.price)
        }
    }
```

#### 🚀 Mengupdate main.py
Setelah model, schema, dan fungsi CRUD dibuat, langkah selanjutnya adalah mengupdate file **main.py** untuk menghubungkan seluruh komponen backend tersebut. File ini berfungsi sebagai entry point dari aplikasi FastAPI yang bertanggung jawab untuk mendefinisikan endpoint API yang dapat diakses oleh pengguna atau frontend.

Pada tahap ini, endpoint API dibuat untuk menangani berbagai permintaan seperti menambahkan data baru, mengambil data yang tersimpan di database, memperbarui informasi, serta menghapus data. Endpoint tersebut akan memanfaatkan fungsi-fungsi yang telah dibuat di file **crud.py** untuk melakukan operasi pada database.

Dengan mengupdate **main.py**, seluruh fitur backend mulai terintegrasi sehingga API dapat dijalankan dan diuji melalui dokumentasi otomatis FastAPI seperti Swagger UI.

File: ``` backend/main.py ```
```
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base
from schemas import ItemCreate, ItemUpdate, ItemResponse, ItemListResponse
import crud

# Buat semua tabel di database (jika belum ada)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cloud App API",
    description="REST API untuk mata kuliah Komputasi Awan — SI ITK",
    version="0.2.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== HEALTH CHECK ====================

@app.get("/health")
def health_check():
    """Endpoint untuk mengecek apakah API berjalan."""
    return {"status": "healthy", "version": "0.2.0"}


# ==================== CRUD ENDPOINTS ====================

@app.post("/items", response_model=ItemResponse, status_code=201)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    """
    Buat item baru.
    
    - **name**: Nama item (wajib, 1-100 karakter)
    - **price**: Harga (wajib, > 0)
    - **description**: Deskripsi (opsional)
    - **quantity**: Jumlah stok (default: 0)
    """
    return crud.create_item(db=db, item_data=item)


@app.get("/items", response_model=ItemListResponse)
def list_items(
    skip: int = Query(0, ge=0, description="Jumlah data yang di-skip"),
    limit: int = Query(20, ge=1, le=100, description="Jumlah data per halaman"),
    search: str = Query(None, description="Cari berdasarkan nama/deskripsi"),
    db: Session = Depends(get_db),
):
    """
    Ambil daftar items dengan pagination dan search.
    
    - **skip**: Offset untuk pagination (default: 0)
    - **limit**: Jumlah item per halaman (default: 20, max: 100)
    - **search**: Kata kunci pencarian (opsional)
    """
    return crud.get_items(db=db, skip=skip, limit=limit, search=search)

@app.get("/items/stats", response_model=dict)
def items_stats(db: Session = Depends(get_db)):
    """
    Statistik inventory: total items, total value (sum of price × quantity), 
    item termahal, dan item termurah.
    """
    return crud.get_items_stats(db=db)

@app.get("/items/{item_id}", response_model=ItemResponse)
def get_item(item_id: int, db: Session = Depends(get_db)):
    """Ambil satu item berdasarkan ID."""
    item = crud.get_item(db=db, item_id=item_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Item dengan id={item_id} tidak ditemukan")
    return item


@app.put("/items/{item_id}", response_model=ItemResponse)
def update_item(item_id: int, item: ItemUpdate, db: Session = Depends(get_db)):
    """
    Update item berdasarkan ID.
    Hanya field yang dikirim yang akan di-update (partial update).
    """
    updated = crud.update_item(db=db, item_id=item_id, item_data=item)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Item dengan id={item_id} tidak ditemukan")
    return updated


@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    """Hapus item berdasarkan ID."""
    success = crud.delete_item(db=db, item_id=item_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Item dengan id={item_id} tidak ditemukan")
    return None

# ==================== TEAM INFO ====================

@app.get("/team")
def team_info():
    """Informasi tim."""
    return {
        "team": "cloud-team-extraordinary",
        "members": [
            # TODO: Isi dengan data tim Anda
            {"name": "Nama 1", "nim": "NIM1", "role": "Lead Backend"},
            {"name": "Raisha Alika Irwandira", "nim": "10231077", "role": "Lead Backend"},
            {"name": "Nicholas Christian Samuel Manurung", "nim": "10231069", "role": "Lead Frontend"},
            {"name": "Pangeran Borneo Silaen", "nim": "10231073", "role": "Lead DevOps"},
            {"name": "Rani Ayu Dewi", "nim": "10231079", "role": "Lead QA & Docs"},
        ],
    }
```
### 3️⃣ Jalankan Server

#### ▶️ Menjalankan Server Backend

Setelah seluruh konfigurasi dan implementasi API selesai dilakukan, langkah selanjutnya adalah menjalankan server backend untuk menguji apakah aplikasi dapat berjalan dengan baik. Server dijalankan menggunakan **Uvicorn**, yaitu ASGI server yang digunakan untuk menjalankan aplikasi berbasis FastAPI.

Perintah berikut digunakan untuk menjalankan server backend:

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### API Endpoint
| Method | Endpoint | Deskripsi |
|------|------|------|
| GET | `/health` | Health check untuk memastikan API berjalan dengan baik |
| POST | `/items` | Menambahkan data item baru ke database |
| GET | `/items` | Mengambil seluruh data item dengan pagination & search |
| GET | `/items/stats` | Mengambil statistik inventory (total item, value, dll) |
| GET | `/items/{item_id}` | Mengambil data item berdasarkan ID |
| PUT | `/items/{item_id}` | Memperbarui data item berdasarkan ID |
| DELETE | `/items/{item_id}` | Menghapus data item berdasarkan ID |
| GET | `/team` | Menampilkan informasi tim pengembang |

> Endpoint `/team` digunakan untuk memverifikasi kontribusi anggota sesuai instruksi modul.

### 4️⃣ API Testing (Swagger)

Pengujian API dilakukan menggunakan **Swagger UI**, yaitu dokumentasi interaktif otomatis yang disediakan oleh FastAPI. Fitur ini memungkinkan pengembang dan QA untuk mensimulasikan permintaan HTTP (GET, POST, PUT, DELETE) secara langsung dari peramban guna memastikan setiap endpoint berfungsi sebagaimana mestinya sesuai dengan kontrak data yang telah ditentukan.

Berikut adalah rangkuman hasil pengujian:

| Endpoint | Skenario Uji | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET /health` | Akses endpoint health check | `{"status": "healthy", ...}` | `{"status": "healthy", ...}` | ✅ Pass |
| `POST /items` | Input item baru (valid) | `201 Created` + Data item | `201 Created` + Data item | ✅ Pass |
| `POST /items` | Input item (harga < 0) | `422 Unprocessable Entity` | `422 Unprocessable Entity` | ✅ Pass |
| `GET /items` | Ambil semua data | `200 OK` + List item | `200 OK` + List item | ✅ Pass |
| `GET /items/stats` | Hitung statistik inventory | `200 OK` + JSON statistik | `200 OK` + JSON statistik | ✅ Pass |
| `GET /items/{id}` | Ambil ID yang terdaftar | `200 OK` + Data item | `200 OK` + Data item | ✅ Pass |
| `GET /items/{id}` | Ambil ID tidak terdaftar | `404 Not Found` | `404 Not Found` | ✅ Pass |
| `PUT /items/{id}` | Update field nama/harga | `200 OK` + Data terupdate | `200 OK` + Data terupdate | ✅ Pass |
| `DELETE /items/{id}` | Hapus data item | `204 No Content` | `204 No Content` | ✅ Pass |
| `GET /team` | Akses informasi anggota tim | `200 OK` + List anggota | `200 OK` + List anggota | ✅ Pass |

---
