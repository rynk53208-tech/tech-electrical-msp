#!/usr/bin/env bash
# ============================================================
# IPAM - IP Address Manager
# Track IPs, subnets, DHCP ranges, and allocations
# Usage: ipam.sh <command> [options]
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="$SCRIPT_DIR/data"
NETWORKS_FILE="$DATA_DIR/networks.json"
ALLOC_FILE="$DATA_DIR/allocations.json"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ---- Utilities ----

require_jq() {
  if ! command -v jq &>/dev/null; then
    echo -e "${RED}Error: 'jq' is required. Install it: apt install jq${RESET}" >&2
    exit 1
  fi
}

next_id() {
  local file="$1" key="$2"
  local max
  max=$(jq -r ".[\"$key\"][].id" "$file" 2>/dev/null | grep -oP '\d+$' | sort -n | tail -1)
  printf "%s-%03d" "${key%-*}" "$(( ${max:-0} + 1 ))"
}

ip_to_int() {
  local ip="$1"
  IFS='.' read -r a b c d <<< "$ip"
  echo $(( (a << 24) + (b << 16) + (c << 8) + d ))
}

ip_in_network() {
  local ip="$1" cidr="$2"
  local net="${cidr%/*}" prefix="${cidr#*/}"
  local mask=$(( 0xFFFFFFFF << (32 - prefix) & 0xFFFFFFFF ))
  local ip_int net_int
  ip_int=$(ip_to_int "$ip")
  net_int=$(ip_to_int "$net")
  (( (ip_int & mask) == (net_int & mask) ))
}

# ---- Help ----

show_help() {
  cat <<EOF
${BOLD}⚡ IPAM - IP Address Manager${RESET}

${CYAN}NETWORK COMMANDS${RESET}
  net list                     List all networks
  net add <cidr> <name>        Add a network
  net show <id|name>           Show network details + allocations
  net del <id>                 Remove a network

${CYAN}ALLOCATION COMMANDS${RESET}
  alloc list [network]         List allocations (optionally filter by network)
  alloc add <ip> <hostname>    Add a static allocation
  alloc del <ip|id>            Remove an allocation
  alloc find <ip|hostname|mac> Search allocations
  alloc set <ip|id> <key=val>  Update a field (owner, mac, description, status, tags)

${CYAN}DHCP COMMANDS${RESET}
  dhcp list                    List DHCP ranges
  dhcp add <net_id> <start> <end> [name]  Add a DHCP range
  dhcp del <id>                Remove a DHCP range
  dhcp check <network_id>      Show free/used IPs in DHCP range

${CYAN}SCAN / ANALYSIS${RESET}
  scan <network_id>            Ping-scan a network and report unknown IPs
  free <network_id>            Show next free IPs in network
  conflicts                    Find duplicate IP allocations
  report                       Summary report of all networks

${CYAN}EXAMPLES${RESET}
  ipam.sh net add 10.0.0.0/24 "Office LAN"
  ipam.sh alloc add 10.0.0.10 printer01
  ipam.sh alloc set 10.0.0.10 owner="IT Dept" mac=aa:bb:cc:11:22:33
  ipam.sh dhcp add net-001 192.168.1.100 192.168.1.200
  ipam.sh free net-001
EOF
}

# ---- Network Commands ----

net_list() {
  require_jq
  echo -e "${BOLD}${CYAN}Networks${RESET}"
  echo -e "${BOLD}$(printf '%-10s %-20s %-20s %-15s %-5s %s' ID NAME CIDR GATEWAY VLAN DESCRIPTION)${RESET}"
  echo "────────────────────────────────────────────────────────────────────────────────"
  jq -r '.networks[] | [.id, .name, .cidr, .gateway, (.vlan // "-"), (.description // "")] | @tsv' "$NETWORKS_FILE" \
    | awk -F'\t' '{ printf "%-10s %-20s %-20s %-15s %-5s %s\n", $1, $2, $3, $4, $5, $6 }'

  local total
  total=$(jq '.networks | length' "$NETWORKS_FILE")
  echo ""
  echo -e "${GREEN}$total network(s)${RESET}"
}

