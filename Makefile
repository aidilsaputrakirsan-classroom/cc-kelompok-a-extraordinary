.PHONY: up build push down clean restart logs logs-backend logs-frontend logs-db ps images shell-backend shell-frontend shell-db

up:
	docker compose up -d

build:
	docker compose up --build -d

push:
	docker compose push backend frontend

down:
	docker compose down

clean:
	docker compose down -v
	docker system prune -f

restart:
	docker compose restart

logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

logs-db:
	docker compose logs -f db

ps:
	docker compose ps

images:
	docker images pangeransilaen/temuin-backend
	docker images pangeransilaen/temuin-frontend

shell-backend:
	docker compose exec backend sh

shell-frontend:
	docker compose exec frontend sh

shell-db:
	docker compose exec db psql -U postgres -d cloudapp
