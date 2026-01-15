import fs from "fs";
import path from "path";

const PROFILE_DIR = path.join(process.cwd(), "device_profiles");

export function loadProfile(profileId) {
  const indexPath = path.join(PROFILE_DIR, "index.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

  const record = index.profiles.find(p => p.profile_id === profileId);
  if (!record) {
    throw new Error(`Profile not found: ${profileId}`);
  }

  const profilePath = path.join(PROFILE_DIR, record.file);
  return JSON.parse(fs.readFileSync(profilePath, "utf-8"));
}
