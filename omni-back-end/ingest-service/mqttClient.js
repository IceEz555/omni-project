import mqtt from "mqtt";
import { processTelemetry } from "./ingestLogic.js";

const BROKER_URL = "mqtt://localhost:1883";
const TOPIC = "iot/+/telemetry"; 

export function startMqtt() {
  const client = mqtt.connect(BROKER_URL);

  client.on("connect", () => {
    console.log("[INFO] ✅ Connected to MQTT broker");
    client.subscribe(TOPIC);
  });

  client.on("message", async (topic, message) => {
    let data;
    try {
      data = JSON.parse(message.toString());
    } catch (e) {
      console.error(`[ERROR] ❌ JSON Parse Failed: ${e.message}`, { raw: message.toString() });
      return;
    }
    const result = await processTelemetry(data);
    if (result.success) {
      console.log(`[INFO] ✅ Accepted telemetry for ${data.device_id} (${data.profile_id})`);
    } else {
      const level = result.type === "DB_ERROR" ? "error" : "warn";
      if (level === "error") {
        console.error(`[ERROR] 💥 ${result.error}`, result.details || "");
      } else {
        console.warn(`[WARN] ⚠️ ${result.error}`, result.details || "");
      }
    }
  });
}
