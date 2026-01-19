import { InfluxDB, Point } from "@influxdata/influxdb-client";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const influxDB = new InfluxDB({ url, token });
export const writeApi = influxDB.getWriteApi(org, bucket);

export function writeYogaMat(data) {
  console.log("📝 Writing to InfluxDB:", data.device_id, "\n","Device Profile:", data.profile_id, "\n", "Timestamp:", data.timestamp);

  const ts = typeof data.timestamp === "number"
    ? new Date(data.timestamp)
    : new Date(data.timestamp);

  const point = new Point("yoga_mat")
    .tag("device_id", data.device_id)
    .tag("profile_id", data.profile_id)
    .intField(
      "pressure_matrix_size",
      data.pressure_map.length // หรือ pressure_matrix
    )
    .timestamp(ts);

  writeApi.writePoint(point);
   writeApi.flush(); // บังคับส่งทันที
}
