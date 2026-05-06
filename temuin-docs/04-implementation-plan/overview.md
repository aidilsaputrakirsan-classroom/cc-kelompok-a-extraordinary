# Implementation Overview - Temuin

## Ringkasan

Implementasi final project dimulai dari branch `master` sebagai fresh start. Praktikum lama tetap berada di branch `praktikum`.

## Prinsip Implementasi

1. Documentation-first: baca dokumen aktif sebelum coding
2. Feature branch workflow: kerja selalu lewat branch turunan dari `master`
3. Status tracking ketat: update sprint file saat mulai, saat blocked, dan saat selesai push
4. Delivery bertahap: setiap sprint menghasilkan output yang bisa diverifikasi
5. UI konsisten: frontend wajib memakai shadcn/ui

## Timeline

| Sprint | Fokus | Modul |
|--------|-------|-------|
| 1 | Setup scaffold backend, frontend, data awal | 1-4 |
| 2 | Auth dan core item flow | 5-6 |
| 3 | Search, claim, master data, notifications | 7 |
| 4 | Docker dan kesiapan UTS | 8 (UTS) |
| 5 | Git workflow, CI, dan test backend/frontend | 9-10 |
| 6 | Deploy (CD) dan split microservices | 11-12 |
| 7 | Gateway, health, logging, reliability | 13-14 |
| 8 | Security hardening dan final polish | 15 |

## Dokumen Terkait

- [branching-strategy.md](./branching-strategy.md)
- [development-workflow.md](./development-workflow.md)
- [definition-of-done.md](./definition-of-done.md)
