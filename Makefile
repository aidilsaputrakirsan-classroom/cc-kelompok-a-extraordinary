# ============================================================
# Temuin - Makefile
# ============================================================
# Prerequisites: docker compose up -d (containers must be running)
# ============================================================

.PHONY: build up down logs lint lint-fix lint-backend lint-frontend test test-backend test-frontend test-coverage pr-check ci-local

# --- Docker Lifecycle ---

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

# --- Development & CI Targets ---

# Composite lint: run backend (ruff) + frontend (eslint).
# Used by CI lint job.
lint: lint-backend lint-frontend

lint-backend:
	@echo "Running ruff linter on backend..."
	docker compose exec backend ruff check /app --output-format=concise

lint-frontend:
	@echo "Running eslint on frontend..."
	cd frontend && npm run lint

lint-fix:
	@echo "Running ruff with auto-fix..."
	docker compose exec backend ruff check /app --fix

# Composite test: backend (pytest) + frontend (vitest).
test: test-backend test-frontend

test-backend:
	@echo "Running backend tests..."
	docker compose exec backend pytest /app/tests -v --tb=short

test-frontend:
	@echo "Running frontend tests..."
	cd frontend && npm run test -- --run

test-coverage:
	@echo "Running backend coverage..."
	docker compose exec backend pytest /app/tests --cov=app --cov-report=term-missing --cov-fail-under=60
	@echo "Running frontend coverage..."
	cd frontend && npm run test:coverage

# Local replica of CI workflow (lint + test + build).
# Run before pushing to catch CI failures early.
ci-local: lint test
	@echo "Local CI checks passed."

pr-check:
	@echo "PR check: build + health verify..."
	@echo "Step 1: Building Docker images..."
	docker compose build
	@echo "Step 2: Starting services..."
	docker compose up -d
	@echo "Step 3: Waiting for health check (max 60s)..."
	@for i in $$(seq 1 12); do \
		if curl -sf http://localhost:8000/health > /dev/null 2>&1; then \
			echo "Backend healthy!"; \
			break; \
		fi; \
		if [ $$i -eq 12 ]; then \
			echo "Health check timeout!"; \
			docker compose logs backend; \
			docker compose down; \
			exit 1; \
		fi; \
		echo "  Waiting... ($$i/12)"; \
		sleep 5; \
	done
	@echo "Step 4: Verifying health endpoint..."
	@curl -s http://localhost:8000/health | python -m json.tool
	@echo ""
	@echo "Step 5: Cleaning up..."
	docker compose down
	@echo "PR check passed!"
