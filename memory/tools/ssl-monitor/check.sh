#!/bin/bash
# SSL Certificate Monitor — Backend Check Script
# Purpose: Real TLS certificate verification via openssl
# Usage: ./check.sh domain.com [port] [output-format]
#        ./check.sh domains.txt (reads list of domains from file)
# Output: JSON with cert details (expiry, issued, issuer, CA, daysLeft)

set -euo pipefail

# ====== CONFIG ======
PROG=$(basename "$0")
PORT=${2:-443}
FORMAT=${3:-json}  # json | csv | text
TIMEOUT=10
DRY_RUN=${DRY_RUN:-0}

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ====== USAGE ======
usage() {
    cat <<EOF
Usage: $PROG <domain|file> [port] [format]

Arguments:
  domain|file       Single domain (e.g., example.com) or path to file with list
  port              HTTPS port (default: 443)
  format            Output format: json | csv | text (default: json)

Examples:
  $PROG example.com
  $PROG example.com 8443 text
  $PROG /tmp/domains.txt json

Output (JSON):
  {
    "domain": "example.com",
    "port": 443,
    "status": "valid",           # valid | expired | warning | error
    "issued": "2023-01-15",
    "expiry": "2024-01-15",
    "daysLeft": 42,
    "issuer": "Let's Encrypt Authority X3",
    "ca": "Let's Encrypt",
    "serialNumber": "...",
    "fingerprint": "...",
    "checked": "2024-03-10T10:30:45Z",
    "error": null
  }

Output (CSV):
  domain,port,status,issued,expiry,daysLeft,issuer,ca,checked,error
  example.com,443,valid,2023-01-15,2024-01-15,42,Let's Encrypt Authority X3,Let's Encrypt,2024-03-10T10:30:45Z,

Environment:
  DRY_RUN=1         Print commands without executing (debug mode)

EOF
    exit 1
}

# ====== UTILITIES ======
log_info()  { echo -e "${BLUE}[INFO]${NC} $*" >&2; }
log_ok()    { echo -e "${GREEN}[OK]${NC} $*" >&2; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $*" >&2; }
log_err()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }

days_until() {
    local target_date="$1"
    local target_epoch=$(date -d "$target_date" +%s 2>/dev/null || date -jf "%Y-%m-%d" "$target_date" +%s 2>/dev/null || echo 0)
    local now_epoch=$(date +%s)
    local diff=$((target_epoch - now_epoch))
    echo $((diff / 86400))  # Convert to days
}

