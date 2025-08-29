import express from "express";
import { AdminController } from "./Admin.controller";

const router = express.Router();

router.get('/all-admin', AdminController.getAllDB);
router.get('/admin/:id', AdminController.singleUser);
router.patch('/admin/update/:id',AdminController.updateAdmin)
router.delete('/admin/hard/:id',AdminController.hardDeleteAdmin)
router.delete('/admin/soft/:id',AdminController.softDeleteAdmin)

export const AdminRoutes = router;
