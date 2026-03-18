# Skills Setup - Temuin

## Tujuan

Dokumen ini menjelaskan skill project-level yang dipakai untuk membuat agent lebih patuh pada aturan Temuin.

## Lokasi Skill Workspace

Untuk agent yang mengikuti konvensi Antigravity dan Gemini CLI, skill project-level hidup di:

```text
<workspace-root>/.agents/skills/
```

Di repo ini, folder tersebut sudah tersedia.

## Skill Project Temuin

| Skill | Fungsi |
|------|--------|
| `temuin-router` | Routing awal, baca sprint aktif, auto-select task |
| `temuin-backend` | Guardrail role backend |
| `temuin-frontend` | Guardrail role frontend |
| `temuin-devops` | Guardrail role devops |
| `temuin-qa-docs` | Guardrail role QA & Docs |

## Skill Pendukung Yang Sudah Disediakan Di Workspace

| Skill | Fungsi |
|------|--------|
| `firebase-auth-basics` | Bantuan Firebase Authentication |
| `web-design-guidelines` | Review dan kualitas UI |
| `design-taste-frontend` | Taste dan kualitas desain frontend |
| `shadcn` | Pola kerja shadcn/ui |

## Aturan Pakai

- Mulai dari `temuin-router`
- Jika task sudah jelas per role, panggil skill role yang relevan
- Untuk auth berbasis Firebase, gabungkan dengan `firebase-auth-basics`
- Untuk frontend, utamakan `temuin-frontend`, lalu gunakan `shadcn`, `design-taste-frontend`, dan `web-design-guidelines` bila agent mendukung skill tambahan
- Jika agent tidak mendukung skill system, fallback ke `AGENTS.md` dan dokumen di `temuin-docs/`