net_add() {
  require_jq
  local cidr="$1" name="$2"
  [[ -z "$cidr" || -z "$name" ]] && { echo "Usage: ipam net add <cidr> <name>"; exit 1; }

  # Extract gateway (assume .1)
  local net="${cidr%/*}"
  IFS='.' read -r a b c d <<< "$net"
  local gw="$a.$b.$c.1"

  local id
  id="net-$(jq '.networks | length + 1' "$NETWORKS_FILE" | xargs printf '%03d')"
  local ts
  ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  jq --arg id "$id" --arg name "$name" --arg cidr "$cidr" --arg gw "$gw" --arg ts "$ts" \
    '.networks += [{
      "id": $id, "name": $name, "cidr": $cidr, "gateway": $gw,
      "vlan": null, "dns": [], "description": "", "tags": [], "created": $ts
    }]' "$NETWORKS_FILE" > "$NETWORKS_FILE.tmp" && mv "$NETWORKS_FILE.tmp" "$NETWORKS_FILE"

  echo -e "${GREEN}✓ Added network $id: $name ($cidr)${RESET}"
}

net_show() {
  require_jq
  local query="$1"
  [[ -z "$query" ]] && { echo "Usage: ipam net show <id|name>"; exit 1; }

  local net
  net=$(jq --arg q "$query" '.networks[] | select(.id == $q or .name == $q)' "$NETWORKS_FILE")
  [[ -z "$net" ]] && { echo -e "${RED}Network not found: $query${RESET}"; exit 1; }

  local net_id cidr name gw
  net_id=$(echo "$net" | jq -r '.id')
  cidr=$(echo "$net" | jq -r '.cidr')
  name=$(echo "$net" | jq -r '.name')
  gw=$(echo "$net" | jq -r '.gateway')

  echo -e "${BOLD}${CYAN}Network: $name${RESET}"
  echo -e "  ID:      $net_id"
  echo -e "  CIDR:    $cidr"
  echo -e "  Gateway: $gw"
  echo ""
  echo -e "${BOLD}Allocations in $cidr:${RESET}"
  echo -e "${BOLD}$(printf '%-16s %-20s %-8s %-8s %-20s %s' IP HOSTNAME TYPE STATUS MAC OWNER)${RESET}"
  echo "─────────────────────────────────────────────────────────────────────────────"
  jq -r --arg nid "$net_id" \
    '.allocations[] | select(.network_id == $nid) | [.ip, (.hostname // "-"), .type, .status, (.mac // "-"), (.owner // "")] | @tsv' \
    "$ALLOC_FILE" \
    | sort -t. -k1,1n -k2,2n -k3,3n -k4,4n \
    | awk -F'\t' '{ printf "%-16s %-20s %-8s %-8s %-20s %s\n", $1, $2, $3, $4, $5, $6 }'

  # DHCP ranges
  echo ""
  echo -e "${BOLD}DHCP Ranges:${RESET}"
  jq -r --arg nid "$net_id" \
    '.dhcp_ranges[] | select(.network_id == $nid) | "  \(.name): \(.start) - \(.end) (lease: \(.lease_time))"' \
    "$NETWORKS_FILE"
}

net_del() {
  require_jq
  local id="$1"
  [[ -z "$id" ]] && { echo "Usage: ipam net del <id>"; exit 1; }

  local exists
  exists=$(jq --arg id "$id" '.networks[] | select(.id == $id) | .id' "$NETWORKS_FILE")
  [[ -z "$exists" ]] && { echo -e "${RED}Network not found: $id${RESET}"; exit 1; }

  jq --arg id "$id" '.networks = [.networks[] | select(.id != $id)]' "$NETWORKS_FILE" > "$NETWORKS_FILE.tmp" \
    && mv "$NETWORKS_FILE.tmp" "$NETWORKS_FILE"
  echo -e "${YELLOW}✓ Removed network $id${RESET}"
}

# ---- Allocation Commands ----

