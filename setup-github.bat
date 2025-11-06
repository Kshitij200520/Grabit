@echo off
echo ==========================================
echo   GITHUB SETUP FOR E-COMMERCE PROJECT
echo ==========================================
echo.

REM Check if git is installed
where git >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not found in PATH!
    echo.
    echo Please do the following:
    echo 1. Install Git from: https://git-scm.com/download/win
    echo 2. During installation, make sure to select "Git from the command line and also from 3rd-party software"
    echo 3. After installation, restart this terminal/PowerShell
    echo 4. Run this script again
    echo.
    echo OR try running Git Bash instead of PowerShell
    pause
    exit /b 1
)

echo [STEP 1] Initializing git repository...
git init

echo [STEP 2] Adding all files to git...
git add .

echo [STEP 3] Creating initial commit...
git commit -m "Initial commit: Complete MERN Stack E-commerce Project with HLD/LLD documentation"

echo [STEP 4] Setting up main branch...
git branch -M main

echo.
echo ==========================================
echo   NEXT STEPS (Manual):
echo ==========================================
echo 1. Go to https://github.com/new
echo 2. Create a new repository with name: "ecommerce-mern-project"
echo 3. Don't initialize with README (we already have files)
echo 4. Copy the repository URL (e.g., https://github.com/yourusername/ecommerce-mern-project.git)
echo 5. Run this command with YOUR repository URL:
echo.
echo    git remote add origin YOUR_REPO_URL_HERE
echo    git push -u origin main
echo.
echo Example:
echo    git remote add origin https://github.com/kshit/ecommerce-mern-project.git
echo    git push -u origin main
echo.
pause