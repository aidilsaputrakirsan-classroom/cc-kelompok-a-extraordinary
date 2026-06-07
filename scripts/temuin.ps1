# ============================================================
# Temuin - Microservices Docker Runner Script (PowerShell)
# ============================================================
# Usage: .\scripts\temuin.ps1 [command]
# Commands: start, stop, restart, reset, status, logs, pull,
#           seed, make-admin, help
# ============================================================

param(
    [Parameter(Position = 0)]
    [string]$Command = "help",

    [Parameter(Position = 1)]
    [string]$Service = ""
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
Set-Location $ProjectRoot

$ComposeArgs = @("--env-file", ".env", "-f", "infra/docker-compose.microservices.yml", "--progress", "quiet")
$ServiceAliases = @{
    "auth" = "auth-service"
    "item" = "item-service"
    "engagement" = "engagement-service"
    "frontend" = "frontend"
    "db" = "db"
}
$ContainerNames = @(
    "temuin-db",
    "temuin-auth",
    "temuin-item",
    "temuin-engagement",
    "temuin-frontend"
)

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

function Invoke-Compose {
    param([string[]]$ComposeCommand)
    docker compose @ComposeArgs @ComposeCommand
}

function Ensure-PostgresVolume {
    $volume = docker volume ls -q --filter "name=temuin_pgdata"
    if (-not $volume) {
        docker volume create temuin_pgdata | Out-Null
    }
}

function Remove-PostgresVolume {
    $volume = docker volume ls -q --filter "name=temuin_pgdata"
    if ($volume) {
        docker volume rm temuin_pgdata | Out-Null
    }
}

function Resolve-ServiceName {
    param([string]$Name)
    if ($ServiceAliases.ContainsKey($Name)) {
        return $ServiceAliases[$Name]
    }
    return $Name
}

function Test-Docker {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Color "Error: Docker is not installed or not in PATH" "Red"
        exit 1
    }
    docker compose version | Out-Null
}

function Test-EnvFile {
    if (-not (Test-Path ".env")) {
        Write-Color "Warning: .env file not found." "Yellow"
        Write-Host "Copying from .env.docker template..."
        Copy-Item ".env.docker" ".env"
        Write-Color ".env created from .env.docker" "Green"
        Write-Color "Microservices use DB_USER, DB_PASSWORD, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, and CORS_ORIGINS from .env." "Yellow"
    }
}

function Wait-Healthy {
    param([int]$TimeoutSeconds = 90)

    Write-Color "Waiting for services to become healthy..." "Yellow"
    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

    while ((Get-Date) -lt $deadline) {
        $states = @()
        foreach ($container in $ContainerNames) {
            $state = docker inspect --format "{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}" $container 2>$null
            if ($LASTEXITCODE -ne 0 -or -not $state) {
                $states += "missing"
            }
            else {
                $states += $state.Trim()
            }
        }

        if ($states -notcontains "missing" -and $states -notcontains "starting" -and $states -notcontains "unhealthy" -and $states -notcontains "exited") {
            Write-Color "All microservices are healthy." "Green"
            return
        }

        Start-Sleep -Seconds 2
    }

    Write-Color "Warning: services are not all healthy yet. Use '.\scripts\temuin.ps1 logs <service>' if this persists." "Yellow"
}

function Invoke-Start {
    Write-Color "=== Starting Temuin Microservices ===" "Cyan"
    Test-Docker
    Test-EnvFile
    docker compose down --remove-orphans 2>$null | Out-Null
    Ensure-PostgresVolume
    Invoke-Compose @("up", "-d")
    Wait-Healthy
    Write-Host ""
    Invoke-Status
}

function Invoke-Stop {
    Write-Color "=== Stopping Temuin Microservices ===" "Cyan"
    Test-Docker
    Invoke-Compose @("down")
    Write-Color "All microservices containers stopped." "Green"
}

function Invoke-Restart {
    Write-Color "=== Restarting Temuin Microservices ===" "Cyan"
    Invoke-Stop
    Write-Host ""
    Invoke-Start
}

function Invoke-Reset {
    Write-Color "=== Resetting Temuin Microservices (full clean restart) ===" "Red"
    Write-Color "WARNING: This will DELETE the shared Postgres volume and all local data!" "Yellow"
    Write-Color "A clean volume is required so auth_db, item_db, and engagement_db are created by infra/postgres-init/01-create-databases.sh." "Yellow"
    $confirm = Read-Host "Type 'yes' to confirm"
    if ($confirm -ne "yes") {
        Write-Color "Reset cancelled." "Yellow"
        return
    }
    Test-Docker
    Test-EnvFile
    Invoke-Compose @("down", "-v")
    Remove-PostgresVolume
    Ensure-PostgresVolume
    Invoke-Compose @("pull")
    Invoke-Compose @("up", "-d")
    Wait-Healthy
    Write-Host ""
    Invoke-Status
}

