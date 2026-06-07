#!/bin/bash
# ============================================================
# Temuin - Microservices Docker Runner Script (Bash)
# ============================================================
# Usage: ./scripts/temuin.sh [command]
# Commands: start, stop, restart, reset, status, logs, pull,
#           seed, make-admin, help
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

COMPOSE_CMD=(docker compose --env-file .env -f infra/docker-compose.microservices.yml --progress quiet)
CONTAINER_NAMES=(temuin-db temuin-auth temuin-item temuin-engagement temuin-frontend)

ensure_postgres_volume() {
    if ! docker volume inspect temuin_pgdata >/dev/null 2>&1; then
        docker volume create temuin_pgdata >/dev/null
    fi
}

resolve_service() {
    case "$1" in
        auth) echo "auth-service" ;;
        item) echo "item-service" ;;
        engagement) echo "engagement-service" ;;
        frontend|db|"") echo "$1" ;;
        *) echo "$1" ;;
    esac
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Error: Docker is not installed or not in PATH${NC}"
        exit 1
    fi
    docker compose version > /dev/null
}

check_env() {
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}Warning: .env file not found.${NC}"
        echo "Copying from .env.docker template..."
        cp .env.docker .env
        echo -e "${GREEN}.env created from .env.docker${NC}"
        echo -e "${YELLOW}Microservices use DB_USER, DB_PASSWORD, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, and CORS_ORIGINS from .env.${NC}"
    fi
}

wait_healthy() {
    local timeout="${1:-90}"
    local deadline=$((SECONDS + timeout))
    echo -e "${YELLOW}Waiting for services to become healthy...${NC}"

    while [ "$SECONDS" -lt "$deadline" ]; do
        local all_healthy=1
        local container
        for container in "${CONTAINER_NAMES[@]}"; do
            local state
            state="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container" 2>/dev/null || true)"
            if [ "$state" != "healthy" ] && [ "$state" != "running" ]; then
                all_healthy=0
                break
            fi
        done

        if [ "$all_healthy" -eq 1 ]; then
            echo -e "${GREEN}All microservices are healthy.${NC}"
            return
        fi

        sleep 2
    done

    echo -e "${YELLOW}Warning: services are not all healthy yet. Use './scripts/temuin.sh logs <service>' if this persists.${NC}"
}

cmd_start() {
    echo -e "${CYAN}=== Starting Temuin Microservices ===${NC}"
    check_docker
    check_env
    docker compose down --remove-orphans >/dev/null 2>&1 || true
    ensure_postgres_volume
    "${COMPOSE_CMD[@]}" up -d
    wait_healthy
    echo ""
    cmd_status
}

cmd_stop() {
    echo -e "${CYAN}=== Stopping Temuin Microservices ===${NC}"
    check_docker
    "${COMPOSE_CMD[@]}" down
    echo -e "${GREEN}All microservices containers stopped.${NC}"
}

cmd_restart() {
    echo -e "${CYAN}=== Restarting Temuin Microservices ===${NC}"
    cmd_stop
    echo ""
    cmd_start
}

cmd_reset() {
    echo -e "${RED}=== Resetting Temuin Microservices (full clean restart) ===${NC}"
    echo -e "${YELLOW}WARNING: This will DELETE the shared Postgres volume and all local data!${NC}"
    echo -e "${YELLOW}A clean volume is required so auth_db, item_db, and engagement_db are created by infra/postgres-init/01-create-databases.sh.${NC}"
    read -p "Type 'yes' to confirm: " confirm
    if [ "$confirm" != "yes" ]; then
        echo -e "${YELLOW}Reset cancelled.${NC}"
        return
    fi
    check_docker
    check_env
    "${COMPOSE_CMD[@]}" down -v
    docker volume rm temuin_pgdata 2>/dev/null || true
    ensure_postgres_volume
    "${COMPOSE_CMD[@]}" pull
    "${COMPOSE_CMD[@]}" up -d
    wait_healthy
    echo ""
    cmd_status
}

