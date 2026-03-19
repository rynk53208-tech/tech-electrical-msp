# MSP Operations Scripts

Quick-use utilities for common IT / MSP tasks. PowerShell for Windows, Bash for Linux/macOS.

---

## Scripts

| Script | Platform | Purpose |
|--------|----------|---------|
| `Get-SystemInfo.ps1` | Windows (PS) | Full system report: OS, hardware, CPU, RAM, disk, network, software |
| `Get-DiskSpace.ps1` | Windows (PS) | Disk usage across all volumes with warn/critical thresholds |
| `Watch-Services.ps1` | Windows (PS) | Monitor critical services, optional auto-restart |
| `Get-UserAccounts.ps1` | Windows (PS) | Local + AD user accounts with last logon, stale account detection |
| `Test-BackupHealth.ps1` | Windows (PS) | Verify backup files exist, check age/size |
| `Get-CertExpiry.ps1` | Windows (PS) | SSL cert expiry in Windows stores + remote HTTPS endpoints |
| `system-info.sh` | Linux/macOS | Full system report via bash |
| `disk-space.sh` | Linux/macOS | Disk usage with low-space warnings |
| `check-services.sh` | Linux/macOS | Service health check via systemd/init.d |
| `check-certs.sh` | Linux/macOS | SSL cert expiry for local files + remote hosts |

---

## Quick Usage

### Windows (PowerShell)

```powershell
# System Info
.\Get-SystemInfo.ps1
.\Get-SystemInfo.ps1 -OutputPath "C:\Temp\report.txt" -IncludeSoftware

# Disk Space (multi-machine)
.\Get-DiskSpace.ps1
.\Get-DiskSpace.ps1 -ComputerName "SRV01","SRV02" -WarnThresholdPct 25 -OutputCsv report.csv

# Service Monitor (auto-restart stopped services)
.\Watch-Services.ps1 -AutoRestart -LogPath "C:\Logs\services.log"

# User Accounts (with AD)
.\Get-UserAccounts.ps1 -IncludeAD -StaleThresholdDays 60 -OutputCsv users.csv

# Backup Health
.\Test-BackupHealth.ps1 -BackupPaths "D:\Backups","\\NAS01\Backups" -MaxAgeHours 25

# Certificate Expiry
.\Get-CertExpiry.ps1 -WarnDays 90 -RemoteHosts "mysite.com:443","mail.corp.com:993"
```

### Linux / macOS (Bash)

```bash
# Make executable (first time)
chmod +x *.sh

# System Info
./system-info.sh
./system-info.sh --output /tmp/report.txt

# Disk Space
./disk-space.sh
./disk-space.sh --warn 25 --critical 15 --csv /tmp/disk.csv

# Service Monitor (restart requires root)
./check-services.sh
sudo ./check-services.sh --restart --log /var/log/services-check.log
./check-services.sh nginx mysql sshd   # check specific services only

# Certificate Expiry
./check-certs.sh --warn 60 --critical 14 google.com:443 mysite.com:443
./check-certs.sh --csv /tmp/certs.csv
```

---

## Scheduled Task / Cron Examples

**Windows — run disk check daily at 7 AM:**
```powershell
$action  = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NonInteractive -File C:\Scripts\Get-DiskSpace.ps1 -OutputCsv C:\Logs\disk.csv"
$trigger = New-ScheduledTaskTrigger -Daily -At 7am
Register-ScheduledTask -TaskName "MSP-DiskCheck" -Action $action -Trigger $trigger -RunLevel Highest
```

**Linux — service check every 15 minutes:**
```cron
*/15 * * * * /opt/msp-scripts/check-services.sh --log /var/log/msp-services.log
0 6  * * * /opt/msp-scripts/check-certs.sh --warn 60 --csv /var/log/certs.csv
```

---

## Notes

- All PowerShell scripts return PSObject arrays — pipe them freely: `.\Get-DiskSpace.ps1 | Where-Object Status -ne OK`
- Scripts default to localhost/current machine; most support `-ComputerName` for remoting
- CSV exports work with Excel, Grafana, or any monitoring tool
- Certificate checker requires `openssl` on Linux and uses `System.Net.Security.SslStream` on Windows

---

*Part of Tech & Electrical Services MSP Toolkit*
