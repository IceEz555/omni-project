import express from "express";
import * as adminController from "../controllers/adminController.js";
import { authenticateToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply Auth Middleware to all routes in this file
router.use(authenticateToken);

// Optional: Add requireRole('ADMIN') if you want only Admins to do this
router.post("/create-user", requireRole('ADMIN'), adminController.createUser);
router.put("/update-user/:id", requireRole('ADMIN'), adminController.updateUser);
router.delete("/delete-user/:id", requireRole('ADMIN'), adminController.deleteUser);
router.get("/get-users", adminController.getAllUsers); // Maybe Operators can view too?
router.get("/get-user/:id", adminController.getUserById);
router.get("/get-projects", adminController.getAllProjects);

export default router;