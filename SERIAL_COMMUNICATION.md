# Serial Communication Guide

## Overview
This application now supports direct serial communication with your robot hardware using the Web Serial API. Commands are sent in real-time during both route creation and route execution.

## Browser Compatibility
Serial communication requires a browser that supports the Web Serial API:
- ✅ Chrome 89+
- ✅ Edge 89+
- ✅ Opera 75+
- ❌ Firefox (not supported)
- ❌ Safari (not supported)

## Setup Instructions

### 1. Connect Your Hardware
- Connect your robot's serial device (Arduino, ESP32, etc.) to your computer via USB
- Make sure the drivers are installed

### 2. Connect in the Application
1. Click the **"🔌 Connect Serial Port"** button in the top-right corner
2. A browser dialog will appear showing available serial ports
3. Select your robot's COM port (e.g., COM3, /dev/ttyUSB0)
4. Click "Connect"
5. The button will change to **"🔌 Serial Connected"** (green)

### 3. Serial Communication Protocol

#### Command Format
Commands are sent as text strings ending with a newline character (`\n`):

**Movement Commands:**
```
M:F\n  - Move Forward
M:B\n  - Move Backward
M:L\n  - Turn Left
M:R\n  - Turn Right
M:S\n  - Stop
```

**Pick/Place Commands:**
```
P:P0\n - Pick (activate gripper close)
P:P1\n - Place (activate gripper open)
P:0\n  - Reset pick/place state
```

**Combined Commands:**
```
M:S|P:P0\n - Stop movement AND Pick
M:S|P:P1\n - Stop movement AND Place
```

### 4. Baud Rate Configuration
Default baud rate is **9600**. To change it, edit `src/services/serialCommunication.js`:

```javascript
await this.port.open({ 
    baudRate: 115200,  // Change this value
    dataBits: 8,
    stopBits: 1,
    parity: 'none'
});
```

## Arduino Example Code

```cpp
void setup() {
    Serial.begin(9600);
    pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
    if (Serial.available() > 0) {
        String command = Serial.readStringUntil('\n');
        
        // Movement commands
        if (command.startsWith("M:")) {
            String movement = command.substring(2);
            if (movement == "F") {
                // Move forward
                Serial.println("Moving Forward");
            } else if (movement == "B") {
                // Move backward
                Serial.println("Moving Backward");
            } else if (movement == "L") {
                // Turn left
                Serial.println("Turning Left");
            } else if (movement == "R") {
                // Turn right
                Serial.println("Turning Right");
            } else if (movement == "S") {
                // Stop
                Serial.println("Stopped");
            }
        }
        
        // Pick/Place commands
        if (command.startsWith("P:")) {
            String action = command.substring(2);
            if (action == "P0") {
                // Pick - close gripper
                Serial.println("Picking");
            } else if (action == "P1") {
                // Place - open gripper
                Serial.println("Placing");
            } else if (action == "0") {
                // Reset
                Serial.println("Reset pick/place");
            }
        }
        
        // Combined commands (e.g., "M:S|P:P0")
        if (command.indexOf('|') > 0) {
            // Parse and handle multiple commands
            Serial.println("Combined command received");
        }
    }
}
```

## Features

### Route Creation
- Commands are sent immediately when you press direction buttons
- Pick/Place actions send commands instantly
- Robot moves in real-time as you create the route

### Route Execution
- Commands are sent automatically during playback
- Pick/Place actions execute with 10-second duration
- Stop command sent during pause/detection events

### Manual Control
- All manual control buttons send serial commands
- Immediate response for manual robot control
- Pick and Place buttons included

## Troubleshooting

### "Serial port not connected" warnings
- This is normal if you haven't clicked the Connect button
- Commands will still be sent to Firebase
- Only affects serial communication, not Firebase

### Port access denied
- Close other applications using the serial port
- Disconnect and reconnect the USB device
- Try a different USB port

### No response from robot
- Check baud rate matches your hardware
- Verify USB cable supports data transfer
- Check Arduino Serial Monitor to see if commands are received

### Connection drops
- USB cable may be loose
- Power supply issues
- Check system logs for USB errors

## Disconnect
Click the **"🔌 Serial Connected"** button to disconnect the serial port.

## Dual Communication
The application sends commands to BOTH:
1. **Firebase Realtime Database** - for cloud logging and remote access
2. **Serial Port** - for direct hardware control

This ensures compatibility with both local USB-connected robots and cloud-connected systems.
