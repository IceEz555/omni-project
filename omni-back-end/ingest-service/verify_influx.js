import { InfluxDB } from "@influxdata/influxdb-client";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

// Query last 10 minutes of data
const fluxQuery = `from(bucket: "${bucket}")
  |> range(start: -10m)
  |> filter(fn: (r) => r["_measurement"] == "yoga_mat")
  |> filter(fn: (r) => r["_field"] == "pressure_matrix_size")
  |> limit(n: 5)`;

console.log("🔍 Querying InfluxDB for recent data...");

queryApi.queryRows(fluxQuery, {
  next(row, tableMeta) {
    const o = tableMeta.toObject(row);
    console.log(
      `Found data: Time=${o._time}, Device=${o.device_id}, Value=${o._value}`
    );
  },
  error(error) {
    console.error("❌ Query failed:", error);
    console.log("\nPossible causes:");
    console.log("1. Check your internet connection.");
    console.log("2. Check if the token is valid.");
    console.log("3. Ensure data was actually written recently.");
  },
  complete() {
    console.log("✅ Query finished.");
  },
});
