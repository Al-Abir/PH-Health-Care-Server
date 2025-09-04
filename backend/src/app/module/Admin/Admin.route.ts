import express, { NextFunction, Request, Response } from "express";
import { AdminController } from "./Admin.controller";
import update from "./Admin.validation";
import validateRequest from "../GlobalEorrHanlder/validateRequest";

const router = express.Router();


router.get('/all-admin', AdminController.getAllDB);
router.get('/admin/:id', AdminController.singleUser);
router.patch('/admin/update/:id',validateRequest(update),AdminController.updateAdmin)
router.delete('/admin/hard/:id',AdminController.hardDeleteAdmin)
router.delete('/admin/soft/:id',AdminController.softDeleteAdmin)

export const AdminRoutes = router;
