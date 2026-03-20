# 🗺️ Network Mapper - Quick Start

**Tool Location**: `/root/.openclaw/workspace/tools/network-mapper.html`

## 30-Second Setup

1. **Open the tool** in your browser (Firefox/Chrome):
   ```bash
   firefox /root/.openclaw/workspace/tools/network-mapper.html
   ```

2. **Immediate view**: Demo network loads automatically showing Barney's typical setup
   - 18 devices visible
   - POS system, workstations, cameras, printers, APs all color-coded
   - Professional topology diagram

3. **Run a real scan**:
   - Change subnet to your target (e.g., `192.168.1.0/24`)
   - Click **🔍 Scan Network**
   - Wait ~30-60 seconds for scan
   - See live results populate

## What You Get

| Section | What It Shows |
|---------|--------------|
| **Topology Diagram** | Visual network map (devices connected to gateway) |
| **Device Categories** | Organized by type (servers, cameras, printers, etc.) |
| **Hosts Panel** | Complete list with IP, MAC, vendor |
| **Stats** | Total device count, server/workstation breakdown |

## Use Cases

### For Barney's Audit
- "Here's your network topology" → Show client the diagram
- Identify all devices (security cameras, POS, WiFi APs)
- Vendor tracking (helps with support)
- Document baseline for future assessments

### For Security Assessment
- Discover unknown devices
- Identify rogue access points
- Map network perimeter
- Find IoT devices needing hardening

### For Network Planning
- Capacity analysis (how many devices)
- Device distribution (where stuff connects)
- Redundancy check (multiple APs, servers)
- Performance baseline

## Real Data vs Demo

**Demo loads automatically** and shows:
- Gateway router (Netgear)
- POS system (Intel server)
- 4 workstations (Dell, HP, Lenovo, Apple)
- 2 wireless APs (TP-Link)
- 3 cameras (Hikvision, Dahua)
- 2 printers (Canon, Xerox)
- Access control (Honeywell)
- Backup system (Raspberry Pi)

**Real scan** (click "Scan Network"):
- Connects to PortableNetDiscover backend
- Scans actual network on specified subnet
- Discovers all live hosts
- Parses MAC addresses and vendors
- Builds live topology

## Browser Notes

- **Works Offline**: Demo data built-in, no server needed
- **No Installation**: Just open the HTML file
- **Responsive**: Works on desktop, tablet
- **Fast**: Loads in <1 second
- **Modern Browsers**: Chrome, Firefox, Safari (Edge supported)

## File Locations

```
/root/.openclaw/workspace/tools/
├── network-mapper.html          ← Main tool
├── NETWORK-MAPPER-README.md     ← Full documentation
└── QUICKSTART.md                ← This file
```

## Common Workflows

### 1. Quick Network Audit
```
Open HTML → See demo → Observe device types → Take notes
```

### 2. Full Network Scan
```
Open HTML → Enter subnet (e.g., 192.168.4.0/24) → Click Scan → Save screenshot → Share with client
```

### 3. Device Inventory
```
Open HTML → Load demo/scan → Switch to "Device Categories" tab → Export list
```

## Tips

- ✅ Demo loads **instantly** (great for showing clients)
- ✅ Scan takes ~30-60 sec (depends on network size)
- ✅ Color coding: 
  - **Pink/Magenta** = Gateway (central router)
  - **Blue** = Servers
  - **Green** = Workstations  
  - **Red** = Cameras
  - **Purple** = Printers
- ✅ Click any host in the list to see full details
- ✅ Export diagram by right-clicking on Mermaid diagram

## Troubleshooting

**Scan doesn't start?**
- Check subnet format: `192.168.x.0/24` (CIDR required)
- Ensure network scanning permissions
- Fall back to demo data

**Demo showing old data?**
- Hard refresh: `Ctrl+F5` or `Cmd+Shift+R`
- Clear browser cache

**No hosts appearing?**
- Network might not have any active devices
- Try demo data first to verify tool works
- Check network permissions

---

**Ready to use.** Open the HTML file and start scanning. 🚀
