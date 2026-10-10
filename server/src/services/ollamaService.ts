import { config } from '../config/env';
import {
  Adventure,
  AdventureRequest,
  IdentificationResponse,
  NatureCategory,
  OllamaHealthInfo
} from '../types';

export class OllamaService {
  private host: string;
  private visionModel: string;
  private textModel: string;
  private timeoutMs: number;

  constructor() {
    this.host = config.ollamaHost;
    this.visionModel = config.ollamaVisionModel;
    this.textModel = config.ollamaTextModel;
    this.timeoutMs = config.timeoutMs;
  }

  public updateConfig(newHost?: string, newVisionModel?: string, newTextModel?: string) {
    if (newHost) this.host = newHost;
    if (newVisionModel) this.visionModel = newVisionModel;
    if (newTextModel) this.textModel = newTextModel;
  }

  public getConfig() {
    return {
      host: this.host,
      visionModel: this.visionModel,
      textModel: this.textModel,
    };
  }

  /**
   * Check if Ollama is reachable and query installed models
   */
  public async checkHealth(): Promise<OllamaHealthInfo> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`${this.host}/api/tags`, {
        signal: controller.signal
      });
      clearTimeout(id);

      if (!response.ok) {
        return {
          status: 'disconnected',
          host: this.host,
          availableModels: [],
          configuredVisionModel: this.visionModel,
          configuredTextModel: this.textModel,
          visionModelFound: false,
          textModelFound: false,
          message: `Ollama returned HTTP ${response.status}: ${response.statusText}`
        };
      }

      const data = (await response.json()) as { models?: Array<{ name: string }> };
      const modelNames = (data.models || []).map(m => m.name);

      // Check if configured models match (with or without :tag)
      const hasVision = modelNames.some(m => m === this.visionModel || m.startsWith(`${this.visionModel}:`));
      const hasText = modelNames.some(m => m === this.textModel || m.startsWith(`${this.textModel}:`));

      // Fetch version if available
      let version: string | undefined;
      try {
        const verRes = await fetch(`${this.host}/api/version`);
        if (verRes.ok) {
          const verData = (await verRes.json()) as { version: string };
          version = verData.version;
        }
      } catch {
        // Ignore version fetch failure
      }

      return {
        status: 'connected',
        host: this.host,
        version,
        availableModels: modelNames,
        configuredVisionModel: this.visionModel,
        configuredTextModel: this.textModel,
        visionModelFound: hasVision,
        textModelFound: hasText,
        message: 'Ollama local AI runtime is connected and ready.'
      };
    } catch (err: unknown) {
      const error = err as Error;
      return {
        status: 'disconnected',
        host: this.host,
        availableModels: [],
        configuredVisionModel: this.visionModel,
        configuredTextModel: this.textModel,
        visionModelFound: false,
        textModelFound: false,
        message: `Could not connect to Ollama at ${this.host}: ${error.message || 'Connection refused'}`
      };
    }
  }

  /**
   * Identify a nature photograph using Ollama vision model
   */
  public async identifyNatureImage(
    base64ImageData: string,
    categoryHint?: NatureCategory
  ): Promise<IdentificationResponse> {
    // Strip prefix if data URL (e.g. data:image/jpeg;base64,...)
    const cleanBase64 = base64ImageData.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    const prompt = `You are WildBuddy, an expert outdoor naturalist and nature educator AI.
Examine this photograph of a natural specimen. The user indicated the category is: ${categoryHint || 'general nature'}.

Provide a careful, realistic botanical or zoological identification suggestion.
Respond STRICTLY with valid JSON following this schema:
{
  "suggestedName": "Common Name (Scientific Name if known)",
  "category": "${categoryHint || 'plant'}",
  "visibleFeatures": ["key visible characteristic 1", "key visible characteristic 2", "key visible characteristic 3"],
  "explanation": "2-3 sentences explaining why it appears to be this species, where it is found, and an engaging ecological fact.",
  "confidence": "low" | "medium" | "high",
  "safetyNote": "A practical outdoor safety caution (e.g. do not consume wild plants/mushrooms, keep distance from wildlife)."
}

IMPORTANT: Do not pretend to be 100% scientifically infallible. Use "low", "medium", or "high" confidence based on photo clarity and visibility. Always include a safety reminder. Return ONLY the JSON object.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.host}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.visionModel,
          prompt,
          images: [cleanBase64],
          stream: false,
          format: 'json',
          options: {
            temperature: 0.2
          }
        })
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error (${response.status}): ${errorText}`);
      }

      const resData = (await response.json()) as { response?: string };
      const rawText = resData.response || '';

      const parsed = this.parseJsonFromResponse(rawText);

      return {
        suggestedName: parsed.suggestedName || 'Unidentified Natural Specimen',
        category: (parsed.category as NatureCategory) || categoryHint || 'plant',
        visibleFeatures: Array.isArray(parsed.visibleFeatures) ? parsed.visibleFeatures : ['Distinctive foliage and natural structure'],
        explanation: parsed.explanation || 'Specimen observed outdoors. Further in-person observation recommended.',
        confidence: ['low', 'medium', 'high'].includes(parsed.confidence) ? parsed.confidence : 'medium',
        safetyNote: parsed.safetyNote || 'Always observe nature responsibly. Never ingest unidentified wild plants or disturb wildlife.',
        isSimulation: false,
        modelUsed: `Local Ollama (${this.visionModel})`
      };
    } catch (err: unknown) {
      clearTimeout(timeout);
      throw err;
    }
  }

  /**
   * Generate a structured nature adventure mission using Ollama text model
   */
  public async generateAdventureWithAI(params: AdventureRequest): Promise<Adventure> {
    const taskCount = params.durationMinutes === 15 ? 4 : (params.durationMinutes === 30 ? 5 : 6);

    const prompt = `You are WildBuddy, an outdoor nature discovery guide that encourages people to spend LESS time on screens and MORE time observing nature outside.

Create an engaging outdoor exploration adventure with these parameters:
- Duration: ${params.durationMinutes} minutes
- Environment: ${params.environment}
- Interest: ${params.interest}
- Difficulty: ${params.difficulty}
${params.accessibilityPreference ? `- Accessibility preference: ${params.accessibilityPreference}` : ''}

Generate ${taskCount} practical, observation-focused tasks that can be done outdoors without staring at a phone.
Return STRICTLY valid JSON with this schema:
{
  "title": "Creative Adventure Title",
  "introduction": "Inspiring 1-2 sentence invitation to step outside.",
  "safetyReminder": "Safety reminder tailored to this environment.",
  "tasks": [
    {
      "title": "Short action-oriented title",
      "estimatedMinutes": ${Math.floor(params.durationMinutes / taskCount)},
      "instruction": "Simple, actionable real-world instruction (e.g. Find two leaves with different vein structures).",
      "whatToObserve": "Specific detail to look, listen, or feel for."
    }
  ]
}
Return ONLY JSON.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.host}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.textModel,
          prompt,
          stream: false,
          format: 'json',
          options: {
            temperature: 0.7
          }
        })
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Ollama text generation error (${response.status})`);
      }

      const resData = (await response.json()) as { response?: string };
      const rawText = resData.response || '';
      const parsed = this.parseJsonFromResponse(rawText);

      const tasks = (parsed.tasks || []).map((t: any, idx: number) => ({
        id: `task-${Date.now()}-${idx + 1}`,
        title: t.title || `Observation ${idx + 1}`,
        estimatedMinutes: t.estimatedMinutes || Math.floor(params.durationMinutes / taskCount),
        instruction: t.instruction || 'Observe your natural surroundings closely.',
        whatToObserve: t.whatToObserve || 'Look for subtle natural patterns.',
        completed: false
      }));

      return {
        id: `adv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: parsed.title || 'Outdoor Nature Expedition',
        introduction: parsed.introduction || 'Step outside, breathe fresh air, and tune your senses to the living world.',
        estimatedTotalMinutes: params.durationMinutes,
        environment: params.environment,
        interest: params.interest,
        difficulty: params.difficulty,
        accessibilityNotes: params.accessibilityPreference,
        safetyReminder: parsed.safetyReminder || 'Stay on safe paths, respect wildlife, and leave no trace.',
        tasks,
        generatedBy: 'ollama',
        createdAt: new Date().toISOString()
      };
    } catch (err: unknown) {
      clearTimeout(timeout);
      throw err;
    }
  }

  private parseJsonFromResponse(text: string): any {
    // Remove markdown code fences if present
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }

    try {
      return JSON.parse(cleaned);
    } catch {
      // Try to find the first { and last }
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const extracted = cleaned.substring(firstBrace, lastBrace + 1);
        return JSON.parse(extracted);
      }
      throw new Error('Failed to parse structured JSON from Ollama response');
    }
  }
}

export const ollamaService = new OllamaService();
