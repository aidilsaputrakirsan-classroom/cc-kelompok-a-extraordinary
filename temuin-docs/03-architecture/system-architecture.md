# System Architecture - Temuin

## Arsitektur Bertahap

Temuin dibangun bertahap mengikuti modul mata kuliah:

| Sprint | Bentuk Sistem |
|-------|----------------|
| 1-4 | Monolith: satu backend FastAPI, satu database, satu frontend React |
| 5 | Monolith + CI/CD |
| 6 | Split ke `auth-service` dan `item-service` |
| 7-8 | Tambah gateway, monitoring, audit, dan security hardening |

## High-Level Architecture

```text
[Browser]
   |
   v
[Frontend React + shadcn/ui]
   |
   v
[Backend FastAPI]
   |
   v
[PostgreSQL]
```

Fase microservices:

```text
[Browser]
   |
   v
[Frontend React + shadcn/ui]
   |
   v
[Nginx Gateway]
   |                 |
   v                 v
[Auth Service]   [Item Service]
   |                 |
   v                 v
[Auth DB]        [Item DB]
```

## Prinsip Arsitektur

- Fase awal harus stabil dan mudah dipahami tim
- Struktur file mengikuti pola modular dari modul, tapi boleh lebih rapi
- Frontend hanya mengenal satu base URL aktif untuk API
- Evolusi ke microservices dilakukan setelah monolith stabil
- Logging, health check, dan audit dipasang bertahap, bukan sejak hari pertama

## Dokumen Terkait

- [backend-architecture.md](./backend-architecture.md)
- [frontend-architecture.md](./frontend-architecture.md)
- [devops-architecture.md](./devops-architecture.md)
- [database-design.md](./database-design.md)
