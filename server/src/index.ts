import { createApp } from './app';
import { config } from './config/env';

const app = createApp();

app.listen(config.port, () => {
  console.log(`🌲 WildBuddy Server is running on port ${config.port}`);
  console.log(`🤖 Configured Ollama Host: ${config.ollamaHost}`);
  console.log(`👁️ Vision Model: ${config.ollamaVisionModel}`);
  console.log(`📝 Text Model: ${config.ollamaTextModel}`);
  console.log(`🌿 Health check available at: http://localhost:${config.port}/api/health`);
});
