import { PrismaClient } from "@prisma/client";
import { getSessionTelemetry } from "../services/influxService.js";
import { publishRecordingEvent } from "../services/mqttService.js";

const prisma = new PrismaClient();

// Start Session (Create)
export const createSession = async (req, res) => {
    try {
        const { device_id, user_id } = req.body;

        if (!device_id) {
            return res.status(400).json({ message: "Device ID is required to start a session" });
        }

        // Verify Device Exists
        const device = await prisma.device.findUnique({
             where: { id: device_id } 
        });

        let deviceSN = "";

        if (!device) {
             // Try searching by serial_number if ID fail
             const deviceBySn = await prisma.device.findUnique({
                 where: { serial_number: device_id }
             });
             
             if (!deviceBySn) {
                 return res.status(404).json({ message: "Device not found" });
             }
             // Use the UUID
             req.body.deviceUUID = deviceBySn.id;
             deviceSN = deviceBySn.serial_number;
        } else {
             req.body.deviceUUID = device.id;
             deviceSN = device.serial_number;
        }

        const newSession = await prisma.session.create({
            data: {
                device_id: req.body.deviceUUID,
                user_id: user_id || null, // Optional
                start_time: new Date(),
            }
        });

        // ✅ Publish MQTT Event to Start Recording
        publishRecordingEvent(deviceSN, "start");

        res.status(201).json(newSession);
    } catch (error) {
        console.error("Start Session Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// End Session (Update end_time)
export const endSession = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedSession = await prisma.session.update({
            where: { id: id },
            data: {
                end_time: new Date()
            },
            include: {
                device: true
            }
        });

        // ✅ Publish MQTT Event to Stop Recording
        if (updatedSession.device) {
            publishRecordingEvent(updatedSession.device.serial_number, "end");
        }

        res.json(updatedSession);
    } catch (error) {
        console.error("End Session Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get Sessions by Device
export const getSessionsByDevice = async (req, res) => {
    try {
        const { deviceId } = req.params;
        console.log(`[DEBUG] Fetching sessions for deviceId (SN): ${deviceId}`);

        const whereClause = (deviceId === 'all' || !deviceId) ? {} : { 
            device: {
                serial_number: deviceId 
            }
        };

        console.log(`[DEBUG] Fetching sessions with filter:`, whereClause);

        const sessions = await prisma.session.findMany({
            where: whereClause,
            include: {
                device: {
                    select: { device_name: true, serial_number: true }
                }
            },
            orderBy: { start_time: 'desc' },
            take: 20
        });

        console.log(`[DEBUG] Found ${sessions.length} sessions`);
        res.json(sessions);
    } catch (error) {
         console.error("Get Sessions Error:", error);
         res.status(500).json({ error: error.message });
    }
}

// Get Single Session
export const getSessionById = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await prisma.session.findUnique({
            where: { id: id },
            include: {
                device: {
                    select: { device_name: true, serial_number: true }
                }
            }
        });

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        res.json(session);
    } catch (error) {
        console.error("Get Session Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Export Session CSV
export const exportSessionCsv = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Get Session Details
        const session = await prisma.session.findUnique({
            where: { id: id },
            include: {
                device: true
            }
        });

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const { start_time, end_time, device } = session;
        const deviceId = device ? device.serial_number : null; // Use Serial Number as ID for Influx

        if (!deviceId) {
             return res.status(400).json({ message: "Session has no associated device" });
        }

        // 2. Fetch Data from InfluxDB
        // If session is active (no end_time), use current time
        const finalEndTime = end_time || new Date();
        
        console.log(`[CSV] Exporting Session ${id} for Device ${deviceId}`);
        console.log(`[CSV] Time Range: ${start_time} - ${finalEndTime}`);

        const telemetryData = await getSessionTelemetry(deviceId, start_time, finalEndTime);

        if (!telemetryData || telemetryData.length === 0) {
             // Return empty csv or 404? 
             // Let's return a Text response saying no data
             res.setHeader("Content-Type", "text/csv");
             res.setHeader("Content-Disposition", `attachment; filename="session-${id}-empty.csv"`);
             return res.send("No telemetry data found for this session time range.");
        }

        // 3. Convert to CSV
        // Header
        const headers = Object.keys(telemetryData[0]).filter(k => k !== "_time" && k !== "_value" && k !== "device_id");
        // Ensure timestamp is first
        const allColumns = ["timestamp", "device_id", ...headers];
        
        const csvRows = [];
        csvRows.push(allColumns.join(",")); // Header Row

        for (const row of telemetryData) {
            const values = allColumns.map(col => {
                let val;
                if (col === "timestamp") val = row["_time"]; 
                else if (col === "device_id") val = row["device_id"];
                else val = row[col];

                // Escape quotes if needed, handle dates
                if (val === undefined || val === null) return "";
                return String(val); 
            });
            csvRows.push(values.join(","));
        }

        const csvString = csvRows.join("\n");

        // 4. Send Response
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="session-${id}.csv"`);
        res.status(200).send(csvString);

    } catch (error) {
        console.error("Export CSV Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get Session Data (JSON for Graph)
export const getSessionData = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Get Session Details
        const session = await prisma.session.findUnique({
            where: { id: id },
            include: { device: true }
        });

        if (!session) return res.status(404).json({ message: "Session not found" });

        const { start_time, end_time, device } = session;
        const deviceId = device ? device.serial_number : null;

        if (!deviceId) return res.status(400).json({ message: "No device associated" });

        // 2. Fetch Data
        const finalEndTime = end_time || new Date();
        const telemetryData = await getSessionTelemetry(deviceId, start_time, finalEndTime);

        // 3. Return JSON
        res.json(telemetryData);

    } catch (error) {
        console.error("Get Session Data Error:", error);
        res.status(500).json({ error: error.message });
    }
};
