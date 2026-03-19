# IPAM Quick Start - 5 Minutes

## Step 1: Open It (30 seconds)
Double-click `ipam.html` or open in any browser.

## Step 2: Review Sample Data (1 minute)
You'll see:
- 3 pre-loaded subnets (192.168.1.0/24, 192.168.2.0/24, 10.0.0.0/16)
- 5 sample devices already assigned
- 2 DHCP ranges configured

**Dashboard shows:**
- 3 total subnets
- 254+ total IPs
- 5 allocated IPs
- Overall utilization: 2%

## Step 3: Add a Subnet (1 minute)
Click **+ Add Subnet**

Fill in:
```
Network Address:  10.2.0.0
CIDR Notation:    24
Gateway IP:       10.2.0.1
Description:      New Branch Office
```

Click **Add Subnet** → Appears in Subnets table

## Step 4: Assign a Device (1 minute)
Click **+ Add Device**

Fill in:
```
Device Name:  Branch Office Router
Device Type:  Router
IP Address:   10.2.0.1
MAC Address:  AA:BB:CC:DD:EE:00 (optional)
Status:       Active
Notes:        Primary gateway for branch
```

Click **Add Device** → Device appears in Devices table

## Step 5: Export Your Data (1 minute)
- **Export as CSV:** Header → 📥 Export CSV (open in Excel)
- **Export as JSON:** Header → 📄 Export JSON (backup/restore)

---

## Key Navigation

| Button | Action |
|--------|--------|
| **Overview** (sidebar) | Main dashboard with stats |
| **Subnets** | List all subnets + utilization |
| **Devices** | All IP assignments |
| **DHCP Ranges** | DHCP pool configuration |
| **IP Allocation** | Per-subnet allocation view |
| **Availability** | Available IPs per subnet |

---

## Common Tasks

### Delete a Device
1. Go to **Devices** tab
2. Click **Delete** on the row
3. Confirm

### Modify a Subnet
Currently: Delete and re-add (edit in progress)

### View DHCP Usage
1. Go to **DHCP Ranges** tab
2. See allocation status per range

### Check Overall Utilization
1. **Dashboard** shows global % used
2. **Subnets** tab shows per-subnet %
3. **Availability** tab shows IPs available per subnet

---

## Tips

✅ **Sample data stays** until you delete it  
✅ **All data saved** to browser automatically  
✅ **Export often** for backup  
✅ **Works offline** after loading  
✅ **No login needed** — it's all client-side

---

## Troubleshooting

**Q: Data disappeared!**  
A: Browser storage cleared. Use CSV/JSON export to backup.

**Q: Want to start fresh?**  
A: Browser console → `localStorage.removeItem('ipamData'); location.reload();`

**Q: Can I use on mobile?**  
A: Yes, but smaller screen. Export to CSV for viewing on phone.

---

**Ready?** Start with the Dashboard, add your first subnet, then export the data. You're done! 🚀
