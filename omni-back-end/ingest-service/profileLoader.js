import fs from "fs"; // fs = File System (ไว้สำหรับอ่านไฟล์)
import path from "path";
// หา path ของโฟลเดอร์ device_profiles
const PROFILE_DIR = path.join(process.cwd(), "device_profiles");

export function loadProfile(profileId) {
  const indexPath = path.join(PROFILE_DIR, "index.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf-8")); // อ่านไฟล์ index.json

  // หาว่า profileId ที่ส่งมา ตรงกับอันไหนใน index.json
  const record = index.profiles.find(p => p.profile_id === profileId);
  if (!record) {
    throw new Error(`Profile not found: ${profileId}`);
  } 
  // ถ้าเจอ ก็ไปอ่านไฟล์ profile นั้นๆจริงๆ (เช่น yoga_mat_v1.json)
  const profilePath = path.join(PROFILE_DIR, record.file);
  return JSON.parse(fs.readFileSync(profilePath, "utf-8")); // ส่งคืนเนื้อหาไฟล์ JSON กลับไป
}