cmd_status() {
    check_docker
    echo -e "${CYAN}=== Container Status (Microservices) ===${NC}"
    "${COMPOSE_CMD[@]}" ps
    echo ""
    echo -e "${CYAN}=== Access URLs ===${NC}"
    echo -e "  Frontend:       ${GREEN}http://localhost:3000${NC}"
    echo -e "  Status API:     ${GREEN}http://localhost:3000/api/status${NC}"
    echo -e "  Auth Health:    ${GREEN}http://localhost:8001/health${NC}"
    echo -e "  Item Health:    ${GREEN}http://localhost:8002/health${NC}"
    echo -e "  Engagement:     ${GREEN}http://localhost:8003/health${NC}"
    echo -e "  Database:       ${GREEN}internal temuin-db:5432${NC} (auth_db, item_db, engagement_db)"
}

cmd_logs() {
    check_docker
    local service
    service="$(resolve_service "${1:-}")"
    if [ -z "$service" ]; then
        "${COMPOSE_CMD[@]}" logs -f --tail=100
    else
        "${COMPOSE_CMD[@]}" logs -f --tail=100 "$service"
    fi
}

cmd_pull() {
    echo -e "${CYAN}=== Pulling Temuin Microservices Images from Docker Hub ===${NC}"
    check_docker
    "${COMPOSE_CMD[@]}" pull
    echo -e "${GREEN}Pull complete.${NC}"
}

cmd_seed() {
    echo -e "${CYAN}=== Seeding Microservices Master Data ===${NC}"
    check_docker
    "${COMPOSE_CMD[@]}" exec item-service python -m app.utils.seed
    echo -e "${GREEN}Seed complete.${NC}"
}

cmd_make_admin() {
    echo -e "${CYAN}=== Make User Admin (auth_db) ===${NC}"
    check_docker

    local email="${1:-}"
    if [ -z "$email" ]; then
        echo -e "${RED}Error: Email is required.${NC}"
        echo "Usage: ./scripts/temuin.sh make-admin user@student.itk.ac.id"
        exit 1
    fi

    local escaped_email="${email//\'/\'\'}"
    echo "Setting role=admin for: $email"
    "${COMPOSE_CMD[@]}" exec db psql -U postgres -d auth_db -c "UPDATE users SET role = 'admin' WHERE email = '$escaped_email';"
    echo -e "${GREEN}Done. $email is now admin if the user exists.${NC}"
}

cmd_help() {
    echo -e "${CYAN}============================================================${NC}"
    echo -e "${CYAN}  Temuin - Microservices Docker Runner${NC}"
    echo -e "${CYAN}============================================================${NC}"
    echo ""
    echo -e "Usage: ${GREEN}./scripts/temuin.sh${NC} ${YELLOW}[command]${NC}"
    echo ""
    echo -e "Commands:"
    echo -e "  ${GREEN}start${NC}              Start microservices stack"
    echo -e "  ${GREEN}stop${NC}               Stop microservices stack"
    echo -e "  ${GREEN}restart${NC}            Restart microservices stack"
    echo -e "  ${GREEN}reset${NC}              Full clean restart (DELETES database!)"
    echo -e "  ${GREEN}status${NC}             Show container status and URLs"
    echo -e "  ${GREEN}logs${NC} [service]     Tail logs (auth, item, engagement, frontend, db)"
    echo -e "  ${GREEN}pull${NC}               Pull microservices images"
    echo -e "  ${GREEN}seed${NC}               Seed item-service master data"
    echo -e "  ${GREEN}make-admin${NC} <email>  Promote user in auth_db"
    echo -e "  ${GREEN}help${NC}               Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./scripts/temuin.sh start"
    echo "  ./scripts/temuin.sh status"
    echo "  ./scripts/temuin.sh logs engagement"
    echo "  ./scripts/temuin.sh make-admin nim@student.itk.ac.id"
    echo ""
    echo "Legacy monolith is still available manually via: docker compose up -d"
    echo ""
}

COMMAND=${1:-help}

case "$COMMAND" in
    start) cmd_start ;;
    stop) cmd_stop ;;
    restart) cmd_restart ;;
    reset) cmd_reset ;;
    status) cmd_status ;;
    logs) cmd_logs "$2" ;;
    pull) cmd_pull ;;
    seed) cmd_seed ;;
    make-admin) cmd_make_admin "$2" ;;
    help) cmd_help ;;
    *)
        echo -e "${RED}Unknown command: $COMMAND${NC}"
        echo ""
        cmd_help
        exit 1
        ;;
esac
