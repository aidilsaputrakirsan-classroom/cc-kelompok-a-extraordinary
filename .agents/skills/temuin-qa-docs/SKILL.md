---
name: temuin-qa-docs
description: Gunakan saat mengerjakan role QA & Docs di project Temuin. Skill ini membatasi QA ke blackbox testing, screenshot evidence, dan update docs seperlunya.
---

# Temuin QA & Docs

1. Baca `temuin-docs/02-prd/prd-user-flows.md`
2. Baca `temuin-docs/04-implementation-plan/definition-of-done.md`
3. Baca `temuin-docs/05-roles/qa-docs.md`
4. Baca sprint aktif
5. Lihat contoh report sebelumnya di `docs/` untuk referensi format

## Rules

- Fokus pada blackbox flow
- Simpan screenshot bukti seperlunya
- Gunakan GitHub Issues untuk tracking sprint completion (lihat skill `temuin-sprint-issue`)
- Update dokumen aktif hanya jika flow atau langkah berubah
- Mulai sprint 05, verifikasi CI berjalan di branch yang di-push
- Mulai sprint 06, smoke test production deployment
- Update status task sesuai aturan repo
- Setiap sprint yang sudah selesai di-QA wajib punya satu file report di `docs/`

## Format QA Report Per Sprint

Setiap akhir sprint, buat file `docs/sprint-XX-qa-report.md` dengan format berikut:

```markdown
# Sprint XX QA Report - Temuin

**Role**: Lead QA & Docs (@raniayudewi)
**Date**: YYYY-MM-DD

## 1. QA-X.1 [Nama Task]

### Hasil Temuan
- Deskripsi singkat hasil blackbox testing
- Gunakan checklist untuk setiap poin yang diverifikasi

> **Catatan bug yang ditemukan dan diperbaiki:**
> (Opsional, isi jika ada bug yang ditemukan selama testing)

### Screenshot Bukti
![Deskripsi](../image/sprint-XX/nama-file.png)

---

(Ulangi section untuk setiap task QA di sprint)

## N. Status Task Sprint XX (QA)

| Task ID | Nama Task | Status | Hasil | Bukti (Image Path) |
|---------|-----------|--------|-------|---------------------|
| QA-X.1  | ...       | done   | ...   | [link](../image/..) |

---

## N+1. Catatan Tambahan

*(Opsional: Kendala atau hal yang perlu diperhatikan tim lain)*
```

### Aturan Format

- **Nama file**: `docs/sprint-XX-qa-report.md` (contoh: `docs/sprint-01-qa-report.md`)
- **Screenshot disimpan di**: `image/sprint-XX/` (contoh: `image/sprint-01/backend-health-1.png`)
- **Satu section per task ID** — setiap task QA di sprint harus punya section sendiri
- **Tabel ringkasan wajib** — di akhir report, buat tabel status semua task QA sprint itu
- **Bug yang ditemukan** — catat di blockquote `>` di bawah hasil temuan task yang relevan
- **Catatan tambahan** — opsional, untuk info yang perlu diketahui role lain
