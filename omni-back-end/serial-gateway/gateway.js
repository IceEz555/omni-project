import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import mqtt from 'mqtt';

// --- CONFIGURATION ---
const MQTT_BROKER = 'mqtt://localhost:1883';
const SERIAL_PORT = 'COM4'; // <--- CHANGE THIS to your Arduino Port (e.g., COM3, /dev/ttyUSB0)
const BAUD_RATE = 115200;

// Connect to MQTT
const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on('connect', () => {
  console.log('✅ Connected to MQTT Broker');
});

// Setup Serial Port
const port = new SerialPort({ path: SERIAL_PORT, baudRate: BAUD_RATE });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

console.log(`🔌 Attempting to connect to Serial Port: ${SERIAL_PORT}`);

port.on('open', () => {
    console.log('✅ Serial Port Opened');
});

port.on('error', (err) => {
    console.error('❌ Serial Port Error: ', err.message);
    console.log('HINT: Check if Arduino is connected and the COM port in gateway.js is correct.');
});

// Parsing State
let isReadingMatrix = false;
let matrixBuffer = [];
const MATRIX_ROWS = 16;
const MATRIX_COLS = 16;

// Read Data from Serial
parser.on('data', (data) => {
    try {
        const cleanData = data.toString().replace(/[\x00-\x1F\x7F]/g, "").trim();
        
        // --- MATRIX PARSING (16x16) ---
        if (cleanData === "TABLE") {
            isReadingMatrix = true;
            matrixBuffer = [];
            // console.log("Detected Matrix Start...");
            return;
        }

        if (isReadingMatrix) {
            // Validate row data (should be numbers)
            const row = cleanData.split(' ').map(Number);
            if (row.length === MATRIX_COLS && !row.some(isNaN)) {
                matrixBuffer.push(row);
            } else {
                 // Invalid row, abort? Or just ignore bad lines?
                 // console.warn("Invalid Matrix Row:", cleanData);
            }

            if (matrixBuffer.length === MATRIX_ROWS) {
                // Complete Matrix
                const payload = {
                    device_id: "pressure_mat_16x16",
                    data: matrixBuffer,
                    timestamp: new Date().toISOString()
                };
                
                // Publish to Special Stream Topic
                mqttClient.publish('iot/matrix/stream', JSON.stringify(payload));
                // console.log("🚀 Published Matrix Frame");

                isReadingMatrix = false;
                matrixBuffer = [];
            }
            return; // Don't process as standard packet
        }

        // --- STANDARD PARSING ---
        // Expected Format: "DEVICE_ID|PROFILE_ID|JSON_DATA"
        console.log(`📥 Received from Serial: ${cleanData}`);
        
        const parts = cleanData.split('|');
        if (parts.length < 3) {
            // console.warn('⚠️ Invalid Data Format.');
            return;
        }

        const deviceId = parts[0];
        const profileId = parts[1];
        const rawJson = parts.slice(2).join('|'); 
        const metrics = JSON.parse(rawJson);

        const payload = {
            device_id: deviceId,
            profile_id: profileId,
            timestamp: new Date().toISOString(),
            ...metrics
        };

        const topic = `iot/${deviceId}/telemetry`;
        mqttClient.publish(topic, JSON.stringify(payload));
        console.log(`🚀 Published to MQTT [${topic}]:`, payload);

    } catch (err) {
        console.error('❌ Error processing serial data:', err);
        isReadingMatrix = false; // Reset on error
        matrixBuffer = [];
    }
});
