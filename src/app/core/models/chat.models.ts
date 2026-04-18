export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface UploadResponse {
  sessionId: string;
  message: string;
}

export interface AskResponse {
  answer: string;
  sources_used: number;
}