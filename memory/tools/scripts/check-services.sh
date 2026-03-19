#!/usr/bin/env bash
# =============================================================================
# MSP Service Status Monitor (Linux)
# Checks critical services, optionally restarts stopped ones
# Usage: ./check-services.sh [--restart] [--log FILE] [service1 service2 ...]
# =============================================================================

set -euo pipefail

AUTO_RESTART=false
LOG_FILE=""
CUSTOM_SERVICES=()

while [[ $# -gt 0 ]]; do
    case "$1" in
        --restart|-r) AUTO_RESTART=true; shift ;;
        --log|-l)     LOG_FILE="$2"; shift 2 ;;
        --help)
            echo "Usage: $0 [--restart] [--log FILE] [service1 service2 ...]"
            echo "  --restart  Attempt to restart stopped services (requires root)"
            echo "  --log FILE Append results to log file"
            exit 0 ;;
        -*) echo "Unknown option: $1"; exit 1 ;;
        *)  CUSTOM_SERVICES+=("$1"); shift ;;
    esac
done

# Default critical services for MSP Linux environments
DEFAULT_SERVICES=(
    # Core system
    "cron"
    "crond"
    "rsyslog"
    "syslog"
    "systemd-journald"
    "dbus"
    "NetworkManager"
    "networking"
    # Security
    "fail2ban"
    "ufw"
    "firewalld"
    "sshd"
    "ssh"
    # Web/App (check if installed)
    "nginx"
    "apache2"
    "httpd"
    # Database
    "mysql"
    "mariadb"
    "postgresql"
    "mongod"
    # Backup
    "bacula-fd"
    "veeam"
    "rsnapshot"
    # Monitoring
    "zabbix-agent"
    "zabbix-agent2"
    "telegraf"
    "node_exporter"
    "nessus"
    "ossec"
    # Container
    "docker"
    "containerd"
)

# Use custom list if provided, else default
if [[ ${#CUSTOM_SERVICES[@]} -gt 0 ]]; then
    SERVICES=("${CUSTOM_SERVICES[@]}")
else
    SERVICES=("${DEFAULT_SERVICES[@]}")
fi

# Colors
RED='\033[0;31m'; YELLOW='\033[1;33m'; GREEN='\033[0;32m'
CYAN='\033[0;36m'; GRAY='\033[0;90m'; RESET='\033[0m'; BOLD='\033[1m'

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
RUNNING=0; STOPPED=0; RESTARTED=0; ERRORS=0; SKIPPED=0

log_entry() {
    local level="$1"; local msg="$2"
    local entry="[$TIMESTAMP][$level] $msg"
    if [[ -n "$LOG_FILE" ]]; then
        echo "$entry" >> "$LOG_FILE"
    fi
}

check_systemd() {
    local svc="$1"
    # Check if unit exists
    if ! systemctl list-unit-files "${svc}.service" &>/dev/null 2>&1; then
        return 1  # not installed
    fi

    local active enabled status color action
    active=$(systemctl is-active "$svc" 2>/dev/null || echo "inactive")
    enabled=$(systemctl is-enabled "$svc" 2>/dev/null || echo "unknown")

    case "$active" in
        active)
            status="running"; color="$GREEN"; action="—"; ((RUNNING++)) || true ;;
        inactive|failed)
            if [[ "$enabled" == "disabled" || "$enabled" == "masked" ]]; then
                status="$active ($enabled)"; color="$GRAY"; action="disabled"; ((SKIPPED++)) || true
            elif $AUTO_RESTART && [[ $EUID -eq 0 ]]; then
                if systemctl restart "$svc" 2>/dev/null; then
                    sleep 1
                    active=$(systemctl is-active "$svc" 2>/dev/null || echo "inactive")
                    if [[ "$active" == "active" ]]; then
                        status="RESTARTED"; color="$YELLOW"; action="✓ RESTARTED"
                        ((RESTARTED++)) || true
                        log_entry "SUCCESS" "Service $svc restarted successfully"
                    else
                        status="RESTART FAILED"; color="$RED"; action="✗ FAILED"
                        ((ERRORS++)) || true
                        log_entry "ERROR" "Service $svc restart failed"
                    fi
                else
                    status="RESTART ERROR"; color="$RED"; action="✗ ERROR"
                    ((ERRORS++)) || true
                    log_entry "ERROR" "Service $svc could not be restarted"
                fi
            else
                status="STOPPED"; color="$RED"; action="⚠ STOPPED"
                ((STOPPED++)) || true
                log_entry "WARN" "Service $svc is stopped (enabled: $enabled)"
            fi ;;
        activating|deactivating)
            status="$active"; color="$YELLOW"; action="check manually"
            log_entry "WARN" "Service $svc is in transitional state: $active" ;;
        *)
            status="$active"; color="$YELLOW"; action="unknown state" ;;
    esac

    printf "${color}  %-35s %-10s %-10s %s${RESET}\n" \
        "${svc:0:34}" "$enabled" "$status" "$action"
    return 0
}

