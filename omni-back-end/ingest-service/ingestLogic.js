import { loadProfile } from "./profileLoader.js";
import { validateTelemetry } from "./validator.js";
import { writeTelemetry } from "./influxWriter.js";

export async function processTelemetry(data) {
  // 1. Basic Check
  if (!data.profile_id) {
    return { success: false, error: "Missing profile_id", type: "MISSING_PROFILE_ID" };
  }

  // 2. Load Profile
  let profile;
  try {
    profile = await loadProfile(data.profile_id);
  } catch (e) {
    return { success: false, error: `Profile not found: ${data.profile_id}`, type: "PROFILE_NOT_FOUND" };
  }

  // 3. Validate
  const result = validateTelemetry(data, profile);
  if (!result.valid) {
    return { success: false, error: "Validation Failed", type: "VALIDATION_ERROR", details: result.errors };
  }

  // 4. Write to DB (Generic)
  try {
    writeTelemetry(data, profile);
  } catch (e) {
    return { success: false, error: `DB Write Failed: ${e.message}`, type: "DB_ERROR" };
  }

  return { success: true };
}
