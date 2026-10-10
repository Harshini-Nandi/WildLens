import { useState, useEffect, useCallback } from 'react';
import { OllamaHealth } from '../types';
import { checkAiHealth } from '../services/api';

export function useAiHealth() {
  const [health, setHealth] = useState<OllamaHealth | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshHealth = useCallback(async () => {
    setLoading(true);
    try {
      const data = await checkAiHealth();
      setHealth(data);
    } catch {
      setHealth({
        status: 'disconnected',
        host: 'http://127.0.0.1:11434',
        availableModels: [],
        configuredVisionModel: 'gemma3',
        configuredTextModel: 'gemma3',
        visionModelFound: false,
        textModelFound: false,
        message: 'Unable to reach backend API'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshHealth();
    // Re-check periodically every 20 seconds
    const interval = setInterval(refreshHealth, 20000);
    return () => clearInterval(interval);
  }, [refreshHealth]);

  return { health, loading, refreshHealth };
}
