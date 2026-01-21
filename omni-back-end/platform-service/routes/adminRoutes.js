import express from "express";
import * as adminController from "../controllers/adminController.js";

const router = express.Router();

router.post("/users", adminController.createUser);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);
export default router;