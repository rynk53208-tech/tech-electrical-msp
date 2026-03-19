# Network Design Guide for Small Office / SMB

**Purpose:** Practical reference for designing and securing small business networks.  
**Audience:** TechSupport delivering network solutions to SMB clients.  
**Author:** Axiom (TechSupport for Irvin's Tech)

---

## 1. Small Office Network Setup

### Typical Architecture

```
Internet
   │
   ▼
[Modem/ONT] ──► [Firewall/UTM] ──► [Core Switch] ──► [Access Points]
   │                                    │                 │
   │                              [VLANs]            [PoE Devices]
   │                                    │
                              ┌────────┴────────┐
                           [Wired]           [WiFi]
                         (Workstations)    (Devices)
```

### Key Components

| Layer | Function | Examples |
|-------|----------|----------|
| **Edge** | Internet connection, first line of defense | ISP modem, firewall |
| **Core/Distribution** | Traffic routing, VLANs, PoE | Managed switch |
| **Access** | Device connectivity | APs, wall jacks |
| **Wireless** | WiFi coverage | Access points |

### Recommended Subnet Scheme (Simple)

- **Corporate VLAN (10):** 10.0.10.0/24 — workstations, servers
- **Guest VLAN (20):** 10.0.20.0/24 — isolated, internet-only
- **IoT/VoIP VLAN (30):** 10.0.30.0/24 — phones, cameras, smart devices
- **Management VLAN (99):** 10.0.99.0/24 — network gear only

> **Pro tip:** Always separate guest and corporate traffic. Never let visitors on the same network as your clients' data.

---

## 2. SMB Best Practices

### Network Design

1. **Use VLANs from day one** — Even a 5-user office benefits from segmentation. Adds minimal complexity, huge security upside.
2. **Redundancy matters** — Dual ISP for critical businesses. If client's revenue depends on connectivity, second WAN is cheap insurance.
3. **Centralize DHCP** — Let the firewall or core switch handle it, not random consumer gear.
4. **Document everything** — IP scheme, cable runs, device inventory. Future you will thank present you.
5. **Use static IPs sparingly** — Servers, printers, network gear only. Everything else DHCP.

### WiFi Best Practices

- **SSIDs:** Minimize. Corp + Guest is plenty. Don't broadcast more than needed.
- **WPA3 or WPA2-Enterprise** — If you can do RADIUS, do it. Otherwise WPA2-PSK with strong passphrase.
- **Channel planning** — 2.4GHz overlaps badly. Use 1, 6, 11. 5GHz more options, less congestion.
- **Power tuning** — Don't max AP transmit power. Let devices roam to closer APs.

### Cabling

- **Go wired for stationary devices** — Desktops, servers, printers, APs. WiFi is convenience, not reliability.
- **Use proper cable grades** — Cat6 minimum. Cat6a for PoE runs > 50ft or future-proofing.
- **Label everything** — Both ends. You'll thank yourself later.

---

## 3. Equipment Recommendations

### Budget Tier (Small Office < 10 users)

| Function | Recommendation | Approx Cost |
|----------|----------------|-------------|
| Firewall | UniFi Dream Machine SE / USG | $150-200 |
| Switch | UniFi US-8 or TP-Link TL-SG1008D (unmanaged, no VLAN) | $50-80 |
| WiFi | UniFi AC Lite (1-2 units) | $80-150 |
| **Total** | | **$280-430** |

### Mid-Tier (10-30 users, business-class)

| Function | Recommendation | Approx Cost |
|----------|----------------|-------------|
| Firewall | FortiGate 40F / UniFi Dream Machine Pro | $300-500 |
| Switch | UniFi US-24 or HP Aruba 2930F (managed, PoE+) | $250-400 |
| WiFi | UniFi AC Pro or UniFi 6 Long-Range (3-5 units) | $200-400 |
| **Total** | | **$750-1300** |

### Pro Tier (30+ users, MSSP-ready)

| Function | Recommendation | Approx Cost |
|----------|----------------|-------------|
| Firewall | FortiGate 60F/100F, Palo Alto PA-125 | $800-2000+ |
| Switch | Cisco Meraki MS120 / Ubiquiti US-48 | $500-1500 |
| WiFi | Cisco Meraki MR46 / UniFi 6 Enterprise | $400-800 per AP |
| RADIUS | Windows NPS or FreeRADIUS on Linux VM | Free |
| **Total** | | **$2000-5000+** |

### Power over Ethernet (PoE) Notes

- **PoE+ (802.3at):** 30W per port — phones, cameras, some APs
- **PoE++ (802.3bt):** 60-90W per port — high-power APs, laptops (rare)
- If you need lots of PoE devices (cameras, phones), budget for PoE switch from the start

### ISP Recommendations

- **Fiber preferred** — Symmetric upload/download, reliable
- **Cable as backup** — Asymmetric is fine for most, but not for hosting
- **Avoid DSL** — Unless nothing else exists. Latency kills VoIP.

---

## 4. Security Considerations

### Edge Security

- **Firewall is non-negotiable** — Consumer routers don't count. Get a real UTM/firewall.
- **Default deny all inbound** — Only open ports you explicitly need.
- **Update firmware** — Set calendar reminders. Vulnerabilities in network gear are common.
- **Disable WAN management** — Turn off HTTP/HTTPS admin from internet. Use VPN if remote access needed.

### Segmentation

| Segment | Purpose | Access Rules |
|---------|---------|--------------|
| Corporate | Workstations, file servers | Full internal, limited internet |
| Guest | Visitor devices | Internet only, no LAN access |
| IoT | Smart devices, cameras | Limited internet, no corporate LAN |
| DMZ | Public-facing services | Isolated, minimal internal access |

### WiFi Security

- **Never use WEP** — Trivially cracked. Upgrade immediately if found.
- **WPA2-PSK:** Fine for small offices, but passphrase shared = compromised = rekey.
- **WPA2-Enterprise:** Ideal. Each user gets creds. Integrate with existing directory (AD, Google WS, etc.) if possible.
- **MAC filtering:** Not security. It's inconvenience theater. Don't bother.
- **Client isolation:** Enable on guest network. Prevents devices talking to each other.

### Monitoring & Logging

- **Centralized logging** — Firewall logs to syslog or cloud. Review periodically.
- **Network monitoring** — UniFi Network, PRTG, or Zabbix for uptime/alerts.
- **VPN for remote access** — Never expose RDP/SSH to the internet. Use WireGuard or IPSec VPN.

### Physical Security

- Lock network closet/cabinet
- Don't put switches in public areas
- Secure cables against tampering
- Consider tamper-evident seals on critical gear

### Incident Response (Quick Reference)

1. **Identify** — What's affected? Is it an isolated device or spread?
2. **Contain** — Isolate infected system from network (pull cable, disable port)
3. **Investigate** — Check logs, recent changes, malware scans
4. **Recover** — Clean/reimage, restore from backup if needed
5. **Document** — What happened, what you fixed, recommendations

---

## Quick Deployment Checklist

- [ ] ISP ordered and active
- [ ] Firewall configured (rules, VLANs, update schedule)
- [ ] Core switch deployed with PoE (if needed)
- [ ] WiFi APs installed and tuned (channel, power)
- [ ] SSIDs created (Corporate + Guest minimum)
- [ ] DHCP scopes configured per VLAN
- [ ] DNS forwarding set (internal resolution)
- [ ] Firmware updated on all gear
- [ ] Admin passwords changed from default
- [ ] Backup/failover configured (if critical)
- [ ] Documentation started (IP scheme, credentials)
- [ ] Client walkthrough: what works, how to get help

---

## Common Mistakes to Avoid

| Mistake | Why It's Bad | Fix |
|---------|--------------|-----|
| Consumer-grade router | No VLANs, weak firewall, unreliable | Business firewall from day one |
| Same SSID for 2.4 + 5GHz | Device confusion, roaming issues | Separate or let device decide |
| No guest isolation | Clients' data at risk | VLAN + client isolation enabled |
| Open WiFi | Legal liability, data theft | WPA2 minimum |
| No documentation | "I have no idea what's running here" | IPAM or simple spreadsheet |
| Ignoring updates | Vulnerabilities actively exploited | Enable auto-updates or calendar |

---

*This guide is a living document. Update as tools, threats, and best practices evolve.*
