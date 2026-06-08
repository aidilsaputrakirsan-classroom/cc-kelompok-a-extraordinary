#!/usr/bin/env bash
# ============================================================
# Temuin - Integration Smoke Test (Sprint 7, DO-7.8 / DEC-020)
# ============================================================
# Dijalankan terhadap gateway production (:8080). Mencakup:
#   - 3 health endpoint (auth, item, engagement)
#   - 1 login flow (register -> login, ambil token)
#   - 1 claim flow (GET /api/claims/ dengan token => 200)
#
# Exit non-zero kalau ada step gagal.
#
# Usage:
#   GATEWAY_URL=http://localhost:8080 ./scripts/integration-test.sh
# ============================================================
set -euo pipefail

GATEWAY_URL="${GATEWAY_URL:-http://localhost:8080}"
PASS=0
FAIL=0

# Email unik per-run agar register tidak bentrok dengan run sebelumnya.
TS="$(date +%s)"
TEST_EMAIL="smoketest_${TS}@itk.ac.id"
TEST_PASSWORD="SmokeTest123"
TEST_NAME="Smoke Test ${TS}"

log_pass() { echo "PASS: $1"; PASS=$((PASS + 1)); }
log_fail() { echo "FAIL: $1"; FAIL=$((FAIL + 1)); }

http_code() {
    # http_code <method> <url> [data]
    local method="$1" url="$2" data="${3:-}"
    if [[ -n "${data}" ]]; then
        curl -s -o /dev/null -w "%{http_code}" -X "${method}" \
            -H "Content-Type: application/json" -d "${data}" "${url}"
    else
        curl -s -o /dev/null -w "%{http_code}" -X "${method}" "${url}"
    fi
}

echo "=== Temuin integration smoke test against ${GATEWAY_URL} ==="

# ---- 1. Health endpoints ----
for svc in auth items engagement; do
    code="$(http_code GET "${GATEWAY_URL}/api/${svc}/health")"
    if [[ "${code}" == "200" ]]; then
        log_pass "health ${svc} (200)"
    else
        log_fail "health ${svc} (got ${code})"
    fi
done

# ---- 2. /api/status returns 3 services ----
status_json="$(curl -fsS "${GATEWAY_URL}/api/status" || echo '')"
count="$(printf '%s' "${status_json}" | grep -o '"name"' | wc -l | tr -d ' ')"
if [[ "${count}" == "3" ]]; then
    log_pass "/api/status lists 3 services"
else
    log_fail "/api/status expected 3 services, got '${count}' (body: ${status_json})"
fi

# ---- 3. Login flow: register then login ----
register_body="{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\",\"name\":\"${TEST_NAME}\"}"
reg_code="$(http_code POST "${GATEWAY_URL}/api/auth/register" "${register_body}")"
# 200/201 created, atau 400/409 kalau user sudah ada (run ulang) - dua-duanya berarti endpoint hidup.
if [[ "${reg_code}" =~ ^(200|201|400|409|422)$ ]]; then
    log_pass "register reachable (${reg_code})"
else
    log_fail "register (got ${reg_code})"
fi

login_body="{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\"}"
login_resp="$(curl -s -X POST -H "Content-Type: application/json" \
    -d "${login_body}" "${GATEWAY_URL}/api/auth/login" || echo '')"
TOKEN="$(printf '%s' "${login_resp}" \
    | grep -o '"access_token"[[:space:]]*:[[:space:]]*"[^"]*"' \
    | sed -E 's/.*"access_token"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/')"
if [[ -n "${TOKEN}" ]]; then
    log_pass "login returns access_token"
else
    log_fail "login did not return token (resp: ${login_resp})"
fi

# ---- 4. Claim flow: list own claims with token ----
# /api/claims/me boleh diakses user biasa (200, list kosong untuk user baru).
# /api/claims/ tanpa item_id hanya untuk admin (403), jadi bukan smoke target.
if [[ -n "${TOKEN}" ]]; then
    claim_code="$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer ${TOKEN}" "${GATEWAY_URL}/api/claims/me")"
    if [[ "${claim_code}" == "200" ]]; then
        log_pass "list own claims authorized (200)"
    else
        log_fail "list own claims (got ${claim_code})"
    fi
else
    log_fail "list own claims skipped (no token)"
fi

echo "=== Summary: ${PASS} passed, ${FAIL} failed ==="
[[ "${FAIL}" -eq 0 ]]
