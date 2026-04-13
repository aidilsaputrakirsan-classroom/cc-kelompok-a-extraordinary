---
name: temuin-sprint-issue
description: Gunakan setelah menyelesaikan sprint untuk membuat GitHub Issue sebagai laporan sprint completion. Skill ini mendefinisikan format konsisten untuk semua role.
---

# Temuin Sprint Issue

Skill ini digunakan setelah semua task dalam satu sprint untuk suatu role sudah `done` (committed dan pushed). Buat satu GitHub Issue per role per sprint sebagai catatan resmi.

## Kapan Digunakan

- Setelah semua task sprint untuk role tertentu sudah `done`
- Setelah PR sudah dibuat (atau sudah merged)
- Berlaku untuk **semua role**: backend, frontend, devops, QA

## Format Issue

### Title

```
[Sprint XX] <Role>: <Task IDs> — <Ringkasan Singkat>
```

Contoh:
- `[Sprint 03] DevOps: DO-3.1~DO-3.4 — Docker containerization`
- `[Sprint 02] Backend: BE-2.1~BE-2.4 — Auth flow dan item CRUD`
- `[Sprint 02] QA: QA-2.1~QA-2.4 — Blackbox testing auth & items`
- `[Sprint 01] Frontend: FE-1.1~FE-1.4 — Scaffold React + Vite + shadcn`

### Labels

Gunakan label sesuai role:
- `devops` untuk DevOps
- `backend` untuk Backend
- `frontend` untuk Frontend
- `qa` untuk QA & Docs
- Tambah `documentation` jika isi issue lebih ke dokumentasi

### Body Template

```markdown
## Ringkasan

Dokumentasi kerja <Role> (@username) untuk Sprint XX.

| Task ID | Deskripsi | Status | Branch / PR |
|---------|-----------|--------|-------------|
| XX-X.1  | ...       | done   | `feat/...` / PR #XX |
| XX-X.2  | ...       | done   | `feat/...` / PR #XX |

---

## Detail Per Task

### XX-X.1 — <Nama Task>

**Deskripsi:** Apa yang diminta task ini.

**Yang Dikerjakan:**
- Poin-poin konkret apa yang dilakukan
- File atau komponen utama yang dibuat/diubah

**Acceptance Criteria:**
- [x] Kriteria 1
- [x] Kriteria 2
- [ ] Kriteria yang belum terpenuhi (jelaskan alasan)

**Referensi:**
- Decision log: DEC-XXX
- Dokumen: `temuin-docs/path/to/doc.md`
- PR: #XX

---

*(Ulangi section untuk setiap task)*

## Files Changed

<details>
<summary>Daftar file yang berubah (klik untuk expand)</summary>

- `path/to/file1.ext` — deskripsi singkat
- `path/to/file2.ext` — deskripsi singkat

</details>

## Verifikasi

- [x] Semua task sudah `done` di sprint file
- [x] Branch sudah di-push ke remote
- [x] PR sudah dibuat
- [x] (Tambahan sesuai role, contoh: Docker images pushed, tests passed, dll.)

## Status Sprint XX (<Role>)

Sprint XX untuk role <Role> sudah **selesai**.

*(Catatan tambahan jika ada task yang blocked atau carry-over ke sprint berikutnya)*
```

## Cara Membuat Issue

### Via GitHub CLI

```bash
gh issue create \
  --title "[Sprint XX] Role: IDs — Summary" \
  --label "role-label" \
  --body-file path/to/body.md
```

### Via GitHub Web UI

Buat issue baru di tab Issues, ikuti format di atas.

## Panduan Penulisan

- **Bahasa**: Bahasa Indonesia untuk isi, heading boleh campuran
- **Detail**: Tulis cukup detail agar bisa menjawab pertanyaan dosen tentang apa yang dikerjakan
- **Checklist**: Gunakan `[x]` dan `[ ]` untuk acceptance criteria
- **Referensi**: Link ke decision log, dokumen arsitektur, atau PR yang relevan
- **Satu issue per role per sprint**: Jangan gabung beberapa role dalam satu issue

## Referensi Workflow

- Commit convention: `temuin-docs/04-implementation-plan/commit-convention.md`
- Branching strategy: `temuin-docs/04-implementation-plan/branching-strategy.md`
- Development workflow: `temuin-docs/04-implementation-plan/development-workflow.md`
- Contoh issue yang baik: #25, #26 (DevOps Sprint 01-02)
