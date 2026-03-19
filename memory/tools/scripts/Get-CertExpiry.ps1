#Requires -Version 5.1
<#
.SYNOPSIS
    MSP Certificate Expiry Checker - Finds SSL/TLS certs expiring soon.

.DESCRIPTION
    Checks Windows certificate stores (local machine and user) for expiring certs.
    Optionally checks remote HTTPS endpoints for their server certificates.
    Outputs sorted list with days-until-expiry, flags critical/warning/OK status.

.PARAMETER WarnDays
    Warn if cert expires within this many days (default: 60)

.PARAMETER CriticalDays
    Critical alert if cert expires within this many days (default: 14)

.PARAMETER StoreLocations
    Certificate stores to check (default: LocalMachine, CurrentUser)

.PARAMETER StoreName
    Store names to check (default: My, WebHosting, Root, CA)

.PARAMETER RemoteHosts
    Array of hostnames/IPs to check via live TLS connection (e.g. "google.com:443")

.PARAMETER IncludeExpired
    Include already-expired certificates in output

.PARAMETER OutputCsv
    Optional CSV export path

.EXAMPLE
    .\Get-CertExpiry.ps1
    .\Get-CertExpiry.ps1 -WarnDays 90 -CriticalDays 30
    .\Get-CertExpiry.ps1 -RemoteHosts "mysite.com:443","mail.mydomain.com:993"
    .\Get-CertExpiry.ps1 -IncludeExpired -OutputCsv "C:\Temp\certs.csv"
#>

param(
    [int]$WarnDays = 60,
    [int]$CriticalDays = 14,
    [string[]]$StoreLocations = @("LocalMachine","CurrentUser"),
    [string[]]$StoreName = @("My","WebHosting","Root","CA","TrustedPeople"),
    [string[]]$RemoteHosts = @(),
    [switch]$IncludeExpired,
    [string]$OutputCsv = ""
)

$results   = [System.Collections.Generic.List[PSObject]]::new()
$now       = Get-Date
$warnDate  = $now.AddDays($WarnDays)
$critDate  = $now.AddDays($CriticalDays)

function Get-CertStatus {
    param([DateTime]$NotAfter)
    $daysLeft = [math]::Round(($NotAfter - (Get-Date)).TotalDays, 0)
    if ($NotAfter -lt (Get-Date))   { return @{ Status = "EXPIRED";  Color = "Red";    Days = $daysLeft } }
    if ($NotAfter -lt $critDate) { return @{ Status = "CRITICAL"; Color = "Red";    Days = $daysLeft } }
    if ($NotAfter -lt $warnDate) { return @{ Status = "WARNING";  Color = "Yellow"; Days = $daysLeft } }
    return @{ Status = "OK"; Color = "Green"; Days = $daysLeft }
}

Write-Host "`nMSP CERTIFICATE EXPIRY REPORT" -ForegroundColor Cyan
Write-Host "Timestamp   : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "Warn at     : $WarnDays days"
Write-Host "Critical at : $CriticalDays days"
Write-Host ("=" * 80)

