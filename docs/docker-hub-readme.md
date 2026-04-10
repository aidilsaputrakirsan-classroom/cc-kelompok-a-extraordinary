# 🐳 Docker Hub - Backend App

## Quick Start

### Pull Image dari Docker Hub
```bash
docker pull pangeransilaen/cloudapp-backend:alpine
```

### Jalankan dengan Docker Compose (Recommended)
```bash
# Clone repository
git clone <repo-url>
cd praktikum

# Start semua container
./scripts/docker-run.sh start
```

### Jalankan Manual

**1. Buat Docker Network**
```bash
docker network create cloudnet
```

**2. Jalankan PostgreSQL**
```bash
docker run -d \
  --name db \
  --network cloudnet \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -e POSTGRES_DB=cloudapp \
  -p 5433:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16-alpine
```

**3. Jalankan Backend**
```bash
docker run -d \
  --name backend \
  --network cloudnet \
  -e DATABASE_URL=postgresql+psycopg://postgres:postgres123@db:5432/cloudapp \
  -e SECRET_KEY=your-secret-key \
  -e ALGORITHM=HS256 \
  -e ACCESS_TOKEN_EXPIRE_MINUTES=60 \
  -e ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000 \
  -p 8000:8000 \
  pangeransilaen/cloudapp-backend:alpine
```

**4. Akses API**
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

---

## 📦 Available Tags

| Tag | Size | Description |
|-----|------|-------------|
| `alpine` | 157 MB | Optimized Alpine-based image (recommended) |
| `latest` | 157 MB | Same as alpine |

---

## 🚀 Features

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM untuk database
- **PostgreSQL** - Database (psycopg driver)
- **JWT Authentication** - Secure auth dengan python-jose
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

---

## 🔧 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `SECRET_KEY` | Yes | - | JWT secret key |
| `ALGORITHM` | No | HS256 | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | 60 | Token expiration time |
| `ALLOWED_ORIGINS` | No | * | CORS allowed origins |
| `APP_ENV` | No | development | Environment (development/production) |
| `DEBUG` | No | true | Debug mode |

---

## 📊 Image Optimization

Image ini dioptimasi menggunakan multi-stage build dengan Alpine Linux:

- **Before:** 304 MB (python:3.12-slim, single-stage)
- **After:** 157 MB (python:3.12-alpine, multi-stage)
- **Reduction:** 147 MB (48.4%)

### Optimization Techniques:
- Multi-stage build (builder + production)
- Alpine Linux base image
- Virtual environment isolation
- Aggressive cleanup (pip, tests, docs, pycache)
- Runtime optimization flags

---

## 🔒 Security

- Non-root user (`appuser`)
- Minimal runtime dependencies
- No build tools in production image
- Healthcheck enabled
- Environment-based configuration

---

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - Register user baru
- `POST /auth/login` - Login & get JWT token

### Items (Protected)
- `GET /items` - List semua items
- `POST /items` - Create item baru
- `GET /items/{id}` - Get item by ID
- `PUT /items/{id}` - Update item
- `DELETE /items/{id}` - Delete item

### Health
- `GET /health` - Health check endpoint

---

## 🛠️ Development

### Build Image Locally
```bash
cd backend
docker build -t cloudapp-backend:alpine .
```

### Run Tests
```bash
# TODO: Add test commands
```

---

## 📚 Documentation

- Full documentation: [GitHub Repository](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary)
- API Docs: http://localhost:8000/docs (when running)

---

## 🤝 Contributing

Contributions are welcome! Please check the repository for guidelines.

---

## 📄 License

[Add your license here]

---

## 👥 Authors

- DevOps Team - Cloud Computing Course

---

**Last Updated:** 2026-04-08
