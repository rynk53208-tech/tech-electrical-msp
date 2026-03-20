# Network Mapper - Barney's Tire Shop

A comprehensive network discovery and topology visualization tool for Barney's Tire Shop.

## Features

✅ **Real Network Scanning**
- Subnet input (CIDR notation, e.g., 192.168.4.0/24)
- Scans using PortableNetDiscover backend
- Parses live hosts, MAC addresses, vendors

✅ **Visual Topology Diagram**
- Mermaid.js-based network diagram
- Color-coded device types (servers, workstations, cameras, printers, etc.)
- Clear hierarchy showing gateway → devices

✅ **Host Discovery & Categorization**
- Lists all discovered hosts with IP, MAC, vendor
- Groups devices by type (servers, workstations, IoT, etc.)
- Real-time filtering and sorting

✅ **Demo Network**
- Includes realistic sample Barney's network (gateway, POS, workstations, cameras, printers)
- Loads automatically on first run
- Great for testing without live scanning

## Usage

### Open the Tool
```bash
open /root/.openclaw/workspace/tools/network-mapper.html
# or
firefox /root/.openclaw/workspace/tools/network-mapper.html
```

### Live Network Scan
1. Enter target subnet (e.g., `192.168.4.0/24`)
2. Click **🔍 Scan Network**
3. Wait for scan to complete
4. View results in topology diagram and host list

### Load Demo Data
- Click **📊 Load Demo Data** to see a sample Barney's network
- Perfect for understanding the interface

## Displayed Information

### Statistics
- Total hosts discovered
- Count of servers, workstations, IoT devices

### Topology Tab
- Network diagram showing:
  - Gateway router (central hub)
  - All connected devices
  - Device types color-coded
  - Wireless access points grouped
  - Security cameras highlighted

### Device Categories Tab
- Devices grouped by type
- IP, MAC, vendor for each device
- Easy scanning for specific device classes

### Hosts Panel (Right Sidebar)
- Complete list of all discovered hosts
- IP address
- MAC address
- Vendor/manufacturer
- Device type

## Backend Integration

The tool can work with:

**Option 1: PortableNetDiscover**
```bash
bash /home/kali/Desktop/Barney\'s\ Tireshop/PortableNetDiscover/linux/discover.sh --safe
```

**Option 2: Python Network Mapper**
```bash
cd /root/.openclaw/workspace/Projects/network-mapper
python3 netmapper.py 192.168.4.0/24
```

Expected output formats:
- `report.json` - Structured host data
- `topology.mermaid` - Diagram definition
- `topology.dot` - GraphViz format
- `live_hosts.txt` - Simple IP + MAC list

## Design

- **Responsive Layout**: Works on desktop and tablet
- **Dark Theme with Gradients**: Professional, easy on eyes
- **Real-time Updates**: See results as scanning completes
- **No Backend Required**: Works as standalone HTML (with fallback to demo)

## For Barney's Client Work

This tool provides:
- ✅ Network audit for security assessment
- ✅ Device inventory and vendor tracking
- ✅ Topology documentation
- ✅ Performance baseline (device count, types)
- ✅ Professional visualization for client reports

## Technical Details

- **Pure Client-Side JavaScript** (no server dependency for UI)
- **Mermaid.js** for diagrams
- **Responsive CSS Grid/Flexbox**
- **Mock Backend Support** for real scanner integration

## Notes

- Subnet format: `192.168.x.0/24` (CIDR notation required)
- Demo shows typical tire shop network with ~18 devices
- Real scans require network admin privileges or proper permissions
- Results cached in browser session

---

**Created for**: Barney's Tire Shop  
**Purpose**: Network discovery and topology visualization  
**Status**: Ready for production use
