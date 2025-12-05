// Serial Communication Service
class SerialCommunication {
    constructor() {
        this.port = null;
        this.writer = null;
        this.reader = null;
        this.isConnected = false;
    }

    // Check if Web Serial API is supported
    isSupported() {
        return 'serial' in navigator;
    }

    // Connect to serial port
    async connect() {
        if (!this.isSupported()) {
            throw new Error('Web Serial API is not supported in this browser. Please use Chrome, Edge, or Opera.');
        }

        try {
            // Request a port and open a connection
            this.port = await navigator.serial.requestPort();
            await this.port.open({
                baudRate: 9600,  // Adjust baudRate as needed (common: 9600, 115200)
                dataBits: 8,
                stopBits: 1,
                parity: 'none'
            });

            // Get the writer for sending data
            this.writer = this.port.writable.getWriter();
            this.isConnected = true;

            console.log('Serial port connected successfully');
            return true;
        } catch (error) {
            console.error('Error connecting to serial port:', error);
            this.isConnected = false;
            throw error;
        }
    }

    // Disconnect from serial port
    async disconnect() {
        try {
            if (this.writer) {
                this.writer.releaseLock();
                this.writer = null;
            }

            if (this.reader) {
                this.reader.releaseLock();
                this.reader = null;
            }

            if (this.port) {
                await this.port.close();
                this.port = null;
            }

            this.isConnected = false;
            console.log('Serial port disconnected');
        } catch (error) {
            console.error('Error disconnecting serial port:', error);
            throw error;
        }
    }

    // Send movement command
    async sendMovement(command) {
        if (!this.isConnected || !this.writer) {
            console.warn('Serial port not connected. Skipping serial send.');
            return false;
        }

        try {
            const message = `${command}\n`; // Format: F, B, L, R, S
            const encoder = new TextEncoder();
            await this.writer.write(encoder.encode(message));
            console.log(`Sent movement command via serial: ${message.trim()}`);
            return true;
        } catch (error) {
            console.error('Error sending movement command:', error);
            return false;
        }
    }

    // Send pick/place command
    async sendPickPlace(command) {
        if (!this.isConnected || !this.writer) {
            console.warn('Serial port not connected. Skipping serial send.');
            return false;
        }

        try {
            const message = `${command}\n`; // Format: P0, P1
            const encoder = new TextEncoder();
            await this.writer.write(encoder.encode(message));
            console.log(`Sent pick/place command via serial: ${message.trim()}`);
            return true;
        } catch (error) {
            console.error('Error sending pick/place command:', error);
            return false;
        }
    }

    // Send combined command (movement + pick/place)
    async sendCombinedCommand(movement, pickPlace) {
        if (!this.isConnected || !this.writer) {
            console.warn('Serial port not connected. Skipping serial send.');
            return false;
        }

        try {
            // Send movement first
            await this.sendMovement(movement);
            // Small delay
            await new Promise(resolve => setTimeout(resolve, 50));
            // Then send pick/place
            await this.sendPickPlace(pickPlace);
            console.log(`Sent combined command: ${movement}, ${pickPlace}`);
            return true;
        } catch (error) {
            console.error('Error sending combined command:', error);
            return false;
        }
    }

    // Read data from serial port (optional for receiving feedback)
    async startReading(callback) {
        if (!this.isConnected || !this.port) {
            console.warn('Serial port not connected.');
            return;
        }

        try {
            this.reader = this.port.readable.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { value, done } = await this.reader.read();
                if (done) {
                    break;
                }
                const text = decoder.decode(value);
                if (callback) {
                    callback(text);
                }
            }
        } catch (error) {
            console.error('Error reading from serial port:', error);
        } finally {
            if (this.reader) {
                this.reader.releaseLock();
                this.reader = null;
            }
        }
    }

    // Get connection status
    getConnectionStatus() {
        return this.isConnected;
    }
}

// Export singleton instance
export const serialComm = new SerialCommunication();
