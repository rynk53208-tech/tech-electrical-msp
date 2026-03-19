# Remote Access Quick-Start Guide

Quick reference for setting up remote access solutions for client support.

---

## 1. TeamViewer

**Best for:** Cross-platform, quick start, no port forwarding needed.

### Setup (Host Machine)

1. Download from **https://www.teamviewer.com**
2. Install → Select "Install for commercial/personal use"
3. Create account or sign in
4. Note the **TV ID** and **Password** (auto-generated, rotates)

### Connecting to Client

1. Enter client's TV ID in "Remote Control" field
2. Click Connect → Enter password
3. Grant/receive confirmation

### Tips

- Enable **Easy Access** (account-based, no password needed) for recurring clients
- Configure → Options → Security → Set custom password
- Works through NAT/firewall (relay connection)

---

## 2. AnyDesk

**Best for:** Lightweight, faster than TeamViewer, custom client deployments.

### Setup (Host Machine)

1. Download from **https://anydesk.com**
2. Install → Uncheck "Add to startup" (optional)
3. Note the **9-digit AnyDesk ID** (e.g., `123-456-789`)
4. Set a password in Settings → Security

### Connecting to Client

1. Enter client's AnyDesk ID
2. Click Connect → Wait for acceptance
3. For unattended access: Set password in Security settings

### Tips

- **Portable version** available (no install needed) — great for USB rescue drives
- Settings → Security → Enable "Require password" and "Allow deny incoming connections"
- Custom client `.exe` can be generated for mass deployment

---

## 3. RustDesk (Self-Hosted)

**Best for:** Full control, self-hosted, no subscription, open source.

### Architecture

- **Relay Server** (your server) — handles connection when P2P fails
- **ID Registration Server** (optional, can use public or self-host)

### Quick Self-Hosted Setup (Ubuntu/Debian)

```bash
# Install Docker if not present
curl -fsSL https://get.docker.com | sh

# Run RustDesk server (relay + signaling)
docker run --name rustdesk-server -d --restart always \
  -p 21115:21115 -p 21116:21116 -p 21117:21117 -p 21118:21118 -p 21119:21119 \
  -v ~/rustdesk-data:/data \
  -e RB_PRIVATE_KEY=... \
  -e RB_DB=... \
  rustdesk/rustdesk-server:latest
```

For simplicity, use the **RustDesk Docker Compose** method:
- See: **https://rustdesk.com/docs/en/server/self-host/install/**
- Generates required keys automatically

### Configure Clients

1. Install RustDesk from **https://rustdesk.com**
2. Go to **Settings → Network**
3. Enter your server IP/hostname:
   - **ID Server:** `your-server-ip:21116`
   - **Relay Server:** `your-server-ip:21117`
4. Clients now use your server for ID lookup and relay

### Tips

- Minimum spec: 1 CPU, 1GB RAM for low-traffic
- Works great behind NAT — only need outbound allowed
- Both ends must point to same self-hosted server for ID matching

---

## 4. Windows RDP Tips

**Best for:** Fast, built-in, low latency on Windows networks.

### Enable RDP on Target Machine

1. Settings → System → Remote Desktop → **Enable Remote Desktop**
2. Note the PC name
3. Click "Confirm" → Requires admin password

### Connect (from Another Windows)

1. Search "Remote Desktop Connection" (mstsc)
2. Enter PC name or IP address
3. Log in with Windows credentials

### Pro Tips

| Tip | How |
|-----|-----|
| **Find local IP** | `ipconfig` in CMD |
| **Dynamic RDP port** | Default `3389` — change in `HKLM\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp\PortNumber` |
| **VPN recommended** | Don't expose RDP to internet directly — use VPN or at least NLA + strong password |
| **Wake on LAN** | Enable in BIOS + network adapter settings for remote wakeup |
| **Clipboard sync** | Enabled by default — toggle in Experience tab |
| **Multiple monitors** | Display → Select all monitors you want |

### Security Hardening

- Enable **Network Level Authentication (NLA)** — prevents DoS attacks
- Use **strong local account** or **Azure AD** login
- Optionally: Restrict via Windows Firewall (allow only from your IP range)
- Consider **RDP Gateway** (Windows Server) for external access

---

## Quick Comparison

| Feature | TeamViewer | AnyDesk | RustDesk (Self) | RDP |
|---------|------------|---------|-----------------|-----|
| Cross-platform | ✅ | ✅ | ✅ | ❌ (Win only) |
| No config needed | ✅ | ✅ | ⚠️ (server) | ❌ (firewall) |
| Self-hosted | ❌ | ❌ | ✅ | ❌ |
| Free (personal) | ✅ | ✅ | ✅ | ✅ |
| Portable version | ❌ | ✅ | ✅ | ❌ |
| Lightweight | ❌ | ✅ | ✅ | ✅ |

---

*For Irvin's Tech Services — Last updated: 2026-03-18*
