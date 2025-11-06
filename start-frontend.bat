@echo off
echo ========================================
echo    Starting E-Commerce Frontend (React)
echo ========================================

cd /d "c:\Users\kshit\Desktop\SD Assignment\client"

:START_FRONTEND
echo.
echo [%TIME%] Starting React development server on port 3000...
set FAST_REFRESH=true
set DISABLE_ESLINT_PLUGIN=true
set GENERATE_SOURCEMAP=false
set BROWSER=none
npm start

echo.
echo [%TIME%] Frontend stopped. Restarting in 5 seconds...
timeout /t 5 /nobreak >nul
goto START_FRONTEND
