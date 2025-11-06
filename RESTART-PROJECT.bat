@echo off
title Quick Restart E-Commerce
color 0E
echo.
echo ==========================================
echo     QUICK RESTART E-COMMERCE PROJECT
echo ==========================================
echo.

echo [STEP 1] Stopping all servers...
taskkill /F /IM node.exe >nul 2>&1
echo   ✓ All servers stopped

echo.
echo [STEP 2] Waiting for ports to clear...
timeout /t 3 /nobreak >nul
echo   ✓ Ports cleared

echo.
echo [STEP 3] Starting Backend...
cd /d "C:\Users\kshit\Desktop\SD Assignment\server"
start "Backend" cmd /c "title Backend Server && color 0A && npm start"
timeout /t 5 /nobreak >nul
echo   ✓ Backend started

echo.
echo [STEP 4] Starting Frontend...
cd /d "C:\Users\kshit\Desktop\SD Assignment\client"
start "Frontend" cmd /c "title Frontend Server && color 0B && set FAST_REFRESH=true && set DISABLE_ESLINT_PLUGIN=true && npm start"
timeout /t 8 /nobreak >nul
echo   ✓ Frontend started

echo.
echo ==========================================
echo      PROJECT RESTARTED SUCCESSFULLY!
echo ==========================================
echo.
echo  Frontend: http://localhost:3000
echo  Backend: http://localhost:5000
echo.
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo Project is ready!
timeout /t 3 /nobreak >nul
exit
