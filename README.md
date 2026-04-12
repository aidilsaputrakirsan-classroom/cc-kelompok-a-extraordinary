# Temuin Final Project

Temuin adalah project akhir mata kuliah Cloud Computing untuk platform lost and found internal kampus ITK.

## Working Branch
- Branch kerja utama final project: `master`
- Branch `praktikum` menyimpan histori practicum
- Semua feature branch dibuat dari `master`

## Source of Truth
- Dokumentasi aktif ada di `temuin-docs/`
- Entry point agent ada di `AGENTS.md`
- Arsip lama hanya disimpan di `temuin-docs/archive/`
- Workspace-local skills ada di `.agents/skills/`

## Repository Structure
- `backend/` - Backend FastAPI (auth, items, claims, master data)
- `frontend/` - Frontend React + Vite + Tailwind CSS + shadcn/ui
- `temuin-docs/` - source of truth project final
- `docs/` - setup guide dan QA reports

## Next Read
1. `AGENTS.md`
2. `temuin-docs/00-ai/AI_GUIDE.md`
3. `temuin-docs/06-sprints/ACTIVE_SPRINT.md`

---

## 🛠️ Project Details (Final Project Report)

### 🚀 Tech Stack
| Layer | Technologies |
|-------|--------------|
| **Frontend** | React, Vite, Tailwind CSS, shadcn/ui |
| **Backend** | FastAPI (Python), SQLAlchemy |
| **Database** | PostgreSQL |
| **Auth** | Firebase Admin SDK, Google OpenID Connect |
| **DevOps** | Docker, Docker Compose (On Progress) |

### 🏛️ Architecture Overview
Temuin menggunakan pendekatan **Monolith-First** yang dirancang untuk skalabilitas menuju **Microservices** (Sprint 06).
- **Authentication**: Integrasi Firebase Auth untuk login akun kampus ITK (`@itk.ac.id`) dengan sinkronisasi ke PostgreSQL internal.
- **Storage**: Gambar item dikompresi di frontend dan disimpan sebagai `Base64` di database PostgreSQL sesuai spesifikasi [DEC-016](temuin-docs/01-concept/decision-log.md).

### 🛣️ API Endpoints Summary

#### 🟢 General Endpoints (Public)
| Method | Endpoint | Description | Status |
|:---:|---|---|:---:|
| `GET` | `/` | Welcome message | ✅ Active |
| `GET` | `/health` | API & Database health check | ✅ Active |

#### 🔑 Auth Endpoints
| Method | Endpoint | Description | Access | Status |
|:---:|---|---|:---:|:---:|
| `POST` | `/auth/login` | Exchange Firebase token for Internal JWT | Public | 🏗️ Sprint 2 |
| `GET` | `/auth/me` | Current user profile | Protected 🔒 | 🏗️ Sprint 2 |

#### 📦 Item Endpoints (Protected 🔒)
| Method | Endpoint | Description | Status |
|:---:|---|---|:---:|
| `GET` | `/items` | List items (with Search & Filter) | 🏗️ Sprint 2 |
| `POST` | `/items` | Report new Lost or Found item | 🏗️ Sprint 2 |
| `GET` | `/items/:id` | Item Detail by ID | 🏗️ Sprint 2 |

---

### 📈 Roadmap & Development Status
| Sprint | Fokus Utama | Status | Note |
|:---:|---|:---:|---|
| **01** | Foundation: Scaffold & Data Models | ✅ **Done** | Base structure established |
| **02** | Auth & Core Item Flow | ✅ **Done** | Core auth & list flow verified |
| **03** | Search, Claim, & Master Data | 🏗️ **In Progress** | - |
| **04** | Docker & Mid-Term Readiness | ⏳ Todo | - |

---

### 🔍 Quality Assurance (QA) Report
Setiap fitur diverifikasi melalui proses pengujian *Blackbox*.

- **Sprint 01 (Verified)**:
  - ✅ Setup backend & frontend scaffold verified.
  - ✅ Health check endpoint active & DB connected.
- **Sprint 02 (Verified)**:
  - ✅ Login Google & ITK Email Validation (Frontend & Backend).
  - ✅ Item Listing & Detail functionality.
  - ⚠️ Item Creation (Frontend Mockup): UI Flow sudah siap, namun integrasi API untuk simpan data permanen masih dalam tahap simulasi oleh tim frontend.

> [!TIP]
> Detail hasil pengujian dan bukti screenshot dapat diakses pada [docs/sprint-02-qa-report.md](docs/sprint-02-qa-report.md) atau folder bukti gambar di [image/sprint-02/](image/sprint-02/).

---

### 📖 Getting Started

1. Salin `.env.example` menjadi `.env` di folder `backend/` dan `frontend/`, lalu isi nilainya.
   - `SECRET_KEY` di backend wajib diisi (string random untuk JWT signing).
   - `FIREBASE_CREDENTIALS_FILE` di backend diisi path ke service account key dari Firebase Console.
   - Variabel `VITE_FIREBASE_*` di frontend diisi dari Firebase Console > Project Settings > Web app.
2. Jalankan Backend:
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate        # Windows (atau: source .venv/bin/activate di macOS/Linux)
   pip install -r requirements.txt
   alembic upgrade head
   uvicorn app.main:app --reload
   ```
3. Jalankan Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Panduan lengkap tersedia di: [docs/setup-guide.md](docs/setup-guide.md).
