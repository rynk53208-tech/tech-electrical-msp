# ⚡ IPAM - IP Address Manager

Track IP allocations, subnets, DHCP ranges, and network inventory. JSON-backed, shell-based, zero-dependency (just `jq` + `python3`).

## Files

```
ipam/
├── ipam.sh              ← Main CLI tool
├── README.md            ← This file
├── data/
│   ├── networks.json    ← Networks, subnets, DHCP ranges
│   └── allocations.json ← IP allocations
└── examples/            ← Example usage scripts
```

## Requirements

```bash
apt install jq python3    # Debian/Ubuntu/Kali
```

## Quick Start

```bash
chmod +x ipam.sh

# List networks
./ipam.sh net list

# Add a network
./ipam.sh net add 10.0.0.0/24 "Office LAN"

# Allocate an IP
./ipam.sh alloc add 10.0.0.10 printer01
./ipam.sh alloc set 10.0.0.10 mac=aa:bb:cc:11:22:33
./ipam.sh alloc set 10.0.0.10 owner="IT Dept"

# Find next free IPs
./ipam.sh free net-001

# Full report
./ipam.sh report
```

## Commands

### Networks
```bash
./ipam.sh net list                        # List all networks
./ipam.sh net add <cidr> <name>           # Add network (auto-derives gateway .1)
./ipam.sh net show <id|name>              # Show network + allocations + DHCP
./ipam.sh net del <id>                    # Delete network
```

### Allocations
```bash
./ipam.sh alloc list [network_id]         # List all (or filter by network)
./ipam.sh alloc add <ip> <hostname>       # Add static allocation
./ipam.sh alloc del <ip|id>              # Remove allocation
./ipam.sh alloc find <query>             # Search by IP/hostname/MAC/owner
./ipam.sh alloc set <ip|id> key=value    # Update fields
```

Settable fields: `mac`, `owner`, `description`, `status`, `hostname`, `tags`

Status values: `active`, `reserved`, `inactive`, `decommissioned`

### DHCP
```bash
./ipam.sh dhcp list                                      # List ranges
./ipam.sh dhcp add <net_id> <start> <end> [name]         # Add range
./ipam.sh dhcp del <id>                                  # Remove range
./ipam.sh dhcp check <net_id>                            # Show usage
```

### Analysis
```bash
./ipam.sh free <network_id>      # Show next 20 free IPs
./ipam.sh scan <network_id>      # Ping-sweep + compare to IPAM (needs nmap)
./ipam.sh conflicts              # Find duplicate IPs/MACs
./ipam.sh report                 # Summary across all networks
```

## Data Format

### networks.json
```json
{
  "networks": [{
    "id": "net-001",
    "name": "Home LAN",
    "cidr": "192.168.1.0/24",
    "gateway": "192.168.1.1",
    "vlan": null,
    "dns": ["8.8.8.8"],
    "description": "Primary home network",
    "tags": ["home"],
    "created": "2026-03-19T00:00:00Z"
  }],
  "subnets": [],
  "dhcp_ranges": [{
    "id": "dhcp-001",
    "network_id": "net-001",
    "name": "Home DHCP Pool",
    "start": "192.168.1.100",
    "end": "192.168.1.200",
    "lease_time": "24h",
    "active": true
  }]
}
```

### allocations.json
```json
{
  "allocations": [{
    "id": "alloc-001",
    "ip": "192.168.1.100",
    "hostname": "home-server",
    "network_id": "net-001",
    "type": "static",
    "status": "active",
    "mac": "aa:bb:cc:dd:ee:ff",
    "owner": "Irvin",
    "description": "Primary home server",
    "tags": ["server"],
    "created": "2026-03-19T00:00:00Z",
    "updated": "2026-03-19T00:00:00Z"
  }]
}
```

## Tips

- `scan` requires `nmap` for best results: `apt install nmap`
- Auto-detects network for new allocations based on CIDR match
- JSON files are human-editable — version control friendly
- Pipe `report` output to a file for snapshots: `./ipam.sh report > snapshot-$(date +%F).txt`
- For MSP use: create one network per client site and tag accordingly
