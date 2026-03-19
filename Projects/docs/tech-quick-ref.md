# ⚡ Field Tech Quick Reference Card

**Print this page and laminate for field use**

---

## 🔗 REMOTE ACCESS

### RDP (Windows)
| Item | Value/Command |
|------|---------------|
| Default Port | `3389` |
| Connect | `mstsc` → Enter IP/hostname |
| Firewall Rule | `Windows Firewall → Allow RDP` |

### TeamViewer
| Item | Value/Command |
|------|---------------|
| QuickConnect | `teamviewer.com` |
| Unattended Access | Host config → Set password |
| Restart TV Service | `taskkill /IM teamviewer.exe /F` then relaunch |

### AnyDesk
| Item | Value/Command |
|------|---------------|
| Quick Connect | `anydesk.com` |
| Unattended Access | Settings → Security → Enable |
| Reset ID | Uninstall → Reinstall |

---

## 🔐 VPN CLIENT SETUP

### Windows Built-in (SSTP/IKEv2)
```
Settings → Network & Internet → VPN → Add a VPN connection
```
- **Protocol:** IKEv2 (most compatible)
- **Auth:** Username/Password or Certificate

### OpenVPN
```bash
# Install
winget install OpenVPNTechnologies.OpenVPNConnect

# Connect
openvpn --config <profile>.ovpn
```

### WireGuard
```bash
# Install client
winget install WireGuard.WireGuard

# Import config to %ProgramFiles%\WireGuard\Config\
```

---

## 🔄 COMMON PASSWORD RESETS

### Windows Local Admin
```cmd
# Boot to WinRE → CMD → reset password
net user administrator /active:yes
net user <username> <newpassword>
```

### Windows AD (with domain join)
```
1. Ctrl+Alt+Del → "Change a password"
2. Or: IT admin via ADUC
3. Emergency: DSRM mode boot
```

### Microsoft 365 (via Admin)
```
admin.microsoft.com → Users → Reset password
```

### Router/ Firewall Default
| Brand | Default User | Default Pass |
|-------|--------------|--------------|
| Cisco | `admin` | `admin` or `cisco` |
| Ubiquiti | `ubnt` | `ubnt` |
| Netgate/PFSense | `admin` | `pfsense` |
| ASUS | `admin` | `admin` |

---

## 💾 BACKUP STATUS CHECK

### Windows Backup (File History / WBAdmin)
```powershell
# Check backup status
Get-WBJob -Previous 1

# List backups
Get-WBBackupVolume
```

### Veeam
```powershell
# Check last job status (Veeam PowerShell)
Get-VBRBackupSession | Sort -Desc EndTime | Select -First 5
```

### Synology/Cube
- Login → Control Panel → Backup & Replication → Job History

### Generic Check
```
1. Check last backup timestamp
2. Verify destination reachable (NAS/cloud)
3. Test restore of 1 file
```

---

## 🛠 RMM QUICK COMMANDS

### ConnectWise Automate / Control
| Action | Command |
|--------|---------|
| Agent Install | `https://download.connectwise.com/...` |
| Push Agent | Via console → Scripts → Agent Deploy |
| Remote Control | Right-click → Remote Control |

### Datto RMM
| Action | Command |
|--------|---------|
| Agent Status | `dmagentctl status` (via SSH) |
| Restart Agent | `dmagentctl restart` |
| Run Policy | Via Datto portal → Policies |

### NinjaOne / NinjaRMM
| Action | Command |
|--------|---------|
| Agent Install | `msiexec /i NinjaRMMSetup.msi /qn` |
| Remote Session | From portal → Click device → Remote |
| Scripts | Scripts → Run on endpoint |

### Generic Agent Commands (Windows)
```cmd
# List running services
sc query type= service state= running | findstr "ninja datto automate"

# Check agent log location
C:\ProgramData\<Vendor>\Logs

# Restart agent service
net stop <agent_service> && net start <agent_service>
```

---

## 📞 ESCALATION

**Irvin Avitia** — [YOUR CONTACT NUMBER]
- Priority issues: Cybersecurity, hardware repair, infrastructure
- Email: [YOUR EMAIL]

---

*Print → Laminate → Keep in truck kit*
