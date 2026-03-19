#Requires -Version 5.1
<#
.SYNOPSIS
    MSP User Account Lister - Gets local users and optionally AD users with last logon info.

.DESCRIPTION
    Lists all local user accounts with status, last logon, and group membership.
    If run on a domain member, can also query Active Directory users.
    Flags stale accounts (no logon in X days) and disabled accounts.

.PARAMETER IncludeAD
    Also query Active Directory (requires RSAT or domain controller)

.PARAMETER StaleThresholdDays
    Flag accounts not logged in for this many days (default: 90)

.PARAMETER OUFilter
    AD OU to filter by (e.g. "OU=Users,DC=corp,DC=local")

.PARAMETER OutputCsv
    Optional path to export CSV report

.PARAMETER ShowDisabled
    Include disabled accounts in output (hidden by default)

.EXAMPLE
    .\Get-UserAccounts.ps1
    .\Get-UserAccounts.ps1 -IncludeAD -StaleThresholdDays 60
    .\Get-UserAccounts.ps1 -IncludeAD -OUFilter "OU=Users,DC=corp,DC=local" -OutputCsv "C:\Temp\users.csv"
#>

param(
    [switch]$IncludeAD,
    [int]$StaleThresholdDays = 90,
    [string]$OUFilter = "",
    [string]$OutputCsv = "",
    [switch]$ShowDisabled
)

$results   = [System.Collections.Generic.List[PSObject]]::new()
$staleDate = (Get-Date).AddDays(-$StaleThresholdDays)

# ── Local Users ───────────────────────────────────────────
Write-Host "`n[*] Local User Accounts on $env:COMPUTERNAME" -ForegroundColor Cyan
Write-Host ("  {0,-20} {1,-10} {2,-8} {3,-22} {4,-8} {5}" -f "Username", "Enabled", "PwdExp", "LastLogon", "Stale", "Groups")
Write-Host ("  " + "-" * 90)

