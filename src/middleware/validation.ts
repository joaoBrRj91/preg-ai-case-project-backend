import { Request, Response, NextFunction } from "express";

export const validateTextRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, style, targetAudience } = req.body;

  if (
    !title ||
    typeof title !== "string" ||
    !style ||
    typeof style !== "string" ||
    !targetAudience ||
    typeof targetAudience !== "string"
  ) {
    res.status(400).json({
      success: false,
      error:
        'Invalid request: "title", "style" and "targetAudience" fields is required and must be a string',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next();
};
