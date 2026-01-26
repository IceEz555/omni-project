import { InfluxDB, Point } from "@influxdata/influxdb-client";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const influxDB = new InfluxDB({ url, token });
export const writeApi = influxDB.getWriteApi(org, bucket);

export function writeTelemetry(data, profile) {
  console.log(`📝 Writing to InfluxDB: ${data.device_id} \n Device Type: ${profile.device_type} \n Timestamp: ${data.timestamp}`);

  const ts = new Date(data.timestamp);

  // Use device_type as the measurement name (e.g., "yoga_mat", "imu")
  const point = new Point(profile.device_type)
    .tag("device_id", data.device_id)
    .tag("profile_id", data.profile_id)
    .timestamp(ts);

  // Dynamic Field Injection
  const fields = profile.telemetry_schema?.fields;

  if (fields && Array.isArray(fields) && fields.length > 0) {
      // 1. Strict Mode (Schema Defined)
      for (const field of fields) {
        const value = data[field.name];
        if (value === undefined) continue;

        if (field.type === 'matrix' || Array.isArray(value)) {
          point.stringField(field.name, JSON.stringify(value));
          point.intField(`${field.name}_size`, value.length);
        } else if (typeof value === 'boolean') {
          point.booleanField(field.name, value);
        } else if (typeof value === 'number') {
          point.floatField(field.name, value);
        } else {
          point.stringField(field.name, String(value));
        }
      }
  } else {
      // 2. Dynamic Mode (No Schema or Empty) -> Write everything that looks like data
      console.log('⚠️ No Schema Fields definition found, writing all data fields dynamically.');
      for (const key in data) {
          if (['device_id', 'profile_id', 'timestamp', 'raw'].includes(key)) continue; // Skip metadata
          
          const value = data[key];
          if (value === null || value === undefined) continue;

          if (Array.isArray(value)) {
              point.stringField(key, JSON.stringify(value));
          } else if (typeof value === 'boolean') {
              point.booleanField(key, value);
          } else if (typeof value === 'number') {
              point.floatField(key, value);
          } else {
              point.stringField(key, String(value));
          }
      }
  }

  writeApi.writePoint(point);
  writeApi.flush();
}

const queryApi = influxDB.getQueryApi(org);

export async function readTelemetry(deviceId, start = "-1h") {
  console.log(`🔍 Querying InfluxDB for ${deviceId}, Range: ${start}`);

  // Flux Query: Filter by device_id and get recent data
  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: ${start})
      |> filter(fn: (r) => r["device_id"] == "${deviceId}")
      |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
      |> sort(columns: ["_time"], desc: true)
      |> limit(n: 100)
  `;

  return new Promise((resolve, reject) => {
    const rows = [];
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        
        // Convert JSON strings back to objects (for Matrix/Arrays)
        for (const key in o) {
          if (typeof o[key] === 'string' && (o[key].startsWith('[') || o[key].startsWith('{'))) {
            try {
              o[key] = JSON.parse(o[key]);
            } catch (e) {
              // Keep as string if parsing fails
            }
          }
        }
        rows.push(o);
      },
      error(error) {
        console.error("❌ Query Failed:", error);
        reject(error);
      },
      complete() {
        console.log(`✅ Query Complete: Found ${rows.length} records`);
        resolve(rows);
      },
    });
  });
}
