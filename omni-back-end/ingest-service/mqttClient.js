import mqtt from "mqtt";
import { processTelemetry } from "./ingestLogic.js";

const BROKER_URL = "mqtt://localhost:1883";
const TOPIC_TELEMETRY = "iot/+/telemetry"; 
const TOPIC_RECORDING = "system/recording/#";

// ✅ In-Memory Active Recording Set
const recordingDevices = new Set();

export function startMqtt() {
  const client = mqtt.connect(BROKER_URL);

  client.on("connect", () => {
    console.log("[INFO] ✅ Connected to MQTT broker (Ingest)");
    client.subscribe([TOPIC_TELEMETRY, TOPIC_RECORDING]);
  });

  client.on("message", async (topic, message) => {
    let data;
    try {
      data = JSON.parse(message.toString());
    } catch (e) {
      console.error(`[ERROR] ❌ JSON Parse Failed`, { topic });
      return;
    }

    // --- HANDLE RECORDING COMMANDS ---
    if (topic.includes("system/recording/")) {
        const deviceId = data.device_id;
        if (topic.endsWith("start")) {
            recordingDevices.add(deviceId);
            console.log(`[REC] ⏺ Started recording for ${deviceId}`);
        } else if (topic.endsWith("end")) {
            recordingDevices.delete(deviceId);
            console.log(`[REC] ⏹ Stopped recording for ${deviceId}`);
        }
        return;
    }

    // --- HANDLE TELEMETRY ---
    // Check if device is in recording mode
    if (!recordingDevices.has(data.device_id)) {
        // [OPTIONAL] Log verbose only if needed, otherwise silent skip
        // console.log(`[SKIP] 🚫 Ignored data from ${data.device_id} (Not Recording)`);
        return;
    }

    const result = await processTelemetry(data);
    if (result.success) {
      console.log(`[INFO] ✅ Recorded telemetry for ${data.device_id}`);
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
