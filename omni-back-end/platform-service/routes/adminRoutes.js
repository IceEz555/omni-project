import express from "express";
import * as adminController from "../controllers/adminController.js";

const router = express.Router();

router.post("/create-user", adminController.createUser);
router.put("/update-user/:id", adminController.updateUser);
router.delete("/delete-user/:id", adminController.deleteUser);
router.get("/get-users", adminController.getAllUsers);
router.get("/get-user/:id", adminController.getUserById);
export default router;