import { Request, Response } from "express";
import fileProcessingService from "../services/fileProcessing.service";
import openaiService from "../services/openai.service";
import { LLMOptimizatesSermonResponse, ApiResponse } from "../types";

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

export const handleFileRequest = async (
  req: Request,
  res: Response<
    ApiResponse<LLMOptimizatesSermonResponse & { extractedText: string }>
  >
): Promise<void> => {
  const file = req.file;
  //const { targetAudience } = req.body;

  try {
    if (!file) {
      res.status(400).json({
        success: false,
        error: "No file provided",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Extract text from file
    const extractedText = await fileProcessingService.processFile(
      file.buffer,
      file.mimetype as "application/pdf" | "text/plain"
    );

    if (extractedText.length === 0) {
      res.status(400).json({
        success: false,
        error: "No text content could be extracted from the file",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Send to LLM for optimization
    const result = await openaiService.optimizateResponseSermon(extractedText);

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
