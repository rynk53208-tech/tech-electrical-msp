# Server Setup Guide

> For Irvin's Tech Services — Northrop-grade infrastructure, practical implementation

---

## 1. Windows Server Setup

### Initial Installation

**Recommended Version:** Windows Server 2022 (LTSC)

**Installation Options:**
- **GUI Install** — Standard for most deployments
- **Server Core** — Lower attack surface, less maintenance (recommended for production)

```powershell
# Post-install via PowerShell (run as Admin)

# Rename computer
Rename-Computer -NewName "SRV-01" -Restart

# Set static IP (example)
New-NetIPAddress -InterfaceAlias "Ethernet0" -IPAddress 192.168.1.10 -PrefixLength 24 -DefaultGateway 192.168.1.1
Set-DnsClientServerAddress -InterfaceAlias "Ethernet0" -ServerAddresses 192.168.1.1,8.8.8.8

# Join domain (if applicable)
Add-Computer -DomainName "corp.yourdomain.com" -Credential "corp\admin"
```

### Role Installation

```powershell
# Install common roles
Install-WindowsFeature -Name Web-Server, DNS, DHCP, File-Services, Hyper-V -IncludeManagementTools

# Verify installation
Get-WindowsFeature | Where-Object {$_.InstallState -eq "Installed"}
```

### Active Directory (if needed)

```powershell
# Promote to Domain Controller (forest level 2016)
Install-ADDSForest -DomainName "corp.yourdomain.com" -DomainNetbiosName "CORP" -SysvolPath "C:\Windows\SYSVOL" -DomainMode 7 -ForestMode 7
```

### Windows Update Configuration

```powershell
# Configure WSUS or Windows Update
Get-ExecutionPolicy -List
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or via GPO: Computer Configuration > Administrative Templates > Windows Components > Windows Update
```

---

## 2. Linux Server Setup

### Initial Setup (Ubuntu 22.04 LTS / Debian 12)

**Network Configuration**

```bash
# Set static IP (/etc/netplan/00-installer-config.yaml)
network:
  ethernets:
    ens33:
      addresses:
        - 192.168.1.10/24
      gateway4: 192.168.1.1
      nameservers:
        addresses:
          - 192.168.1.1
          - 8.8.8.8
  version: 2

# Apply
sudo netplan apply
```

**Hostname & Timezone**

```bash
sudo hostnamectl set-hostname "srv-01"
sudo timedatectl set-timezone America/Los_Angeles
```

### Package Management

```bash
# Update everything
sudo apt update && sudo apt upgrade -y

# Essential packages
sudo apt install -y curl wget git vim ufw fail2ban net-tools curl
```

### User Management

```bash
# Create sudo user
sudo adduser irvin
sudo usermod -aG sudo irvin

# Disable root SSH login (see Hardening section)
```

### Common Services

**Docker**
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker irvin
sudo systemctl enable docker
```

**Nginx**
```bash
sudo apt install nginx
sudo systemctl enable nginx
```

---

## 3. Basic Hardening

### Windows Server Hardening

```powershell
# Enable Windows Firewall
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True

# Block incoming by default
Set-NetFirewallProfile -Profile Public -DefaultInboundAction Block

# Disable unnecessary services
Stop-Service -Name "TelnetService" -Force
Set-Service -Name "TelnetService" -StartupType Disabled

# Enable SMB signing (prevent SMB attacks)
Set-SmbServerConfiguration -RequireSecuritySignature $true -EnableSMB1Protocol $false

# Audit policy (via GPO or local)
auditpol /set /subcategory:"Logon" /success:enable /failure:enable
```

**Disable Legacy Protocols**
```powershell
# Disable SMBv1
Set-SmbServerConfiguration -EnableSMB1Protocol $false
```

### Linux Server Hardening

**Firewall (UFW)**
```bash
# Default deny
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow specific services
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Enable
sudo ufw enable
```

**Fail2Ban (brute force protection)**
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban

# Custom config
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
# Edit jail.local with your settings
sudo systemctl restart fail2ban
```

**SSH Hardening**
```bash
# Edit /etc/ssh/sshd_config
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
MaxAuthTries 3
ClientAliveInterval 300

# Reload
sudo systemctl restart sshd
```

**Automatic Security Updates**
```bash
# Ubuntu
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Or configure /etc/apt/apt.conf.d/50unattended-upgrades
```

### Common Hardening Checklist

| Item | Windows | Linux |
|------|---------|-------|
| Firewall | Windows Firewall | UFW/iptables |
| Disable root login | N/A | `PermitRootLogin no` |
| SSH key auth | N/A | `PasswordAuthentication no` |
| Fail2Ban | Use Windows Defender | `sudo apt install fail2ban` |
| Auto-updates | Enable in GPO | unattended-upgrades |
| Disable SMBv1 | `Set-SmbServerConfiguration -EnableSMB1Protocol $false` | Comment out in /etc/samba/smb.conf |
| Patch management | WSUS/Windows Update | apt |

---

## 4. Monitoring Setup

### Windows Server

**Windows Admin Center** (recommended for GUI)
- Download from: https://www.windowsadmincenter.com
- Centralized management for multiple servers

**Built-in Monitoring**
```powershell
# Performance Monitor
perfmon

# Event Viewer
eventvwr.msc

# Enable remote management
winrm quickconfig
```

**Third-Party Options**
- **Zabbix Agent** — Cross-platform monitoring
- **PRTG** — Free for <100 sensors
- **SolarWinds** — Enterprise grade

### Linux Server

**Prometheus + Grafana** (industry standard)

```bash
# Install Prometheus
sudo apt install prometheus prometheus-node-exporter

# Install Grafana
sudo apt install grafana

# Start services
sudo systemctl enable prometheus grafana-server
sudo systemctl start prometheus grafana-server
```

**Basic Prometheus Config** (`/etc/prometheus/prometheus.yml`)
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
```

**Node Exporter** (for system metrics)
```bash
# Install node exporter
sudo apt install prometheus-node-exporter

# Enable
sudo systemctl enable prometheus-node-exporter
```

**Access**
- Prometheus: http://server:9090
- Grafana: http://server:3000 (default admin/admin)

### Simple Alternatives

**Netdata** (all-in-one, easy)
```bash
# Install
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

**Glances**
```bash
sudo apt install glances
glances
```

---

## Quick Reference

### Common Ports to Monitor/Allow

| Port | Service | Security |
|------|---------|----------|
| 22 | SSH | Key-based auth only |
| 80/443 | HTTP/HTTPS | TLS required |
| 3389 | RDP | Network level auth, VPN |
| 445 | SMB | Disable SMBv1, firewall |
| 3306 | MySQL | Bind to localhost only |
| 5432 | PostgreSQL | Peer/-cert auth |

### Quick Security Check

```bash
# Linux - check open ports
sudo ss -tulpn

# Linux - check failed SSH attempts
sudo grep "Failed password" /var/log/auth.log

# Windows - check open ports
netstat -an | findstr LISTENING
```

---

## Recommended Next Steps

1. **Backups** — Set up automated backups (Veeam for Windows, Restic/Borg for Linux)
2. **VPN** — WireGuard or OpenVPN for remote access
3. **Log aggregation** — Centralized logging with Wazuh, ELK, or Graylog
4. **Documentation** — Keep an inventory of what runs where

---

*For Irvin's Tech Services — Built to Northrop standards, simplified for business.*
