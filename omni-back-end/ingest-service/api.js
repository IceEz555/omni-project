import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000; // API Port

app.use(cors());
app.use(bodyParser.json());

const PROFILE_DIR = path.join(process.cwd(), "device_profiles");
const INDEX_PATH = path.join(PROFILE_DIR, "index.json");

// Helper to read and write index
function readIndex() {
  if (!fs.existsSync(INDEX_PATH)) return { profiles: [] };
  return JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8"));
}
function writeIndex(data) {
  fs.writeFileSync(INDEX_PATH, JSON.stringify(data, null, 2));
}

// GET /device-profiles - List all profiles
app.get("/device-profiles", (req, res) => {
  try {
    const index = readIndex();
    res.json(index);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /device-profiles - Create/Update a profile
app.post("/device-profiles", (req, res) => {
  try {
    const { profile_id, device_type, telemetry_schema } = req.body;

    if (!profile_id || !device_type || !telemetry_schema) {
      return res.status(400).json({ error: "Missing required fields (profile_id, device_type, telemetry_schema)" });
    }
    // 1. Save the profile file
    const fileName = `${profile_id}.json`;
    const filePath = path.join(PROFILE_DIR, fileName);
    
    const newProfile = {
      profile_id,
      device_type,
      telemetry_schema
    };

    fs.writeFileSync(filePath, JSON.stringify(newProfile, null, 2));
    // 2. Update index.json
    const index = readIndex();
    const existingIdx = index.profiles.findIndex(p => p.profile_id === profile_id);
    if (existingIdx >= 0) {
      // Update existing
      index.profiles[existingIdx] = { profile_id, device_type, file: fileName };
    } else {
      // Add new
      index.profiles.push({ profile_id, device_type, file: fileName });
    }
    writeIndex(index);
    console.log(`[INFO] 🆕 Profile updated: ${profile_id}`);
    res.json({ message: "Profile saved successfully", profile: newProfile });
  } catch (err) {
    console.error("[ERROR] ❌ Failed to save profile:", err);
    res.status(500).json({ error: err.message });
  }
});

import { processTelemetry } from "./ingestLogic.js";

// POST /telemetry - Ingest data via HTTP
app.post("/telemetry", async (req, res) => {
  try {
    const data = req.body;
    const result = await processTelemetry(data);

    if (result.success) {
      console.log(`[INFO] 🌐 HTTP Ingest Success: ${data.device_id}`);
      res.json({ message: "Telemetry accepted" });
    } else {
      console.warn(`[WARN] 🌐 HTTP Ingest Rejected: ${result.error}`);
      res.status(400).json({ error: result.error, details: result.details });
    }
  } catch (err) {
    console.error(`[ERROR] 💥 HTTP Ingest Error: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export function startApi() {
  app.listen(PORT, () => {
    console.log(`[INFO] 🌍 API Server running on http://localhost:${PORT}`);
  });
}
