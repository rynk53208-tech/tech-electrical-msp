#Requires -Version 5.1
<#
.SYNOPSIS
    MSP Backup Verification - Checks backup files exist, reports age and size.

.DESCRIPTION
    Scans configured backup locations for recent backup files.
    Warns if backups are missing, too old, or suspiciously small.
    Supports UNC paths, local drives, and optional Windows Backup status check.

.PARAMETER BackupPaths
    Array of backup locations to check. Uses defaults if not specified.

.PARAMETER MaxAgeHours
    Maximum acceptable backup age in hours (default: 25 — allows for daily + 1h drift)

.PARAMETER MinSizeMB
    Minimum acceptable file size in MB (default: 1)

.PARAMETER Extensions
    File extensions to look for (default: .bak, .zip, .7z, .tar, .vhd, .vhdx, .img, .bkf)

.PARAMETER LogPath
    Optional path to append results log

.PARAMETER CheckWindowsBackup
    Also check Windows Server Backup status

.EXAMPLE
    .\Test-BackupHealth.ps1
    .\Test-BackupHealth.ps1 -BackupPaths "D:\Backups","\\NAS01\Backups\$env:COMPUTERNAME" -MaxAgeHours 26
    .\Test-BackupHealth.ps1 -CheckWindowsBackup -LogPath "C:\Logs\backup-check.log"
#>

param(
    [string[]]$BackupPaths = @(),
    [int]$MaxAgeHours = 25,
    [double]$MinSizeMB = 1,
    [string[]]$Extensions = @(".bak",".zip",".7z",".tar",".gz",".vhd",".vhdx",".img",".bkf",".wbcat"),
    [string]$LogPath = "",
    [switch]$CheckWindowsBackup
)

# Default backup paths to check if none specified
$defaultPaths = @(
    "C:\Backup",
    "D:\Backup",
    "D:\Backups",
    "E:\Backups",
    "\\localhost\Backup$",
    "$env:SystemDrive\WindowsImageBackup"
)

if ($BackupPaths.Count -gt 0) {
    $targetPaths = $BackupPaths
} else {
    $targetPaths = $defaultPaths
}

$results   = [System.Collections.Generic.List[PSObject]]::new()
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$logLines  = [System.Collections.Generic.List[string]]::new()
$cutoff    = (Get-Date).AddHours(-$MaxAgeHours)

function Write-Log {
    param([string]$Msg, [string]$Level = "INFO")
    $entry = "[$timestamp][$Level] $Msg"
    $logLines.Add($entry)
}

Write-Host "`nMSP BACKUP VERIFICATION REPORT" -ForegroundColor Cyan
Write-Host "Timestamp : $timestamp"
Write-Host "Max Age   : $MaxAgeHours hours (cutoff: $($cutoff.ToString('yyyy-MM-dd HH:mm')))"
Write-Host "Min Size  : $MinSizeMB MB"
Write-Host ("=" * 70)

