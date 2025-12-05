@echo off
REM SmartVision Kiosk Mode Launcher
REM This will open Chrome in fullscreen kiosk mode

echo Starting SmartVision in Kiosk Mode...

REM Close any existing Chrome instances (optional)
REM taskkill /F /IM chrome.exe 2>nul

REM Start Chrome in kiosk mode (fullscreen, no UI)
start chrome --kiosk --app=http://localhost:5173

echo SmartVision started in fullscreen kiosk mode
echo Press Ctrl+Alt+F4 or Alt+F4 to exit
