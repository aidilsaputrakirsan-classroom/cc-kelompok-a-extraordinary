# PRD Non-Functional Requirements - Temuin

## Security

- Hanya email kampus yang boleh login
- JWT internal dipakai untuk request terproteksi
- Tidak boleh ada hardcoded secret di code
- Validasi input dilakukan di backend dan frontend

## Usability

- UI memakai Bahasa Indonesia
- Halaman utama harus tetap mudah dipakai di desktop dan mobile
- Status dan feedback aksi harus jelas
- Form wajib memiliki validasi yang mudah dipahami

## Performance

- Search dan filter terasa responsif pada skala MVP
- Gambar diproses di frontend sebelum upload
- Halaman frontend memakai lazy loading bila sudah relevan

## Reliability

- Sprint 1-4 fokus pada arsitektur monolith yang stabil
- Sprint 6-8 fokus pada split microservices tanpa memutus alur utama
- Jika service tidak tersedia, frontend menampilkan pesan yang jelas

## Observability

- Health check tersedia untuk backend monolith dan service hasil split
- Structured logging dan audit log ditambahkan di fase akhir
- QA cukup melakukan blackbox validation dan screenshot bukti

## Dokumen Terkait

- [../03-architecture/system-architecture.md](../03-architecture/system-architecture.md)
- [../04-implementation-plan/definition-of-done.md](../04-implementation-plan/definition-of-done.md)
