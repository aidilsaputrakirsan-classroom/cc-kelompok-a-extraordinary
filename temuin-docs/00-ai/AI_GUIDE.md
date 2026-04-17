# AI Guide - Temuin Documentation Map

## Tujuan

Dokumen ini adalah peta navigasi utama untuk manusia dan AI agent di branch final project Temuin.

## Struktur Dokumentasi

```text
temuin-docs/
├── 00-ai/
│   ├── AI_GUIDE.md
│   ├── ROLE_ROUTER.md
│   ├── DOCUMENT_INDEX.md
│   └── SKILLS_SETUP.md
├── 01-concept/
├── 02-prd/
├── 03-architecture/
├── 04-implementation-plan/
├── 05-roles/
├── 06-sprints/
├── 07-tasks/
└── archive/
```

## Read Order Yang Wajib

### Untuk Semua Orang
1. Root `AGENTS.md`
2. Jika tersedia, gunakan workspace skill `.agents/skills/temuin-router`
3. `temuin-docs/00-ai/AI_GUIDE.md`
4. `temuin-docs/00-ai/ROLE_ROUTER.md`
5. `temuin-docs/01-concept/glossary.md`
6. `temuin-docs/01-concept/decision-log.md`
7. `temuin-docs/06-sprints/ACTIVE_SPRINT.md`

### Untuk Memahami Produk
8. `temuin-docs/01-concept/concept.md`
9. `temuin-docs/02-prd/prd-overview.md`
10. `temuin-docs/02-prd/prd-features.md`
11. `temuin-docs/02-prd/prd-user-flows.md`

### Untuk Implementasi
12. `temuin-docs/03-architecture/system-architecture.md`
13. `temuin-docs/03-architecture/[dokumen sesuai role].md`
14. `temuin-docs/05-roles/[role].md`
15. `temuin-docs/06-sprints/sprint-0X.md`

## Layer Skill Workspace

Jika agent mendukung skill project-level, gunakan layer berikut:
- `temuin-router` untuk routing awal dan auto-selection task
- `temuin-backend` untuk task backend
- `temuin-frontend` untuk task frontend
- `temuin-devops` untuk task devops
- `temuin-qa-docs` untuk task QA dan dokumentasi

Skill pendukung workspace yang sudah tersedia:
- `web-design-guidelines`
- `design-taste-frontend`
- `shadcn`

## Source Of Truth Hierarchy

Jika ada konflik antar dokumen aktif, gunakan urutan ini:

1. `temuin-docs/01-concept/decision-log.md`
2. `temuin-docs/02-prd/`
3. `temuin-docs/03-architecture/`
4. `temuin-docs/04-implementation-plan/`
5. `temuin-docs/06-sprints/ACTIVE_SPRINT.md`
6. `temuin-docs/06-sprints/sprint-0X.md`
7. `temuin-docs/07-tasks/backlog.md`

Catatan:
- `concept.md` dan `glossary.md` adalah fondasi konteks dan istilah
- Folder `archive/` bukan source of truth aktif

## Routing Untuk AI Agent

### Jika User Menyebut ID Task
- Kerjakan task itu
- Baca sprint file tempat task tersebut berada
- Hormati dependency dan status task

### Jika User Menyebut Role Saja
- Baca `temuin-docs/06-sprints/ACTIVE_SPRINT.md`
- Buka sprint aktif
- Cari section role yang sesuai
- Pilih task pertama yang:
  - statusnya bukan `done`
  - statusnya bukan `blocked`
  - semua dependency di kolom `Depends On` sudah `done`

### Jika Tidak Ada Task Aman Di Sprint Aktif
- Beri peringatan sebelum lompat sprint
- Pilih task pertama dari sprint berikutnya yang dependency-nya aman
- Isi alasan lompatan di kolom `Notes`

## Aturan Status Task

- `todo` - belum mulai
- `in_progress` - sedang dikerjakan
- `blocked` - terhambat dan butuh bantuan atau keputusan
- `done` - sudah di-commit dan di-push ke remote

## Dokumen Terkait

- [ROLE_ROUTER.md](./ROLE_ROUTER.md)
- [DOCUMENT_INDEX.md](./DOCUMENT_INDEX.md)
- [SKILLS_SETUP.md](./SKILLS_SETUP.md)