# ── Windows Certificate Stores ────────────────────────────
foreach ($location in $StoreLocations) {
    foreach ($store in $StoreName) {
        $storePath = "Cert:\$location\$store"
        try {
            $certs = Get-ChildItem -Path $storePath -ErrorAction SilentlyContinue
            if (-not $certs -or $certs.Count -eq 0) { continue }

            $relevant = $certs | Where-Object {
                $_.NotAfter -lt $warnDate -or ($IncludeExpired -and $_.NotAfter -lt $now)
            }
            if ($relevant.Count -eq 0) { continue }

            Write-Host "`n[*] Store: $storePath ($($certs.Count) total, $($relevant.Count) expiring)" -ForegroundColor Cyan
            Write-Host ("  {0,-45} {1,-12} {2,-8} {3,-22} {4}" -f "Subject", "Thumbprint", "Days", "Expires", "Status")
            Write-Host ("  " + "-" * 100)

            foreach ($cert in ($relevant | Sort-Object NotAfter)) {
                $info     = Get-CertStatus -NotAfter $cert.NotAfter
                $subject  = $cert.Subject
                if ($subject.Length -gt 43) { $subject = $subject.Substring(0,40) + "..." }
                $thumb    = $cert.Thumbprint.Substring(0,10) + "..."
                $daysDisp = if ($info.Days -lt 0) { "EXPIRED $([math]::Abs($info.Days))d ago" } else { "$($info.Days)d" }

                $obj = [PSCustomObject]@{
                    Source       = "Store"
                    Location     = "$location\$store"
                    Subject      = $cert.Subject
                    Thumbprint   = $cert.Thumbprint
                    Issuer       = $cert.Issuer
                    NotBefore    = $cert.NotBefore.ToString("yyyy-MM-dd")
                    NotAfter     = $cert.NotAfter.ToString("yyyy-MM-dd")
                    DaysLeft     = $info.Days
                    Status       = $info.Status
                    SAN          = ($cert.DnsNameList.Unicode -join "; ")
                }
                $results.Add($obj)

                Write-Host ("  {0,-45} {1,-12} {2,-8} {3,-22} {4}" -f `
                    $subject, $thumb, $daysDisp, $cert.NotAfter.ToString("yyyy-MM-dd"), $info.Status) `
                    -ForegroundColor $info.Color
            }
        } catch {
            # Store doesn't exist on this system — skip silently
        }
    }
}

# ── Remote HTTPS Certificate Checks ──────────────────────
if ($RemoteHosts.Count -gt 0) {
    Write-Host "`n[*] Remote TLS Certificate Checks" -ForegroundColor Cyan
    Write-Host ("  {0,-35} {1,-5} {2,-45} {3,-12} {4,-8} {5}" -f "Host", "Port", "Subject/CN", "Expires", "Days", "Status")
    Write-Host ("  " + "-" * 115)

    foreach ($hostEntry in $RemoteHosts) {
        $parts    = $hostEntry -split ":"
        $hostname = $parts[0]
        $port     = if ($parts.Count -gt 1) { [int]$parts[1] } else { 443 }

        try {
            $tcpClient = New-Object System.Net.Sockets.TcpClient
            $tcpClient.Connect($hostname, $port)
            $sslStream = New-Object System.Net.Security.SslStream($tcpClient.GetStream(), $false, {$true})
            $sslStream.AuthenticateAsClient($hostname)
            $cert      = [System.Security.Cryptography.X509Certificates.X509Certificate2]$sslStream.RemoteCertificate
            $sslStream.Close()
            $tcpClient.Close()

            $notAfter = [DateTime]::Parse($cert.GetExpirationDateString())
            $info     = Get-CertStatus -NotAfter $notAfter
            $cn       = if ($cert.Subject -match "CN=([^,]+)") { $matches[1] } else { $cert.Subject }
            if ($cn.Length -gt 43) { $cn = $cn.Substring(0,40) + "..." }
            $daysDisp = if ($info.Days -lt 0) { "EXPIRED" } else { "$($info.Days)d" }

            $obj = [PSCustomObject]@{
                Source     = "Remote"
                Location   = "$hostname`:$port"
                Subject    = $cert.Subject
                Thumbprint = $cert.Thumbprint
                Issuer     = $cert.Issuer
                NotBefore  = [DateTime]::Parse($cert.GetEffectiveDateString()).ToString("yyyy-MM-dd")
                NotAfter   = $notAfter.ToString("yyyy-MM-dd")
                DaysLeft   = $info.Days
                Status     = $info.Status
                SAN        = ""
            }
            $results.Add($obj)

            Write-Host ("  {0,-35} {1,-5} {2,-45} {3,-12} {4,-8} {5}" -f `
                $hostname, $port, $cn, $notAfter.ToString("yyyy-MM-dd"), $daysDisp, $info.Status) `
                -ForegroundColor $info.Color

        } catch {
            Write-Host ("  {0,-35} {1,-5} {2}" -f $hostname, $port, "ERROR: $_") -ForegroundColor Red
            $results.Add([PSCustomObject]@{
                Source = "Remote"; Location = "$hostname`:$port"; Subject = "N/A"; Thumbprint = "N/A"
                Issuer = "N/A"; NotBefore = "N/A"; NotAfter = "N/A"; DaysLeft = -1; Status = "ERROR"; SAN = ""
            })
        }
    }
}

# ── Summary ───────────────────────────────────────────────
Write-Host "`n--- SUMMARY ---" -ForegroundColor Cyan
$expired  = $results | Where-Object { $_.Status -eq "EXPIRED" }
$critical = $results | Where-Object { $_.Status -eq "CRITICAL" }
$warnings = $results | Where-Object { $_.Status -eq "WARNING" }
$ok       = $results | Where-Object { $_.Status -eq "OK" }

Write-Host "  Total flagged : $($results.Count)"
if ($expired.Count -gt 0)  { Write-Host "  EXPIRED:  $($expired.Count)" -ForegroundColor Red }
if ($critical.Count -gt 0) { Write-Host "  CRITICAL: $($critical.Count)  (expire within $CriticalDays days)" -ForegroundColor Red }
if ($warnings.Count -gt 0) { Write-Host "  WARNING:  $($warnings.Count)  (expire within $WarnDays days)" -ForegroundColor Yellow }
if ($ok.Count -gt 0)       { Write-Host "  OK:       $($ok.Count)" -ForegroundColor Green }

$urgentCount = $expired.Count + $critical.Count
if ($urgentCount -gt 0) {
    Write-Host "`n  ⚠ $urgentCount certificate(s) need IMMEDIATE attention!" -ForegroundColor Red
} elseif ($warnings.Count -gt 0) {
    Write-Host "`n  Plan renewals for $($warnings.Count) certificate(s) within $WarnDays days." -ForegroundColor Yellow
} elseif ($results.Count -eq 0) {
    Write-Host "`n  ✓ No certificates expiring within $WarnDays days." -ForegroundColor Green
}

# CSV
if ($OutputCsv -ne "") {
    $results | Export-Csv -Path $OutputCsv -NoTypeInformation -Encoding UTF8
    Write-Host "`n[+] CSV exported to: $OutputCsv" -ForegroundColor Green
}

return $results
