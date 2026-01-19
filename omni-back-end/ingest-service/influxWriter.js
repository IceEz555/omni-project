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
  for (const field of profile.telemetry_schema.fields) {
    const value = data[field.name];
    if (value === undefined) continue;

    if (field.type === 'matrix' || Array.isArray(value)) {
      // 1. Store Full Data (JSON String)
      point.stringField(field.name, JSON.stringify(value));
      // 2. Store Size (Auto-generated generic size field)
      // e.g. pressure_map -> pressure_map_size
      point.intField(`${field.name}_size`, value.length);
    } else if (typeof value === 'boolean') {
      point.booleanField(field.name, value);
    } else if (typeof value === 'number') {
      point.floatField(field.name, value);
    } else {
      point.stringField(field.name, String(value));
    }
  }

  writeApi.writePoint(point);
  writeApi.flush();
}
