import { startMqtt } from "./mqttClient.js";
import "dotenv/config";

console.log("🚀 Ingest Service starting...");
startMqtt();
