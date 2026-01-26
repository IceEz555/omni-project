import express from "express";
import * as deviceController from "../controllers/deviceController.js";
import * as adminController from "../controllers/adminController.js";
import * as deviceProfileController from "../controllers/deviceProfileController.js";
import * as telemetryController from "../controllers/telemetryController.js";
import { authenticateToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply Auth Middleware to all routes in this file
router.use(authenticateToken);

// User Management
router.post("/create-user", requireRole('ADMIN'), adminController.createUser);
router.put("/update-user/:id", requireRole('ADMIN'), adminController.updateUser);
router.delete("/delete-user/:id", requireRole('ADMIN'), adminController.deleteUser);
router.get("/get-users", adminController.getAllUsers);
router.get("/get-user/:id", adminController.getUserById);

// Project Management
router.get("/get-projects", adminController.getAllProjects);

// Device Device Management
router.post("/create-device", requireRole('ADMIN'), deviceController.createDevice);
router.get("/get-devices", deviceController.getAllDevices);
router.delete("/delete-device/:id", requireRole('ADMIN'), deviceController.deleteDevice);
router.get("/get-telemetry/:deviceId", telemetryController.getDeviceTelemetry);

// Device Profile Management
router.post("/create-profile", requireRole('ADMIN'), deviceProfileController.createProfile);
router.get("/get-profiles", deviceProfileController.getAllProfiles);
router.delete("/delete-profile/:id", requireRole('ADMIN'), deviceProfileController.deleteProfile);
router.get("/get-device-profiles", deviceProfileController.getAllProfiles); // Alias/Update existing usage

export default router;