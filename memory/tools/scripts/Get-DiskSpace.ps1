#Requires -Version 5.1
<#
.SYNOPSIS
    MSP Disk Space Checker - Reports all drives with low-space warnings.

.DESCRIPTION
    Checks all fixed disk volumes, reports usage, and warns on low space.
    Supports remote machines. Can output to console, CSV, or both.

.PARAMETER ComputerName
    Target computer(s). Defaults to local machine.

.PARAMETER WarnThresholdPct
    Warn if free space is below this percentage (default: 20)

.PARAMETER CriticalThresholdPct
    Critical alert if free space is below this percentage (default: 10)

.PARAMETER OutputCsv
    Optional path to export results as CSV.

.EXAMPLE
    .\Get-DiskSpace.ps1
    .\Get-DiskSpace.ps1 -ComputerName "SERVER01","SERVER02" -WarnThresholdPct 25
    .\Get-DiskSpace.ps1 -OutputCsv "C:\Temp\disk_report.csv"
#>

param(
    [string[]]$ComputerName = @($env:COMPUTERNAME),
    [int]$WarnThresholdPct = 20,
    [int]$CriticalThresholdPct = 10,
    [string]$OutputCsv = ""
)

$results = [System.Collections.Generic.List[PSObject]]::new()

foreach ($computer in $ComputerName) {
    Write-Host "`n[*] Checking $computer..." -ForegroundColor Cyan

    try {
        $disks = Get-CimInstance -ClassName Win32_LogicalDisk `
            -ComputerName $computer `
            -Filter "DriveType=3" `
            -ErrorAction Stop

        foreach ($disk in $disks) {
            $totalGB  = [math]::Round($disk.Size / 1GB, 2)
            $freeGB   = [math]::Round($disk.FreeSpace / 1GB, 2)
            $usedGB   = [math]::Round(($disk.Size - $disk.FreeSpace) / 1GB, 2)
            $freePct  = if ($disk.Size -gt 0) { [math]::Round(($disk.FreeSpace / $disk.Size) * 100, 1) } else { 0 }

            $status = "OK"
            $color  = "Green"
            if ($freePct -le $CriticalThresholdPct) {
                $status = "CRITICAL"
                $color  = "Red"
            } elseif ($freePct -le $WarnThresholdPct) {
                $status = "WARNING"
                $color  = "Yellow"
            }

            # Build progress bar
            $barWidth  = 30
            $filled    = [math]::Round((1 - $freePct/100) * $barWidth)
            $bar       = "#" * $filled + "-" * ($barWidth - $filled)

            $obj = [PSCustomObject]@{
                Computer    = $computer
                Drive       = $disk.DeviceID
                Label       = $disk.VolumeName
                TotalGB     = $totalGB
                UsedGB      = $usedGB
                FreeGB      = $freeGB
                FreePct     = $freePct
                Status      = $status
                FileSystem  = $disk.FileSystem
            }
            $results.Add($obj)

            # Console output
            $label = if ($disk.VolumeName) { " [$($disk.VolumeName)]" } else { "" }
            Write-Host ("  {0}{1}  [{2}]  Total: {3,7:N1} GB  Used: {4,7:N1} GB  Free: {5,7:N1} GB ({6,5:N1}%)  " -f `
                $disk.DeviceID, $label, $bar, $totalGB, $usedGB, $freeGB, $freePct) -NoNewline
            Write-Host "[$status]" -ForegroundColor $color
        }
    } catch {
        Write-Host "  [!] Failed to connect to $computer : $_" -ForegroundColor Red
        $results.Add([PSCustomObject]@{
            Computer = $computer; Drive = "N/A"; Label = "ERROR"; TotalGB = 0;
            UsedGB = 0; FreeGB = 0; FreePct = 0; Status = "UNREACHABLE"; FileSystem = ""
        })
    }
}

# Summary
Write-Host "`n--- SUMMARY ---" -ForegroundColor Cyan
$critical = $results | Where-Object { $_.Status -eq "CRITICAL" }
$warnings  = $results | Where-Object { $_.Status -eq "WARNING" }

if ($critical.Count -gt 0) {
    Write-Host "  CRITICAL ($($critical.Count)):" -ForegroundColor Red
    $critical | ForEach-Object { Write-Host "    $($_.Computer) $($_.Drive) - $($_.FreePct)% free" -ForegroundColor Red }
}
if ($warnings.Count -gt 0) {
    Write-Host "  WARNING  ($($warnings.Count)):" -ForegroundColor Yellow
    $warnings | ForEach-Object { Write-Host "    $($_.Computer) $($_.Drive) - $($_.FreePct)% free" -ForegroundColor Yellow }
}
if ($critical.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "  All drives within normal thresholds. ✓" -ForegroundColor Green
}

# CSV export
if ($OutputCsv -ne "") {
    $results | Export-Csv -Path $OutputCsv -NoTypeInformation -Encoding UTF8
    Write-Host "`n[+] CSV exported to: $OutputCsv" -ForegroundColor Green
}

# Return object for pipeline use
return $results
