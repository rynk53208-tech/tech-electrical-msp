#!/usr/bin/env bash
# ============================================================
# SSL Certificate Monitor
# Tracks expiry for a list of domains, prints a report, and
# saves JSON results to results/latest.json
# ============================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOMAINS_FILE="${SCRIPT_DIR}/domains.json"
RESULTS_DIR="${SCRIPT_DIR}/results"
REPORT_FILE="${RESULTS_DIR}/latest.json"
ALERT_DAYS_DEFAULT=30

# ── Colors ──────────────────────────────────────────────────
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Dependencies check ───────────────────────────────────────
for cmd in openssl jq date; do
  command -v "$cmd" &>/dev/null || { echo "ERROR: '$cmd' not found. Install it first."; exit 1; }
done

mkdir -p "$RESULTS_DIR"

# ── Parse domains from JSON ──────────────────────────────────
if [[ ! -f "$DOMAINS_FILE" ]]; then
  echo "ERROR: domains.json not found at $DOMAINS_FILE"
  exit 1
fi

DOMAINS=$(jq -c '.domains[]?' "$DOMAINS_FILE")

if [[ -z "$DOMAINS" ]]; then
  echo -e "${YELLOW}No domains configured. Add entries to domains.json${RESET}"
  exit 0
fi

# ── Check a single domain's SSL cert ────────────────────────
# Console output → stderr
# JSON output    → stdout (so caller can capture cleanly)
check_cert() {
  local domain="$1"
  local port="${2:-443}"
  local alert_days="${3:-$ALERT_DAYS_DEFAULT}"
  local label="${4:-$domain}"
  local expiry_raw expiry_epoch today_epoch days_left cert_status cert_color cert_icon cert_info cert_subject cert_issuer

  # Ensure numeric types
  port=$(( port + 0 ))
  alert_days=$(( alert_days + 0 ))

  # Fetch cert expiry date
  expiry_raw=$(echo | timeout 10 openssl s_client -servername "$domain" -connect "${domain}:${port}" 2>/dev/null \
    | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2) || true

  if [[ -z "$expiry_raw" ]]; then
    echo -e "  ${RED}✗ UNREACHABLE${RESET}  ${BOLD}${label}${RESET} (${domain}:${port})" >&2
    jq -n \
      --arg domain "$domain" \
      --arg label "$label" \
      --argjson port "$port" \
      --argjson alertDays "$alert_days" \
      '{"domain":$domain,"label":$label,"port":$port,"status":"unreachable","expiryDate":null,"daysLeft":null,"alertDays":$alertDays}'
    return
  fi

  # Parse dates (GNU vs BSD date)
  if date --version &>/dev/null 2>&1; then
    expiry_epoch=$(date -d "$expiry_raw" +%s 2>/dev/null) || expiry_epoch=0
  else
    expiry_epoch=$(date -j -f "%b %d %T %Y %Z" "$expiry_raw" +%s 2>/dev/null) || expiry_epoch=0
  fi

  today_epoch=$(date +%s)
  days_left=$(( (expiry_epoch - today_epoch) / 86400 ))

  # Grab subject and issuer (second connection)
  cert_info=$(echo | timeout 10 openssl s_client -servername "$domain" -connect "${domain}:${port}" 2>/dev/null \
    | openssl x509 -noout -subject -issuer 2>/dev/null) || cert_info=""
  cert_subject=$(echo "$cert_info" | grep "^subject" | sed 's/subject=//')
  cert_issuer=$(echo "$cert_info" | grep "^issuer" | sed 's/issuer=//')

  # Determine cert_status
  if [[ $days_left -le 0 ]]; then
    cert_status="EXPIRED"
    cert_color="$RED"
    cert_icon="✗"
  elif [[ $days_left -le $alert_days ]]; then
    cert_status="WARNING"
    cert_color="$YELLOW"
    cert_icon="⚠"
  else
    cert_status="OK"
    cert_color="$GREEN"
    cert_icon="✓"
  fi

  # Console line → stderr
  printf "  ${cert_color}${cert_icon} %-8s${RESET}  ${BOLD}%-30s${RESET} expires in ${cert_color}%4d days${RESET}  (%s)\n" \
    "$cert_status" "$label" "$days_left" "$expiry_raw" >&2

  # JSON → stdout
  jq -n \
    --arg domain "$domain" \
    --arg label "$label" \
    --argjson port "$port" \
    --arg cert_status "$cert_status" \
    --arg expiryDate "$expiry_raw" \
    --argjson daysLeft "$days_left" \
    --argjson alertDays "$alert_days" \
    --arg subject "$cert_subject" \
    --arg issuer "$cert_issuer" \
    '{"domain":$domain,"label":$label,"port":$port,"status":$cert_status,"expiryDate":$expiryDate,"daysLeft":$daysLeft,"alertDays":$alertDays,"subject":$subject,"issuer":$issuer}'
}