check_init_d() {
    local svc="$1"
    if [[ ! -f "/etc/init.d/$svc" ]]; then
        return 1
    fi
    local status
    if /etc/init.d/"$svc" status &>/dev/null 2>&1; then
        status="running"; ((RUNNING++)) || true
        printf "${GREEN}  %-35s %-10s %-10s %s${RESET}\n" "$svc" "init.d" "running" "—"
    else
        status="stopped"; ((STOPPED++)) || true
        printf "${RED}  %-35s %-10s %-10s %s${RESET}\n" "$svc" "init.d" "stopped" "⚠ STOPPED"
        log_entry "WARN" "init.d service $svc is stopped"
    fi
    return 0
}

echo ""
echo -e "${CYAN}MSP Service Monitor — $(hostname)${RESET}"
echo "Timestamp : $TIMESTAMP"
echo "Auto-restart: $AUTO_RESTART"
if [[ $AUTO_RESTART == true && $EUID -ne 0 ]]; then
    echo -e "${YELLOW}  Note: --restart requires root privileges${RESET}"
fi
echo ""
printf "${BOLD}  %-35s %-10s %-10s %s${RESET}\n" "Service" "Enabled" "Status" "Action"
echo "  $(printf '%0.s-' {1..70})"

for svc in "${SERVICES[@]}"; do
    # Try systemd first
    if command -v systemctl &>/dev/null; then
        check_systemd "$svc" && continue
    fi
    # Try init.d
    check_init_d "$svc" && continue
    # Not found — only show if custom list
    if [[ ${#CUSTOM_SERVICES[@]} -gt 0 ]]; then
        printf "${GRAY}  %-35s %-10s %-10s %s${RESET}\n" "$svc" "—" "not found" "not installed"
    fi
done

# ── Open Ports Summary ────────────────────────────────────
echo ""
echo -e "${CYAN}[*] Listening Services (network)${RESET}"
if command -v ss &>/dev/null; then
    echo -e "${BOLD}  $(printf '%-8s %-25s %-30s %s' Proto 'Local Address' 'Process' 'State')${RESET}"
    ss -tlnp 2>/dev/null | tail -n +2 | while IFS= read -r line; do
        echo "  $line"
    done | head -25
elif command -v netstat &>/dev/null; then
    netstat -tlnp 2>/dev/null | tail -n +2 | head -20 | while IFS= read -r line; do
        echo "  $line"
    done
fi

# ── Last restart events ───────────────────────────────────
if command -v journalctl &>/dev/null; then
    echo ""
    echo -e "${CYAN}[*] Recent Service Failures (last 24h)${RESET}"
    journalctl -p err --since="24 hours ago" --no-pager -q 2>/dev/null | \
        grep -i "failed\|error\|crash" | tail -10 | while IFS= read -r line; do
        echo -e "  ${YELLOW}$line${RESET}"
    done || echo "  None found."
fi

# ── Summary ───────────────────────────────────────────────
echo ""
echo -e "${BOLD}--- SUMMARY ---${RESET}"
echo -e "  ${GREEN}Running:    $RUNNING${RESET}"
[[ $RESTARTED -gt 0 ]] && echo -e "  ${YELLOW}Restarted:  $RESTARTED${RESET}"
[[ $STOPPED -gt 0 ]]   && echo -e "  ${RED}Stopped:    $STOPPED${RESET}"
[[ $ERRORS -gt 0 ]]    && echo -e "  ${RED}Errors:     $ERRORS${RESET}"
[[ $SKIPPED -gt 0 ]]   && echo -e "  ${GRAY}Skipped:    $SKIPPED (disabled/not installed)${RESET}"

ISSUES=$((STOPPED + ERRORS))
if [[ $ISSUES -gt 0 ]]; then
    echo -e "\n  ${RED}⚠ $ISSUES service(s) need attention!${RESET}"
else
    echo -e "\n  ${GREEN}✓ All critical services are healthy.${RESET}"
fi

[[ -n "$LOG_FILE" ]] && echo "" && echo "[+] Log appended to: $LOG_FILE"
