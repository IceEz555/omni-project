import mqtt from "mqtt";

const BROKER_URL = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";
let client = null;

export const connectMqtt = () => {
    if (client) return client;

    console.log(`[MQTT] Connecting to ${BROKER_URL}...`);
    client = mqtt.connect(BROKER_URL);

    client.on("connect", () => {
        console.log("[MQTT] Connected to Broker");
    });

    client.on("error", (err) => {
        console.error("[MQTT] Connection Error:", err);
    });

    return client;
};

export const publishRecordingEvent = (deviceId, type) => {
    if (!client) connectMqtt();
    
    // Topic: system/recording/{start|end}
    const topic = `system/recording/${type}`;
    const payload = JSON.stringify({ device_id: deviceId, timestamp: new Date().toISOString() });

    client.publish(topic, payload, { qos: 1 }, (err) => {
        if (err) {
            console.error(`[MQTT] Failed to publish ${topic}:`, err);
        } else {
            console.log(`[MQTT] Published ${topic} for device ${deviceId}`);
        }
    });
};
