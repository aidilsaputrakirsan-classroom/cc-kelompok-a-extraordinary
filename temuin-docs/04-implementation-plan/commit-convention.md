# Commit Convention - Temuin

## Format

```text
<type>(<scope>): <deskripsi singkat>
```

## Tipe Commit

| Tipe | Kegunaan |
|------|----------|
| `feat` | Fitur baru |
| `fix` | Perbaikan bug |
| `chore` | Setup atau config |
| `docs` | Perubahan dokumentasi |
| `refactor` | Refactor tanpa ubah behavior |
| `test` | Tambah atau ubah test |
| `ci` | Workflow CI/CD |

## Scope Yang Dipakai

- `backend`
- `frontend`
- `devops`
- `qa`
- `docs`

## Contoh

- `feat(frontend): setup vite, tailwind, dan shadcn`
- `feat(backend): tambah auth login dan sync user`
- `chore(devops): tambah docker-compose monolith`
- `docs(qa): tambah hasil blackbox sprint 02`

## Catatan

- Deskripsi commit menggunakan Bahasa Indonesia
- Tulis satu commit untuk satu perubahan yang masih masuk akal direview
