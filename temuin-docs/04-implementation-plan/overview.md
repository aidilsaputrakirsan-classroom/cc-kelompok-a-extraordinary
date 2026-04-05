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

| Sprint | Fokus |
|-------|-------|
| 1 | Setup scaffold backend, frontend, data awal |
| 2 | Auth dan core item flow |
| 3 | Search, claim, master data, notifications |
| 4 | Docker dan kesiapan UTS |
| 5 | CI/CD dan test backend |
| 6 | Deploy dan split microservices |
| 7 | Gateway, health, logging, audit |
| 8 | Security hardening dan final polish |

## Dokumen Terkait

- [branching-strategy.md](./branching-strategy.md)
- [development-workflow.md](./development-workflow.md)
- [definition-of-done.md](./definition-of-done.md)
