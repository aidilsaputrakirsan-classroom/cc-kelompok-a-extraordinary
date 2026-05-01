# Docker Hub Images - Temuin

Dokumen ini mencatat image Docker Hub yang dipakai untuk menjalankan aplikasi Temuin via Docker Compose.

## Repositories

| Service | Image | Tag | Fungsi |
|---------|-------|-----|--------|
| Backend | `pangeransilaen/temuin-backend` | `latest` | FastAPI REST API |
| Frontend | `pangeransilaen/temuin-frontend` | `latest` | React build served by Nginx |
| Database | `postgres` | `16-alpine` | PostgreSQL database official image |

## Latest Local Build Sizes

| Image | Tag | Size |
|-------|-----|------|
| `pangeransilaen/temuin-backend` | `latest` | 157 MB |
| `pangeransilaen/temuin-frontend` | `latest` | 92.9 MB |

## Pull Images

```bash
docker pull pangeransilaen/temuin-backend:latest
docker pull pangeransilaen/temuin-frontend:latest
docker pull postgres:16-alpine
```

## Build Images Locally

Jalankan dari root project:

```bash
docker compose build backend frontend
```

Compose akan men-tag hasil build sesuai `image:` di `docker-compose.yml`:

```bash
pangeransilaen/temuin-backend:latest
pangeransilaen/temuin-frontend:latest
```

## Push Images

Pastikan sudah login ke Docker Hub sebagai akun yang punya akses ke repository `pangeransilaen`.

```bash
docker login
docker compose push backend frontend
```

Atau gunakan Makefile:

```bash
make push
```

## Run with Docker Compose

```bash
docker compose up -d
```

Jika ingin rebuild dari source sebelum menjalankan:

```bash
docker compose up --build -d
```

## Access URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

## Environment Variables

Backend memakai `backend/.env.docker` saat dijalankan lewat Compose.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string ke service `db` |
| `SECRET_KEY` | JWT secret key |
| `ALGORITHM` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time |
| `ALLOWED_ORIGINS` | CORS allowed origins |

## Image Size Check

Gunakan command berikut setelah build/pull:

```bash
docker images pangeransilaen/temuin-backend pangeransilaen/temuin-frontend
```
