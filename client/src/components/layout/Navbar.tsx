import React from 'react';
import { Compass, WifiOff, Camera } from 'lucide-react';
import { ActiveTab, OllamaHealth } from '../../types';

interface NavbarProps {
  currentTab?: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  isOnline: boolean;
  aiHealth: OllamaHealth | null;
  onOpenSetupGuide: () => void;
  onQuickIdentify: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  isOnline,
  aiHealth,
  onOpenSetupGuide,
  onQuickIdentify
}) => {
  const isAiReady = aiHealth?.status === 'connected' && aiHealth.visionModelFound;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sage-border/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Tagline */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-sage shadow-sm group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-forest-dark">WildBuddy</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sage/60 text-forest-dark border border-sage-border">
                Open AI
              </span>
            </div>
            <p className="text-[11px] text-charcoal-muted font-medium hidden sm:block">
              Less scrolling. More exploring.
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Offline indicator */}
          {!isOnline && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200">
              <WifiOff className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          )}

          {/* AI Runtime Status Pill */}
          <button
            onClick={onOpenSetupGuide}
            title={isAiReady ? `Ollama local AI active (${aiHealth.configuredVisionModel})` : 'Ollama runtime offline - Click for setup guide'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              isAiReady
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isAiReady ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="hidden md:inline">
              {isAiReady ? `Ollama: ${aiHealth.configuredVisionModel}` : 'AI: Demo Mode'}
            </span>
            <span className="md:hidden">
              {isAiReady ? 'AI Local' : 'Demo AI'}
            </span>
          </button>

          {/* Quick Identify Button */}
          <button
            onClick={onQuickIdentify}
            className="flex items-center gap-1.5 bg-forest hover:bg-forest-hover text-cream px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Identify Specimen</span>
            <span className="sm:hidden">Identify</span>
          </button>
        </div>
      </div>
    </header>
  );
};
