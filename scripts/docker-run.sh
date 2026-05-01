#!/bin/bash

# ============================================================
# Docker Compose Management Script
# ============================================================
# Wrapper untuk mengelola stack Temuin via docker compose.
#
# Usage:
#   ./scripts/docker-run.sh start   - Start semua services
#   ./scripts/docker-run.sh build   - Build ulang image lalu start
#   ./scripts/docker-run.sh stop    - Stop & remove containers/network
#   ./scripts/docker-run.sh restart - Restart semua services
#   ./scripts/docker-run.sh status  - Cek status services
#   ./scripts/docker-run.sh logs    - Lihat logs semua services
#   ./scripts/docker-run.sh logs db|backend|frontend
#   ./scripts/docker-run.sh push    - Push backend/frontend image
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker tidak running. Jalankan Docker Desktop terlebih dahulu."
        exit 1
    fi
}

compose() {
    docker compose "$@"
}

start_services() {
    check_docker
    print_info "Starting Temuin services via Docker Compose..."
    compose up -d
    print_success "Services started."
    show_status
}

build_services() {
    check_docker
    print_info "Building and starting Temuin services..."
    compose up --build -d
    print_success "Services built and started."
    show_status
}

stop_services() {
    check_docker
    print_info "Stopping and removing Temuin containers/network..."
    compose down
    print_success "Services stopped. Volume cloudapp-pgdata tetap tersimpan."
}

clean_services() {
    check_docker
    print_warning "Menghapus containers, network, dan volume cloudapp-pgdata..."
    compose down -v
    print_success "Stack dan volume berhasil dihapus."
}

restart_services() {
    check_docker
    print_info "Restarting Temuin services..."
    compose restart
    print_success "Services restarted."
    show_status
}

show_status() {
    check_docker
    print_info "Status services:"
    echo ""
    compose ps
    echo ""
    print_info "Akses aplikasi:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend API: http://localhost:8000"
    echo "  - API Docs: http://localhost:8000/docs"
    echo "  - Database: localhost:5433"
}

show_logs() {
    check_docker

    if [ -z "$1" ]; then
        print_info "Logs untuk semua services (Ctrl+C untuk keluar):"
        compose logs -f
    elif [ "$1" = "db" ] || [ "$1" = "backend" ] || [ "$1" = "frontend" ]; then
        print_info "Logs untuk service '$1' (Ctrl+C untuk keluar):"
        compose logs -f "$1"
    else
        print_error "Service tidak dikenal: $1"
        print_info "Gunakan: logs [db|backend|frontend]"
        exit 1
    fi
}

push_images() {
    check_docker
    print_info "Pushing backend dan frontend images ke Docker Hub..."
    compose push backend frontend
    print_success "Images pushed."
}

show_images() {
    check_docker
    docker images pangeransilaen/temuin-backend
    docker images pangeransilaen/temuin-frontend
}

show_help() {
    echo "Docker Compose Management Script"
    echo ""
    echo "Usage:"
    echo "  ./scripts/docker-run.sh start             - Start semua services"
    echo "  ./scripts/docker-run.sh build             - Build ulang image lalu start"
    echo "  ./scripts/docker-run.sh stop              - Stop & remove containers/network"
    echo "  ./scripts/docker-run.sh clean             - Stop & remove containers/network/volume"
    echo "  ./scripts/docker-run.sh restart           - Restart semua services"
    echo "  ./scripts/docker-run.sh status            - Cek status services"
    echo "  ./scripts/docker-run.sh logs              - Lihat logs semua services"
    echo "  ./scripts/docker-run.sh logs db           - Lihat logs database"
    echo "  ./scripts/docker-run.sh logs backend      - Lihat logs backend"
    echo "  ./scripts/docker-run.sh logs frontend     - Lihat logs frontend"
    echo "  ./scripts/docker-run.sh images            - Lihat image Temuin lokal"
    echo "  ./scripts/docker-run.sh push              - Push backend/frontend image"
    echo "  ./scripts/docker-run.sh help              - Tampilkan help ini"
    echo ""
}

case "$1" in
    start|up)
        start_services
        ;;
    build)
        build_services
        ;;
    stop|down)
        stop_services
        ;;
    clean)
        clean_services
        ;;
    restart)
        restart_services
        ;;
    status|ps)
        show_status
        ;;
    logs)
        show_logs "$2"
        ;;
    images)
        show_images
        ;;
    push)
        push_images
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Command tidak dikenal: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
