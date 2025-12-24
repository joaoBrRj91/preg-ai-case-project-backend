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
  title: string;
  introdution: string;
  points: {
    point: string;
    verse: string;
    development: string;
  };
  application: string;
  prayer: string;
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
