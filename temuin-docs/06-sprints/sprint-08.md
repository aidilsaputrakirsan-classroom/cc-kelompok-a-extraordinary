# Sprint 08 - Security And Final Polish

## Tujuan Sprint

Menyelesaikan security hardening, code cleanup, final regression, final deploy, dan kesiapan demo akhir.

## Alignment Modul: 15

- Modul 15: Final Polish — Security, Cleanup & Dokumentasi

## Lead Backend (@disnejy)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| BE-8.1 | Review input validation, auth hardening, dan config sensitif | High | 3h | BE-7.3 | todo | - | Modul 15: OWASP Top 10 review |
| BE-8.2 | Rapikan dokumentasi API dan Swagger akhir | Medium | 2h | BE-8.1 | todo | - | - |
| BE-8.3 | Tutup bug final yang mempengaruhi demo | High | 2h | BE-8.2 | todo | - | - |
| BE-8.4 | Rate limiting dan input validation strengthening | Medium | 2h | BE-8.1 | todo | - | Modul 15: security hardening |
| BE-8.5 | Code cleanup: hapus dead code, TODO, print statements | Medium | 2h | BE-8.3 | todo | - | Modul 15: code quality |

## Lead Frontend (@nicholasmnrng)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| FE-8.1 | Final UI polish dan accessibility review | Medium | 3h | FE-7.3 | todo | - | - |
| FE-8.2 | Pastikan build production stabil | High | 1h | FE-8.1 | todo | - | - |
| FE-8.3 | Tutup bug final yang mempengaruhi demo | High | 2h | FE-8.2 | todo | - | - |
| FE-8.4 | Code cleanup: hapus console.log, dead components | Medium | 2h | FE-8.3 | todo | - | Modul 15: code quality |

## Lead DevOps (@PangeranSilaen)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| DO-8.1 | Hardening image dan deploy config final | Medium | 2h | DO-7.4 | todo | - | - |
| DO-8.2 | Finalisasi workflow deploy dan cleanup environment | High | 2h | DO-8.1 | todo | - | - |
| DO-8.3 | Tulis deployment dan backup note final | Medium | 1h | DO-8.2 | todo | - | - |
| DO-8.4 | Security audit: secret scan, rate limiting di gateway | Medium | 2h | DO-8.1 | todo | - | Modul 15: security checklist |
| DO-8.5 | Git tag v3.0.0 dan release notes | Medium | 1h | DO-8.2 | todo | - | Modul 15: final release |
| DO-8.6 | Final verification checklist dan deployment docs | Medium | 1h | DO-8.5 | todo | - | Modul 15: operations guide |

## Lead QA & Docs (@raniayudewi)

| ID | Task | Priority | Estimate | Depends On | Status | Branch/Ref | Notes |
|----|------|----------|----------|------------|--------|------------|-------|
| QA-8.1 | Full blackbox regression seluruh flow utama | High | 3h | BE-8.3, FE-8.3, DO-8.2 | todo | - | - |
| QA-8.2 | Simpan screenshot final untuk flow presentasi | Medium | 1h | QA-8.1 | todo | - | - |
| QA-8.3 | Rapikan dokumen aktif dan checklist demo akhir | Medium | 1h | QA-8.1, DO-8.3 | todo | - | - |
| QA-8.4 | Final verification: semua service jalan, demo ready | High | 2h | QA-8.1, DO-8.5 | todo | - | Modul 15: UAS readiness |
| QA-8.5 | Buat/update comprehensive README dan API contract docs | Medium | 2h | BE-8.2, DO-8.6 | todo | - | Modul 15: professional documentation |

## Quick Links

- [ACTIVE_SPRINT.md](./ACTIVE_SPRINT.md)
- [../05-roles/backend.md](../05-roles/backend.md)
- [../05-roles/frontend.md](../05-roles/frontend.md)
- [../05-roles/devops.md](../05-roles/devops.md)
- [../05-roles/qa-docs.md](../05-roles/qa-docs.md)
- [../04-implementation-plan/development-workflow.md](../04-implementation-plan/development-workflow.md)
