import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

interface CustomError extends Error {
  status?: number;
}

const ErrorHandling = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err.stack);

  // handle Zod validation errors separately
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Validation failed",
      errors: err.issues.map(issue => ({
        path: issue.path.join("."),
        message: issue.message,
        err:err.name
      })),
    });
  }

  const statusCode = err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  });
};

export default ErrorHandling;
