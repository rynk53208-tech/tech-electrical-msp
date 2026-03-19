# Barney's Tire Shop - Network Reconnaissance Plan

## Phase 1: Reconnaissance (Current Focus)

### Step 1: Passive Discovery (Non-Intrusive)
```bash
# 1.1 - Capture ARP cache from gateway/router (if accessible)
arp -a

# 1.2 - Check DHCP leases (usually on router/firewall)
# Access router web UI or: grep dhcp /var/lib/dhcp/dhcpd.leases

# 1.3 - Sniff network traffic (passive)
sudo tcpdump -i eth0 -n -c 100  # Capture 100 packets, analyze ARP/DHCP
sudo netdiscover -p  # Passive ARP scanning

# 1.4 - Check connected devices on managed switches
# Access switch via console/SSH, run: show mac address-table
```

### Step 2: Active Discovery (After Passive)
```bash
# 2.1 - Nmap quick scan of local subnet
sudo nmap -sn 192.168.1.0/24  # Ping sweep
# Replace with actual subnet

# 2.2 - Port scan discovered hosts
sudo nmap -sS -F 192.168.1.1-254  # Fast SYN scan

# 2.3 - Service version detection
sudo nmap -sV -p 1-1000 192.168.1.0/24

# 2.4 - OS fingerprinting
sudo nmap -O 192.168.1.0/24
```

### Step 3: Deep Enumeration
```bash
# 3.1 - Full port scan (all 65535 ports)
sudo nmap -p- -T4 192.168.1.0/24

# 3.2 - UDP scan (top 100 UDP ports)
sudo nmap -sU --top-ports 100 192.168.1.0/24

# 3.3 - Vulnerability scripts
sudo nmap --script vuln 192.168.1.0/24

# 3.4 - SMB enumeration (common in Windows environments)
sudo nmap -p 139,445 --script smb-enum-shares,smb-enum-users 192.168.1.0/24
```

### Step 4: Authentication & Domain Discovery
```bash
# 4.1 - Find domain controllers
nmap -p 88,389,636 --script krb5-enum-users,ldap-rootdse 192.168.1.0/24

# 4.2 - Check for LDAP
nmap -p 389 -sV --script ldap-search 192.168.1.0/24

# 4.3 - Find VPN endpoints
nmap -p 443,1723,500,4500 192.168.1.0/24
```

---

## Asset Inventory Template

| IP | Hostname | MAC | OS | Ports | Services | Risk Level | Notes |
|----|----------|-----|-----|-------|----------|------------|-------|
| 192.168.x.x | TBD | TBD | TBD | TBD | TBD | TBD | Discovered via scan |

---

## Risk Assessment Matrix

| Finding | Severity | Impact | Remediation | Priority |
|---------|----------|--------|-------------|----------|
| No firewall documentation | 🔴 Critical | Unknown exposure | Deploy new firewall, audit rules | P1 |
| No network diagram | 🟠 High | Can't troubleshoot | Create topology map | P1 |
| Unknown backup status | 🔴 Critical | Data loss risk | Verify backups, test restore | P1 |
| Default passwords | 🔴 Critical | Compromise risk | Change all credentials | P1 |
| No VLAN segmentation | 🟠 High | Lateral movement | Implement VLANs | P2 |
| Unpatched systems | 🟠 High | Exploit risk | Schedule patching | P2 |
| No monitoring | 🟡 Medium | No visibility | Deploy monitoring | P3 |

---

## Decision Framework: Repair vs Rebuild

### REBUILD if:
- >50% of servers need replacement
- Domain compromised or unmanageable
- No valid backups
- Malware suspected
- Hardware failures > $5000 to fix

### REPAIR if:
- <25% servers affected
- Good backups exist
- Hardware functional
- Time constraint (<1 week to restore)

### HYBRID approach (most likely):
- Keep working systems
- Rebuild critical servers (domain controller, file server)
- Deploy new firewall
- Implement monitoring incrementally

---

## Recommended Tool Stack for USB Deployment

### Linux (Kali on USB)
- nmap (network scanning)
- netdiscover (ARP scanning)
- Wireshark (packet capture)
-responder (LLMNR poisoning)
- enum4linux (SMB enumeration)
- ldapsearch (LDAP queries)
- hydra (password cracking)

### Windows (Portable)
- Angry IP Scanner
- Advanced Port Scanner
- SolarWinds Port Scanner
- Microsoft Network Monitor

---

## Next Actions

1. ☐ On-site with Kali laptop
2. ☐ Run passive discovery first
3. ☐ Document all findings in inventory
4. ☐ Deploy new firewall appliance
5. ☐ Test backups
6. ☐ Plan rebuild vs repair

---

*Generated: 2026-03-19 for Tech & Electrical Services LLC - Barney's Tire Shop MSP*
