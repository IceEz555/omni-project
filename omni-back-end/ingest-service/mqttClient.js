import mqtt from "mqtt";
import { loadProfile } from "./profileLoader.js";
import { validateTelemetry } from "./validator.js";
import { writeYogaMat } from "./influxWriter.js";

<<<<<<< HEAD
const BROKER_URL = process.env.MQTT_BROKER;
const TOPIC = "iot/+/+/telemetry"; // + คือ Wildcard (แทนอะไรก็ได้) เช่น iot/device1/room1/telemetry
=======
const BROKER_URL = "mqtt://localhost:1883";
const TOPIC = "iot/+/telemetry"; // + คือ Wildcard (แทนอะไรก็ได้) เช่น iot/device1/telemetry
>>>>>>> dev-backend

export function startMqtt() {
  const client = mqtt.connect(BROKER_URL);

  client.on("connect", () => {
    console.log("✅ Connected to MQTT broker");
    client.subscribe(TOPIC);
  });
  //
  client.on("message", (topic, message) => {
    try {
      const data = JSON.parse(message.toString()); // แปลงข้อมูลที่มาเป็น Buffer ให้เป็น JSON Objec

      if (!data.profile_id) {
        throw new Error("Missing profile_id");
      }
      // Step A: ไปโหลดคู่มือตรวจ (Profile) มา
      const profile = loadProfile(data.profile_id);
      // Step B: ส่งข้อมูล+คู่มือ ไปให้ Validator ตรวจ
      const result = validateTelemetry(data, profile);

      if (!result.valid) {
        console.error("❌ Rejected telemetry:", result.errors);
        return;
      }
      // Step C: ถ้าผ่านหมด ก็แสดงว่าข้อมูลถูกต้อง
      console.log("✅ Accepted telemetry", {
        device_id: data.device_id,
        profile_id: data.profile_id,
        timestamp: data.timestamp
      });
      // Step D: เขียนลง InfluxDB
      if (data.profile_id === "yoga_mat_v1") {
        writeYogaMat(data);
      }

    } catch (err) {
      console.error("❌ Ingest error:", err.message);
    }
  });
}
