import React from 'react';
import { WifiOff, Cpu, AlertTriangle } from 'lucide-react';
import { OllamaHealth } from '../../types';

interface StatusBannerProps {
  isOnline: boolean;
  aiHealth: OllamaHealth | null;
  onOpenSetupGuide: () => void;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  isOnline,
  aiHealth,
  onOpenSetupGuide
}) => {
  // If browser is completely offline
  if (!isOnline) {
    return (
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs sm:text-sm text-amber-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Offline Mode:</strong> Internet disconnected. Saved observations, adventures, and journal are fully available locally.
          </span>
        </div>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-amber-200/60 text-amber-900 font-medium text-[11px]">
          PWA Active
        </span>
      </div>
    );
  }

  // If Ollama is disconnected
  if (aiHealth && aiHealth.status === 'disconnected') {
    return (
      <div className="bg-sage-light border-b border-sage-border px-4 py-2 text-xs sm:text-sm text-charcoal flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-forest shrink-0" />
          <span>
            <strong>Local Ollama Offline:</strong> Running in offline demo mode. For real local vision inference, start Ollama locally.
          </span>
        </div>
        <button
          onClick={onOpenSetupGuide}
          className="text-forest hover:text-forest-dark font-medium underline shrink-0 ml-2"
        >
          Setup Guide
        </button>
      </div>
    );
  }

  // If Ollama is connected but models are not downloaded yet
  if (aiHealth && aiHealth.status === 'connected' && (!aiHealth.visionModelFound || !aiHealth.textModelFound)) {
    return (
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-xs sm:text-sm text-blue-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            <strong>Ollama Connected:</strong> Model <code>{aiHealth.configuredVisionModel}</code> needs to be pulled.
          </span>
        </div>
        <button
          onClick={onOpenSetupGuide}
          className="text-blue-700 hover:text-blue-900 font-medium underline shrink-0 ml-2"
        >
          View Pull Command
        </button>
      </div>
    );
  }

  return null;
};
