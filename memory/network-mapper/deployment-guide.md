# Network Mapper Deployment Guide
## Barney's Tire Shop

---

## What You'll Need

1. **Kali Linux laptop** with nmap installed
2. **Access to the shop's network** (Wi-Fi or wired connection to their router)
3. **Permission** from Barney to scan their network

---

## What to Run

### Step 1: Navigate to the tool
```bash
cd /root/.openclaw/workspace/memory/network-mapper
```

### Step 2: Run the mapper
```bash
python3 netmapper.py
```

### Step 3: Enter the subnet
When prompted, enter the shop's network subnet. Common examples:

| Network Type | Typical Subnet |
|--------------|----------------|
| Standard home/small business | `192.168.1.0/24` |
| Older setups | `192.168.0.0/24` |
| D-Link networks | `192.168.100.0/24` |
| Netgear default | `192.168.1.0/24` |

**To find the correct subnet:**
- Look at the router's label (often 192.168.1.1)
- Check your laptop's IP: `ip addr show` or `ipconfig` (Windows)
- Ask Barney what IP range their router uses

---

## How to Interpret Results

The tool will output 3 files:

### 1. `network-topology.html` ← Open this in a browser
Visual map showing all devices with:
- **IP addresses** - Unique identifier for each device
- **Hostnames** - Device names (may show "N/A" if none)
- **MAC addresses** - Hardware IDs (useful for identifying devices)
- **Open ports** - Services running on each device
- **Device type** - Color-coded:
  - 🔴 Red border = Gateway/Router
  - 🟡 Yellow border = Server
  - 🟢 Green border = Workstation/PC

### 2. `network-data.json`
Raw data for further processing (for Irvin's records)

### 3. `network-data.csv`
Spreadsheet-friendly format for reports

---

## Understanding Port Findings

| Port | Common Service | Security Note |
|------|----------------|----------------|
| 80/443 | Web server | Check if intended |
| 3389 | Remote Desktop | Security risk if open to internet |
| 22 | SSH | Should be locked down |
| 445 | Windows File Sharing | Potential vulnerability |
| 139 | NetBIOS | Legacy, should be disabled |
| 8080 | Alt HTTP | Often admin interfaces |

---

## Tips for Barney's

1. **Ask Barney** what devices he expects to see (POS system, cameras, etc.)
2. **Note anything unexpected** - unknown devices could be security risks
3. **Take photos** of the HTML output on your laptop to show Barney
4. **Check the router** - it's usually at x.x.x.1 (e.g., 192.168.1.1)

---

## Quick Reference

```bash
# Find your own IP first
ip addr show | grep "inet "

# Then run the mapper when ready
python3 netmapper.py
# Enter: 192.168.1.0/24  (or whatever subnet)

# View results
firefox network-topology.html
```

---

*Prepared for Irvin Avitia - Tech & Electrical Services*