function Invoke-Status {
    Test-Docker
    Write-Color "=== Container Status (Microservices) ===" "Cyan"
    Invoke-Compose @("ps")
    Write-Host ""
    Write-Color "=== Access URLs ===" "Cyan"
    Write-Host "  Frontend:       " -NoNewline; Write-Color "http://localhost:3000" "Green"
    Write-Host "  Status API:     " -NoNewline; Write-Color "http://localhost:3000/api/status" "Green"
    Write-Host "  Auth Health:    " -NoNewline; Write-Color "http://localhost:8001/health" "Green"
    Write-Host "  Item Health:    " -NoNewline; Write-Color "http://localhost:8002/health" "Green"
    Write-Host "  Engagement:     " -NoNewline; Write-Color "http://localhost:8003/health" "Green"
    Write-Host "  Database:       " -NoNewline; Write-Color "internal temuin-db:5432 (auth_db, item_db, engagement_db)" "Green"
}

function Invoke-Logs {
    Test-Docker
    if ($Service -eq "") {
        Invoke-Compose @("logs", "-f", "--tail=100")
    }
    else {
        Invoke-Compose @("logs", "-f", "--tail=100", (Resolve-ServiceName $Service))
    }
}

function Invoke-Pull {
    Write-Color "=== Pulling Temuin Microservices Images from Docker Hub ===" "Cyan"
    Test-Docker
    Invoke-Compose @("pull")
    Write-Color "Pull complete." "Green"
}

function Invoke-Seed {
    Write-Color "=== Seeding Microservices Master Data ===" "Cyan"
    Test-Docker
    Invoke-Compose @("exec", "item-service", "python", "-m", "app.utils.seed")
    Write-Color "Seed complete." "Green"
}

function Invoke-MakeAdmin {
    Write-Color "=== Make User Admin (auth_db) ===" "Cyan"
    Test-Docker

    if ($Service -eq "") {
        Write-Color "Error: Email is required." "Red"
        Write-Host "Usage: .\scripts\temuin.ps1 make-admin user@student.itk.ac.id"
        exit 1
    }

    $email = $Service.Replace("'", "''")
    Write-Host "Setting role=admin for: $email"
    Invoke-Compose @("exec", "db", "psql", "-U", "postgres", "-d", "auth_db", "-c", "UPDATE users SET role = 'admin' WHERE email = '$email';")
    Write-Color "Done. $email is now admin if the user exists." "Green"
}

function Invoke-Help {
    Write-Color "============================================================" "Cyan"
    Write-Color "  Temuin - Microservices Docker Runner" "Cyan"
    Write-Color "============================================================" "Cyan"
    Write-Host ""
    Write-Host "Usage: " -NoNewline; Write-Color ".\scripts\temuin.ps1" "Green" -NoNewline; Write-Color " [command]" "Yellow"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  " -NoNewline; Write-Color "start" "Green" -NoNewline; Write-Host "              Start microservices stack"
    Write-Host "  " -NoNewline; Write-Color "stop" "Green" -NoNewline; Write-Host "               Stop microservices stack"
    Write-Host "  " -NoNewline; Write-Color "restart" "Green" -NoNewline; Write-Host "            Restart microservices stack"
    Write-Host "  " -NoNewline; Write-Color "reset" "Green" -NoNewline; Write-Host "              Full clean restart (DELETES database!)"
    Write-Host "  " -NoNewline; Write-Color "status" "Green" -NoNewline; Write-Host "             Show container status and URLs"
    Write-Host "  " -NoNewline; Write-Color "logs" "Green" -NoNewline; Write-Host " [service]     Tail logs (auth, item, engagement, frontend, db)"
    Write-Host "  " -NoNewline; Write-Color "pull" "Green" -NoNewline; Write-Host "               Pull microservices images"
    Write-Host "  " -NoNewline; Write-Color "seed" "Green" -NoNewline; Write-Host "               Seed item-service master data"
    Write-Host "  " -NoNewline; Write-Color "make-admin" "Green" -NoNewline; Write-Host " <email>  Promote user in auth_db"
    Write-Host "  " -NoNewline; Write-Color "help" "Green" -NoNewline; Write-Host "               Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\scripts\temuin.ps1 start"
    Write-Host "  .\scripts\temuin.ps1 status"
    Write-Host "  .\scripts\temuin.ps1 logs engagement"
    Write-Host "  .\scripts\temuin.ps1 make-admin nim@student.itk.ac.id"
    Write-Host ""
    Write-Host "Legacy monolith is still available manually via: docker compose up -d"
    Write-Host ""
}

switch ($Command.ToLower()) {
    "start" { Invoke-Start }
    "stop" { Invoke-Stop }
    "restart" { Invoke-Restart }
    "reset" { Invoke-Reset }
    "status" { Invoke-Status }
    "logs" { Invoke-Logs }
    "pull" { Invoke-Pull }
    "seed" { Invoke-Seed }
    "make-admin" { Invoke-MakeAdmin }
    "help" { Invoke-Help }
    default {
        Write-Color "Unknown command: $Command" "Red"
        Write-Host ""
        Invoke-Help
        exit 1
    }
}
