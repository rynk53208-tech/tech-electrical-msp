# VPN Setup Guide

*For Irvin's Tech Business — Practical advice for clients*

---

## 1. Types of VPNs

### Remote Access VPN
- **What it is:** Individual users connect to a network remotely
- **Use case:** Single employees working from home or traveling
- **Examples:** OpenVPN, WireGuard, IPSec client

### Site-to-Site VPN
- **What it is:** Connects entire networks (office to office, office to cloud)
- **Use case:** Branch offices, hybrid cloud setups
- **Examples:** AWS Site-to-Site VPN, OpenVPN Access Server, pfSense

### Zero Trust Network Access (ZTNA)
- **What it is:** Identity-based access, no traditional VPN tunnel
- **Use case:** Modern enterprises, contractors, MFA-heavy environments
- **Examples:** Cloudflare Access, Tailscale, Twingate

### Split Tunnel vs Full Tunnel
- **Split Tunnel:** Only traffic to company network goes through VPN (faster, default for most)
- **Full Tunnel:** ALL traffic routes through VPN (more secure, slower)

---

## 2. When to Use Each

| Scenario | Recommended VPN Type |
|----------|---------------------|
| Single remote employee | Remote Access (WireGuard/OpenVPN) |
| Multiple offices needing to share resources | Site-to-Site |
| Cloud infrastructure (AWS/Azure) | Site-to-Site + AWS/Azure native |
| Contractors with minimal access | ZTNA (Tailscale) |
| Sensitive data/financial clients | Full tunnel + ZTNA |
| General remote work | Split tunnel Remote Access |

---

## 3. Setup Instructions

### WireGuard (Recommended — Fast, Modern)

**Server (Linux):**
```bash
# Install
sudo apt install wireguard

# Generate keys
wg genkey | tee privatekey | wg pubkey > publickey

# Create config /etc/wireguard/wg0.conf
[Interface]
PrivateKey = <your-private-key>
Address = 10.0.0.1/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
PublicKey = <client-public-key>
AllowedIPs = 10.0.0.2/32

# Start
sudo wg-quick up wg0
```

**Client Config (Windows/macOS/Linux):**
Download WireGuard app, import:
```
[Interface]
PrivateKey = <client-private-key>
Address = 10.0.0.2/24
DNS = 1.1.1.1

[Peer]
PublicKey = <server-public-key>
Endpoint = your-server-ip:51820
AllowedIPs = 0.0.0.0/0  # or company network only for split tunnel
PersistentKeepalive = 25
```

### OpenVPN (Legacy/Compatibility)

**Server:**
```bash
# Install
sudo apt install openvpn easy-rsa

# Setup CA
cd /usr/share/easy-rsa
./easyrsa init-pki
./easyrsa build-ca

# Build server cert
./easyrsa build-server-full server nopass

# Config
sudo cp /usr/share/easy-rsa/easy-rsa/3/pki/{ca.crt,issued/server.crt,private/server.key} /etc/openvpn/

# Create server.conf (simplified)
sudo openvpn --config /etc/openvpn/server.conf
```

**Client:** Use OpenVPN Connect app, import .ovpn file

### Tailscale (ZTNA — Easiest for small teams)

```bash
# Install on Linux server
curl -fsSL https://tailscale.com/install.sh | sh

# Login
sudo tailscale login

# Enable subnet router (act as VPN server)
sudo tailscale up --advertise-routes=192.168.1.0/24

# On client
sudo tailscale login  # joins network automatically
```

---

## 4. Security Best Practices

### Authentication
- **Use key-based auth** — No passwords in VPN configs
- **Implement MFA** — Especially for admin access
- **Certificate rotation** — Rotate every 90-180 days for OpenVPN
- **WireGuard keys** — Regenerate keys periodically

### Network Segmentation
- **Don't give full network access** — Restrict to needed subnets only
- **Use VLANs** — Isolate sensitive systems from VPN users
- **Firewall rules** — Explicit allow only what's needed

### Server Hardening
- **Keep software updated** — Patch WireGuard/OpenVPN immediately
- **Disable root login** — Use sudoers, disable direct root
- **Fail2Ban** — Block brute force attempts
- **Change default ports** — Don't use 51820/1194 (optional, security through obscurity)

### Monitoring
- **Log connections** — Track who connects, when, from where
- **Set up alerts** — Unusual connection times or locations
- **Review active sessions** — Weekly audit of connected users

### Client Security
- **Device encryption** — Full disk encryption required
- **Kill switch** — Block traffic if VPN drops (WireGuard: `Table = off` + firewall rules)
- **Update clients** — Keep VPN software current
- **Don't share configs** — Each user gets unique keys/certs

---

## Quick Reference

| Need | Solution |
|------|----------|
| Fast, simple | WireGuard |
| Maximum compatibility | OpenVPN |
| No infrastructure | Tailscale |
| Cloud AWS | AWS Site-to-Site VPN |
| Contractors/ZTNA | Cloudflare Access / Twingate |

---

*Document created for Irvin's Tech Business — Client VPN implementations*
