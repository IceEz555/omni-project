import mqtt from "mqtt";
import { loadProfile } from "./profileLoader.js";
import { validateTelemetry } from "./validator.js";

const BROKER_URL = "mqtt://localhost:1883";
const TOPIC = "iot/+/+/telemetry";

export function startMqtt() {
  const client = mqtt.connect(BROKER_URL);

  client.on("connect", () => {
    console.log("✅ Connected to MQTT broker");
    client.subscribe(TOPIC);
  });

  client.on("message", (topic, message) => {
    try {
      const data = JSON.parse(message.toString());

      if (!data.profile_id) {
        throw new Error("Missing profile_id");
      }

      const profile = loadProfile(data.profile_id);
      const result = validateTelemetry(data, profile);

      if (!result.valid) {
        console.error("❌ Rejected telemetry:", result.errors);
        return;
      }

      console.log("✅ Accepted telemetry", {
        device_id: data.device_id,
        profile_id: data.profile_id,
        timestamp: data.timestamp
      });

    } catch (err) {
      console.error("❌ Ingest error:", err.message);
    }
  });
}
