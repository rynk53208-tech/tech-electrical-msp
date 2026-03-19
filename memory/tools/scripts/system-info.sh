#!/usr/bin/env bash
# =============================================================================
# MSP System Info Gatherer (Linux/macOS)
# Collects: OS, hardware, CPU, RAM, disks, network, installed packages
# Usage: ./system-info.sh [--output /path/to/report.txt]
# =============================================================================

set -euo pipefail

OUTPUT_FILE=""
while [[ $# -gt 0 ]]; do
    case "$1" in
        --output|-o) OUTPUT_FILE="$2"; shift 2 ;;
        *) echo "Usage: $0 [--output FILE]"; exit 1 ;;
    esac
done

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
REPORT=()

sep()    { REPORT+=("$(printf '%0.s=' {1..60})"); }
header() { sep; REPORT+=("  $1"); sep; }
info()   { REPORT+=("$(printf '  %-30s %s' "$1:" "$2")"); }

REPORT+=("MSP SYSTEM INFORMATION REPORT")
REPORT+=("Generated : $TIMESTAMP")
REPORT+=("Collected : $(whoami)@$(hostname)")

# ── OS ────────────────────────────────────────────────────
header "OPERATING SYSTEM"
if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    info "OS Name"      "${PRETTY_NAME:-Unknown}"
    info "OS ID"        "${ID:-unknown}"
    info "Version"      "${VERSION_ID:-unknown}"
fi
info "Kernel"       "$(uname -r)"
info "Architecture" "$(uname -m)"
info "Hostname"     "$(hostname -f 2>/dev/null || hostname)"
info "Uptime"       "$(uptime -p 2>/dev/null || uptime)"
info "Last Boot"    "$(who -b 2>/dev/null | awk '{print $3, $4}' || uptime -s 2>/dev/null || echo 'N/A')"
info "Timezone"     "$(timedatectl show --property=Timezone --value 2>/dev/null || date +%Z)"

# ── Hardware ──────────────────────────────────────────────
header "HARDWARE"
if command -v dmidecode &>/dev/null && [[ $EUID -eq 0 ]]; then
    info "Manufacturer" "$(dmidecode -s system-manufacturer 2>/dev/null)"
    info "Model"        "$(dmidecode -s system-product-name 2>/dev/null)"
    info "Serial"       "$(dmidecode -s system-serial-number 2>/dev/null)"
    info "BIOS"         "$(dmidecode -s bios-version 2>/dev/null) ($(dmidecode -s bios-release-date 2>/dev/null))"
elif [[ -f /sys/class/dmi/id/sys_vendor ]]; then
    info "Manufacturer" "$(cat /sys/class/dmi/id/sys_vendor 2>/dev/null)"
    info "Model"        "$(cat /sys/class/dmi/id/product_name 2>/dev/null)"
    info "Serial"       "$(cat /sys/class/dmi/id/product_serial 2>/dev/null)"
else
    info "Hardware"     "Run as root with dmidecode for full hardware info"
fi

# ── CPU ───────────────────────────────────────────────────
header "PROCESSOR"
if [[ -f /proc/cpuinfo ]]; then
    CPU_MODEL=$(grep -m1 "model name" /proc/cpuinfo | cut -d: -f2 | xargs)
    CPU_CORES=$(grep -c "^processor" /proc/cpuinfo)
    CPU_THREADS=$(grep "siblings" /proc/cpuinfo | head -1 | awk '{print $3}')
    CPU_SOCKETS=$(grep "physical id" /proc/cpuinfo | sort -u | wc -l)
    info "Model"   "$CPU_MODEL"
    info "Sockets" "${CPU_SOCKETS:-1}"
    info "Cores"   "$CPU_CORES"
    info "Threads" "${CPU_THREADS:-$CPU_CORES}"
    # Load average
    info "Load Avg" "$(cat /proc/loadavg | awk '{print $1, $2, $3}') (1/5/15 min)"
fi

# ── Memory ────────────────────────────────────────────────
header "MEMORY"
if [[ -f /proc/meminfo ]]; then
    MEM_TOTAL=$(awk '/MemTotal/ {printf "%.1f GB", $2/1024/1024}' /proc/meminfo)
    MEM_FREE=$(awk '/MemAvailable/ {printf "%.1f GB", $2/1024/1024}' /proc/meminfo)
    MEM_USED=$(awk '/MemTotal/{t=$2} /MemAvailable/{a=$2} END{printf "%.1f GB", (t-a)/1024/1024}' /proc/meminfo)
    SWAP_TOTAL=$(awk '/SwapTotal/ {printf "%.1f GB", $2/1024/1024}' /proc/meminfo)
    SWAP_FREE=$(awk '/SwapFree/ {printf "%.1f GB", $2/1024/1024}' /proc/meminfo)
    info "Total RAM"   "$MEM_TOTAL"
    info "Used"        "$MEM_USED"
    info "Available"   "$MEM_FREE"
    info "Swap Total"  "$SWAP_TOTAL"
    info "Swap Free"   "$SWAP_FREE"
fi

