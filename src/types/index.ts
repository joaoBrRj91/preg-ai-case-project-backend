export interface TextRequest {
  title: string;
  style: string;
  targetAudience: string;
}

export interface FileRequest {
  fileData: number[];
  mimeType: "application/pdf" | "text/plain";
}

export interface LLMGenerateSermonResponse {
  content: string;
  model: string;
  tokens: {
    prompt: number;
    completion: number;
  };
}

export interface LLMOptimizatesSermonResponse {
  content: string;
  model: string;
  tokens: {
    prompt: number;
    completion: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
