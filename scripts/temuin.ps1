# ============================================================
# Temuin - Docker Runner Script (PowerShell)
# ============================================================
# Usage: .\scripts\temuin.ps1 [command]
# Commands: start, stop, restart, reset, status, logs, build,
#           pull, migrate, seed, help
# ============================================================

param(
    [Parameter(Position = 0)]
    [string]$Command = "help",

    [Parameter(Position = 1)]
    [string]$Service = ""
)

$ErrorActionPreference = "Stop"

# Navigate to project root (where docker-compose.yml lives)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
Set-Location $ProjectRoot

# ============================================================
# Helpers
# ============================================================

function Write-Color {
    param(
        [string]$Text,
        [string]$Color = "White",
        [switch]$NoNewline
    )
    $params = @{ Object = $Text; ForegroundColor = $Color }
    if ($NoNewline) { $params.NoNewline = $true }
    Write-Host @params
}

function Test-Docker {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Color "Error: Docker is not installed or not in PATH" "Red"
        exit 1
    }
    $composeCheck = docker compose version 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Color "Error: Docker Compose V2 is not available" "Red"
        exit 1
    }
}

function Test-EnvFile {
    if (-not (Test-Path ".env")) {
        Write-Color "Warning: .env file not found." "Yellow"
        Write-Host "Copying from .env.docker template..."
        Copy-Item ".env.docker" ".env"
        Write-Color ".env created from .env.docker" "Green"
        Write-Color "Please edit .env with your actual values (especially Firebase config)." "Yellow"
    }
}

# ============================================================
# Commands
# ============================================================

function Test-FirebaseCreds {
    if (-not (Test-Path "backend/serviceAccountKey.json")) {
        Write-Color "WARNING: backend/serviceAccountKey.json not found." "Yellow"
        Write-Host "Creating empty placeholder. Firebase auth will NOT work until you add the real file."
        '{}' | Set-Content "backend/serviceAccountKey.json" -Encoding UTF8
    } else {
        $content = (Get-Content "backend/serviceAccountKey.json" -Raw).Trim()
        if ($content -eq '{}' -or $content.Length -lt 50) {
            Write-Color "WARNING: backend/serviceAccountKey.json appears to be a placeholder." "Yellow"
            Write-Color "Firebase auth will NOT work. Replace with the real credentials file." "Yellow"
        }
    }
}

function Invoke-Start {
    Write-Color "=== Starting Temuin ===" "Cyan"
    Test-Docker
    Test-EnvFile
    Test-FirebaseCreds
    docker compose up -d
    Write-Host ""
    Invoke-Status
}

function Invoke-Stop {
    Write-Color "=== Stopping Temuin ===" "Cyan"
    Test-Docker
    docker compose down
    Write-Color "All containers stopped." "Green"
}

function Invoke-Restart {
    Write-Color "=== Restarting Temuin ===" "Cyan"
    Invoke-Stop
    Write-Host ""
    Invoke-Start
}

function Invoke-Reset {
    Write-Color "=== Resetting Temuin (full clean restart) ===" "Red"
    Write-Color "WARNING: This will DELETE the database and all data!" "Yellow"
    $confirm = Read-Host "Type 'yes' to confirm"
    if ($confirm -ne "yes") {
        Write-Color "Reset cancelled." "Yellow"
        return
    }
    Test-Docker
    Test-EnvFile
    Test-FirebaseCreds
    Write-Host "Stopping containers and removing volumes..."
    docker compose down -v
    Write-Host "Pulling latest images..."
    docker compose pull backend frontend
    Write-Host "Starting from scratch..."
    docker compose up -d
    Write-Host ""
    Invoke-Status
}

function Invoke-Status {
    Test-Docker
    Write-Color "=== Container Status ===" "Cyan"
    docker compose ps
    Write-Host ""
    Write-Color "=== Access URLs ===" "Cyan"
    Write-Host "  Frontend:  " -NoNewline; Write-Color "http://localhost:3000" "Green"
    Write-Host "  Backend:   " -NoNewline; Write-Color "http://localhost:8000" "Green"
    Write-Host "  API Docs:  " -NoNewline; Write-Color "http://localhost:8000/docs" "Green"
    Write-Host "  Database:  " -NoNewline; Write-Color "localhost:5434 (user: postgres)" "Green"
}

function Invoke-Logs {
    Test-Docker
    if ($Service -eq "") {
        docker compose logs -f --tail=100
    }
    else {
        docker compose logs -f --tail=100 $Service
    }
}

function Invoke-Build {
    Write-Color "=== Building Temuin Images ===" "Cyan"
    Test-Docker
    Test-EnvFile
    docker compose build
    Write-Color "Build complete." "Green"
}

