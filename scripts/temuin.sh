#!/bin/bash
# ============================================================
# Temuin - Docker Runner Script (Bash)
# ============================================================
# Usage: ./scripts/temuin.sh [command]
# Commands: start, stop, restart, reset, status, logs, build,
#           pull, migrate, seed, help
# ============================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Navigate to project root (where docker-compose.yml lives)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Check docker compose is available
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Error: Docker is not installed or not in PATH${NC}"
        exit 1
    fi
    if ! docker compose version &> /dev/null; then
        echo -e "${RED}Error: Docker Compose V2 is not available${NC}"
        exit 1
    fi
}

# Check .env file exists
check_env() {
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}Warning: .env file not found.${NC}"
        echo -e "Copying from .env.docker template..."
        cp .env.docker .env
        echo -e "${GREEN}.env created from .env.docker${NC}"
        echo -e "${YELLOW}Please edit .env with your actual values (especially Firebase config).${NC}"
    fi
}

# Check Firebase credentials exist
check_firebase() {
    if [ ! -f "backend/serviceAccountKey.json" ]; then
        echo -e "${YELLOW}WARNING: backend/serviceAccountKey.json not found.${NC}"
        echo "Creating empty placeholder. Firebase auth will NOT work until you add the real file."
        echo '{}' > backend/serviceAccountKey.json
    else
        local content
        content=$(cat backend/serviceAccountKey.json | tr -d '[:space:]')
        if [ "$content" = "{}" ] || [ ${#content} -lt 50 ]; then
            echo -e "${YELLOW}WARNING: backend/serviceAccountKey.json appears to be a placeholder.${NC}"
            echo -e "${YELLOW}Firebase auth will NOT work. Replace with the real credentials file.${NC}"
        fi
    fi
}

# ============================================================
# Commands
# ============================================================

cmd_start() {
    echo -e "${CYAN}=== Starting Temuin ===${NC}"
    check_docker
    check_env
    check_firebase
    docker compose up -d
    echo ""
    cmd_status
}

cmd_stop() {
    echo -e "${CYAN}=== Stopping Temuin ===${NC}"
    check_docker
    docker compose down
    echo -e "${GREEN}All containers stopped.${NC}"
}

cmd_restart() {
    echo -e "${CYAN}=== Restarting Temuin ===${NC}"
    cmd_stop
    echo ""
    cmd_start
}

cmd_reset() {
    echo -e "${RED}=== Resetting Temuin (full clean restart) ===${NC}"
    echo -e "${YELLOW}WARNING: This will DELETE the database and all data!${NC}"
    read -p "Type 'yes' to confirm: " confirm
    if [ "$confirm" != "yes" ]; then
        echo -e "${YELLOW}Reset cancelled.${NC}"
        return
    fi
    check_docker
    check_env
    check_firebase
    echo "Stopping containers and removing volumes..."
    docker compose down -v
    echo "Pulling latest images..."
    docker compose pull backend frontend
    echo "Starting from scratch..."
    docker compose up -d
    echo ""
    cmd_status
}

cmd_status() {
    check_docker
    echo -e "${CYAN}=== Container Status ===${NC}"
    docker compose ps
    echo ""
    echo -e "${CYAN}=== Access URLs ===${NC}"
    echo -e "  Frontend:  ${GREEN}http://localhost:3000${NC}"
    echo -e "  Backend:   ${GREEN}http://localhost:8000${NC}"
    echo -e "  API Docs:  ${GREEN}http://localhost:8000/docs${NC}"
    echo -e "  Database:  ${GREEN}localhost:5434${NC} (user: postgres)"
}

cmd_logs() {
    check_docker
    SERVICE=${1:-""}
    if [ -z "$SERVICE" ]; then
        docker compose logs -f --tail=100
    else
        docker compose logs -f --tail=100 "$SERVICE"
    fi
}

cmd_build() {
    echo -e "${CYAN}=== Building Temuin Images ===${NC}"
    check_docker
    check_env
    docker compose build
    echo -e "${GREEN}Build complete.${NC}"
}

cmd_pull() {
    echo -e "${CYAN}=== Pulling Temuin Images from Docker Hub ===${NC}"
    check_docker
    docker compose pull backend frontend
    echo -e "${GREEN}Pull complete.${NC}"
}

cmd_migrate() {
    echo -e "${CYAN}=== Running Alembic Migrations ===${NC}"
    check_docker
    docker compose exec backend alembic upgrade head
    echo -e "${GREEN}Migrations complete.${NC}"
}

cmd_seed() {
    echo -e "${CYAN}=== Seeding Database ===${NC}"
    check_docker

    # Check if db container is running
    if ! docker compose ps db | grep -q "running"; then
        echo -e "${RED}Error: Database container is not running. Run './scripts/temuin.sh start' first.${NC}"
        exit 1
    fi

    echo "Creating seed data..."
    docker compose exec db psql -U postgres -d temuin_db -c "
        -- Insert default categories (model: id String PK, name String)
        INSERT INTO categories (id, name) VALUES
            ('cat-elektronik', 'Elektronik'),
            ('cat-dokumen', 'Dokumen'),
            ('cat-aksesoris', 'Aksesoris'),
            ('cat-pakaian', 'Pakaian'),
            ('cat-lainnya', 'Lainnya')
        ON CONFLICT DO NOTHING;

        -- Insert default buildings (model: id String PK, name String)
        INSERT INTO buildings (id, name) VALUES
            ('bld-gkb', 'Gedung Kuliah Bersama'),
            ('bld-rek', 'Gedung Rektorat'),
            ('bld-lib', 'Perpustakaan'),
            ('bld-if', 'Gedung Teknik Informatika'),
            ('bld-kan', 'Kantin Pusat')
        ON CONFLICT DO NOTHING;
    " 2>/dev/null || echo -e "${YELLOW}Note: Some seed data may already exist or tables not yet created.${NC}"

    echo -e "${GREEN}Seed complete.${NC}"
}

cmd_help() {
    echo -e "${CYAN}============================================================${NC}"
    echo -e "${CYAN}  Temuin - Docker Runner${NC}"
    echo -e "${CYAN}============================================================${NC}"
    echo ""
    echo -e "Usage: ${GREEN}./scripts/temuin.sh${NC} ${YELLOW}[command]${NC}"
    echo ""
    echo -e "Commands:"
    echo -e "  ${GREEN}start${NC}              Start all containers"
    echo -e "  ${GREEN}stop${NC}               Stop all containers (data preserved)"
    echo -e "  ${GREEN}restart${NC}            Restart all containers"
    echo -e "  ${GREEN}reset${NC}              Full clean restart (DELETES database!)"
    echo -e "  ${GREEN}status${NC}             Show container status and URLs"
    echo -e "  ${GREEN}logs${NC} [service]     Tail logs (optional: db, backend, frontend)"
    echo -e "  ${GREEN}build${NC}              Build images locally"
    echo -e "  ${GREEN}pull${NC}               Pull images from Docker Hub"
    echo -e "  ${GREEN}migrate${NC}            Run Alembic database migrations"
    echo -e "  ${GREEN}seed${NC}               Seed database with initial data"
    echo -e "  ${GREEN}help${NC}               Show this help message"
    echo ""
    echo -e "Examples:"
    echo -e "  ./scripts/temuin.sh start          # Start everything"
    echo -e "  ./scripts/temuin.sh logs backend    # Tail backend logs"
    echo -e "  ./scripts/temuin.sh seed            # Seed the database"
    echo -e "  ./scripts/temuin.sh reset           # Nuke DB + pull latest + start fresh"
    echo ""
}

# ============================================================
# Main
# ============================================================

COMMAND=${1:-help}

case "$COMMAND" in
    start)    cmd_start ;;
    stop)     cmd_stop ;;
    restart)  cmd_restart ;;
    reset)    cmd_reset ;;
    status)   cmd_status ;;
    logs)     cmd_logs "$2" ;;
    build)    cmd_build ;;
    pull)     cmd_pull ;;
    migrate)  cmd_migrate ;;
    seed)     cmd_seed ;;
    help)     cmd_help ;;
    *)
        echo -e "${RED}Unknown command: $COMMAND${NC}"
        echo ""
        cmd_help
        exit 1
        ;;
esac