alloc_list() {
  require_jq
  local filter="$1"
  local query
  if [[ -n "$filter" ]]; then
    query="jq -r --arg f \"$filter\" '.allocations[] | select(.network_id == \$f or .ip | startswith(\$f))'"
  fi

  echo -e "${BOLD}${CYAN}Allocations${RESET}"
  echo -e "${BOLD}$(printf '%-16s %-20s %-10s %-8s %-8s %-20s %s' IP HOSTNAME NETWORK TYPE STATUS MAC OWNER)${RESET}"
  echo "──────────────────────────────────────────────────────────────────────────────────────"

  local jq_filter='.allocations[]'
  [[ -n "$filter" ]] && jq_filter=".allocations[] | select(.network_id == \"$filter\")"

  jq -r "$jq_filter | [.ip, (.hostname // \"-\"), (.network_id // \"-\"), .type, .status, (.mac // \"-\"), (.owner // \"\")] | @tsv" \
    "$ALLOC_FILE" \
    | sort -t. -k1,1n -k2,2n -k3,3n -k4,4n \
    | awk -F'\t' '{ printf "%-16s %-20s %-10s %-8s %-8s %-20s %s\n", $1, $2, $3, $4, $5, $6, $7 }'

  local total
  total=$(jq --argjson f "$(jq '.allocations | length' "$ALLOC_FILE")" 'null | $f' <<< "null")
  echo ""
  echo -e "${GREEN}$(jq '.allocations | length' "$ALLOC_FILE") allocation(s)${RESET}"
}

alloc_add() {
  require_jq
  local ip="$1" hostname="$2"
  [[ -z "$ip" || -z "$hostname" ]] && { echo "Usage: ipam alloc add <ip> <hostname>"; exit 1; }

  # Check duplicate
  local dup
  dup=$(jq -r --arg ip "$ip" '.allocations[] | select(.ip == $ip) | .id' "$ALLOC_FILE")
  [[ -n "$dup" ]] && { echo -e "${RED}IP $ip already allocated (id: $dup)${RESET}"; exit 1; }

  # Auto-detect network
  local net_id=""
  while IFS= read -r net_cidr_id; do
    local cidr id
    cidr="${net_cidr_id%%|*}"
    id="${net_cidr_id##*|}"
    if ip_in_network "$ip" "$cidr"; then
      net_id="$id"
      break
    fi
  done < <(jq -r '.networks[] | "\(.cidr)|\(.id)"' "$NETWORKS_FILE")

  local id
  id="alloc-$(jq '.allocations | length + 1' "$ALLOC_FILE" | xargs printf '%03d')"
  local ts
  ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  jq --arg id "$id" --arg ip "$ip" --arg host "$hostname" \
     --arg nid "${net_id:-unknown}" --arg ts "$ts" \
    '.allocations += [{
      "id": $id, "ip": $ip, "hostname": $host,
      "network_id": $nid, "type": "static", "status": "active",
      "mac": null, "owner": null, "description": null, "tags": [],
      "created": $ts, "updated": $ts
    }]' "$ALLOC_FILE" > "$ALLOC_FILE.tmp" && mv "$ALLOC_FILE.tmp" "$ALLOC_FILE"

  echo -e "${GREEN}✓ Allocated $ip → $hostname${RESET} (${net_id:-unknown})"
}

alloc_del() {
  require_jq
  local query="$1"
  [[ -z "$query" ]] && { echo "Usage: ipam alloc del <ip|id>"; exit 1; }

  local exists
  exists=$(jq -r --arg q "$query" '.allocations[] | select(.ip == $q or .id == $q) | .id' "$ALLOC_FILE")
  [[ -z "$exists" ]] && { echo -e "${RED}Not found: $query${RESET}"; exit 1; }

  jq --arg q "$query" '.allocations = [.allocations[] | select(.ip != $q and .id != $q)]' \
    "$ALLOC_FILE" > "$ALLOC_FILE.tmp" && mv "$ALLOC_FILE.tmp" "$ALLOC_FILE"
  echo -e "${YELLOW}✓ Removed allocation for $query${RESET}"
}

