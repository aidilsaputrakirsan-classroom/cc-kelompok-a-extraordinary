# Active Sprint - Temuin

## Current Priority

- **Active Sprint**: `sprint-05`
- **Periode**: Minggu 13 (carryover dari Minggu 9-10)
- **Alignment Modul**: Modul 9-10 (Git Workflow, CI 3-job, Backend & Frontend Testing dengan threshold)
- **Last Updated**: 2026-05-17

## Sprint Calendar (Modul 10-15 Roadmap)

| Minggu | Sprint | Modul | Highlight |
|--------|--------|-------|-----------|
| 13 (now) | sprint-05 | 9-10 | CI 3-job, ruff, pytest cov ≥60%, vitest cov ≥40%, branch protection doc |
| 14 | sprint-06 | 11-12 | Deploy ke Tencent VPS (DEC-018), split monolith → 3-service hybrid (DEC-019) |
| 15 | sprint-07 | 13-14 | Gateway production (rate limit + correlation ID), retry+CB (DEC-021), structured log + /metrics + StatusPage (DEC-022) |
| 16 (UAS) | sprint-08 | 15 | Security hardening, image non-root, security headers, release v1.0.0 |

## Auto-Selection Rule

Jika user hanya menyebut role:
1. Buka `sprint-05.md`
2. Cari section role yang sesuai
3. Pilih task pertama yang statusnya bukan `done` atau `blocked`
4. Pastikan semua dependency di kolom `Depends On` sudah `done`

## Fallback Rule

Jika sprint aktif tidak memiliki task aman untuk role tersebut:
1. Beri peringatan sebelum lompat sprint
2. Buka sprint berikutnya
3. Pilih task pertama yang dependency-nya aman
4. Catat alasan lompatan di kolom `Notes`

## Status Reference

- `todo`
- `in_progress`
- `blocked`
- `done`
