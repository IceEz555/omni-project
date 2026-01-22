import mqtt from "mqtt";

const client = mqtt.connect("mqtt://localhost:1883");

const TOPIC = "iot/device_test/telemetry";

client.on("connect", () => {
    console.log("✅ Tester Connected");
    runTests();
});

async function runTests() {
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    console.log("\n--- Test 1: Malformed JSON ---");
    client.publish(TOPIC, "This is not JSON");
    await delay(500);

    console.log("\n--- Test 2: Missing Profile ID ---");
    client.publish(TOPIC, JSON.stringify({ device_id: "d1" }));
    await delay(500);

    console.log("\n--- Test 3: Unknown Profile ID ---");
    client.publish(TOPIC, JSON.stringify({ profile_id: "unknown_v99", device_id: "d1" }));
    await delay(500);

    console.log("\n--- Test 4: Validation Error (Missing Timestamp) ---");
    client.publish(TOPIC, JSON.stringify({
        profile_id: "yoga_mat_v1",
        device_id: "d1",
        pressure_map: Array(32 * 32).fill(0),
        movement_status: true
    }));
    await delay(500);

    console.log("\n--- Test 5: Validation Error (Invalid Matrix Size) ---");
    client.publish(TOPIC, JSON.stringify({
        profile_id: "yoga_mat_v1",
        device_id: "d1",
        timestamp: Date.now(),
        pressure_map: [1, 2, 3], // Wrong size
        movement_status: true
    }));
    await delay(500);

    console.log("\n--- Test 6: Validation Error (Invalid Matrix Elements) ---");
    client.publish(TOPIC, JSON.stringify({
        profile_id: "yoga_mat_v1",
        device_id: "d1",
        timestamp: Date.now(),
        pressure_map: Array(32*32).fill("not a number"), 
        movement_status: true
    }));
    await delay(500);

    console.log("\n--- Test 7: Success Case ---");
    client.publish(TOPIC, JSON.stringify({
        profile_id: "yoga_mat_v1",
        device_id: "d1",
        timestamp: Date.now(),
        pressure_map: Array(32 * 32).fill(0),
        movement_status: true
    }));
    await delay(1000);

    client.end();
    console.log("\n✅ Tests Completed. Check Ingest Service logs.");
    process.exit(0);
}
