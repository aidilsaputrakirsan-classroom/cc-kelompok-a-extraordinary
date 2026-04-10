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

## Repository Scaffold
- `backend/` - placeholder backend final project
- `frontend/` - placeholder frontend final project
- `temuin-docs/` - source of truth project final

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
- **Storage**: Gambar item dikompresi di frontend dan disimpan sebagai `Base64` di database PostgreSQL sesuai spesifikasi [DEC-016](file:///c:/Users/Rani%20Ayu%20Dewi/OneDrive/Documents/GitHub/cc-kelompok-a-extraordinary/temuin-docs/01-concept/decision-log.md).

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
| **02** | Auth & Core Item Flow | 🏗️ **In Progress** | Implementation stage |
| **03** | Search, Claim, & Master Data | ⏳ Todo | - |
| **04** | Docker & Mid-Term Readiness | ⏳ Todo | - |

---

### 🔍 Quality Assurance (QA) Report
Setiap fitur diverifikasi melalui proses pengujian *Blackbox*.

- **Sprint 01 (Verified)**:
  - ✅ Setup backend & frontend scaffold verified.
  - ✅ Health check endpoint active & DB connected.
  - ✅ Bug fix: `psycopg2` dependency & `shadcn` import issues resolved.
- **Sprint 02 (Draf Target)**:
  - ◻️ Login Google & ITK Email Validation.
  - ◻️ Item CRUD (Lost & Found reporting).

> [!TIP]
> Detail hasil pengujian dan bukti screenshot dapat diakses pada folder internal `temuin-docs/06-sprints/` atau folder bukti gambar di `images/sprint-xx/`.

---

### 📖 Getting Started
1. Salin `.env.example` menjadi `.env` di folder `backend/` dan `frontend/`.
2. Jalankan Backend: `cd backend && pip install -r requirements.txt && python run.py`.
3. Jalankan Frontend: `cd frontend && npm install && npm run dev`.
4. Panduan lengkap tersedia di: [docker-run-guide.md](file:///c:/Users/Rani%20Ayu%20Dewi/OneDrive/Documents/GitHub/cc-kelompok-a-extraordinary/docs/docker-run-guide.md).