# ── Main loop ────────────────────────────────────────────────
echo "" >&2
echo -e "${CYAN}${BOLD}══════════════════════════════════════════════════${RESET}" >&2
echo -e "${CYAN}${BOLD}  SSL Certificate Monitor — $(date '+%Y-%m-%d %H:%M %Z')${RESET}" >&2
echo -e "${CYAN}${BOLD}══════════════════════════════════════════════════${RESET}" >&2
echo "" >&2

results_array="[]"
expired_count=0
warning_count=0
ok_count=0
unreachable_count=0

while IFS= read -r entry; do
  domain=$(echo "$entry" | jq -r '.domain')
  port=$(echo "$entry" | jq -r '.port // 443')
  alert_days=$(echo "$entry" | jq -r ".alertDays // $ALERT_DAYS_DEFAULT")
  label=$(echo "$entry" | jq -r '.label // .domain')

  result=$(check_cert "$domain" "$port" "$alert_days" "$label")
  status_val=$(echo "$result" | jq -r '.status')

  case "$status_val" in
    EXPIRED)     (( expired_count++ )) ;;
    WARNING)     (( warning_count++ )) ;;
    OK)          (( ok_count++ )) ;;
    unreachable) (( unreachable_count++ )) ;;
  esac

  results_array=$(echo "$results_array" | jq ". + [$result]")
done <<< "$DOMAINS"

# ── Summary ──────────────────────────────────────────────────
total=$((expired_count + warning_count + ok_count + unreachable_count))
echo "" >&2
echo -e "${CYAN}${BOLD}── Summary ────────────────────────────────────────${RESET}" >&2
echo -e "  Total checked:  ${BOLD}${total}${RESET}" >&2
echo -e "  ${GREEN}✓ OK:${RESET}           ${ok_count}" >&2
echo -e "  ${YELLOW}⚠ Warning:${RESET}      ${warning_count}" >&2
echo -e "  ${RED}✗ Expired:${RESET}      ${expired_count}" >&2
echo -e "  ${RED}✗ Unreachable:${RESET}  ${unreachable_count}" >&2
echo "" >&2

# ── Save JSON report ──────────────────────────────────────────
report=$(jq -n \
  --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --argjson results "$results_array" \
  --argjson total "$total" \
  --argjson ok "$ok_count" \
  --argjson warning "$warning_count" \
  --argjson expired "$expired_count" \
  --argjson unreachable "$unreachable_count" \
  '{
    "generatedAt": $timestamp,
    "summary": {"total":$total,"ok":$ok,"warning":$warning,"expired":$expired,"unreachable":$unreachable},
    "results": $results
  }')

echo "$report" > "$REPORT_FILE"

# Also save timestamped copy
ts=$(date -u +%Y%m%d-%H%M%S)
echo "$report" > "${RESULTS_DIR}/${ts}.json"

echo -e "  Report saved → ${RESULTS_DIR}/latest.json" >&2
echo "" >&2

# ── Exit codes: 0=all OK, 1=warnings, 2=expired ──────────────
if [[ $expired_count -gt 0 ]]; then
  exit 2
elif [[ $warning_count -gt 0 ]]; then
  exit 1
else
  exit 0
fi
