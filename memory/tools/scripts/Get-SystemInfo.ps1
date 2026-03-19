#Requires -Version 5.1
<#
.SYNOPSIS
    MSP System Info Gatherer - Collects system specs, software, and network config.

.DESCRIPTION
    Gathers comprehensive system information for MSP documentation and auditing.
    Outputs a formatted report to console and optionally to a file.

.PARAMETER OutputPath
    Optional path to save the report (e.g. C:\Temp\SystemInfo.txt)

.PARAMETER IncludeSoftware
    Include full installed software list (can be slow on large machines)

.EXAMPLE
    .\Get-SystemInfo.ps1
    .\Get-SystemInfo.ps1 -OutputPath "C:\Temp\report.txt" -IncludeSoftware

.NOTES
    Author: MSP Tools Collection
    Version: 1.0
#>

param(
    [string]$OutputPath = "",
    [switch]$IncludeSoftware
)

$output = [System.Collections.Generic.List[string]]::new()

function Write-Section {
    param([string]$Title)
    $line = "=" * 60
    $output.Add("`n$line")
    $output.Add("  $Title")
    $output.Add($line)
}

function Write-Info {
    param([string]$Label, $Value)
    $output.Add("  {0,-30} {1}" -f "${Label}:", $Value)
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$output.Add("MSP SYSTEM INFORMATION REPORT")
$output.Add("Generated: $timestamp")
$output.Add("Collected by: $env:USERNAME on $env:COMPUTERNAME")

# ── OS & Hardware ──────────────────────────────────────────
Write-Section "OPERATING SYSTEM"
$os = Get-CimInstance Win32_OperatingSystem
Write-Info "OS Name"         $os.Caption
Write-Info "Version"         $os.Version
Write-Info "Build"           $os.BuildNumber
Write-Info "Architecture"    $os.OSArchitecture
Write-Info "Install Date"    ($os.InstallDate.ToString("yyyy-MM-dd"))
Write-Info "Last Boot"       ($os.LastBootUpTime.ToString("yyyy-MM-dd HH:mm:ss"))
Write-Info "Uptime"          ("{0}d {1}h {2}m" -f (New-TimeSpan -Start $os.LastBootUpTime).Days, (New-TimeSpan -Start $os.LastBootUpTime).Hours, (New-TimeSpan -Start $os.LastBootUpTime).Minutes)
Write-Info "Registered To"   "$($os.RegisteredUser) / $($os.Organization)"

Write-Section "HARDWARE"
$cs = Get-CimInstance Win32_ComputerSystem
$bios = Get-CimInstance Win32_BIOS
Write-Info "Manufacturer"    $cs.Manufacturer
Write-Info "Model"           $cs.Model
Write-Info "Serial Number"   $bios.SerialNumber
Write-Info "BIOS Version"    $bios.SMBIOSBIOSVersion
Write-Info "BIOS Date"       $bios.ReleaseDate.ToString("yyyy-MM-dd")
Write-Info "Total RAM"       ("{0:N1} GB" -f ($cs.TotalPhysicalMemory / 1GB))
Write-Info "CPU Count"       $cs.NumberOfProcessors
Write-Info "Logical CPUs"    $cs.NumberOfLogicalProcessors

Write-Section "PROCESSOR(S)"
Get-CimInstance Win32_Processor | ForEach-Object {
    Write-Info "CPU"         "$($_.Name) @ $($_.MaxClockSpeed) MHz, $($_.NumberOfCores) cores"
}

Write-Section "MEMORY MODULES"
Get-CimInstance Win32_PhysicalMemory | ForEach-Object {
    $slot = if ($_.DeviceLocator) { $_.DeviceLocator } else { "Unknown" }
    Write-Info $slot ("{0:N0} MB @ {1} MHz - {2}" -f ($_.Capacity / 1MB), $_.Speed, $_.Manufacturer)
}

# ── Disk Info ─────────────────────────────────────────────
Write-Section "DISK DRIVES"
Get-CimInstance Win32_DiskDrive | ForEach-Object {
    Write-Info "Drive"       "$($_.Caption) | Size: $("{0:N1}" -f ($_.Size / 1GB)) GB | Interface: $($_.InterfaceType)"
}

Write-Section "LOGICAL VOLUMES"
Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | ForEach-Object {
    $pct = if ($_.Size -gt 0) { [math]::Round(($_.FreeSpace / $_.Size) * 100, 1) } else { 0 }
    $warn = if ($pct -lt 15) { "  ⚠ LOW SPACE" } else { "" }
    Write-Info "$($_.DeviceID)" ("Total: {0:N1} GB  Used: {1:N1} GB  Free: {2:N1} GB ({3}%){4}" -f ($_.Size/1GB), (($_.Size - $_.FreeSpace)/1GB), ($_.FreeSpace/1GB), $pct, $warn)
}

# ── Network ───────────────────────────────────────────────
Write-Section "NETWORK ADAPTERS"
Get-NetAdapter | Where-Object { $_.Status -ne 'Not Present' } | ForEach-Object {
    $ip = (Get-NetIPAddress -InterfaceIndex $_.ifIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue).IPAddress
    $gw = (Get-NetRoute -InterfaceIndex $_.ifIndex -DestinationPrefix "0.0.0.0/0" -ErrorAction SilentlyContinue).NextHop
    $output.Add("")
    Write-Info "  Adapter"     "$($_.Name) [$($_.InterfaceDescription)]"
    Write-Info "  Status"      $_.Status
    Write-Info "  MAC"         $_.MacAddress
    Write-Info "  IP Address"  ($ip -join ", ")
    Write-Info "  Gateway"     $gw
}

Write-Section "DNS CONFIGURATION"
$dnsServers = Get-DnsClientServerAddress -AddressFamily IPv4 | Where-Object { $_.ServerAddresses.Count -gt 0 }
$dnsServers | ForEach-Object {
    Write-Info $_.InterfaceAlias ($_.ServerAddresses -join ", ")
}

Write-Section "HOSTNAME & DOMAIN"
Write-Info "Computer Name"   $env:COMPUTERNAME
Write-Info "Domain/Workgroup" (if ($cs.PartOfDomain) { "$($cs.Domain) [DOMAIN]" } else { "$($cs.Workgroup) [WORKGROUP]" })
Write-Info "FQDN"            ([System.Net.Dns]::GetHostEntry("").HostName)

# ── Firewall ──────────────────────────────────────────────
Write-Section "WINDOWS FIREWALL"
try {
    Get-NetFirewallProfile | ForEach-Object {
        Write-Info $_.Name ("Enabled: $($_.Enabled) | DefaultInbound: $($_.DefaultInboundAction) | DefaultOutbound: $($_.DefaultOutboundAction)")
    }
} catch {
    Write-Info "Firewall" "Could not retrieve (may need elevation)"
}

# ── Installed Software ────────────────────────────────────
if ($IncludeSoftware) {
    Write-Section "INSTALLED SOFTWARE"
    $regPaths = @(
        "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*",
        "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*",
        "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*"
    )
    $software = foreach ($path in $regPaths) {
        Get-ItemProperty $path -ErrorAction SilentlyContinue |
            Where-Object { $_.DisplayName -and $_.DisplayName -ne "" } |
            Select-Object DisplayName, DisplayVersion, Publisher, InstallDate
    }
    $software | Sort-Object DisplayName -Unique | ForEach-Object {
        $date = if ($_.InstallDate) { $_.InstallDate } else { "unknown" }
        Write-Info $_.DisplayName ("v$($_.DisplayVersion) | $($_.Publisher) | Installed: $date")
    }
}

# ── Pending Updates ───────────────────────────────────────
Write-Section "WINDOWS UPDATE STATUS"
try {
    $wu = New-Object -ComObject Microsoft.Update.Session
    $searcher = $wu.CreateUpdateSearcher()
    $results = $searcher.Search("IsInstalled=0 and IsHidden=0")
    Write-Info "Pending Updates" $results.Updates.Count
    if ($results.Updates.Count -gt 0) {
        $results.Updates | Select-Object -First 5 | ForEach-Object {
            $output.Add("    - $($_.Title)")
        }
        if ($results.Updates.Count -gt 5) { $output.Add("    ... and $($results.Updates.Count - 5) more") }
    }
} catch {
    Write-Info "Pending Updates" "Unable to query (COM error or WSUS)"
}

# ── Footer ────────────────────────────────────────────────
$output.Add("`n" + ("=" * 60))
$output.Add("  END OF REPORT - $timestamp")
$output.Add("=" * 60)

# Output
$report = $output -join "`n"
Write-Host $report

if ($OutputPath -ne "") {
    $report | Out-File -FilePath $OutputPath -Encoding UTF8
    Write-Host "`n[+] Report saved to: $OutputPath" -ForegroundColor Green
}
