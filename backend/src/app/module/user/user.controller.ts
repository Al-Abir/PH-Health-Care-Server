import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdminController = async (req: Request, res: Response) => {
  try {
    const result = await userService.createAdmin(req.body);
    res.status(201).json({
      message: "Admin created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error creating admin",
      error: error.message,
    });
  }
};

export const userController={
    createAdminController
}