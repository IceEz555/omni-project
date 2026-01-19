import "dotenv/config";
import { writeApi } from "./influxWriter.js";
import { startMqtt } from "./mqttClient.js";

// -------------------------------------------------------------------------
// ✅ Start MQTT
// -------------------------------------------------------------------------
console.log("🚀 Ingest Service starting...");
startMqtt();

// -------------------------------------------------------------------------
// ✅ Graceful Shutdown (ปิดโปรแกรมอย่างสวยงาม)
// -------------------------------------------------------------------------
process.on("SIGINT", async () => {
  console.log("Closing InfluxDB writer...");
  await writeApi.close();
  process.exit(0);
});

