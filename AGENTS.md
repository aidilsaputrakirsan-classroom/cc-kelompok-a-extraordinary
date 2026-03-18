# AGENTS.md - Temuin Final Project Entry Point

Setiap AI coding agent wajib mulai dari file ini sebelum mengerjakan apa pun di repository ini.

## Read Order
0. Jika agent mendukung workspace-local skills, mulai dari `.agents/skills/temuin-router`
1. Baca `temuin-docs/00-ai/AI_GUIDE.md`
2. Baca `temuin-docs/00-ai/ROLE_ROUTER.md`
3. Baca `temuin-docs/01-concept/glossary.md`
4. Baca `temuin-docs/01-concept/decision-log.md`
5. Baca `temuin-docs/06-sprints/ACTIVE_SPRINT.md`
6. Lanjut ke role guide dan file sprint yang relevan

## Repository Rules
- Source of truth aktif hanya ada di `temuin-docs/`
- Dokumen di `temuin-docs/archive/` adalah arsip, bukan acuan kerja aktif
- Base branch final project adalah `project/temuin`
- Jangan mengandalkan perubahan default branch repo
- Jangan commit langsung ke `project/temuin`; buat feature branch dari branch itu
- Frontend wajib memakai `React + Vite + Tailwind CSS + shadcn/ui`
- Saat agent membangun UI, utamakan komponen dan pola shadcn/ui sebelum membuat markup custom

## Task Tracking Rules
- Status task yang valid hanya `todo`, `in_progress`, `blocked`, `done`
- `done` hanya boleh dipakai setelah perubahan sudah di-commit dan di-push ke remote
- Sebelum mulai task, ubah status task menjadi `in_progress`
- Jika task terhenti, ubah status menjadi `blocked` dan isi alasan singkat di kolom `Notes`
- Setelah push, isi kolom `Branch/Ref` lalu ubah status ke `done`

## Auto-Selection Rules
- Jika user menyebut ID task, kerjakan task itu
- Jika user hanya menyebut role, baca `temuin-docs/06-sprints/ACTIVE_SPRINT.md`
- Pilih task pertama untuk role tersebut yang dependency-nya sudah aman dan statusnya bukan `done` atau `blocked`
- Jika harus lompat ke sprint lebih lanjut, beri peringatan dulu dan catat alasan lompatan di `Notes`

## QA and Documentation Rules
- QA fokus pada blackbox testing, screenshot bukti, dan update dokumentasi seperlunya
- Jangan menambah issue tracker formal, bug template, atau dokumen known issues yang berat
- Jika behavior berubah, update dokumen aktif yang relevan di `temuin-docs/`

## Workspace Skills
- Skill project-level berada di `.agents/skills/`
- Skill router proyek: `temuin-router`
- Skill role-specific: `temuin-backend`, `temuin-frontend`, `temuin-devops`, `temuin-qa-docs`
- Skill pendukung yang sudah tersedia di workspace ini: `firebase-auth-basics`, `web-design-guidelines`, `design-taste-frontend`, `shadcn`