# ====== CERT CHECK ======
check_cert() {
    local domain="$1"
    local port="${2:-443}"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    # Cleanup
    domain="${domain#https://}"
    domain="${domain#http://}"
    domain="${domain%/*}"
    
    [[ -z "$domain" ]] && return 1
    
    log_info "Checking $domain:$port..."
    
    # Query certificate via openssl
    local cert_data
    cert_data=$(timeout "$TIMEOUT" openssl s_client -connect "$domain:$port" -showcerts </dev/null 2>/dev/null || echo "")
    
    if [[ -z "$cert_data" ]]; then
        # Return error response (JSON)
        cat <<EOF
{
  "domain": "$domain",
  "port": $port,
  "status": "error",
  "issued": null,
  "expiry": null,
  "daysLeft": null,
  "issuer": null,
  "ca": null,
  "serialNumber": null,
  "fingerprint": null,
  "checked": "$timestamp",
  "error": "Failed to connect or timeout"
}
EOF
        return 1
    fi
    
    # Extract cert details via openssl x509
    local cert_text
    cert_text=$(echo "$cert_data" | openssl x509 -noout -text 2>/dev/null || echo "")
    
    if [[ -z "$cert_text" ]]; then
        cat <<EOF
{
  "domain": "$domain",
  "port": $port,
  "status": "error",
  "issued": null,
  "expiry": null,
  "daysLeft": null,
  "issuer": null,
  "ca": null,
  "serialNumber": null,
  "fingerprint": null,
  "checked": "$timestamp",
  "error": "Failed to parse certificate"
}
EOF
        return 1
    fi
    
    # Parse fields
    local notBefore notAfter issuer subject serial fingerprint
    notBefore=$(echo "$cert_text" | grep "Not Before:" | sed 's/.*Not Before: //' | xargs)
    notAfter=$(echo "$cert_text" | grep "Not After:" | sed 's/.*Not After : //' | xargs)
    issuer=$(echo "$cert_text" | grep "Issuer:" | head -1 | sed 's/.*Issuer: //' | xargs)
    subject=$(echo "$cert_text" | grep "Subject:" | head -1 | sed 's/.*Subject: //' | xargs)
    serial=$(echo "$cert_text" | grep "Serial Number:" | sed 's/.*Serial Number //' | sed 's/ (0x.*//' | xargs)
    fingerprint=$(openssl x509 -noout -fingerprint -sha256 <<<"$cert_data" 2>/dev/null | sed 's/.*SHA256 Fingerprint=//' || echo "")
    
    # Convert dates to ISO format
    local issued_iso expiry_iso
    issued_iso=$(date -d "$notBefore" +"%Y-%m-%d" 2>/dev/null || date -jf "%b %d %T %Y %Z" "$notBefore" +"%Y-%m-%d" 2>/dev/null || echo "$notBefore")
    expiry_iso=$(date -d "$notAfter" +"%Y-%m-%d" 2>/dev/null || date -jf "%b %d %T %Y %Z" "$notAfter" +"%Y-%m-%d" 2>/dev/null || echo "$notAfter")
    
    # Calculate days left
    local days_left
    days_left=$(days_until "$expiry_iso") || days_left=999
    
    # Determine status
    local status="valid"
    if [[ $days_left -lt 0 ]]; then
        status="expired"
    elif [[ $days_left -le 7 ]]; then
        status="critical"
    elif [[ $days_left -le 30 ]]; then
        status="warning"
    fi
    
    # Extract CA from issuer string (heuristic)
    local ca="Unknown"
    if [[ "$issuer" =~ "Let" ]]; then ca="Let's Encrypt"; fi
    if [[ "$issuer" =~ "DigiCert" ]]; then ca="DigiCert"; fi
    if [[ "$issuer" =~ "Sectigo" ]]; then ca="Sectigo"; fi
    if [[ "$issuer" =~ "GlobalSign" ]]; then ca="GlobalSign"; fi
    if [[ "$issuer" =~ "Amazon" ]]; then ca="Amazon"; fi
    
    # Output JSON
    cat <<EOF
{
  "domain": "$domain",
  "port": $port,
  "status": "$status",
  "issued": "$issued_iso",
  "expiry": "$expiry_iso",
  "daysLeft": $days_left,
  "issuer": "$issuer",
  "ca": "$ca",
  "subject": "$subject",
  "serialNumber": "$serial",
  "fingerprint": "$fingerprint",
  "checked": "$timestamp",
  "error": null
}
EOF
}

# ====== MAIN ======
main() {
    [[ $# -lt 1 ]] && usage
    
    local input="$1"
    
    # Check if input is a file
    if [[ -f "$input" ]]; then
        log_info "Reading domains from $input..."
        local first=1
        echo "["
        while IFS= read -r line || [[ -n "$line" ]]; do
            line="${line%#*}"  # Strip comments
            line="${line%%*([[:space:]])}"  # Trim whitespace
            [[ -z "$line" ]] && continue
            
            if [[ $first -eq 0 ]]; then echo ","; fi
            check_cert "$line" "$PORT"
            first=0
        done < "$input"
        echo ""
        echo "]"
    else
        # Single domain
        check_cert "$input" "$PORT"
    fi
}

[[ -n "${1:-}" ]] && main "$@" || usage
