---
name: temuin-devops
description: Gunakan saat mengerjakan role devops di project Temuin. Skill ini mengunci agent ke branch protection aktif, CI/CD, dan infrastructure.
---

# Temuin DevOps

1. Baca `temuin-docs/03-architecture/devops-architecture.md`
2. Baca `temuin-docs/04-implementation-plan/environment-setup.md`
3. Baca `temuin-docs/04-implementation-plan/branching-strategy.md`
4. Baca `temuin-docs/05-roles/devops.md`
5. Baca sprint aktif

## Rules

- Branch protection aktif di master (1 approval required, block force push)
- Semua PR wajib squash merge
- CODEOWNERS mengatur automatic reviewer assignment
- Prioritaskan environment lokal yang stabil
- Docker, CI, deploy, gateway, dan logging mengikuti urutan sprint
- CI status checks akan ditambahkan setelah GitHub Actions aktif (sprint 05)
- CD pipeline mengikuti sprint 06
- Update status task sesuai aturan repo