alloc_find() {
  require_jq
  local query="$1"
  [[ -z "$query" ]] && { echo "Usage: ipam alloc find <ip|hostname|mac>"; exit 1; }

  jq -r --arg q "$query" \
    '.allocations[] | select(
      .ip == $q or
      (.hostname // "" | ascii_downcase | contains($q | ascii_downcase)) or
      (.mac // "" | ascii_downcase) == ($q | ascii_downcase) or
      (.owner // "" | ascii_downcase | contains($q | ascii_downcase))
    ) | "\(.ip)\t\(.hostname // "-")\t\(.network_id)\t\(.type)\t\(.status)\t\(.mac // "-")\t\(.owner // "")"' \
    "$ALLOC_FILE" \
    | awk -F'\t' '{ printf "%-16s %-20s %-10s %-8s %-8s %-20s %s\n", $1, $2, $3, $4, $5, $6, $7 }'
}

alloc_set() {
  require_jq
  local query="$1" kv="$2"
  [[ -z "$query" || -z "$kv" ]] && { echo "Usage: ipam alloc set <ip|id> <key=value>"; exit 1; }

  local key="${kv%%=*}" val="${kv#*=}"
  local ts
  ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  local exists
  exists=$(jq -r --arg q "$query" '.allocations[] | select(.ip == $q or .id == $q) | .id' "$ALLOC_FILE")
  [[ -z "$exists" ]] && { echo -e "${RED}Not found: $query${RESET}"; exit 1; }

  jq --arg q "$query" --arg k "$key" --arg v "$val" --arg ts "$ts" \
    '(.allocations[] | select(.ip == $q or .id == $q)) |= . + {($k): $v, "updated": $ts}' \
    "$ALLOC_FILE" > "$ALLOC_FILE.tmp" && mv "$ALLOC_FILE.tmp" "$ALLOC_FILE"

  echo -e "${GREEN}✓ Updated $query: $key=$val${RESET}"
}

# ---- DHCP Commands ----

dhcp_list() {
  require_jq
  echo -e "${BOLD}${CYAN}DHCP Ranges${RESET}"
  echo -e "${BOLD}$(printf '%-10s %-10s %-25s %-16s %-16s %s' ID NETWORK NAME START END LEASE)${RESET}"
  echo "──────────────────────────────────────────────────────────────────────────────"
  jq -r '.dhcp_ranges[] | [.id, .network_id, .name, .start, .end, .lease_time] | @tsv' "$NETWORKS_FILE" \
    | awk -F'\t' '{ printf "%-10s %-10s %-25s %-16s %-16s %s\n", $1, $2, $3, $4, $5, $6 }'
}

dhcp_add() {
  require_jq
  local net_id="$1" start="$2" end="$3" name="${4:-DHCP Pool}"
  [[ -z "$net_id" || -z "$start" || -z "$end" ]] && {
    echo "Usage: ipam dhcp add <network_id> <start_ip> <end_ip> [name]"
    exit 1
  }

  local id
  id="dhcp-$(jq '.dhcp_ranges | length + 1' "$NETWORKS_FILE" | xargs printf '%03d')"

  jq --arg id "$id" --arg nid "$net_id" --arg s "$start" --arg e "$end" --arg n "$name" \
    '.dhcp_ranges += [{
      "id": $id, "network_id": $nid, "name": $n,
      "start": $s, "end": $e, "lease_time": "24h", "active": true
    }]' "$NETWORKS_FILE" > "$NETWORKS_FILE.tmp" && mv "$NETWORKS_FILE.tmp" "$NETWORKS_FILE"

  echo -e "${GREEN}✓ Added DHCP range $id: $start - $end ($net_id)${RESET}"
}

dhcp_del() {
  require_jq
  local id="$1"
  jq --arg id "$id" '.dhcp_ranges = [.dhcp_ranges[] | select(.id != $id)]' \
    "$NETWORKS_FILE" > "$NETWORKS_FILE.tmp" && mv "$NETWORKS_FILE.tmp" "$NETWORKS_FILE"
  echo -e "${YELLOW}✓ Removed DHCP range $id${RESET}"
}

dhcp_check() {
  require_jq
  local net_id="$1"
  [[ -z "$net_id" ]] && { echo "Usage: ipam dhcp check <network_id>"; exit 1; }

  echo -e "${BOLD}DHCP usage for $net_id:${RESET}"
  jq -r --arg nid "$net_id" \
    '.dhcp_ranges[] | select(.network_id == $nid) | "Range: \(.start) - \(.end)"' \
    "$NETWORKS_FILE"

  local allocated
  allocated=$(jq -r --arg nid "$net_id" \
    '[.allocations[] | select(.network_id == $nid and .type == "dhcp") | .ip] | length' \
    "$ALLOC_FILE")
  echo "DHCP-allocated entries: $allocated"
}

# ---- Scan / Analysis ----

