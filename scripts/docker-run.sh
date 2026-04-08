#!/bin/bash

# ============================================================
# Docker Management Script
# ============================================================
# Script untuk mengelola container backend dan database
#
# Usage:
#   ./docker-run.sh start   - Start semua container
#   ./docker-run.sh stop    - Stop semua container
#   ./docker-run.sh restart - Restart semua container
#   ./docker-run.sh status  - Cek status container
#   ./docker-run.sh logs    - Lihat logs semua container
#   ./docker-run.sh logs db - Lihat logs database saja
#   ./docker-run.sh logs backend - Lihat logs backend saja
# ============================================================

set -e  # Exit on error

# Colors untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Container names
DB_CONTAINER="db"
BACKEND_CONTAINER="backend"
NETWORK_NAME="cloudnet"

# Function: Print colored message
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

# Function: Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker tidak running. Jalankan Docker Desktop terlebih dahulu."
        exit 1
    fi
}

# Function: Check if network exists
check_network() {
    if ! docker network ls | grep -q "$NETWORK_NAME"; then
        print_warning "Network '$NETWORK_NAME' tidak ditemukan. Membuat network..."
        docker network create "$NETWORK_NAME"
        print_success "Network '$NETWORK_NAME' berhasil dibuat"
    fi
}

# Function: Start containers
start_containers() {
    print_info "Starting containers..."
    check_docker
    check_network

    # Start database container
    if docker ps -a | grep -q "$DB_CONTAINER"; then
        if docker ps | grep -q "$DB_CONTAINER"; then
            print_warning "Container '$DB_CONTAINER' sudah running"
        else
            print_info "Starting container '$DB_CONTAINER'..."
            docker start "$DB_CONTAINER"
            print_success "Container '$DB_CONTAINER' started"
        fi
    else
        print_info "Creating and starting container '$DB_CONTAINER'..."
        docker run -d \
            --name "$DB_CONTAINER" \
            --network "$NETWORK_NAME" \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_PASSWORD=postgres123 \
            -e POSTGRES_DB=cloudapp \
            -p 5433:5432 \
            -v pgdata:/var/lib/postgresql/data \
            postgres:16-alpine
        print_success "Container '$DB_CONTAINER' created and started"
    fi

    # Wait for database to be ready
    print_info "Waiting for database to be ready..."
    sleep 3

    # Start backend container
    if docker ps -a | grep -q "$BACKEND_CONTAINER"; then
        if docker ps | grep -q "$BACKEND_CONTAINER"; then
            print_warning "Container '$BACKEND_CONTAINER' sudah running"
        else
            print_info "Starting container '$BACKEND_CONTAINER'..."
            docker start "$BACKEND_CONTAINER"
            print_success "Container '$BACKEND_CONTAINER' started"
        fi
    else
        print_info "Creating and starting container '$BACKEND_CONTAINER'..."
        cd "$(dirname "$0")/../backend"
        docker run -d \
            --name "$BACKEND_CONTAINER" \
            --network "$NETWORK_NAME" \
            --env-file .env.docker \
            -p 8000:8000 \
            backend-app:latest
        print_success "Container '$BACKEND_CONTAINER' created and started"
    fi

    print_success "Semua container berhasil dijalankan!"
    echo ""
    show_status
}

# Function: Stop containers
stop_containers() {
    print_info "Stopping containers..."
    check_docker

    # Stop backend first
    if docker ps | grep -q "$BACKEND_CONTAINER"; then
        print_info "Stopping container '$BACKEND_CONTAINER'..."
        docker stop "$BACKEND_CONTAINER"
        print_success "Container '$BACKEND_CONTAINER' stopped"
    else
        print_warning "Container '$BACKEND_CONTAINER' tidak running"
    fi

    # Stop database
    if docker ps | grep -q "$DB_CONTAINER"; then
        print_info "Stopping container '$DB_CONTAINER'..."
        docker stop "$DB_CONTAINER"
        print_success "Container '$DB_CONTAINER' stopped"
    else
        print_warning "Container '$DB_CONTAINER' tidak running"
    fi

    print_success "Semua container berhasil dihentikan!"
}

# Function: Restart containers
restart_containers() {
    print_info "Restarting containers..."
    stop_containers
    echo ""
    start_containers
}

# Function: Show status
show_status() {
    print_info "Status containers:"
    echo ""
    docker ps -a --filter "name=$DB_CONTAINER" --filter "name=$BACKEND_CONTAINER" \
        --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""

    # Check if containers are healthy
    if docker ps | grep -q "$DB_CONTAINER" && docker ps | grep -q "$BACKEND_CONTAINER"; then
        print_success "Semua container running!"
        echo ""
        print_info "Akses aplikasi:"
        echo "  - Backend API: http://localhost:8000"
        echo "  - API Docs: http://localhost:8000/docs"
        echo "  - Database: localhost:5433"
    else
        print_warning "Beberapa container tidak running. Jalankan './docker-run.sh start'"
    fi
}

# Function: Show logs
show_logs() {
    check_docker

    if [ -z "$1" ]; then
        # Show logs for all containers
        print_info "Logs untuk semua container (Ctrl+C untuk keluar):"
        echo ""
        docker logs -f --tail=50 "$DB_CONTAINER" &
        docker logs -f --tail=50 "$BACKEND_CONTAINER" &
        wait
    elif [ "$1" == "db" ]; then
        print_info "Logs untuk container '$DB_CONTAINER' (Ctrl+C untuk keluar):"
        echo ""
        docker logs -f --tail=100 "$DB_CONTAINER"
    elif [ "$1" == "backend" ]; then
        print_info "Logs untuk container '$BACKEND_CONTAINER' (Ctrl+C untuk keluar):"
        echo ""
        docker logs -f --tail=100 "$BACKEND_CONTAINER"
    else
        print_error "Container tidak dikenal: $1"
        print_info "Gunakan: logs [db|backend]"
        exit 1
    fi
}

# Function: Show help
show_help() {
    echo "Docker Management Script"
    echo ""
    echo "Usage:"
    echo "  ./docker-run.sh start           - Start semua container"
    echo "  ./docker-run.sh stop            - Stop semua container"
    echo "  ./docker-run.sh restart         - Restart semua container"
    echo "  ./docker-run.sh status          - Cek status container"
    echo "  ./docker-run.sh logs            - Lihat logs semua container"
    echo "  ./docker-run.sh logs db         - Lihat logs database saja"
    echo "  ./docker-run.sh logs backend    - Lihat logs backend saja"
    echo "  ./docker-run.sh help            - Tampilkan help ini"
    echo ""
}

# Main script
case "$1" in
    start)
        start_containers
        ;;
    stop)
        stop_containers
        ;;
    restart)
        restart_containers
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs "$2"
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
