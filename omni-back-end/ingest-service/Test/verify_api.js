
async function runApiTests() {
  const API_URL = "http://localhost:3000/device-profiles";
  
  console.log("\n--- Test 1: GET /device-profiles ---");
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    console.log("GET Result:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("GET Failed:", e.message);
  }

  console.log("\n--- Test 2: POST /device-profiles (New Profile) ---");
  const newProfile = {
    profile_id: "test_device_v1",
    device_type: "tester",
    telemetry_schema: {
      fields: [
        { name: "temp", type: "number", required: true }
      ]
    }
  };

  try {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfile)
    });
    const data = await res.json();
    console.log("POST Result:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("POST Failed:", e.message);
  }

  console.log("\n--- Test 3: GET /device-profiles (Verify Update) ---");
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    console.log("GET Result:", JSON.stringify(data, null, 2));
    
    // Check if new profile exists
    const exists = data.profiles.find(p => p.profile_id === "test_device_v1");
    if(exists) console.log("✅ Verification Success: Profile found in index.");
    else console.error("❌ Verification Failed: Profile not found.");

  } catch (e) {
    console.error("GET Failed:", e.message);
  }
}

runApiTests();
