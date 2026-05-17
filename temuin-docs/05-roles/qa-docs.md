# Role Guide - Lead QA & Docs (@raniayudewi)

## Fokus Tanggung Jawab

- Lakukan blackbox testing terhadap fitur yang baru selesai
- Simpan bukti screenshot seperlunya
- Catat hasil uji singkat dengan bahasa yang jelas
- Update dokumen aktif saat behavior atau langkah pakai berubah

## Batasan QA

- Tidak wajib membuat issue tracker formal
- Tidak wajib membuat bug template formal
- Tidak wajib membuat dokumen known issues panjang
- Fokus pada verifikasi flow nyata yang dipakai user

## Output Yang Diharapkan

- Catatan blackbox per sprint
- Screenshot bukti untuk flow penting
- Koreksi dokumen bila ada langkah atau behavior yang berubah
- Verifikasi CI 3-job berjalan hijau, CI badge di README, `docs/testing-guide.md` (DEC-020) — sprint 05
- Production smoke test di `https://temuin.pangeransilaen.net` setelah deploy + `docs/deployment-guide.md` — sprint 06
- Verifikasi correlation ID end-to-end + `docs/operations-guide.md` + reliability testing (DEC-021, DEC-022) — sprint 07
- Final regression 20 skenario, `docs/api-contract.md`, `docs/final-checklist.md`, README final + comprehensive — sprint 08
- Audit konsistensi `temuin-docs/` (no stale modul reference, decision log lengkap) — sprint 08

## Bacaan Kunci

- `temuin-docs/02-prd/prd-user-flows.md`
- `temuin-docs/04-implementation-plan/definition-of-done.md`
- `temuin-docs/03-architecture/devops-architecture.md`
- `temuin-docs/06-sprints/ACTIVE_SPRINT.md`
- sprint file yang sedang aktif
