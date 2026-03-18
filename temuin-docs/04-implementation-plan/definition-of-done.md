# Definition of Done - Temuin

## DoD Per Task

Sebuah task dianggap `done` jika:

- Output utama task sudah bekerja sesuai dokumen aktif
- Tidak melanggar keputusan di `decision-log.md`
- Verifikasi yang relevan sudah dijalankan
- Dokumentasi aktif diperbarui jika behavior berubah
- Perubahan sudah di-commit
- Perubahan sudah di-push ke remote
- Kolom `Branch/Ref` di sprint file sudah terisi
- Status task di sprint file sudah diubah ke `done`

## DoD Per Sprint

Sebuah sprint dianggap selesai jika:

- Semua task selesai atau carry-over jelas alasannya
- Sprint output inti bisa ditunjukkan atau diuji
- `ACTIVE_SPRINT.md` sudah dipindah ke sprint berikutnya jika sprint ditutup

## DoD Per QA Check

Untuk kebutuhan QA & Docs:

- Blackbox flow utama berjalan
- Screenshot bukti tersedia seperlunya
- Hasil test singkat dicatat di dokumen yang relevan

## Dokumen Terkait

- [development-workflow.md](./development-workflow.md)
- [../06-sprints/ACTIVE_SPRINT.md](../06-sprints/ACTIVE_SPRINT.md)
