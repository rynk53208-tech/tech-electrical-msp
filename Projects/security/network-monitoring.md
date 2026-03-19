# Network Monitoring Guide

> For Irvin's Tech & Electrical Services — MSP/MSSP Operations

This guide covers essential network monitoring for small-to-medium business environments. Adapt thresholds based on client SLAs and network size.

---

## 1. What to Monitor

### 🔴 Critical Infrastructure
| Component | Metrics to Track |
|-----------|------------------|
| **Firewall** | Uptime, connection states, throughput, dropped packets, rule hits |
| **Core Switches** | Port status, VLAN health, spanning tree, CPU/memory |
| **Routers** | Uptime, routing table changes, WAN link status, latency |
| **VPN Gateways** | Active tunnels, tunnel health, throughput, auth failures |

### 🟠 Network Traffic
- **Bandwidth utilization** — Per-interface, per-VLAN
- **Top talkers** — Devices consuming most bandwidth
- **Protocol distribution** — HTTP, HTTPS, DNS, SMB, etc.
- **Broadcast/multicast levels** — Excessive = network issue

### 🟡 Endpoint & Access
- **DHCP pool usage** — Warn at 80%, critical at 95%
- **DNS resolution** — Query times, failure rate
- **DHCP leases** — Unusual new devices
- **WiFi APs** — Client count, channel interference, uptime

### 🟢 Security Indicators
- **Failed VPN/auth attempts** — Brute force detection
- **Firewall denies** — Blocked inbound/outbound traffic
- **Unusual port scans** — Potential reconnaissance
- **New device alerts** — Unknown MAC addresses on network

---

## 2. Tools to Use

### Open Source / Free Tier
| Tool | Use Case | Cost |
|------|----------|------|
| **Zabbix** | Full-stack monitoring (network, servers, apps) | Free |
| **Nagios Core** | Infrastructure monitoring, alerting | Free |
| **Prometheus + Grafana** | Metrics collection + visualization | Free |
| **Snort/Suricata** | Intrusion detection | Free |
| **Wireshark** | Packet capture & analysis | Free |
| **Observium** | Network discovery & monitoring | Free (self-hosted) |

### Commercial (Recommended for MSP)
| Tool | Use Case | Cost |
|------|----------|------|
| **PRTG Network Monitor** | All-in-one, easy setup, good for SMB | Free for ≤100 sensors |
| **SolarWinds N-central** | RMM + monitoring for MSPs | Per-endpoint |
| **Auvik** | Network discovery, mapping, monitoring | Per-network |
| **ManageEngine OpManager** | Network + infrastructure | Free for ≤10 devices |
| **Splunk** | Log aggregation + security analytics | Free limited / paid |

### Lightweight Options
- **check_mk** — Nagios fork, easier config
- **Netdata** — Real-time performance, low overhead
- **LibreNMS** — Cisco/Unix/Linux monitoring, SNMP-based

---

## 3. Alert Thresholds

### Network Performance
| Metric | Warning | Critical |
|--------|---------|----------|
| **CPU utilization (firewall/switch)** | >70% for 5 min | >90% for 2 min |
| **Memory utilization** | >75% | >90% |
| **Interface bandwidth** | >70% for 5 min | >90% for 2 min |
| **Latency (gateway)** | >100ms | >300ms |
| **Packet loss** | >1% | >5% |
| **Jitter** | >30ms | >50ms |

### Availability
| Metric | Warning | Critical |
|--------|---------|----------|
| **Device down** | — | Any critical device unreachable >2 min |
| **VPN tunnel down** | — | Any active tunnel drops |
| **Uplink failure** | — | Redundant link loss |

### Security
| Metric | Warning | Critical |
|--------|---------|----------|
| **Failed logins (VPN/firewall)** | 5 in 10 min | 15 in 10 min |
| **Firewall deny rate** | 100/min | 500/min |
| **New device detected** | Notify | — |
| **DNS tunneling suspicion** | — | Immediate alert |

