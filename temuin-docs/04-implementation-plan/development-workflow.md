# Development Workflow - Temuin

## Workflow Harian

1. Sync base branch
   - `git checkout project/temuin`
   - `git pull origin project/temuin`
2. Baca `ACTIVE_SPRINT.md` dan sprint file yang relevan
3. Tentukan task dari ID yang diberikan user atau auto-selection role
4. Ubah status task menjadi `in_progress`
5. Buat feature branch dari `project/temuin`
6. Kerjakan task dan verifikasi behavior yang relevan
7. Commit dengan format yang benar
8. Push branch ke remote
9. Isi kolom `Branch/Ref` di sprint file
10. Ubah status task menjadi `done`
11. Jika perlu kolaborasi, buat PR ke `project/temuin`

## Jika Blocked

1. Ubah status menjadi `blocked`
2. Tulis alasan singkat di kolom `Notes`
3. Jangan lanjut ke task lain di sprint yang dependency-nya tergantung task blocked itu
4. Jika terpaksa lompat sprint, beri peringatan dan catat alasannya

## Aturan Penting

- Satu branch = satu task utama
- `done` berarti sudah di-push, bukan sekadar selesai lokal
- PR direkomendasikan untuk review, tapi tidak menjadi syarat mutlak status task
- Jika behavior berubah, update dokumen aktif yang relevan

## Dokumen Terkait

- [branching-strategy.md](./branching-strategy.md)
- [definition-of-done.md](./definition-of-done.md)