try {
    $localUsers = Get-LocalUser -ErrorAction Stop

    foreach ($user in $localUsers) {
        if (-not $ShowDisabled -and -not $user.Enabled) { continue }

        # Get last logon from event log (4624) or WMI
        $lastLogon = $null
        try {
            $wmiacct = Get-CimInstance -ClassName Win32_UserAccount -Filter "Name='$($user.Name)'" -ErrorAction SilentlyContinue
            # Try Win32_NetworkLoginProfile for last logon
            $profile = Get-CimInstance -ClassName Win32_NetworkLoginProfile -Filter "Name='$env:COMPUTERNAME\\$($user.Name)'" -ErrorAction SilentlyContinue
            if ($profile -and $profile.LastLogon) {
                $lastLogon = $profile.LastLogon
            } elseif ($user.LastLogon) {
                $lastLogon = $user.LastLogon
            }
        } catch { }

        $lastLogonStr = if ($lastLogon) { $lastLogon.ToString("yyyy-MM-dd HH:mm") } else { "Never / Unknown" }
        $isStale      = if ($lastLogon -and $lastLogon -lt $staleDate) { "YES" } elseif (-not $lastLogon) { "?" } else { "no" }

        # Group membership
        try {
            $groups = Get-LocalGroup | Where-Object {
                (Get-LocalGroupMember $_ -ErrorAction SilentlyContinue | Where-Object { $_.Name -like "*\$($user.Name)" -or $_.Name -eq $user.Name })
            } | Select-Object -ExpandProperty Name
            $groupStr = $groups -join ", "
        } catch {
            $groupStr = "N/A"
        }

        $pwdExpires = if ($user.PasswordExpires) { $user.PasswordExpires.ToString("yyyy-MM-dd") } else { "Never" }
        $rowColor   = if (-not $user.Enabled) { "DarkGray" } elseif ($isStale -eq "YES") { "Yellow" } else { "White" }

        $obj = [PSCustomObject]@{
            Source      = "Local"
            Computer    = $env:COMPUTERNAME
            Username    = $user.Name
            FullName    = $user.FullName
            Enabled     = $user.Enabled
            PwdExpires  = $pwdExpires
            LastLogon   = $lastLogonStr
            Stale       = $isStale
            Groups      = $groupStr
            Description = $user.Description
        }
        $results.Add($obj)

        Write-Host ("  {0,-20} {1,-10} {2,-8} {3,-22} {4,-8} {5}" -f `
            $user.Name, $user.Enabled, $pwdExpires, $lastLogonStr, $isStale, ($groupStr | ForEach-Object { $_.Substring(0,[Math]::Min(30,$_.Length)) })) -ForegroundColor $rowColor
    }
} catch {
    Write-Host "  [!] Could not enumerate local users: $_" -ForegroundColor Red
}

# ── Active Directory Users ─────────────────────────────────
if ($IncludeAD) {
    Write-Host "`n[*] Active Directory Users" -ForegroundColor Cyan

    # Check if AD module available
    $adAvailable = Get-Module -ListAvailable -Name ActiveDirectory -ErrorAction SilentlyContinue
    if (-not $adAvailable) {
        Write-Host "  [!] ActiveDirectory module not found. Install RSAT: Add-WindowsCapability -Online -Name Rsat.ActiveDirectory.DS-LDS.Tools~~~~0.0.1.0" -ForegroundColor Red
    } else {
        Import-Module ActiveDirectory -ErrorAction SilentlyContinue

        Write-Host ("  {0,-25} {1,-10} {2,-22} {3,-8} {4}" -f "Username", "Enabled", "LastLogon", "Stale", "Display Name")
        Write-Host ("  " + "-" * 90)

        try {
            $adParams = @{
                Filter     = "*"
                Properties = @("LastLogonDate","PasswordExpired","PasswordNeverExpires","LockedOut","Description","Department","Title")
            }
            if ($OUFilter -ne "") { $adParams["SearchBase"] = $OUFilter }

            $adUsers = Get-ADUser @adParams -ErrorAction Stop

            foreach ($adUser in ($adUsers | Sort-Object SamAccountName)) {
                if (-not $ShowDisabled -and -not $adUser.Enabled) { continue }

                $lastLogon    = $adUser.LastLogonDate
                $lastLogonStr = if ($lastLogon) { $lastLogon.ToString("yyyy-MM-dd HH:mm") } else { "Never / Unknown" }
                $isStale      = if ($lastLogon -and $lastLogon -lt $staleDate) { "YES" } elseif (-not $lastLogon) { "?" } else { "no" }
                $rowColor     = if (-not $adUser.Enabled) { "DarkGray" } elseif ($isStale -eq "YES") { "Yellow" } elseif ($adUser.LockedOut) { "Red" } else { "White" }
                $suffix       = if ($adUser.LockedOut) { " [LOCKED]" } elseif ($adUser.PasswordExpired) { " [PWDEXP]" } else { "" }

                $obj = [PSCustomObject]@{
                    Source      = "AD"
                    Computer    = $env:USERDOMAIN
                    Username    = $adUser.SamAccountName
                    FullName    = $adUser.DisplayName
                    Enabled     = $adUser.Enabled
                    PwdExpires  = if ($adUser.PasswordNeverExpires) { "Never" } else { "Yes" }
                    LastLogon   = $lastLogonStr
                    Stale       = $isStale
                    Groups      = ""
                    Description = "$($adUser.Title) | $($adUser.Department)$suffix"
                }
                $results.Add($obj)

                Write-Host ("  {0,-25} {1,-10} {2,-22} {3,-8} {4}{5}" -f `
                    $adUser.SamAccountName, $adUser.Enabled, $lastLogonStr, $isStale, $adUser.DisplayName, $suffix) -ForegroundColor $rowColor
            }
        } catch {
            Write-Host "  [!] AD query failed: $_" -ForegroundColor Red
        }
    }
}

# ── Summary ───────────────────────────────────────────────
Write-Host "`n--- SUMMARY ---" -ForegroundColor Cyan
$enabled  = $results | Where-Object { $_.Enabled -eq $true }
$disabled = $results | Where-Object { $_.Enabled -eq $false }
$stale    = $results | Where-Object { $_.Stale -eq "YES" }

Write-Host "  Total accounts:   $($results.Count)"
Write-Host "  Enabled:          $($enabled.Count)" -ForegroundColor Green
if ($disabled.Count -gt 0) { Write-Host "  Disabled:         $($disabled.Count)" -ForegroundColor DarkGray }
if ($stale.Count -gt 0) {
    Write-Host "  Stale (>$($StaleThresholdDays)d):    $($stale.Count)" -ForegroundColor Yellow
    $stale | ForEach-Object { Write-Host "    - $($_.Username) (Last: $($_.LastLogon))" -ForegroundColor Yellow }
}

# CSV export
if ($OutputCsv -ne "") {
    $results | Export-Csv -Path $OutputCsv -NoTypeInformation -Encoding UTF8
    Write-Host "`n[+] CSV exported to: $OutputCsv" -ForegroundColor Green
}

return $results
