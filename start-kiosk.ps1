# SmartVision Kiosk Mode Launcher (PowerShell)
# This will open Chrome in fullscreen kiosk mode

Write-Host "Starting SmartVision in Kiosk Mode..." -ForegroundColor Green

# Find Chrome executable
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

if (Test-Path $chromePath) {
    # Start Chrome in kiosk mode
    Start-Process $chromePath -ArgumentList "--kiosk", "--app=http://localhost:5173", "--start-fullscreen"
    Write-Host "SmartVision started in fullscreen kiosk mode" -ForegroundColor Green
    Write-Host "Press Alt+F4 to exit" -ForegroundColor Yellow
} else {
    Write-Host "Chrome not found. Please install Google Chrome." -ForegroundColor Red
}
