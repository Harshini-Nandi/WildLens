import { Router, Request, Response } from 'express';
import { ollamaService } from '../services/ollamaService';
import { generateDeterministicAdventure, getSampleDemonstrationIdentification } from '../services/fallbackService';
import { AdventureRequest, IdentificationRequest, NatureCategory } from '../types';

const router = Router();

/**
 * GET /api/health
 * Returns Ollama health status, connection state, and discovered models.
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const health = await ollamaService.checkHealth();
    return res.json({
      success: true,
      data: health,
      setupInstructions: {
        installOllama: 'Download from https://ollama.com and install.',
        pullVisionModel: `Run in terminal: ollama pull ${health.configuredVisionModel}`,
        pullTextModel: `Run in terminal: ollama pull ${health.configuredTextModel}`,
        startCommand: 'ollama serve'
      }
    });
  } catch (err: unknown) {
    const error = err as Error;
    return res.status(500).json({
      success: false,
      error: error.message || 'Error checking Ollama health'
    });
  }
});

/**
 * POST /api/identify
 * Identifies a nature image using local vision model or returns clearly marked simulation if offline.
 */
router.post('/identify', async (req: Request, res: Response) => {
  try {
    const { image, category, preferSimulationIfOffline } = req.body as IdentificationRequest;

    if (!image || typeof image !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing required base64 image data'
      });
    }

    // Check payload size (approximate)
    if (image.length > 30 * 1024 * 1024) {
      return res.status(413).json({
        success: false,
        error: 'Image is too large. Please use an image under 15MB.'
      });
    }

    // Check Ollama status
    const health = await ollamaService.checkHealth();

    if (health.status === 'connected' && health.visionModelFound) {
      try {
        const result = await ollamaService.identifyNatureImage(image, category);
        return res.json({
          success: true,
          data: result
        });
      } catch (ollamaErr: unknown) {
        const oErr = ollamaErr as Error;
        console.warn('Ollama vision inference failed:', oErr.message);

        // If user allows simulation fallback on error
        if (preferSimulationIfOffline !== false) {
          const sample = getSampleDemonstrationIdentification(category);
          sample.explanation += ` (Notice: Local model ${health.configuredVisionModel} encountered an error: ${oErr.message}. Displaying demonstration result.)`;
          return res.json({
            success: true,
            data: sample,
            fallbackNotice: 'Local Ollama encountered an error during inference. Demonstration sample displayed.'
          });
        }

        return res.status(502).json({
          success: false,
          error: `Ollama inference error: ${oErr.message}`
        });
      }
    } else {
      // Ollama not reachable or vision model not installed
      if (preferSimulationIfOffline !== false) {
        const sample = getSampleDemonstrationIdentification(category);
        return res.json({
          success: true,
          data: sample,
          fallbackNotice: health.status !== 'connected'
            ? 'Local Ollama runtime is not running. Displaying demonstration sample. Start Ollama with "ollama serve" for real offline AI.'
            : `Vision model "${health.configuredVisionModel}" not found. Run "ollama pull ${health.configuredVisionModel}". Demonstration sample displayed.`
        });
      }

      return res.status(503).json({
        success: false,
        error: 'Local Ollama vision model is currently unavailable.',
        health
      });
    }
  } catch (err: unknown) {
    const error = err as Error;
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal identification error'
    });
  }
});

/**
 * POST /api/generate-adventure
 * Generates an outdoor nature adventure using local text model or deterministic offline engine.
 */
router.post('/generate-adventure', async (req: Request, res: Response) => {
  try {
    const { durationMinutes, environment, interest, difficulty, accessibilityPreference } = req.body as AdventureRequest;

    const validDurations = [15, 30, 60];
    const duration = validDurations.includes(Number(durationMinutes)) ? (Number(durationMinutes) as 15 | 30 | 60) : 30;
    const env = environment || 'any';
    const intr = interest || 'general';
    const diff = difficulty || 'easy';

    const params: AdventureRequest = {
      durationMinutes: duration,
      environment: env,
      interest: intr,
      difficulty: diff,
      accessibilityPreference
    };

    // Check if Ollama is connected
    const health = await ollamaService.checkHealth();

    if (health.status === 'connected' && health.textModelFound) {
      try {
        const adventure = await ollamaService.generateAdventureWithAI(params);
        return res.json({
          success: true,
          data: adventure
        });
      } catch (ollamaErr: unknown) {
        console.warn('Ollama adventure generation failed, falling back to deterministic:', (ollamaErr as Error).message);
        const fallbackAdventure = generateDeterministicAdventure(params);
        return res.json({
          success: true,
          data: fallbackAdventure,
          fallbackNotice: 'Local model was temporarily busy. High quality deterministic adventure generated.'
        });
      }
    } else {
      // Offline / Deterministic mode
      const fallbackAdventure = generateDeterministicAdventure(params);
      return res.json({
        success: true,
        data: fallbackAdventure,
        fallbackNotice: health.status !== 'connected'
          ? 'Generated via WildBuddy offline deterministic engine (Ollama is not running).'
          : `Generated via WildBuddy offline deterministic engine (Model "${health.configuredTextModel}" not pulled).`
      });
    }
  } catch (err: unknown) {
    const error = err as Error;
    return res.status(500).json({
      success: false,
      error: error.message || 'Error generating adventure'
    });
  }
});

/**
 * POST /api/config
 * Update Ollama host or model configurations
 */
router.post('/config', (req: Request, res: Response) => {
  const { host, visionModel, textModel } = req.body;
  ollamaService.updateConfig(host, visionModel, textModel);
  return res.json({
    success: true,
    data: ollamaService.getConfig()
  });
});

/**
 * GET /api/config
 * Get current Ollama configuration
 */
router.get('/config', (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: ollamaService.getConfig()
  });
});

export default router;
