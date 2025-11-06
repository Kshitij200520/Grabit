@echo off
cd /d "C:\Users\kshit\Desktop\SD Assignment\client"
:loop
echo Starting React Development Server...
npm start
echo React server stopped. Restarting in 3 seconds...
timeout /t 3 /nobreak >nul
goto loop
