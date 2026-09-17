@echo off
REM Cloud Dependency Atlas - Quick Start
REM This script starts both the backend and frontend servers

setlocal enabledelayedexpansion

echo.
echo ========================================================================
echo     Cloud Dependency Atlas - Application Launcher
echo ========================================================================
echo.

REM Get the directory where this script is located
set "scriptDir=%~dp0"

REM Check if we're in the right directory
if not exist "%scriptDir%backend\package.json" (
    echo Error: Could not find backend/package.json
    echo Please run this script from the root directory of azure-dependency-atlas
    pause
    exit /b 1
)

echo Checking dependencies...
echo.

REM Check backend dependencies
if not exist "%scriptDir%backend\node_modules" (
    echo Installing backend dependencies...
    cd /d "%scriptDir%backend"
    call npm install
    cd /d "%scriptDir%"
)

REM Check frontend dependencies
if not exist "%scriptDir%frontend\node_modules" (
    echo Installing frontend dependencies...
    cd /d "%scriptDir%frontend"
    call npm install
    cd /d "%scriptDir%"
)

echo.
echo Dependencies ready!
echo.
echo Starting Backend Server (port 5000)...
echo Location: %scriptDir%backend
start cmd /k "cd /d "%scriptDir%backend" && npm run dev"

REM Give backend time to start
timeout /t 3 /nobreak

echo.
echo Starting Frontend Server (port 3000)...
echo Location: %scriptDir%frontend
start cmd /k "cd /d "%scriptDir%frontend" && npm run dev"

echo.
echo ========================================================================
echo             Application is Starting!
echo ========================================================================
echo.
echo Open in your browser:
echo   http://localhost:3000
echo.
echo Backend API:
echo   http://localhost:5000
echo.
echo To stop the servers:
echo   - Close the backend and frontend command windows
echo   - Or press Ctrl+C in either window
echo.
pause
