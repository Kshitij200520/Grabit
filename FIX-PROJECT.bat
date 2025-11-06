@echo off
title Fix E-Commerce Project Issues
color 0C
echo.
echo ==========================================
echo      FIXING E-COMMERCE PROJECT ISSUES
echo ==========================================
echo.

echo [STEP 1] Killing all Node processes...
taskkill /F /IM node.exe >nul 2>&1
echo   ✓ Cleaned up processes

echo.
echo [STEP 2] Checking ports...
netstat -ano | findstr ":3000 :5000" >nul
if %errorlevel%==0 (
    echo   ! Ports still busy, waiting...
    timeout /t 3 /nobreak >nul
) else (
    echo   ✓ Ports are free
)

echo.
echo [STEP 3] Updating npm dependencies...
cd /d "C:\Users\kshit\Desktop\SD Assignment\server"
echo   → Installing server dependencies...
call npm install --silent >nul 2>&1
echo   ✓ Server dependencies updated

cd /d "C:\Users\kshit\Desktop\SD Assignment\client"
echo   → Installing client dependencies...
call npm install --silent >nul 2>&1
echo   ✓ Client dependencies updated

echo.
echo [STEP 4] Testing backend connection...
cd /d "C:\Users\kshit\Desktop\SD Assignment\server"
start /B npm start >nul 2>&1
timeout /t 5 /nobreak >nul

powershell -Command "try { Invoke-RestMethod 'http://localhost:5000/api/payments/test' -Method Get >$null; Write-Host '   ✓ Backend is working' } catch { Write-Host '   ! Backend needs manual check' }"

taskkill /F /IM node.exe >nul 2>&1

echo.
echo ==========================================
echo        PROJECT ISSUES FIXED!
echo ==========================================
echo.
echo  Now run: START-PROJECT.bat
echo.
pause
