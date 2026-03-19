#Requires -Version 5.1
<#
.SYNOPSIS
    MSP Service Status Monitor - Checks critical services and can auto-restart stopped ones.

.DESCRIPTION
    Monitors a configurable list of critical Windows services.
    Reports status, can attempt restarts, and logs results.
    Designed for scheduled task use on managed endpoints.

.PARAMETER ServiceList
    Array of service names to monitor. Uses built-in MSP defaults if not specified.

.PARAMETER AutoRestart
    Attempt to restart stopped services automatically.

.PARAMETER ComputerName
    Target computer(s). Defaults to localhost.

.PARAMETER LogPath
    Optional path to append log entries.

.PARAMETER WarnOnly
    Report issues but do not restart services.

.EXAMPLE
    .\Watch-Services.ps1
    .\Watch-Services.ps1 -AutoRestart -LogPath "C:\Logs\services.log"
    .\Watch-Services.ps1 -ServiceList "wuauserv","bits","windefend" -AutoRestart
    .\Watch-Services.ps1 -ComputerName "SERVER01","SERVER02" -WarnOnly
#>

param(
    [string[]]$ServiceList = @(),
    [switch]$AutoRestart,
    [string[]]$ComputerName = @($env:COMPUTERNAME),
    [string]$LogPath = "",
    [switch]$WarnOnly
)

# Default critical service list for MSP environments
$defaultServices = @(
    # Windows core
    "EventLog",          # Windows Event Log
    "Winmgmt",           # WMI
    "RpcSs",             # RPC
    "Dnscache",          # DNS Client
    "Dhcp",              # DHCP Client
    "Spooler",           # Print Spooler
    "wuauserv",          # Windows Update
    "bits",              # Background Intelligent Transfer
    # Security
    "WinDefend",         # Windows Defender
    "mpssvc",            # Windows Firewall
    "wscsvc",            # Security Center
    # Remote management
    "WinRM",             # Windows Remote Management
    "TermService",       # Remote Desktop
    # Backup/VSS
    "VSS",               # Volume Shadow Copy
    "wbengine",          # Windows Backup Engine
    # Common server services (check if exist)
    "LanmanServer",      # File sharing
    "LanmanWorkstation", # Workstation (SMB client)
    "W32Time"            # Windows Time
)

if ($ServiceList.Count -gt 0) {
    $targetServices = $ServiceList
} else {
    $targetServices = $defaultServices
}

$logLines  = [System.Collections.Generic.List[string]]::new()
$results   = [System.Collections.Generic.List[PSObject]]::new()
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $entry = "[$timestamp][$Level] $Message"
    $logLines.Add($entry)
    $color = switch ($Level) {
        "WARN"    { "Yellow" }
        "ERROR"   { "Red" }
        "SUCCESS" { "Green" }
        default   { "White" }
    }
    Write-Host $entry -ForegroundColor $color
}

foreach ($computer in $ComputerName) {
    Write-Host "`n[*] Monitoring services on: $computer" -ForegroundColor Cyan
    Write-Host ("  {0,-35} {1,-12} {2,-10} {3}" -f "Service", "Status", "StartType", "Action")
    Write-Host ("  " + "-" * 75)

    foreach ($svcName in $targetServices) {
        try {
            $svc = Get-Service -Name $svcName -ComputerName $computer -ErrorAction Stop
            $status    = $svc.Status
            $startType = $svc.StartType
            $action    = "—"
            $rowColor  = "White"

            if ($status -eq "Running") {
                $rowColor = "Green"
            } elseif ($status -eq "Stopped") {
                if ($startType -eq "Disabled") {
                    $rowColor = "Gray"
                    $action   = "Disabled (skip)"
                } elseif ($AutoRestart -and -not $WarnOnly) {
                    try {
                        Start-Service -Name $svcName -ErrorAction Stop
                        $svc    = Get-Service -Name $svcName -ComputerName $computer
                        $status = $svc.Status
                        if ($status -eq "Running") {
                            $action   = "✓ RESTARTED"
                            $rowColor = "Yellow"
                            Write-Log "Service '$svcName' on $computer was stopped — restarted successfully." "SUCCESS"
                        } else {
                            $action   = "✗ RESTART FAILED"
                            $rowColor = "Red"
                            Write-Log "Service '$svcName' on $computer — restart attempted but still not running." "ERROR"
                        }
                    } catch {
                        $action   = "✗ ERROR: $_"
                        $rowColor = "Red"
                        Write-Log "Service '$svcName' on $computer — restart failed: $_" "ERROR"
                    }
                } else {
                    $action   = "⚠ STOPPED"
                    $rowColor = "Yellow"
                    Write-Log "Service '$svcName' on $computer is STOPPED (start type: $startType)." "WARN"
                }
            } elseif ($status -in "Paused","StopPending","StartPending") {
                $rowColor = "Yellow"
                $action   = "⚠ Check manually"
                Write-Log "Service '$svcName' on $computer is in state: $status" "WARN"
            }

            $row = [PSCustomObject]@{
                Computer    = $computer
                ServiceName = $svcName
                DisplayName = $svc.DisplayName
                Status      = $status
                StartType   = $startType
                Action      = $action
            }
            $results.Add($row)

            Write-Host ("  {0,-35} {1,-12} {2,-10} {3}" -f $svc.DisplayName.Substring(0, [Math]::Min(34,$svc.DisplayName.Length)), $status, $startType, $action) -ForegroundColor $rowColor

        } catch [Microsoft.PowerShell.Commands.ServiceCommandException] {
            # Service not installed — skip silently for defaults
            if ($ServiceList.Count -gt 0) {
                Write-Host ("  {0,-35} {1,-12} {2,-10} {3}" -f $svcName, "NOT FOUND", "N/A", "Not installed") -ForegroundColor DarkGray
            }
        } catch {
            Write-Host ("  {0,-35} {1}" -f $svcName, "ERROR: $_") -ForegroundColor Red
            Write-Log "Error querying '$svcName' on $computer: $_" "ERROR"
        }
    }
}

# Summary
Write-Host "`n--- SUMMARY ---" -ForegroundColor Cyan
$stopped  = $results | Where-Object { $_.Status -eq "Stopped" -and $_.StartType -ne "Disabled" }
$running  = $results | Where-Object { $_.Status -eq "Running" }
$problems = $results | Where-Object { $_.Status -notin @("Running","Stopped") }

Write-Host "  Running:  $($running.Count)" -ForegroundColor Green
if ($stopped.Count -gt 0)  { Write-Host "  Stopped:  $($stopped.Count)" -ForegroundColor Yellow }
if ($problems.Count -gt 0) { Write-Host "  Issues:   $($problems.Count)" -ForegroundColor Red }
if ($stopped.Count -eq 0 -and $problems.Count -eq 0) {
    Write-Host "  All critical services are running. ✓" -ForegroundColor Green
}

# Log file append
if ($LogPath -ne "" -and $logLines.Count -gt 0) {
    $logLines | Add-Content -Path $LogPath -Encoding UTF8
    Write-Host "`n[+] Log appended to: $LogPath" -ForegroundColor Green
}

return $results
