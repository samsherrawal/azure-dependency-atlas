# Cloud Dependency Atlas - Quick Start Script
# This script starts both the backend and frontend servers

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║     Cloud Dependency Atlas - Application Launcher             ║
╚════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Get the directory of this script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check if we're in the right directory
if (-not (Test-Path "$scriptDir\backend\package.json")) {
    Write-Host "❌ Error: Could not find backend/package.json" -ForegroundColor Red
    Write-Host "Please run this script from the root directory of azure-dependency-atlas" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n📦 Checking dependencies..." -ForegroundColor Yellow

# Check backend dependencies
if (-not (Test-Path "$scriptDir\backend\node_modules")) {
    Write-Host "`n📥 Installing backend dependencies..." -ForegroundColor Yellow
    Push-Location "$scriptDir\backend"
    npm install
    Pop-Location
}

# Check frontend dependencies
if (-not (Test-Path "$scriptDir\frontend\node_modules")) {
    Write-Host "`n📥 Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location "$scriptDir\frontend"
    npm install
    Pop-Location
}

Write-Host "`n✅ Dependencies ready!" -ForegroundColor Green

# Start backend in a new window
Write-Host "`n🚀 Starting Backend Server..." -ForegroundColor Yellow
Write-Host "   Location: $scriptDir\backend" -ForegroundColor Gray
Write-Host "   Port: 5000" -ForegroundColor Gray

$backendProcess = Start-Process powershell -ArgumentList @"
Set-Location "$scriptDir\backend"; npm run dev
"@ -PassThru
Write-Host "   Process ID: $($backendProcess.Id)" -ForegroundColor Gray

# Give backend time to start
Start-Sleep -Seconds 3

# Start frontend in a new window
Write-Host "`n🎨 Starting Frontend Server..." -ForegroundColor Yellow
Write-Host "   Location: $scriptDir\frontend" -ForegroundColor Gray
Write-Host "   Port: 3000" -ForegroundColor Gray

$frontendProcess = Start-Process powershell -ArgumentList @"
Set-Location "$scriptDir\frontend"; npm run dev
"@ -PassThru
Write-Host "   Process ID: $($frontendProcess.Id)" -ForegroundColor Gray

# Wait for services to be ready
Write-Host "`n⏳ Waiting for services to start..." -ForegroundColor Yellow
$maxRetries = 30
$retry = 0

while ($retry -lt $maxRetries) {
    try {
        $backendHealth = (Invoke-WebRequest -Uri "http://localhost:5000/health" -ErrorAction Stop).StatusCode
        if ($backendHealth -eq 200) {
            break
        }
    } catch {
        # Service not ready yet
    }
    $retry++
    Start-Sleep -Seconds 1
    Write-Host "   Attempt $retry/$maxRetries..." -ForegroundColor Gray
}

if ($retry -ge $maxRetries) {
    Write-Host "`n⚠️  Backend did not start in time" -ForegroundColor Yellow
} else {
    Write-Host "`n✅ Backend is ready!" -ForegroundColor Green
}

Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║              🎉 Application is RUNNING! 🎉                    ║
╚════════════════════════════════════════════════════════════════╝

📱 OPEN IN BROWSER:
   👉 http://localhost:3000

🔗 API ENDPOINT:
   Backend running at http://localhost:5000

📊 TRY THESE ACTIONS:
   1. Click "Dashboard" to see health overview
   2. Click "Topology" to view dependency graph
   3. Click "Incidents" to explore investigation scenarios
   4. Use the Assistant panel on the left to ask infrastructure questions

⏹️  TO STOP:
   - Close the backend and frontend PowerShell windows
   - Or press Ctrl+C in either window

📚 FOR MORE HELP:
   - See GO.md for quick overview
   - See HOW_TO_RUN.md for detailed setup
   - See CHEATSHEET.md for command reference

"@ -ForegroundColor Cyan

Write-Host "Waiting for processes..." -ForegroundColor Gray
$backendProcess.WaitForExit()
$frontendProcess.WaitForExit()
