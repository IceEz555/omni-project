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
router.post("/create-user", adminController.createUser); // Removed requireRole('ADMIN') for Demo
router.put("/update-user/:id", adminController.updateUser); // Removed requireRole('ADMIN') for Demo
router.delete("/delete-user/:id", adminController.deleteUser); // Removed requireRole('ADMIN') for Demo
router.get("/get-users", adminController.getAllUsers);
router.get("/get-user/:id", adminController.getUserById);

// Project Management - REMOVED
// router.get("/get-projects", adminController.getAllProjects);

// Device Device Management
router.post("/create-device", deviceController.createDevice); // Removed requireRole('ADMIN') for Demo
router.get("/get-devices", deviceController.getAllDevices);
router.delete("/delete-device/:id", deviceController.deleteDevice); // Removed requireRole('ADMIN') for Demo
router.get("/get-telemetry/:deviceId", telemetryController.getDeviceTelemetry);

// Device Profile Management
router.post("/create-profile", deviceProfileController.createProfile); // Removed requireRole('ADMIN') for Demo
router.get("/get-profiles", deviceProfileController.getAllProfiles);
router.delete("/delete-profile/:id", deviceProfileController.deleteProfile); // Removed requireRole('ADMIN') for Demo
router.get("/get-device-profiles", deviceProfileController.getAllProfiles); // Alias/Update existing usage

export default router;