import { Request, Response } from "express";
import openaiService from "../services/openai.service";
import { LLMGenerateSermonResponse, ApiResponse, TextRequest } from "../types";

export const handleTextRequest = async (
  req: Request<unknown, unknown, TextRequest>,
  res: Response<ApiResponse<LLMGenerateSermonResponse>>
): Promise<void> => {
  const { title, style, targetAudience } = req.body;

  try {
    const result = await openaiService.generateResponseNewSermon(
      title,
      style,
      targetAudience
    );

    res.status(200).json({
      success: true,
      data: {
        content: result.content,
        model: result.model,
        tokens: {
          prompt: result.promptTokens,
          completion: result.completionTokens,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
};