# Physical DIMM info if available
if command -v dmidecode &>/dev/null && [[ $EUID -eq 0 ]]; then
    REPORT+=("")
    REPORT+=("  Memory Modules:")
    dmidecode -t 17 2>/dev/null | grep -E "^\s+(Size|Type:|Speed|Locator|Manufacturer|Serial)" | \
        grep -v "No Module" | sed 's/^\s*/    /' | while read -r line; do
        REPORT+=("$line")
    done
fi

# ── Disk ──────────────────────────────────────────────────
header "DISK VOLUMES"
df -h --output=target,size,used,avail,pcent,fstype 2>/dev/null | tail -n +2 | grep -v "^/dev/loop" | while IFS= read -r line; do
    REPORT+=("  $line")
done || df -h | tail -n +2 | while IFS= read -r line; do REPORT+=("  $line"); done

# Block devices
header "BLOCK DEVICES"
if command -v lsblk &>/dev/null; then
    while IFS= read -r line; do REPORT+=("  $line"); done < <(lsblk -o NAME,SIZE,TYPE,MOUNTPOINT,MODEL,SERIAL,VENDOR 2>/dev/null | head -30)
fi

# ── Network ───────────────────────────────────────────────
header "NETWORK INTERFACES"
if command -v ip &>/dev/null; then
    while IFS= read -r line; do REPORT+=("  $line"); done < <(ip -o addr show 2>/dev/null | \
        awk '{printf "  %-15s %-10s %s\n", $2, $3, $4}')
    REPORT+=("")
    info "Default Gateway" "$(ip route show default 2>/dev/null | awk '/default/{print $3; exit}' || echo 'N/A')"
elif command -v ifconfig &>/dev/null; then
    while IFS= read -r line; do REPORT+=("  $line"); done < <(ifconfig 2>/dev/null)
fi

header "DNS CONFIGURATION"
if [[ -f /etc/resolv.conf ]]; then
    grep "^nameserver\|^search\|^domain" /etc/resolv.conf | while IFS= read -r line; do
        REPORT+=("  $line")
    done
fi

# ── Firewall ──────────────────────────────────────────────
header "FIREWALL STATUS"
if command -v ufw &>/dev/null; then
    info "UFW Status" "$(ufw status 2>/dev/null | head -1)"
elif command -v firewall-cmd &>/dev/null; then
    info "firewalld" "$(firewall-cmd --state 2>/dev/null)"
fi
if command -v iptables &>/dev/null && [[ $EUID -eq 0 ]]; then
    RULE_COUNT=$(iptables -L 2>/dev/null | grep -c "^Chain" || echo 0)
    info "iptables chains" "$RULE_COUNT"
fi

# ── Services ──────────────────────────────────────────────
header "KEY SERVICES (systemd)"
if command -v systemctl &>/dev/null; then
    SERVICES=("sshd" "ssh" "cron" "crond" "rsyslog" "fail2ban" "ufw" "firewalld"
              "nginx" "apache2" "httpd" "mysql" "mariadb" "postgresql"
              "docker" "containerd" "snapd" "unattended-upgrades")
    REPORT+=("  $(printf '%-30s %-10s %s' 'Service' 'Enabled' 'Active')")
    REPORT+=("  $(printf '%0.s-' {1..55})")
    for svc in "${SERVICES[@]}"; do
        if systemctl list-unit-files "${svc}.service" &>/dev/null 2>&1; then
            ACTIVE=$(systemctl is-active "$svc" 2>/dev/null || echo "inactive")
            ENABLED=$(systemctl is-enabled "$svc" 2>/dev/null || echo "unknown")
            REPORT+=("  $(printf '%-30s %-10s %s' "$svc" "$ENABLED" "$ACTIVE")")
        fi
    done
fi

# ── Installed packages ────────────────────────────────────
header "PACKAGE MANAGER"
if command -v apt &>/dev/null; then
    PKG_COUNT=$(dpkg --list 2>/dev/null | grep "^ii" | wc -l)
    info "Package Manager" "apt/dpkg"
    info "Installed pkgs"  "$PKG_COUNT"
    PENDING=$(apt list --upgradable 2>/dev/null | grep -c "upgradable" || echo 0)
    info "Upgradable"      "$PENDING"
elif command -v rpm &>/dev/null; then
    PKG_COUNT=$(rpm -qa 2>/dev/null | wc -l)
    info "Package Manager" "rpm/yum/dnf"
    info "Installed pkgs"  "$PKG_COUNT"
elif command -v pacman &>/dev/null; then
    PKG_COUNT=$(pacman -Qq 2>/dev/null | wc -l)
    info "Package Manager" "pacman"
    info "Installed pkgs"  "$PKG_COUNT"
fi

# ── Last logins ───────────────────────────────────────────
header "RECENT LOGINS"
if command -v last &>/dev/null; then
    while IFS= read -r line; do REPORT+=("  $line"); done < <(last -n 10 -F 2>/dev/null | head -12 || last -n 10 | head -12)
fi

# ── Footer ────────────────────────────────────────────────
sep
REPORT+=("  END OF REPORT - $TIMESTAMP")
sep

# Output
printf '%s\n' "${REPORT[@]}"

if [[ -n "$OUTPUT_FILE" ]]; then
    printf '%s\n' "${REPORT[@]}" > "$OUTPUT_FILE"
    echo ""
    echo "[+] Report saved to: $OUTPUT_FILE"
fi