free_ips() {
  require_jq
  local net_id="$1"
  [[ -z "$net_id" ]] && { echo "Usage: ipam free <network_id>"; exit 1; }

  local cidr
  cidr=$(jq -r --arg id "$net_id" '.networks[] | select(.id == $id) | .cidr' "$NETWORKS_FILE")
  [[ -z "$cidr" ]] && { echo -e "${RED}Network not found: $net_id${RESET}"; exit 1; }

  # Get allocated IPs
  local allocated
  allocated=$(jq -r --arg nid "$net_id" '[.allocations[] | select(.network_id == $nid) | .ip]' "$ALLOC_FILE")

  echo -e "${BOLD}Free IPs in $cidr (next 20):${RESET}"

  # Use Python for IP math (more reliable than bash)
  python3 - "$cidr" "$allocated" <<'PYEOF'
import sys, json, ipaddress

cidr = sys.argv[1]
taken = set(json.loads(sys.argv[2]))
network = ipaddress.ip_network(cidr, strict=False)

count = 0
for ip in network.hosts():
    s = str(ip)
    if s not in taken:
        print(f"  {s}")
        count += 1
        if count >= 20:
            break

print(f"\n  ... {network.num_addresses - 2} total hosts in network")
PYEOF
}

scan_network() {
  require_jq
  local net_id="$1"
  [[ -z "$net_id" ]] && { echo "Usage: ipam scan <network_id>"; exit 1; }

  local cidr
  cidr=$(jq -r --arg id "$net_id" '.networks[] | select(.id == $id) | .cidr' "$NETWORKS_FILE")
  [[ -z "$cidr" ]] && { echo -e "${RED}Network not found: $net_id${RESET}"; exit 1; }

  echo -e "${BOLD}${CYAN}Scanning $cidr (ping sweep)...${RESET}"
  echo -e "${YELLOW}Note: May require sudo for some systems${RESET}"
  echo ""

  local found=0
  local unknown=0
  local allocated
  allocated=$(jq -r --arg nid "$net_id" '[.allocations[] | select(.network_id == $nid) | .ip] | @csv' "$ALLOC_FILE" | tr -d '"')

  # Use nmap if available, fallback to ping
  if command -v nmap &>/dev/null; then
    echo -e "${BOLD}$(printf '%-16s %-8s %-20s %s' IP STATUS HOSTNAME KNOWN)${RESET}"
    echo "─────────────────────────────────────────────────────"
    nmap -sn -T4 "$cidr" 2>/dev/null | grep -E "^Nmap scan report|Host is up" | paste - - | \
      sed 's/Nmap scan report for //' | sed 's/ Host is up.*//' | while read -r ip; do
        ip=$(echo "$ip" | awk '{print $1}')
        known=""
        hostname=$(jq -r --arg ip "$ip" '.allocations[] | select(.ip == $ip) | .hostname' "$ALLOC_FILE" 2>/dev/null)
        if [[ -n "$hostname" ]]; then
          known="${GREEN}✓ $hostname${RESET}"
        else
          known="${RED}⚠ UNKNOWN${RESET}"
          unknown=$((unknown + 1))
        fi
        printf "%-16s %-8s %b\n" "$ip" "UP" "$known"
        found=$((found + 1))
      done
    echo ""
    echo -e "${GREEN}Found: $found hosts${RESET}"
    [[ $unknown -gt 0 ]] && echo -e "${RED}Unknown: $unknown (not in IPAM)${RESET}"
  else
    echo "nmap not found. Install with: apt install nmap"
    echo "Falling back to basic ping test for first few IPs..."
    python3 - "$cidr" <<'PYEOF'
import subprocess, sys, ipaddress
net = ipaddress.ip_network(sys.argv[1], strict=False)
for ip in list(net.hosts())[:10]:
    result = subprocess.run(['ping', '-c', '1', '-W', '1', str(ip)],
                           capture_output=True, timeout=2)
    status = "UP" if result.returncode == 0 else "down"
    print(f"  {str(ip):<16} {status}")
PYEOF
  fi
}

check_conflicts() {
  require_jq
  echo -e "${BOLD}${CYAN}Checking for conflicts...${RESET}"

  # Duplicate IPs
  local dups
  dups=$(jq -r '[.allocations[].ip] | group_by(.) | map(select(length > 1)) | .[] | .[0]' "$ALLOC_FILE")
  if [[ -n "$dups" ]]; then
    echo -e "${RED}Duplicate IPs found:${RESET}"
    echo "$dups" | while read -r ip; do
      echo -e "  ${RED}$ip${RESET}"
      jq -r --arg ip "$ip" '.allocations[] | select(.ip == $ip) | "    \(.id) - \(.hostname // "?")"' "$ALLOC_FILE"
    done
  else
    echo -e "${GREEN}✓ No duplicate IPs${RESET}"
  fi

  # Duplicate MACs
  local mac_dups
  mac_dups=$(jq -r '[.allocations[] | select(.mac != null) | .mac] | group_by(.) | map(select(length > 1)) | .[] | .[0]' "$ALLOC_FILE")
  if [[ -n "$mac_dups" ]]; then
    echo -e "${RED}Duplicate MACs found:${RESET}"
    echo "$mac_dups" | while read -r mac; do
      echo -e "  ${RED}$mac${RESET}"
      jq -r --arg m "$mac" '.allocations[] | select(.mac == $m) | "    \(.id) - \(.ip) \(.hostname // "?")"' "$ALLOC_FILE"
    done
  else
    echo -e "${GREEN}✓ No duplicate MACs${RESET}"
  fi
}

