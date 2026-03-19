#!/usr/bin/env bash
# =============================================================================
# MSP Certificate Expiry Checker (Linux/macOS)
# Checks local cert files + live remote HTTPS/TLS endpoints
# Usage: ./check-certs.sh [--warn DAYS] [--critical DAYS] [--csv FILE] [host:port ...]
# =============================================================================

set -euo pipefail

WARN_DAYS=60
CRIT_DAYS=14
CSV_FILE=""
REMOTE_HOSTS=()
CERT_DIRS=("/etc/ssl/certs" "/etc/pki/tls/certs" "/etc/nginx/ssl" "/etc/apache2/ssl"
           "/etc/letsencrypt/live" "/etc/haproxy" "/etc/postfix" "/etc/dovecot/certs")

while [[ $# -gt 0 ]]; do
    case "$1" in
        --warn|-w)     WARN_DAYS="$2";  shift 2 ;;
        --critical|-c) CRIT_DAYS="$2";  shift 2 ;;
        --csv)         CSV_FILE="$2";   shift 2 ;;
        --dir|-d)      CERT_DIRS+=("$2"); shift 2 ;;
        --help)
            echo "Usage: $0 [--warn DAYS] [--critical DAYS] [--csv FILE] [--dir PATH] [host:port ...]"
            exit 0 ;;
        -*) echo "Unknown option: $1"; exit 1 ;;
        *)  REMOTE_HOSTS+=("$1"); shift ;;
    esac
done

# Colors
RED='\033[0;31m'; YELLOW='\033[1;33m'; GREEN='\033[0;32m'
CYAN='\033[0;36m'; GRAY='\033[0;90m'; RESET='\033[0m'; BOLD='\033[1m'

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
NOW_EPOCH=$(date +%s)
WARN_EPOCH=$((NOW_EPOCH + WARN_DAYS * 86400))
CRIT_EPOCH=$((NOW_EPOCH + CRIT_DAYS * 86400))

OK_COUNT=0; WARN_COUNT=0; CRIT_COUNT=0; EXPIRED_COUNT=0; ERROR_COUNT=0
CSV_LINES=()

cert_status() {
    local exp_epoch="$1"
    local days_left=$(( (exp_epoch - NOW_EPOCH) / 86400 ))
    if [[ $exp_epoch -lt $NOW_EPOCH ]]; then
        echo "EXPIRED|$days_left|$RED"
    elif [[ $exp_epoch -lt $CRIT_EPOCH ]]; then
        echo "CRITICAL|$days_left|$RED"
    elif [[ $exp_epoch -lt $WARN_EPOCH ]]; then
        echo "WARNING|$days_left|$YELLOW"
    else
        echo "OK|$days_left|$GREEN"
    fi
}

print_cert() {
    local source="$1" label="$2" cn="$3" issuer="$4" notafter="$5" exp_epoch="$6"
    IFS='|' read -r status days_left color <<< "$(cert_status "$exp_epoch")"

    local days_disp
    if [[ $days_left -lt 0 ]]; then
        days_disp="EXPIRED $(( -days_left ))d ago"
        ((EXPIRED_COUNT++)) || true
    else
        days_disp="${days_left}d"
        case "$status" in
            CRITICAL) ((CRIT_COUNT++)) || true ;;
            WARNING)  ((WARN_COUNT++)) || true ;;
            OK)       ((OK_COUNT++)) || true ;;
        esac
    fi

    # Truncate CN
    local cn_short="${cn:0:40}"

    printf "${color}  %-12s %-42s %-12s %-8s %s${RESET}\n" \
        "$source" "$cn_short" "$notafter" "$days_disp" "$status"

    CSV_LINES+=("$source,$label,$cn,$issuer,$notafter,$days_left,$status")
}

check_cert_file() {
    local file="$1"
    [[ -f "$file" ]] || return 0
    [[ "$file" =~ \.(crt|pem|cer|cert)$ ]] || return 0

    # Skip CA bundle / system certs that are huge
    local size
    size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null || echo 0)
    [[ $size -gt 102400 ]] && return 0  # skip files > 100KB

    # Parse with openssl
    local cn notafter exp_epoch issuer
    cn=$(openssl x509 -noout -subject -in "$file" 2>/dev/null | grep -oP '(?<=CN\s=\s)[^,/]+' | head -1 || true)
    cn="${cn:-$(basename "$file")}"
    issuer=$(openssl x509 -noout -issuer -in "$file" 2>/dev/null | grep -oP '(?<=CN\s=\s)[^,/]+' | head -1 || true)
    notafter=$(openssl x509 -noout -enddate -in "$file" 2>/dev/null | cut -d= -f2 || true)
    [[ -z "$notafter" ]] && return 0

    exp_epoch=$(date -d "$notafter" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "$notafter" +%s 2>/dev/null || true)
    [[ -z "$exp_epoch" ]] && return 0

    print_cert "LocalFile" "$file" "$cn" "${issuer:-unknown}" "$(date -d "@$exp_epoch" '+%Y-%m-%d' 2>/dev/null || date -r "$exp_epoch" '+%Y-%m-%d' 2>/dev/null)" "$exp_epoch"
}

