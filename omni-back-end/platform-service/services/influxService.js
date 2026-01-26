import { InfluxDB } from "@influxdata/influxdb-client";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

/**
 * Get recent telemetry for a specific device (last 1 hour default)
 */
export async function getRecentTelemetry(deviceId, duration = "-1h") {
    // Note: We use _measurement filter dynamically if needed, 
    // but usually user queries by device ID in a single massive bucket or specific measurement.
    // Based on ingest-service, measurement name = device_type (e.g. 'sensor').
    // But we can filter by tag 'device_id' across ALL measurements if we are lazy, 
    // OR we should know the measurement.
    
    // For simplicity, we filter by device_id tag which works across measurements if bucket is same.
    
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${duration})
        |> filter(fn: (r) => r["device_id"] == "${deviceId}")
        |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
        |> sort(columns: ["_time"], desc: false) 
        |> limit(n: 50)
    `;
    // Note: sorting ASC for graph (oldest to newest)

    return new Promise((resolve, reject) => {
        const rows = [];
        queryApi.queryRows(fluxQuery, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                rows.push(o);
            },
            error(error) {
                console.error("Query Failed:", error);
                reject(error);
            },
            complete() {
                resolve(rows);
            },
        });
    });
}
