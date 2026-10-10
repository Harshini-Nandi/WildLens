import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  ollamaHost: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434',
  ollamaVisionModel: process.env.OLLAMA_VISION_MODEL || 'gemma3',
  ollamaTextModel: process.env.OLLAMA_TEXT_MODEL || 'gemma3',
  timeoutMs: parseInt(process.env.OLLAMA_TIMEOUT_MS || '60000', 10),
};
