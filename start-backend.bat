@echo off
echo ========================================
echo    Starting E-Commerce Backend Server
echo ========================================

cd /d "C:\Users\kshit\Desktop\SD Assignment\server"

:START_SERVER
echo.
echo [%TIME%] Starting backend server on port 5000...
npm start

echo.
echo [%TIME%] Server stopped. Restarting in 5 seconds...
timeout /t 5 /nobreak >nul
goto START_SERVER
