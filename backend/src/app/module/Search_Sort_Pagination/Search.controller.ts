import { Request, Response } from "express";
import { QueryServiceProvider } from "./Search.service";
export const searchqueryController = async (req: Request, res: Response) => {
  try {
    const users = await QueryServiceProvider(req.query);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};
