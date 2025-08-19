import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

// POST → create user + admin at once
router.post("/admin",userController.createAdminController);

export default router;
