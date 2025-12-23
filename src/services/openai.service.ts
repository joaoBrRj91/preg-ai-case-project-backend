import { OpenAI } from "openai";
import generateContentToLLM from "../utils/Prompts/promptsTemplates";

class OpenAIService {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not defined");
    }
    this.client = new OpenAI({ apiKey });
  }

  async generateResponse(
    title: string,
    style: string,
    targetAudience: string
  ): Promise<{
    content: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
  }> {
    const response = await this.client.responses.create({
      model: "gpt-4o-mini",
      input: generateContentToLLM(title, style, targetAudience),
      max_output_tokens: 250,
      temperature: 0.2,
    });

    return {
      content: response.output_text,
      model: response.model,
      promptTokens: response.usage?.input_tokens ?? 0,
      completionTokens: response.usage?.output_tokens ?? 0,
    };
  }
}

export default new OpenAIService();
