import { Request, Response } from "express";
import { userService } from "./user.service";
import { CreateAdminSchema } from "./user.validation";
import { ZodError } from "zod";

const createAdminController = async (req: Request, res: Response) => {
  try {
    const validatedData = CreateAdminSchema.parse(req.body);
    const result = await userService.createAdmin(validatedData);

    res.status(201).json({
      message: "Admin created successfully",
      data: result,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.issues.map(issue => issue.message),
      });
    }

    const error = err as Error;
    res.status(500).json({
      message: "Error creating admin",
      error: error.message,
    });
  }
};

export const userController = {
  createAdminController,
};
