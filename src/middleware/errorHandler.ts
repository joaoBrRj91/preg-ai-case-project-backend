import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Error:", error);

  if (error instanceof Error) {
    res.status(400).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(500).json({
      success: false,
      error: "An unexpected error occurred",
      timestamp: new Date().toISOString(),
    });
  }
};

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
