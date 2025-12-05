# SmartVision - Fullscreen Kiosk Mode Setup

## Problem
Browsers block automatic fullscreen for security reasons. You'll see tabs and address bar unless you use kiosk mode.

## Solution: Launch in Kiosk Mode

### Option 1: Use the Batch File (Easiest)
1. Double-click `start-kiosk.bat`
2. Chrome will open in TRUE fullscreen (no tabs, no address bar)
3. Press `Alt+F4` to exit

### Option 2: Use PowerShell Script
1. Right-click `start-kiosk.ps1` → Run with PowerShell
2. TRUE fullscreen mode activated

### Option 3: Manual Command
Open Command Prompt and run:
```bash
chrome --kiosk --app=http://localhost:5173
```

### Option 4: Create Desktop Shortcut
1. Right-click on Desktop → New → Shortcut
2. Location: `"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=http://localhost:5173`
3. Name it "SmartVision Kiosk"
4. Click the shortcut to launch in fullscreen

## For Production Digital Signage

### Windows Startup (Auto-launch on boot):
1. Press `Win+R`, type `shell:startup`, press Enter
2. Copy `start-kiosk.bat` to this folder
3. SmartVision will auto-start in fullscreen when Windows boots

### Disable Exit Keys (Advanced):
For public displays, you may want to disable Alt+F4:
- Use Windows Group Policy or third-party kiosk software
- Consider Windows Kiosk Mode (assigned access)

## How to Exit Kiosk Mode
- Press `Alt+F4`
- Press `Ctrl+Alt+Delete` → Task Manager → End Chrome
- Press `Alt+Tab` to switch windows

## Testing
1. Make sure your dev server is running: `npm run dev`
2. Launch using one of the methods above
3. Playlist should now be in TRUE fullscreen (no browser UI visible)

## Notes
- Kiosk mode hides ALL browser UI (tabs, address bar, bookmarks)
- Perfect for digital signage displays
- Works with auto-playing playlists
- F11 won't work in kiosk mode (already fullscreen)
