import { Adventure, AdventureRequest, IdentificationResult, NatureCategory, OllamaHealth } from '../types';
import { generateClientOfflineAdventure } from './offlineAdventureGenerator';

const API_BASE = '/api';

export async function checkAiHealth(): Promise<OllamaHealth> {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
      throw new Error(`Health check returned status ${res.status}`);
    }
    const data = await res.json();
    return data.data;
  } catch (err: unknown) {
    const error = err as Error;
    return {
      status: 'disconnected',
      host: 'http://127.0.0.1:11434',
      availableModels: [],
      configuredVisionModel: 'gemma3',
      configuredTextModel: 'gemma3',
      visionModelFound: false,
      textModelFound: false,
      message: `Backend API or Ollama unreachable: ${error.message}`
    };
  }
}

export async function identifyNatureSpecimen(
  base64Image: string,
  category?: NatureCategory,
  preferSimulationIfOffline = true
): Promise<IdentificationResult> {
  try {
    const res = await fetch(`${API_BASE}/identify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: base64Image,
        category,
        preferSimulationIfOffline
      })
    });

    const body = await res.json();
    if (!res.ok) {
      throw new Error(body.error || `Server responded with ${res.status}`);
    }

    return body.data as IdentificationResult;
  } catch (err: unknown) {
    // If network failed completely (offline mode)
    if (preferSimulationIfOffline) {
      return {
        suggestedName: category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Specimen` : 'Wild Natural Specimen',
        category: category || 'plant',
        visibleFeatures: [
          'Distinctive organic form captured in outdoor light',
          'Intricate cellular and structural vascular pattern',
          'Adaptation to natural outdoor microclimate'
        ],
        explanation: 'Observed offline without active local Ollama backend. Recorded with metadata for later botanical reference.',
        confidence: 'low',
        safetyNote: 'Always observe nature responsibly. Never ingest unidentified plants or disturb wildlife.',
        isSimulation: true,
        modelUsed: 'Offline Journal Fallback'
      };
    }
    throw err;
  }
}

export async function requestAdventure(params: AdventureRequest): Promise<Adventure> {
  try {
    const res = await fetch(`${API_BASE}/generate-adventure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      throw new Error(`Failed to generate adventure: status ${res.status}`);
    }

    const body = await res.json();
    return body.data as Adventure;
  } catch (err: unknown) {
    console.warn('API adventure generation failed, using client-side offline generator:', (err as Error).message);
    // Instant seamless offline fallback!
    return generateClientOfflineAdventure(params);
  }
}

export async function saveOllamaConfig(host: string, visionModel: string, textModel: string) {
  try {
    const res = await fetch(`${API_BASE}/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host, visionModel, textModel })
    });
    return res.json();
  } catch (err) {
    console.warn('Could not update backend config:', err);
    return null;
  }
}
