---
name: temuin-router
description: Gunakan saat bekerja di repository Temuin tanpa task ID yang jelas, atau saat user hanya menyebut role. Skill ini mewajibkan pembacaan AGENTS, sprint aktif, dan auto-selection task yang aman.
---

# Temuin Router

1. Baca `AGENTS.md`
2. Baca `temuin-docs/00-ai/AI_GUIDE.md`
3. Baca `temuin-docs/00-ai/ROLE_ROUTER.md`
4. Baca `temuin-docs/06-sprints/ACTIVE_SPRINT.md`

## Routing Rules

- Jika user menyebut ID task, pakai task itu
- Jika user hanya menyebut role, buka sprint aktif dan pilih task pertama yang dependency-nya aman
- Jangan pilih task dengan status `done` atau `blocked`
- Jika terpaksa lompat sprint, beri peringatan dan tulis alasan di `Notes`

## Status Rules

- Sebelum mulai kerja, ubah status task menjadi `in_progress`
- Setelah commit dan push, isi `Branch/Ref` lalu ubah status task menjadi `done`
- Jangan anggap `done` berarti sudah di-merge

## Escalation

- Untuk backend, gunakan `temuin-backend`
- Untuk frontend, gunakan `temuin-frontend`
- Untuk devops, gunakan `temuin-devops`
- Untuk QA dan docs, gunakan `temuin-qa-docs`
