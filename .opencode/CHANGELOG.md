# Change Log

## 2026-03-20
- Fixed Modul 04 auth mismatch so `/auth/login` accepts Swagger OAuth2 form data and existing JSON login payloads.
- Fixed JWT `sub` handling so issued tokens work on protected `/items` endpoints.
- Added backend regression tests for form login, JSON login, and token-based access to protected endpoints.
- Added `python-multipart` to backend dependencies and refreshed `backend/.env.example` auth/CORS guidance.
- Added `docs/setup-guide.md` for local setup and Swagger auth verification.
