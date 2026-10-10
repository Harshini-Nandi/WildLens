import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Sparkles,
  CheckCircle2,
  Trees,
  Flower2,
  Camera,
  Heart,
  Eye,
  Footprints
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { requestAdventure } from '../../services/api';
import {
  Adventure,
  AdventureDifficulty,
  AdventureEnvironment,
  AdventureInterest,
  AdventureRequest,
  OllamaHealth
} from '../../types';

interface AdventureGeneratorProps {
  onStartAdventure: (adventure: Adventure) => void;
  savedAdventures: Adventure[];
  aiHealth: OllamaHealth | null;
}

export const AdventureGenerator: React.FC<AdventureGeneratorProps> = ({
  onStartAdventure,
  savedAdventures,
  aiHealth
}) => {
  const [duration, setDuration] = useState<15 | 30 | 60>(30);
  const [environment, setEnvironment] = useState<AdventureEnvironment>('park');
  const [interest, setInterest] = useState<AdventureInterest>('general');
  const [difficulty, setDifficulty] = useState<AdventureDifficulty>('easy');
  const [accessibility, setAccessibility] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const environments: Array<{ id: AdventureEnvironment; label: string; desc: string }> = [
    { id: 'garden', label: 'Home Garden / Yard', desc: 'Backyard foliage, balcony plants, domestic soil' },
    { id: 'park', label: 'City Park / Common', desc: 'Canopy trees, manicured lawns, pond edges' },
    { id: 'neighborhood', label: 'Neighborhood Walk', desc: 'Pavement cracks, sidewalk hedges, street trees' },
    { id: 'forest', label: 'Forest / Woods', desc: 'Dense canopy, decaying logs, fungal understory' },
    { id: 'any', label: 'Any Outdoor Area', desc: 'Versatile exploration for anywhere outside' }
  ];

  const interests: Array<{ id: AdventureInterest; label: string; icon: any }> = [
    { id: 'general', label: 'General Explorer', icon: Compass },
    { id: 'plants', label: 'Plants & Leaves', icon: Trees },
    { id: 'birds', label: 'Avian Watch', icon: Eye },
    { id: 'insects', label: 'Micro Critters', icon: Flower2 },
    { id: 'photography', label: 'Nature Photography', icon: Camera },
    { id: 'mindfulness', label: 'Sensory Grounding', icon: Heart }
  ];

  const difficulties: Array<{ id: AdventureDifficulty; label: string }> = [
    { id: 'easy', label: 'Easy (Gentle pacing, nearby objects)' },
    { id: 'moderate', label: 'Moderate (Active searching, deeper looking)' },
    { id: 'adventurous', label: 'Adventurous (Trail exploration, off-path focus)' }
  ];

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    const params: AdventureRequest = {
      durationMinutes: duration,
      environment,
      interest,
      difficulty,
      accessibilityPreference: accessibility.trim() || undefined
    };

    try {
      const adv = await requestAdventure(params);
      onStartAdventure(adv);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to generate adventure');
    } finally {
      setGenerating(false);
    }
  };

  const completedAdventures = savedAdventures.filter(a => !!a.completedAt);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-forest-dark uppercase tracking-wider mb-1">
          <MapPin className="w-3.5 h-3.5 text-forest" />
          <span>Screen-Minimal Missions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
          Outdoor Adventure Generator
        </h1>
        <p className="text-sm text-charcoal-muted mt-1">
          Generate an observation mission tailored to your surroundings. Put your phone away, observe, and return to record your findings.
        </p>
      </div>

      {/* Generator Form Card */}
      <Card className="p-6 space-y-6 bg-white">
        {/* Time Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
            1. Available Time
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[15, 30, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDuration(mins as 15 | 30 | 60)}
                className={`py-3 px-4 rounded-xl border text-center transition-all ${
                  duration === mins
                    ? 'bg-forest text-cream border-forest font-bold shadow-sm'
                    : 'bg-white border-sage-border/80 text-charcoal hover:bg-sage-light'
                }`}
              >
                <div className="text-base sm:text-lg font-bold">{mins} Mins</div>
                <div className={`text-[11px] ${duration === mins ? 'text-sage' : 'text-charcoal-muted'}`}>
                  {mins === 15 ? 'Quick walk' : (mins === 30 ? 'Balanced exploration' : 'Deep immersion')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Environment Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
            2. Outdoor Environment
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {environments.map((env) => (
              <button
                key={env.id}
                type="button"
                onClick={() => setEnvironment(env.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  environment === env.id
                    ? 'bg-sage-light border-forest text-forest-dark'
                    : 'bg-white border-sage-border/80 text-charcoal hover:bg-cream-light'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm">{env.label}</div>
                <div className="text-[11px] text-charcoal-muted mt-0.5">{env.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Interest Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
            3. Exploration Focus
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {interests.map((intr) => {
              const Icon = intr.icon;
              const isSelected = interest === intr.id;
              return (
                <button
                  key={intr.id}
                  type="button"
                  onClick={() => setInterest(intr.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-forest text-cream border-forest font-semibold'
                      : 'bg-white border-sage-border/80 text-charcoal hover:bg-sage-light'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-sage' : 'text-forest'}`} />
                  <span className="truncate">{intr.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty and Accessibility */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-sage-border/50">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
              4. Challenge Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as AdventureDifficulty)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-sage-border bg-white text-charcoal focus:ring-2 focus:ring-forest"
            >
              {difficulties.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
              Optional Mobility / Pace
            </label>
            <input
              type="text"
              value={accessibility}
              onChange={(e) => setAccessibility(e.target.value)}
              placeholder="e.g. Paved path, Seated, Wheelchair, Audio focus"
              className="w-full px-3 py-2 text-xs rounded-xl border border-sage-border bg-white text-charcoal focus:ring-2 focus:ring-forest"
            />
          </div>
        </div>

        {/* Error message if any */}
        {error && (
          <div className="text-xs text-rose-800 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-charcoal-muted">
            {aiHealth?.status === 'connected' ? '⚡ Local Ollama text model active' : '🌲 Offline deterministic generator ready'}
          </span>

          <Button
            size="lg"
            variant="primary"
            loading={generating}
            icon={<Sparkles className="w-5 h-5" />}
            onClick={handleGenerate}
            className="w-full sm:w-auto"
          >
            Generate & Begin Adventure
          </Button>
        </div>
      </Card>

      {/* Previously Completed Adventures History */}
      {completedAdventures.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-sage-border">
          <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
            <Footprints className="w-4 h-4 text-forest" />
            Completed Outdoor Missions ({completedAdventures.length})
          </h3>

          <div className="space-y-2.5">
            {completedAdventures.slice(0, 5).map((adv) => (
              <Card key={adv.id} className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-charcoal">{adv.title}</span>
                    <Badge variant="success" size="sm">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                    </Badge>
                  </div>
                  <div className="text-xs text-charcoal-muted flex items-center gap-3">
                    <span>⏱️ {adv.minutesSpent || adv.estimatedTotalMinutes} mins explored</span>
                    <span>🌿 {adv.environment}</span>
                    <span>{adv.completedAt ? new Date(adv.completedAt).toLocaleDateString() : ''}</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStartAdventure(adv)}
                >
                  Repeat
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