function Invoke-Pull {
    Write-Color "=== Pulling Temuin Images from Docker Hub ===" "Cyan"
    Test-Docker
    docker compose pull backend frontend
    Write-Color "Pull complete." "Green"
}

function Invoke-Migrate {
    Write-Color "=== Running Alembic Migrations ===" "Cyan"
    Test-Docker
    docker compose exec backend alembic upgrade head
    Write-Color "Migrations complete." "Green"
}

function Invoke-Seed {
    Write-Color "=== Seeding Database ===" "Cyan"
    Test-Docker

    $dbRunning = docker compose ps db 2>&1 | Select-String "running"
    if (-not $dbRunning) {
        Write-Color "Error: Database container is not running. Run '.\scripts\temuin.ps1 start' first." "Red"
        exit 1
    }

    Write-Host "Creating seed data..."
    $seedSQL = @"
        INSERT INTO categories (id, name) VALUES
            ('cat-elektronik', 'Elektronik'),
            ('cat-dokumen', 'Dokumen'),
            ('cat-aksesoris', 'Aksesoris'),
            ('cat-pakaian', 'Pakaian'),
            ('cat-lainnya', 'Lainnya')
        ON CONFLICT DO NOTHING;

        INSERT INTO buildings (id, name) VALUES
            ('bld-gkb', 'Gedung Kuliah Bersama'),
            ('bld-rek', 'Gedung Rektorat'),
            ('bld-lib', 'Perpustakaan'),
            ('bld-if', 'Gedung Teknik Informatika'),
            ('bld-kan', 'Kantin Pusat')
        ON CONFLICT DO NOTHING;
"@

    docker compose exec db psql -U postgres -d temuin_db -c $seedSQL 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Color "Note: Some seed data may already exist or tables not yet created." "Yellow"
    }

    Write-Color "Seed complete." "Green"
}

function Invoke-Help {
    Write-Color "============================================================" "Cyan"
    Write-Color "  Temuin - Docker Runner" "Cyan"
    Write-Color "============================================================" "Cyan"
    Write-Host ""
    Write-Host "Usage: " -NoNewline; Write-Color ".\scripts\temuin.ps1" "Green" -NoNewline; Write-Color " [command]" "Yellow"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  " -NoNewline; Write-Color "start" "Green" -NoNewline; Write-Host "              Start all containers"
    Write-Host "  " -NoNewline; Write-Color "stop" "Green" -NoNewline; Write-Host "               Stop all containers (data preserved)"
    Write-Host "  " -NoNewline; Write-Color "restart" "Green" -NoNewline; Write-Host "            Restart all containers"
    Write-Host "  " -NoNewline; Write-Color "reset" "Green" -NoNewline; Write-Host "              Full clean restart (DELETES database!)"
    Write-Host "  " -NoNewline; Write-Color "status" "Green" -NoNewline; Write-Host "             Show container status and URLs"
    Write-Host "  " -NoNewline; Write-Color "logs" "Green" -NoNewline; Write-Host " [service]     Tail logs (optional: db, backend, frontend)"
    Write-Host "  " -NoNewline; Write-Color "build" "Green" -NoNewline; Write-Host "              Build images locally"
    Write-Host "  " -NoNewline; Write-Color "pull" "Green" -NoNewline; Write-Host "               Pull images from Docker Hub"
    Write-Host "  " -NoNewline; Write-Color "migrate" "Green" -NoNewline; Write-Host "            Run Alembic database migrations"
    Write-Host "  " -NoNewline; Write-Color "seed" "Green" -NoNewline; Write-Host "               Seed database with initial data"
    Write-Host "  " -NoNewline; Write-Color "help" "Green" -NoNewline; Write-Host "               Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\scripts\temuin.ps1 start          # Start everything"
    Write-Host "  .\scripts\temuin.ps1 logs backend    # Tail backend logs"
    Write-Host "  .\scripts\temuin.ps1 seed            # Seed the database"
    Write-Host "  .\scripts\temuin.ps1 reset           # Nuke DB + pull latest + start fresh"
    Write-Host ""
}

# ============================================================
# Main
# ============================================================

switch ($Command.ToLower()) {
    "start"   { Invoke-Start }
    "stop"    { Invoke-Stop }
    "restart" { Invoke-Restart }
    "reset"   { Invoke-Reset }
    "status"  { Invoke-Status }
    "logs"    { Invoke-Logs }
    "build"   { Invoke-Build }
    "pull"    { Invoke-Pull }
    "migrate" { Invoke-Migrate }
    "seed"    { Invoke-Seed }
    "help"    { Invoke-Help }
    default {
        Write-Color "Unknown command: $Command" "Red"
        Write-Host ""
        Invoke-Help
        exit 1
    }
}