check_remote() {
    local host_port="$1"
    local host="${host_port%%:*}"
    local port="${host_port##*:}"
    [[ "$port" == "$host" ]] && port=443

    local cn notafter exp_epoch issuer cert_info
    cert_info=$(echo "" | openssl s_client -connect "$host:$port" -servername "$host" \
        -verify_quiet -brief 2>/dev/null | openssl x509 -noout -subject -enddate -issuer 2>/dev/null || true)

    if [[ -z "$cert_info" ]]; then
        # Try without SNI
        cert_info=$(echo "" | openssl s_client -connect "$host:$port" \
            -verify_quiet 2>/dev/null | openssl x509 -noout -subject -enddate -issuer 2>/dev/null || true)
    fi

    if [[ -z "$cert_info" ]]; then
        printf "${RED}  %-12s %-42s %s${RESET}\n" "Remote" "$host:$port" "ERROR: Could not retrieve certificate"
        ((ERROR_COUNT++)) || true
        CSV_LINES+=("Remote,$host:$port,ERROR,N/A,N/A,-1,ERROR")
        return 0
    fi

    cn=$(echo "$cert_info" | grep "subject" | grep -oP '(?<=CN\s=\s)[^,/]+' | head -1 || true)
    cn="${cn:-$host}"
    issuer=$(echo "$cert_info" | grep "issuer" | grep -oP '(?<=CN\s=\s)[^,/]+' | head -1 || true)
    notafter=$(echo "$cert_info" | grep "notAfter" | cut -d= -f2 || true)
    [[ -z "$notafter" ]] && notafter=$(echo "$cert_info" | grep "enddate" | cut -d= -f2 || true)
    [[ -z "$notafter" ]] && { printf "${RED}  Remote %-45s %s${RESET}\n" "$host:$port" "ERROR: No expiry date"; ((ERROR_COUNT++)) || true; return 0; }

    exp_epoch=$(date -d "$notafter" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "$notafter" +%s 2>/dev/null || true)
    [[ -z "$exp_epoch" ]] && { ((ERROR_COUNT++)) || true; return 0; }

    print_cert "Remote" "$host:$port" "$cn" "${issuer:-unknown}" \
        "$(date -d "@$exp_epoch" '+%Y-%m-%d' 2>/dev/null || date -r "$exp_epoch" '+%Y-%m-%d' 2>/dev/null)" \
        "$exp_epoch"
}

# ── Main ──────────────────────────────────────────────────
echo ""
echo -e "${CYAN}MSP CERTIFICATE EXPIRY REPORT${RESET}"
echo "Timestamp   : $TIMESTAMP"
echo "Warn at     : $WARN_DAYS days"
echo "Critical at : $CRIT_DAYS days"
echo "$(printf '%0.s=' {1..70})"

printf "\n${BOLD}  %-12s %-42s %-12s %-8s %s${RESET}\n" "Source" "CN / Host" "Expires" "Days" "Status"
echo "  $(printf '%0.s-' {1..85})"

# Check local cert directories
echo ""
echo -e "${CYAN}[*] Local Certificate Files${RESET}"
found_any=false
for dir in "${CERT_DIRS[@]}"; do
    [[ -d "$dir" ]] || continue
    found_any=true
    # Handle letsencrypt structure (subdirs per domain)
    if [[ "$dir" =~ letsencrypt/live ]]; then
        find "$dir" -maxdepth 2 -name "cert.pem" -o -name "fullchain.pem" 2>/dev/null | while read -r f; do
            check_cert_file "$f"
        done
    else
        find "$dir" -maxdepth 2 -type f \( -name "*.crt" -o -name "*.pem" -o -name "*.cer" \) 2>/dev/null | head -50 | while read -r f; do
            check_cert_file "$f"
        done
    fi
done
if ! $found_any; then
    echo "  No standard certificate directories found."
fi

# Check remote hosts
if [[ ${#REMOTE_HOSTS[@]} -gt 0 ]]; then
    echo ""
    echo -e "${CYAN}[*] Remote TLS Certificate Checks${RESET}"
    if ! command -v openssl &>/dev/null; then
        echo -e "${RED}  [!] openssl not found — cannot check remote certificates${RESET}"
    else
        for host in "${REMOTE_HOSTS[@]}"; do
            check_remote "$host"
        done
    fi
fi

# ── Summary ───────────────────────────────────────────────
echo ""
echo -e "${BOLD}--- SUMMARY ---${RESET}"
[[ $EXPIRED_COUNT -gt 0 ]] && echo -e "  ${RED}EXPIRED:  $EXPIRED_COUNT${RESET}"
[[ $CRIT_COUNT -gt 0 ]]    && echo -e "  ${RED}CRITICAL: $CRIT_COUNT  (< $CRIT_DAYS days)${RESET}"
[[ $WARN_COUNT -gt 0 ]]    && echo -e "  ${YELLOW}WARNING:  $WARN_COUNT  (< $WARN_DAYS days)${RESET}"
[[ $OK_COUNT -gt 0 ]]      && echo -e "  ${GREEN}OK:       $OK_COUNT${RESET}"
[[ $ERROR_COUNT -gt 0 ]]   && echo -e "  ${RED}ERRORS:   $ERROR_COUNT (could not check)${RESET}"

URGENT=$((EXPIRED_COUNT + CRIT_COUNT))
if [[ $URGENT -gt 0 ]]; then
    echo -e "\n  ${RED}⚠ $URGENT certificate(s) need IMMEDIATE renewal!${RESET}"
elif [[ $WARN_COUNT -gt 0 ]]; then
    echo -e "\n  ${YELLOW}Plan $WARN_COUNT renewal(s) within $WARN_DAYS days.${RESET}"
elif [[ $OK_COUNT -gt 0 ]]; then
    echo -e "\n  ${GREEN}✓ All checked certificates are healthy.${RESET}"
else
    echo "  No certificates checked."
fi

# CSV
if [[ -n "$CSV_FILE" ]]; then
    echo "Source,Label,CN,Issuer,NotAfter,DaysLeft,Status" > "$CSV_FILE"
    printf '%s\n' "${CSV_LINES[@]}" >> "$CSV_FILE"
    echo ""
    echo "[+] CSV exported to: $CSV_FILE"
fi
