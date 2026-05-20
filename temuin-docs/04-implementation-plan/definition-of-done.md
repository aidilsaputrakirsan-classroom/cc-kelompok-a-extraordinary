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

### DoD CI/CD (mulai Sprint 5, DEC-020)

Tambahan untuk task yang menyentuh kode produksi:

- Workflow CI hijau di branch sebelum merge ke master
- Backend coverage tetap ≥60% setelah perubahan (`pytest --cov-fail-under=60`)
- Frontend coverage tetap ≥40% setelah perubahan (Vitest threshold)
- Tidak ada pelanggaran `ruff check backend/` atau `eslint frontend/`

### DoD Microservices Split (Sprint 6+, DEC-019)

Tambahan untuk task yang menyentuh service split:

- Service standalone bisa dibuild dan run dengan Dockerfile-nya
- Endpoint `/health` return 200
- Cross-service call yang dimiliki sudah include retry+CB (Sprint 7+)
- Structured logging keluar sebagai JSON valid (Sprint 7+)
- Correlation ID propagated ke outbound HTTP call (Sprint 7+)

### DoD Production Deploy (Sprint 6+, DEC-018)

Untuk task DevOps yang trigger deployment:

- Health check post-deploy hijau di `https://temuin.pangeransilaen.net/api/auth/health`
- Total RAM container <1.4 GB pakai `docker stats` (verifikasi 5 menit idle)
- Tidak break service lain di VPS (`9router`, `enowxai`)

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