report() {
  require_jq
  echo -e "${BOLD}${CYAN}════ IPAM Summary Report ════${RESET}"
  echo ""

  local net_count alloc_count dhcp_count
  net_count=$(jq '.networks | length' "$NETWORKS_FILE")
  alloc_count=$(jq '.allocations | length' "$ALLOC_FILE")
  dhcp_count=$(jq '.dhcp_ranges | length' "$NETWORKS_FILE")

  echo -e "  Networks:    ${BOLD}$net_count${RESET}"
  echo -e "  Allocations: ${BOLD}$alloc_count${RESET}"
  echo -e "  DHCP Ranges: ${BOLD}$dhcp_count${RESET}"
  echo ""

  echo -e "${BOLD}Per-Network Breakdown:${RESET}"
  jq -r '.networks[] | "\(.id)|\(.name)|\(.cidr)"' "$NETWORKS_FILE" | while IFS='|' read -r id name cidr; do
    local count
    count=$(jq --arg id "$id" '[.allocations[] | select(.network_id == $id)] | length' "$ALLOC_FILE")
    echo -e "  ${CYAN}$name${RESET} ($cidr)"
    echo -e "    Allocations: $count"

    # Usage percentage using python
    python3 - "$cidr" "$count" <<'PYEOF'
import sys, ipaddress
cidr, used = sys.argv[1], int(sys.argv[2])
net = ipaddress.ip_network(cidr, strict=False)
total = net.num_addresses - 2
pct = (used / total * 100) if total > 0 else 0
bar_len = 20
filled = int(bar_len * pct / 100)
bar = '█' * filled + '░' * (bar_len - filled)
print(f"    Usage:  [{bar}] {pct:.1f}% ({used}/{total})")
PYEOF
  done

  echo ""
  echo -e "${BOLD}Allocation Status Breakdown:${RESET}"
  jq -r '[.allocations[].status] | group_by(.) | map("\(.[0]): \(length)") | .[]' "$ALLOC_FILE" \
    | while read -r line; do echo "  $line"; done

  echo ""
  echo -e "${BOLD}Type Breakdown:${RESET}"
  jq -r '[.allocations[].type] | group_by(.) | map("\(.[0]): \(length)") | .[]' "$ALLOC_FILE" \
    | while read -r line; do echo "  $line"; done
}

# ---- Router ----

main() {
  [[ $# -eq 0 ]] && { show_help; exit 0; }

  case "$1" in
    net)
      case "$2" in
        list)   net_list ;;
        add)    net_add "$3" "$4" ;;
        show)   net_show "$3" ;;
        del)    net_del "$3" ;;
        *)      echo "Unknown net command: $2"; show_help ;;
      esac ;;
    alloc)
      case "$2" in
        list)   alloc_list "$3" ;;
        add)    alloc_add "$3" "$4" ;;
        del)    alloc_del "$3" ;;
        find)   alloc_find "$3" ;;
        set)    alloc_set "$3" "$4" ;;
        *)      echo "Unknown alloc command: $2"; show_help ;;
      esac ;;
    dhcp)
      case "$2" in
        list)   dhcp_list ;;
        add)    dhcp_add "$3" "$4" "$5" "$6" ;;
        del)    dhcp_del "$3" ;;
        check)  dhcp_check "$3" ;;
        *)      echo "Unknown dhcp command: $2"; show_help ;;
      esac ;;
    scan)       scan_network "$2" ;;
    free)       free_ips "$2" ;;
    conflicts)  check_conflicts ;;
    report)     report ;;
    help|--help|-h) show_help ;;
    *)          echo -e "${RED}Unknown command: $1${RESET}"; show_help; exit 1 ;;
  esac
}

main "$@"
