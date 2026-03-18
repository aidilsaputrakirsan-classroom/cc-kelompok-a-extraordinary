---
name: temuin-backend
description: Gunakan saat mengerjakan role backend di project Temuin. Skill ini mengunci agent ke decision log, arsitektur backend, database design, sprint aktif, dan aturan status task.
---

# Temuin Backend

1. Baca `temuin-docs/01-concept/decision-log.md`
2. Baca `temuin-docs/03-architecture/backend-architecture.md`
3. Baca `temuin-docs/03-architecture/database-design.md`
4. Baca `temuin-docs/05-roles/backend.md`
5. Baca sprint aktif

## Rules

- Jangan melanggar business rule item dan claim
- Gunakan env vars, bukan hardcoded config
- Jaga monolith stabil sebelum split microservices
- Update status task sesuai aturan repo

## Companion Skill

- Jika task menyentuh login Google atau Firebase Auth, gunakan juga `firebase-auth-basics` bila tersedia
