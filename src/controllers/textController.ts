import { Request, Response } from "express";
import openaiService from "../services/openai.service";

import { LLMGenerateSermonResponse, ApiResponse, TextRequest } from "../types";

function parseLLMJson<T>(raw: string): T {
  try {
    //Tenta parser o retorno do json da llm para o tipo
    return JSON.parse(raw);
  } catch (err) {
    const repaired = raw
      // remove trailing commas antes de } ou ]
      .replace(/,\s*(\}|\])/g, "$1")
      // remove caracteres invisíveis comuns
      .replace(/[\u0000-\u001F]+/g, "")
      // remove BOM se existir
      .replace(/^\uFEFF/, "");

    return JSON.parse(repaired);
  }
}

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
      data: parseLLMJson(result.content),
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
