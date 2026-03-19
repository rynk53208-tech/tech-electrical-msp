@echo off
:: Quick Fixes Collection for Tech Support
:: Run as Administrator for full functionality

echo ========================================
echo   Quick Fixes - Windows Batch Collection
echo ========================================
echo.

:menu
echo Select an option:
echo 1. Clear Temp Files
echo 2. Flush DNS Cache
echo 3. Reset Network (release/renew IP)
echo 4. Quick Malware Scan (Windows Defender)
echo 5. Common Registry Fixes
echo 6. Run All (1-5)
echo 7. Exit
echo.
set /p choice="Enter option (1-7): "

if "%choice%"=="1" goto cleartemp
if "%choice%"=="2" goto flushdns
if "%choice%"=="3" goto resetnet
if "%choice%"=="4" goto malwarescan
if "%choice%"=="5" goto registryfixes
if "%choice%"=="6" goto runall
if "%choice%"=="7" exit
goto menu

:cleartemp
echo.
echo [1/5] Clearing Temp Files...
echo.
echo Cleaning User Temp...
del /q/f/s %TEMP%\* 2>nul
echo Cleaning Windows Temp...
del /q/f/s C:\Windows\Temp\* 2>nul
echo Cleaning Prefetch...
del /q/f/s C:\Windows\Prefetch\* 2>nul
echo Cleaning Recent Documents...
del /q/f/s "%APPDATA%\Microsoft\Windows\Recent\*" 2>nul
echo.
echo [OK] Temp files cleared.
echo.
goto ask_continue

:flushdns
echo.
echo [2/5] Flushing DNS Cache...
ipconfig /flushdns
echo.
echo [OK] DNS cache flushed.
echo.
goto ask_continue

:resetnet
echo.
echo [3/5] Resetting Network...
echo Releasing IP...
ipconfig /release
echo Renewing IP...
ipconfig /renew
echo Resetting Winsock...
netsh winsock reset
echo Resetting TCP/IP...
netsh int ip reset
echo.
echo [OK] Network reset complete. Reboot recommended.
echo.
goto ask_continue

:malwarescan
echo.
echo [4/5] Running Quick Malware Scan...
echo Starting Windows Defender Quick Scan...
"%ProgramFiles%\Windows Defender\mpcmdrun.exe" -Scan -ScanType 2
echo.
echo [OK] Quick scan complete. Review results above.
echo.
goto ask_continue

:registryfixes
echo.
echo [5/5] Applying Common Registry Fixes...
echo.
echo Note: Some fixes require admin rights.
echo.

:: Fix: Show hidden files (disabled by malware)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v Hidden /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v ShowSuperHidden /t REG_DWORD /d 1 /f

:: Fix: Show file extensions
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v HideFileExt /t REG_DWORD /d 0 /f

:: Fix: Disable autorun (malware prevention)
reg add "HKLM\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoDriveTypeAutoRun /t REG_DWORD /d 255 /f

:: Fix: Disable remote registry
reg add "HKLM\System\CurrentControlSet\Services\RemoteRegistry" /v Start /t REG_DWORD /d 4 /f

:: Fix: Enable Windows Firewall
netsh advfirewall set allprofiles state on

:: Fix: Clear malicious startup entries
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "Update" /f 2>nul
reg delete "HKLM\Software\Microsoft\Windows\CurrentVersion\Run" /v "Update" /f 2>nul

echo.
echo [OK] Common registry fixes applied.
echo.
goto ask_continue

:runall
echo Running all fixes...
echo.
call :cleartemp
call :flushdns
call :resetnet
call :malwarescan
call :registryfixes
echo.
echo ========================================
echo   ALL FIXES COMPLETE
echo ========================================
echo Recommendation: Reboot the system.
pause
exit

:ask_continue
echo.
set /p cont="Run another fix? (Y/N): "
if /i "%cont%"=="Y" goto menu
if /i "%cont%"=="y" goto menu
exit