### DHCP
| Metric | Warning | Critical |
|--------|---------|----------|
| **Pool usage** | >80% | >95% |
| **Lease exhaustion rate** | >20 new/min | — |

---

## 4. Response Procedures

### 🔴 Critical: Service Outage

**Trigger:** Core device down, total site loss, major VPN failure

1. **Acknowledge** — Confirm alert in monitoring system
2. **Check externally** — Use mobile/hotspot to test if issue is WAN-side
3. **Remote access** — Jump to affected device via out-of-band (IPMI, console) or management VLAN
4. **Quick diagnostics:**
   - `ping <gateway>`
   - `show interface status`
   - `show ip route`
   - Check logs: `tail -f /var/log/messages` or firewall logs
5. **Escalate** — If unresolved in 15 min, escalate to senior tech or Irvin
6. **Document** — Log ticket with timeline, actions taken, resolution

---

### 🟠 Warning: Performance Degradation

**Trigger:** High CPU, bandwidth saturation, latency spike

1. **Verify** — Confirm with ping/throughput test, not just alert
2. **Identify cause:**
   - Check `top talkers` in monitoring
   - Review firewall traffic logs
   - Look for burst traffic, DDoS, or infected host
3. **Mitigate:**
   - QoS rule to throttle non-critical traffic
   - Block malicious IP/port at firewall
   - Isolate infected endpoint (port shutdown)
4. **Monitor** — Watch for 10 min post-fix
5. **Document** — Update ticket with root cause

---

### 🟡 Security: Anomalies

**Trigger:** Brute force attempts, unknown device, suspicious traffic

1. **Verify** — Confirm not legitimate admin (check source IP, geolocation)
2. **Block** — Add to firewall blocklist immediately
   ```
   # Example: iptables block
   iptables -A INPUT -s <suspicious-ip> -j DROP
   ```
3. **Investigate:**
   - Check auth logs for compromised accounts
   - Run network capture if needed
   - Scan affected endpoint with antivirus
4. **If compromised:**
   - Disable account
   - Quarantine endpoint
   - Notify client immediately
   - Preserve logs for incident report
5. **Document** — Full incident report with IOCs (indicators of compromise)

---

### 🔵 Routine: New Device / DHCP Alert

**Trigger:** Unknown MAC on network, DHCP pool warning

1. **Identify** — Lookup MAC vendor, cross-reference with asset list
2. **If legitimate** — Add to known assets, optionally add to allowlist
3. **If suspicious** — Block at switch port or VLAN
4. **If DHCP pool low** — Plan subnet expansion, document for client

---

## Monitoring Checklist (Daily)

- [ ] Review all active alerts
- [ ] Check overnight incident summary
- [ ] Verify monitoring system itself is healthy
- [ ] Review capacity trends (bandwidth, DHCP, storage)
- [ ] Update asset list with new devices discovered

---

## Quick Command Reference

```bash
# Check interface stats (Linux)
ip -s link
sar -n DEV 1 5

# Check firewall connections (PFSense)
pfctl -s states

# SNMP walk (basic)
snmpwalk -v2c -c <community> <host> ifDescr

# Check DHCP leases
cat /var/lib/dhcpd/dhcpd.leases

# Port scan quick check
nmap -sn 192.168.1.0/24
```

---

## Recommended Stack for This Business

| Role | Tool |
|------|------|
| **Network monitoring** | Zabbix or PRTG |
| **Log aggregation** | Wazuh (free) or Splunk Free |
| **Alerting** | PagerDuty or OpsGenie (integrates with above) |
| **Remote access** | Tailscale (mesh VPN) for out-of-band |

Start with **Zabbix + Grafana** (free, self-hosted) — solid for MSP growth. Add **Wazuh** for IDS/SiEM capabilities.

---

*Document Version: 1.0*  
*Last Updated: 2026-03-18*  
*Owner: Irvin's Tech Services*