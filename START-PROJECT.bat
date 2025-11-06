@echo off
title E-Commerce Project Launcher
color 0A
echo.
echo ==========================================
echo    E-COMMERCE PROJECT LAUNCHER
echo ==========================================
echo.
echo  This will start both servers for you:
echo  - Backend Server (Port 5000)
echo  - Frontend Server (Port 3000)
echo.
echo ==========================================
echo.

REM Kill any existing Node processes
echo [STEP 1] Cleaning up existing processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start Backend in new window
echo [STEP 2] Starting Backend Server...
start "Backend Server" cmd /c "cd /d C:\Users\kshit\Desktop\SD Assignment\server && npm start && pause"
timeout /t 5 /nobreak >nul

REM Start Frontend in new window  
echo [STEP 3] Starting Frontend Server...
start "Frontend Server" cmd /c "cd /d C:\Users\kshit\Desktop\SD Assignment\client && set FAST_REFRESH=true && set DISABLE_ESLINT_PLUGIN=true && npm start && pause"
timeout /t 10 /nobreak >nul

REM Open browser
echo [STEP 4] Opening application in browser...
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo ==========================================
echo   PROJECT STARTED SUCCESSFULLY!
echo ==========================================
echo.
echo  Backend: http://localhost:5000
echo  Frontend: http://localhost:3000
echo.
echo  Both servers are running in separate windows.
echo  Close this window when done.
echo.
pause
