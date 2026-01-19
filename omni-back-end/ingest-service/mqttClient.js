import mqtt from "mqtt";
import { loadProfile } from "./profileLoader.js";
import { validateTelemetry } from "./validator.js";
import { writeYogaMat } from "./influxWriter.js";

const BROKER_URL = "mqtt://localhost:1883";
const TOPIC = "iot/+/telemetry"; // + คือ Wildcard (แทนอะไรก็ได้) เช่น iot/device1/telemetry

export function startMqtt() {
  const client = mqtt.connect(BROKER_URL);

  client.on("connect", () => {
    console.log("[INFO] ✅ Connected to MQTT broker");
    client.subscribe(TOPIC);
  });
  //
  client.on("message", (topic, message) => {
    let data;
    try {
      try {
        data = JSON.parse(message.toString()); 
      } catch (e) {
        console.error(`[ERROR] ❌ JSON Parse Failed: ${e.message}`, { raw: message.toString() });
        return;
      }

      if (!data.profile_id) {
        console.warn("[WARN] ⚠️ Missing profile_id in telemetry");
        return;
      }
      
      // Step A: Load Profile
      let profile;
      try {
        profile = loadProfile(data.profile_id);
      } catch (e) {
        console.warn(`[WARN] ⚠️ Profile not found: ${data.profile_id}`);
        return;
      }

      // Step B: Validate
      const result = validateTelemetry(data, profile);

      if (!result.valid) {
        console.warn(`[WARN] ❌ Validation Failed for device ${data.device_id || 'unknown'}:`, JSON.stringify(result.errors));
        return;
      }

      // Step C: Success
      console.log(`[INFO] ✅ Accepted telemetry for ${data.device_id} (${data.profile_id})`);

      // Step D: Write to InfluxDB
      // TODO: Refactor to be generic (Next Task)
      if (data.profile_id === "yoga_mat_v1") {
        writeYogaMat(data);
      }

    } catch (err) {
      console.error("[ERROR] 💥 Internal Ingest Error:", err.message);
    }
  });
}
