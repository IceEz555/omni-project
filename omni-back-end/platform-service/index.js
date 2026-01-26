import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import mqtt from 'mqtt';

const app = express();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust for production
        methods: ["GET", "POST"]
    }
});

// MQTT Setup for Live Stream (No DB)
const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on('connect', () => {
    console.log('✅ Platform Service Connected to MQTT');
    mqttClient.subscribe('iot/matrix/stream');
});

mqttClient.on('message', (topic, message) => {
    if (topic === 'iot/matrix/stream') {
        try {
            const data = JSON.parse(message.toString());
            // Broadcast to all connected socket clients
            io.emit('matrix-data', data);
        } catch (e) {
            console.error("Error parsing MQTT matrix data", e);
        }
    }
});

io.on('connection', (socket) => {
    console.log('User connected to live stream');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[DEBUG] Received ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Basic Health Check
app.get('/', (req, res) => {
  res.send('Platform Service is running');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Platform Service running on http://0.0.0.0:${PORT}`);
});
