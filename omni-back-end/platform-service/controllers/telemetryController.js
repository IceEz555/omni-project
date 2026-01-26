import * as influxService from "../services/influxService.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDeviceTelemetry = async (req, res) => {
    try {
        const { deviceId } = req.params;
        
        // Optional: Verify device exists/belongs to user?
        // For admin dashboard (public/internal), skippable for speed.

        const data = await influxService.getRecentTelemetry(deviceId);
        
        // Format for Chart.js / Recharts
        // Recharts expects array of objects: [{ time: '10:00', value: 20 }, ...]
        
        const formatted = data.map(d => {
            // Pick the first numeric field available as the "Main Value" for the sparkline
            // Or prioritize known fields like 'distance', 'pressure', etc.
            
            // Exclude system fields
            const keys = Object.keys(d).filter(k => !['_start', '_stop', '_time', '_measurement', 'device_id', 'profile_id', 'result', 'table'].includes(k));
            
            // Try to find a number
            const valueKey = keys.find(k => typeof d[k] === 'number') || keys[0];
            
            return {
                time: d._time,
                value: d[valueKey], // Main value
                ...d // Include everything just in case
            };
        });

        res.json({
            deviceId,
            count: formatted.length,
            data: formatted
        });

    } catch (error) {
        console.error("Telemetry Error:", error);
        res.status(500).json({ error: error.message });
    }
};