foreach ($path in $targetPaths) {
    Write-Host "`n[*] Checking: $path" -ForegroundColor Cyan

    if (-not (Test-Path $path -ErrorAction SilentlyContinue)) {
        Write-Host "  [SKIP] Path does not exist or is inaccessible." -ForegroundColor DarkGray
        $results.Add([PSCustomObject]@{
            Path = $path; FileName = "N/A"; SizeMB = 0; Age = "N/A"
            AgeHours = -1; Modified = "N/A"; Status = "PATH_MISSING"; Issue = "Path not found"
        })
        Write-Log "Path not found: $path" "WARN"
        continue
    }

    # Find backup files
    $files = @()
    try {
        $files = Get-ChildItem -Path $path -Recurse -File -ErrorAction SilentlyContinue |
            Where-Object { $Extensions -contains $_.Extension.ToLower() } |
            Sort-Object LastWriteTime -Descending
    } catch {
        Write-Host "  [!] Error reading path: $_" -ForegroundColor Red
        continue
    }

    if ($files.Count -eq 0) {
        Write-Host "  [!] NO BACKUP FILES FOUND in this location!" -ForegroundColor Red
        Write-Log "No backup files found at: $path" "ERROR"
        $results.Add([PSCustomObject]@{
            Path = $path; FileName = "NONE"; SizeMB = 0; Age = "N/A"
            AgeHours = -1; Modified = "N/A"; Status = "NO_FILES"; Issue = "No backup files found"
        })
        continue
    }

    Write-Host "  Found $($files.Count) backup file(s). Newest:" -ForegroundColor White
    Write-Host ("  {0,-40} {1,10} {2,-22} {3,-10} {4}" -f "File", "Size", "Modified", "Age", "Status")
    Write-Host ("  " + "-" * 95)

    # Check top 5 files, flag the newest
    $shown = 0
    foreach ($file in ($files | Select-Object -First 10)) {
        $sizeMB   = [math]::Round($file.Length / 1MB, 2)
        $ageHours = [math]::Round((New-TimeSpan -Start $file.LastWriteTime -End (Get-Date)).TotalHours, 1)
        $ageStr   = if ($ageHours -lt 1) { "<1h" } elseif ($ageHours -lt 24) { "${ageHours}h" } else { "{0:N1}d" -f ($ageHours/24) }

        $status = "OK"
        $issue  = ""
        $color  = "Green"

        if ($file.LastWriteTime -lt $cutoff) {
            $status = "STALE"
            $issue  = "Older than $MaxAgeHours hours"
            $color  = "Red"
        }
        if ($sizeMB -lt $MinSizeMB) {
            $status = if ($status -eq "OK") { "SMALL" } else { "$status+SMALL" }
            $issue  += " | File too small ($sizeMB MB)"
            $color  = "Red"
        }

        $row = [PSCustomObject]@{
            Path      = $path
            FileName  = $file.Name
            SizeMB    = $sizeMB
            Age       = $ageStr
            AgeHours  = $ageHours
            Modified  = $file.LastWriteTime.ToString("yyyy-MM-dd HH:mm")
            Status    = $status
            Issue     = $issue
        }
        $results.Add($row)

        if ($shown -lt 5) {
            $nameShort = $file.Name
            if ($nameShort.Length -gt 38) { $nameShort = $nameShort.Substring(0,35) + "..." }
            Write-Host ("  {0,-40} {1,8:N2} MB  {2,-22} {3,-10} {4}" -f `
                $nameShort, $sizeMB, $file.LastWriteTime.ToString("yyyy-MM-dd HH:mm"), $ageStr, $status) -ForegroundColor $color
            $shown++
        }

        if ($status -ne "OK") {
            Write-Log "Backup issue [$status] at $path\$($file.Name): $issue" "WARN"
        }
    }
    if ($files.Count -gt 5) {
        Write-Host "  ... and $($files.Count - 5) older files" -ForegroundColor DarkGray
    }
}

# ── Windows Server Backup ─────────────────────────────────
if ($CheckWindowsBackup) {
    Write-Host "`n[*] Windows Server Backup Status" -ForegroundColor Cyan
    try {
        $wbSvc = Get-Service -Name wbengine -ErrorAction SilentlyContinue
        if ($wbSvc) {
            Write-Host "  WSB Engine: $($wbSvc.Status)" -ForegroundColor (if ($wbSvc.Status -eq "Running") { "Green" } else { "Yellow" })
        }
        # Get last backup via wbadmin
        $wbInfo = & wbadmin get status 2>&1
        if ($LASTEXITCODE -eq 0) {
            $wbInfo | ForEach-Object { Write-Host "  $_" }
        } else {
            Write-Host "  No active backup job running." -ForegroundColor Gray
        }
        # Last completed
        $wbHistory = & wbadmin get versions 2>&1
        if ($wbHistory) {
            Write-Host "`n  Recent versions:" -ForegroundColor White
            $wbHistory | Select-Object -First 10 | ForEach-Object { Write-Host "  $_" }
        }
    } catch {
        Write-Host "  [!] Could not query Windows Server Backup: $_" -ForegroundColor Yellow
    }
}

# ── Summary ───────────────────────────────────────────────
Write-Host "`n--- SUMMARY ---" -ForegroundColor Cyan
$ok       = $results | Where-Object { $_.Status -eq "OK" }
$stale    = $results | Where-Object { $_.Status -like "*STALE*" }
$missing  = $results | Where-Object { $_.Status -in "PATH_MISSING","NO_FILES" }
$small    = $results | Where-Object { $_.Status -like "*SMALL*" }

Write-Host "  Paths checked: $($targetPaths.Count)"
Write-Host "  Files OK:      $($ok.Count)" -ForegroundColor Green
if ($stale.Count -gt 0)   { Write-Host "  STALE:         $($stale.Count)" -ForegroundColor Red }
if ($missing.Count -gt 0) { Write-Host "  MISSING:       $($missing.Count)" -ForegroundColor Red }
if ($small.Count -gt 0)   { Write-Host "  TOO SMALL:     $($small.Count)" -ForegroundColor Yellow }

$totalIssues = $stale.Count + $missing.Count + $small.Count
if ($totalIssues -eq 0) {
    Write-Host "`n  ✓ Backup health looks good!" -ForegroundColor Green
} else {
    Write-Host "`n  ⚠ $totalIssues issue(s) require attention!" -ForegroundColor Red
}

# Log
if ($LogPath -ne "" -and $logLines.Count -gt 0) {
    $logLines | Add-Content -Path $LogPath -Encoding UTF8
    Write-Host "`n[+] Log appended to: $LogPath" -ForegroundColor Green
}

return $results
