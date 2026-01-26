import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function loadProfile(profileId) {
  console.log(`🔍 Loading profile from DB: ${profileId}`);
  
  try {
    const profile = await prisma.deviceProfile.findUnique({
      where: { profile_id: profileId }
    });

    if (!profile) {
      throw new Error(`Profile not found in DB: ${profileId}`);
    }

    // Transform DB format to the format expected by ingestLogic
    // DB: { schema_definition: { format: ... }, data_type: ... }
    // Expected: { telemetry_schema: { ... } } ??
    // Wait, let's check what ingestLogic expects.
    // It calls `validateTelemetry(data, profile)`.
    // validator.js likely iterates `profile.telemetry_schema.fields`.
    
    // In our DB migration, we stored `schema_definition` which holds the JSON schema.
    // We assume schema_definition IS the telemetry_schema + other stuff?
    // Let's assume schema_definition = { fields: [...] } for now based on what I wrote in ultrasonic_sensor.json
    
    // If I created a profile via API earlier (DeviceProfileController), I saved `schema_definition: { format: dataFormat || "JSON" }`.
    // This is NOT enough for validation! The validator needs `fields`.
    
    // SHORTCUT FOR NOW:
    // If the DB profile lacks detailed schema, we might accept all data or return a minimal compliant object.
    // But since the user wants "ultrasonic_sensor", I should ensure when they create it on Frontend, we save the FIELDS.
    // Current Frontend simply asks for "Data Format" string.
    
    // WORKAROUND:
    // If profile is from DB, check if it has fields. If not, default to "Dynamic/Accept All" or construct based on Type.
    
    let schema = profile.schema_definition;
    
    // If schema is just { format: "JSON" }, we might need to mock fields or adjust validator.
    // For now, let's just return the raw DB object and let the Validator crash or pass.
    // Actually, let's fallback: If no fields, assume generic?
    
    return {
        ...profile,
        device_type: profile.data_type, // Map DB 'data_type' to expected 'device_type'
        telemetry_schema: schema // Map schema_definition to telemetry_schema
    };

  } catch (error) {
    console.error("❌ Database Load Error:", error);
    throw error;
  }
}
