#!/usr/bin/env bash
# =============================================================================
# MSP Disk Space Checker (Linux/macOS)
# Reports all mounted filesystems, warns on low space
# Usage: ./disk-space.sh [--warn PCT] [--critical PCT] [--csv FILE]
# =============================================================================

set -euo pipefail

WARN_PCT=20
CRIT_PCT=10
CSV_FILE=""
HOSTS=()

while [[ $# -gt 0 ]]; do
    case "$1" in
        --warn|-w)     WARN_PCT="$2";  shift 2 ;;
        --critical|-c) CRIT_PCT="$2";  shift 2 ;;
        --csv)         CSV_FILE="$2";  shift 2 ;;
        --host|-h)     HOSTS+=("$2");  shift 2 ;;
        --help)
            echo "Usage: $0 [--warn PCT] [--critical PCT] [--csv FILE] [--host user@host ...]"
            exit 0 ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

# Colors
RED='\033[0;31m'; YELLOW='\033[1;33m'; GREEN='\033[0;32m'
CYAN='\033[0;36m'; GRAY='\033[0;90m'; RESET='\033[0m'; BOLD='\033[1m'

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
CSV_LINES=()
WARN_COUNT=0
CRIT_COUNT=0

check_host() {
    local label="$1"
    local ssh_cmd="$2"   # empty for local

    echo ""
    echo -e "${CYAN}[*] Disk Space: $label${RESET}"
    echo -e "${BOLD}  $(printf '%-20s %8s %8s %8s %6s  %s' 'Filesystem' 'Total' 'Used' 'Free' 'Use%' 'Mount')${RESET}"
    echo "  $(printf '%0.s-' {1..75})"

    # Get df output
    local df_output
    if [[ -z "$ssh_cmd" ]]; then
        df_output=$(df -BG -x tmpfs -x devtmpfs -x squashfs 2>/dev/null || df -g 2>/dev/null || df -h)
    else
        df_output=$(ssh -o ConnectTimeout=5 -o BatchMode=yes "$ssh_cmd" \
            "df -BG -x tmpfs -x devtmpfs -x squashfs 2>/dev/null || df -h" 2>/dev/null)
    fi

    while IFS= read -r line; do
        # Skip header
        [[ "$line" =~ ^Filesystem ]] && continue
        [[ -z "$line" ]] && continue

        # Parse: filesystem size used avail pct mount
        read -r fs total used avail pct mount <<< "$line"

        # Strip 'G' suffix for numeric comparison
        pct_num="${pct/\%/}"
        [[ "$pct_num" =~ ^[0-9]+$ ]] || continue

        free_pct=$((100 - pct_num))
        status="OK"
        color="$GREEN"

        if [[ $free_pct -le $CRIT_PCT ]]; then
            status="CRITICAL"
            color="$RED"
            ((CRIT_COUNT++)) || true
        elif [[ $free_pct -le $WARN_PCT ]]; then
            status="WARNING"
            color="$YELLOW"
            ((WARN_COUNT++)) || true
        fi

        # Bar
        bar_width=20
        filled=$(( (pct_num * bar_width) / 100 ))
        bar=$(printf '%0.s#' $(seq 1 $((filled > 0 ? filled : 0))))
        bar+=$(printf '%0.s-' $(seq 1 $((bar_width - filled > 0 ? bar_width - filled : 0))))

        echo -e "  ${color}$(printf '%-20s %8s %8s %8s %5s%%  %-20s  [%s]  %s' \
            "${fs:0:19}" "$total" "$used" "$avail" "$pct_num" "${mount:0:19}" "$bar" "$status")${RESET}"

        # CSV
        CSV_LINES+=("$label,$fs,$total,$used,$avail,$pct_num,$free_pct,$mount,$status")

    done <<< "$(echo "$df_output" | tail -n +2)"
}

# Local check
check_host "$(hostname)" ""

# Remote checks via SSH
for host in "${HOSTS[@]}"; do
    check_host "$host" "$host"
done

# ── Inode check (Linux) ────────────────────────────────────
if df -i &>/dev/null 2>&1; then
    echo ""
    echo -e "${CYAN}[*] Inode Usage${RESET}"
    echo -e "${BOLD}  $(printf '%-20s %8s %8s %8s %6s  %s' 'Filesystem' 'INodes' 'Used' 'Free' 'Use%' 'Mount')${RESET}"
    echo "  $(printf '%0.s-' {1..75})"
    df -i -x tmpfs -x devtmpfs 2>/dev/null | tail -n +2 | while IFS= read -r line; do
        read -r fs total used avail pct mount <<< "$line"
        pct_num="${pct/\%/}"
        [[ "$pct_num" =~ ^[0-9]+$ ]] || continue
        color="$GREEN"
        [[ $pct_num -ge 90 ]] && color="$RED"
        [[ $pct_num -ge 75 && $pct_num -lt 90 ]] && color="$YELLOW"
        echo -e "  ${color}$(printf '%-20s %8s %8s %8s %5s%%  %s' "${fs:0:19}" "$total" "$used" "$avail" "$pct_num" "${mount:0:29}")${RESET}"
    done
fi

# ── Large directories ──────────────────────────────────────
echo ""
echo -e "${CYAN}[*] Largest Directories (top 10)${RESET}"
du -sh /* 2>/dev/null | sort -rh | head -10 | while IFS= read -r line; do
    echo "  $line"
done

# ── Summary ───────────────────────────────────────────────
echo ""
echo -e "${BOLD}--- SUMMARY ---${RESET}"
echo "  Warn threshold:     ${WARN_PCT}% free"
echo "  Critical threshold: ${CRIT_PCT}% free"

if [[ $CRIT_COUNT -gt 0 ]]; then
    echo -e "  ${RED}CRITICAL: $CRIT_COUNT filesystem(s) below ${CRIT_PCT}% free${RESET}"
fi
if [[ $WARN_COUNT -gt 0 ]]; then
    echo -e "  ${YELLOW}WARNING:  $WARN_COUNT filesystem(s) below ${WARN_PCT}% free${RESET}"
fi
if [[ $WARN_COUNT -eq 0 && $CRIT_COUNT -eq 0 ]]; then
    echo -e "  ${GREEN}All filesystems within normal thresholds. ✓${RESET}"
fi

# CSV export
if [[ -n "$CSV_FILE" ]]; then
    echo "Host,Filesystem,Total,Used,Available,UsePct,FreePct,Mount,Status" > "$CSV_FILE"
    printf '%s\n' "${CSV_LINES[@]}" >> "$CSV_FILE"
    echo ""
    echo "[+] CSV exported to: $CSV_FILE"
fi
