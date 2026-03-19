# WiFi Troubleshooting Guide

> For Irvin's Tech & Electrical Services

---

## 1. Channel Interference

### The Problem
WiFi channels overlap, especially on 2.4GHz. Channel congestion = slow speeds, dropped packets, latency spikes.

### Key Concepts

| Band | Channels | Best Practice |
|------|----------|---------------|
| 2.4 GHz | 1, 6, 11 | Use only these 3 (non-overlapping) |
| 5 GHz | 36, 40, 44, 48, 149, 153, 157, 161 | Use UNII-1 (36-48) or UNII-3 (149-161), avoid DFS (52-144) unless needed |

### Common Interference Sources
- **Microwave ovens** — kill 2.4GHz signal
- **Wireless cameras** (baby monitors, security cams)
- **Bluetooth devices** (2.4GHz overlap)
- **Neighboring networks** — apartment complexes are war zones
- **Fluorescent lights**, wireless keyboards/mice
- **USB 3.0 devices** (generates 2.4GHz noise)

### Fixes
1. **Scan the spectrum** — find the least congested channel
2. **Switch to 5GHz** — more channels, less interference
3. **Reduce transmit power** if APs overlap too much
4. **Change AP channel width** — 20MHz on 2.4GHz (40MHz causes overlap)
5. **Shield or relocate** interference sources

---

## 2. Access Point Placement

### Golden Rules

1. **Line of Sight** — signal weakens through walls, metal, concrete
2. **Central location** — don't hide APs in closets or corners
3. **Ceiling mount** ideal — downward broadcast pattern
4. **Elevate above obstacles** — mount above cubicle walls, furniture
5. **Mind the coverage area** — one AP covers ~100-150ft radius depending on environment

### Problem Areas to Avoid
- Near microwave ovens or cordless phones
- Inside walls or behind TVs
- Metal racks or server rooms (RF shielding)
- Basements with concrete floors
- Near large mirrors or water features

### Scaling
- **Small home (1500 sq ft):** 1 AP usually fine
- **Larger home/office:** Mesh system or multiple APs, wired backhaul preferred
- **Dead zones:** Add AP, don't just boost power

### Tip: 80/20 Rule
80% of WiFi issues are placement or channel-related. Check these first.

---

## 3. Common Fixes

### Quick Wins
| Issue | Fix |
|-------|-----|
| Slow speeds | Switch from 2.4GHz to 5GHz |
| Dropping connection | Change channel, reduce AP power |
| Dead zones | Add AP or mesh node |
| Too many devices | Enable band steering, upgrade to WiFi 6 |
| Intermittent issues | Check for intermittent interferers (microwave) |

### Configuration Checklist
- [ ] Update firmware on APs/routers
- [ ] Use WPA3 or WPA2-AES (not WPA-TKIP or WEP)
- [ ] Disable WPS (security risk)
- [ ] Enable band steering (pushes devices to 5GHz)
- [ ] Set appropriate transmit power (not max)
- [ ] Use 20MHz channel width on 2.4GHz
- [ ] Enable QoS for latency-sensitive traffic (voip, gaming)
- [ ] Disable AP isolation if clients need to talk to each other

### When to Replace Hardware
- Old WiFi 4 (802.11n) equipment — upgrade to WiFi 6
- Consumer-grade routers in business environments
- Hardware with known vulnerabilities (WPS enabled, etc.)

---

## 4. Tools to Use

### Spectrum Analysis
| Tool | Platform | Notes |
|------|----------|-------|
| **WiFi Analyzer** | Android | Free, solid for quick scans |
| **NetSpot** | Mac/Windows | Professional site survey tool |
| **inSSIDer** | Windows | Good channel analyzer |
| **Acrylic WiFi** | Windows | Free & paid versions |
| **Kismet** | Linux | Packet sniffer + spectrum |

### Speed & Performance Testing
| Tool | What It Tests |
|------|---------------|
| **Speedtest.net** | Internet throughput |
| **iPerf3** | Local network speed (client/server) |
| **PingPlotter** | Latency + traceroute |
| **WiFi Perf** | Accurate WiFi throughput |

### Network Discovery
- **Angry IP Scanner** — find devices on network
- **Nmap** — port scans, OS detection
- **Router web interface** — client list, signal levels

### Client-Side Tools
- **WiFi Signal** (Mac) — menu bar signal monitor
- **WiFi Explorer** (Mac) — channel visualization
- **Homedale** (Windows) — signal monitoring over time

---

## Quick Diagnostic Flowchart

```
Complaint received
        │
        ▼
Is the client on 2.4GHz or 5GHz?
        │
        ├─ 2.4GHz → Check channel → Congested? → Switch to 1/6/11 or move to 5GHz
        │
        ▼
Is the AP in a good location?
        │
        ├─ No → Relocate AP
        │
        ▼
Any interference sources nearby?
        │
        ├─ Yes → Remove or shield
        │
        ▼
Run speed test & compare to expected
        │
        ├─ Slow → Check channel width, firmware, client capabilities
        │
        ▼
Still failing? → Consider mesh/AP addition or ISP issue
```

---

## Pro Tips

- **2.4GHz range > speed** — good for IoT, far devices
- **5GHz speed > range** — good for streaming, gaming
- **Don't over-AP** — too many overlapping APs causes co-channel interference
- **Measure, don't guess** — use a spectrum analyzer before recommending solutions
- **Document the baseline** — speed tests before and after changes = credibility

---

*Created for Irvin's Tech & Electrical Services — WiFi troubleshooting reference*
