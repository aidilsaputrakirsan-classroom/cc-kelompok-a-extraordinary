#!/usr/bin/env bash
# ============================================================
# Temuin - Observability Log Helper (Sprint 7, DO-7.4 / DEC-022)
# ============================================================
# Subcommands:
#   all              Tail -f log dari semua container microservices
#   errors           Tampilkan baris log level ERROR/CRITICAL
#   trace <id>       Grep correlation_id <id> di semua container
#   metrics          Curl /metrics tiap service via gateway :8080
#
# Usage:
#   ./scripts/logs.sh all
#   ./scripts/logs.sh errors
#   ./scripts/logs.sh trace a1b2c3d4e5f6
#   ./scripts/logs.sh metrics
# ============================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${PROJECT_ROOT}"

COMPOSE=(docker compose --env-file .env -f infra/docker-compose.microservices.yml)
SERVICES=(auth-service item-service engagement-service gateway)
GATEWAY_URL="http://localhost:8080"

usage() {
    grep -E '^#( |$)' "$0" | sed -E 's/^# ?//'
}

cmd_all() {
    "${COMPOSE[@]}" logs -f --tail=100
}

cmd_errors() {
    # JSON structured logs: level field "ERROR"/"CRITICAL". Plain logs: ERROR/CRITICAL token.
    "${COMPOSE[@]}" logs --tail=500 \
        | grep -E -i '"level"\s*:\s*"(error|critical)"|\b(ERROR|CRITICAL)\b' \
        || echo "No ERROR/CRITICAL lines found in the last 500 log lines."
}

cmd_trace() {
    local cid="${1:-}"
    if [[ -z "${cid}" ]]; then
        echo "Usage: $0 trace <correlation_id>" >&2
        exit 2
    fi
    echo "=== Tracing correlation_id=${cid} across services ==="
    for svc in "${SERVICES[@]}"; do
        echo "--- ${svc} ---"
        "${COMPOSE[@]}" logs --tail=2000 "${svc}" 2>/dev/null \
            | grep -F "${cid}" \
            || echo "(no match)"
    done
}

cmd_metrics() {
    echo "=== Prometheus metrics via gateway (${GATEWAY_URL}) ==="
    for path in auth items engagement; do
        echo "--- /api/${path}/metrics ---"
        curl -fsS "${GATEWAY_URL}/api/${path}/metrics" || echo "(unreachable)"
        echo
    done
}

main() {
    local sub="${1:-help}"
    shift || true
    case "${sub}" in
        all)     cmd_all ;;
        errors)  cmd_errors ;;
        trace)   cmd_trace "${1:-}" ;;
        metrics) cmd_metrics ;;
        help|-h|--help) usage ;;
        *) echo "Unknown subcommand: ${sub}" >&2; usage; exit 2 ;;
    esac
}

main "$@"
