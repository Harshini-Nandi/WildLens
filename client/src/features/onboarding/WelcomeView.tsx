import React from 'react';
import { Compass, Sparkles, MapPin, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

interface WelcomeViewProps {
  onStartExploring: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onStartExploring }) => {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-light text-forest-dark text-xs font-semibold border border-sage-border">
          <Sparkles className="w-3.5 h-3.5 text-forest" />
          <span>Open-Source AI Nature Companion</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-forest-dark tracking-tight leading-tight">
          Less scrolling.<br />
          <span className="text-terracotta">More exploring.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-charcoal-muted leading-relaxed">
          WildBuddy is built to get you away from your screen. Identify plants, leaves, and wildlife using open-weight AI, take on quick outdoor missions, and record your discoveries in a private, offline-first journal.
        </p>

        {/* Hero Illustration */}
        <div className="relative rounded-3xl overflow-hidden shadow-nature-lg border-2 border-sage-border max-w-2xl mx-auto aspect-[16/10] bg-cream-dark">
          <img
            src="/nature-hero.svg"
            alt="WildBuddy Nature Trail"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-forest-dark/20 to-transparent flex items-end p-6 sm:p-8">
            <div className="text-left text-cream space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-sage">The Outdoors Awaits</span>
              <h3 className="text-xl sm:text-2xl font-bold">Step outside and touch grass.</h3>
            </div>
          </div>
        </div>

        {/* Start Exploring Action */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            variant="primary"
            onClick={onStartExploring}
            icon={<ArrowRight className="w-5 h-5" />}
            className="w-full sm:w-auto"
          >
            Start Exploring Now
          </Button>
        </div>

        <p className="text-xs text-charcoal-muted flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-forest" />
          No account registration. 100% of observations stay on your device.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3 bg-white" hoverable>
          <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-charcoal">Nature AI Identifier</h3>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            Snap a photo of any leaf, flower, insect, or bird. Run inference through local Ollama models with zero cloud subscriptions or tracking.
          </p>
        </Card>

        <Card className="p-6 space-y-3 bg-white" hoverable>
          <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center font-bold">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-charcoal">Outdoor Missions</h3>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            Generate 15, 30, or 60-minute scavenger hunts. Lock your phone, observe nature, and return to record your sightings.
          </p>
        </Card>

        <Card className="p-6 space-y-3 bg-white" hoverable>
          <div className="w-12 h-12 rounded-xl bg-sage text-forest-dark flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-charcoal">Local Nature Journal</h3>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            Catalog your discoveries in browser-native IndexedDB. Track streaks, badges, and weekly outdoor hours completely offline.
          </p>
        </Card>
      </div>

      {/* Privacy and Open Source AI Banner */}
      <Card variant="sage" className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-base sm:text-lg text-forest-dark">
              How WildBuddy Works Offline
            </h4>
            <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl">
              Cached application shell and local database keep your journal and missions available in deep woods. Local open-weight models (like Gemma 3 or LLaVA via Ollama) run inference on your machine without cellular data.
            </p>
          </div>
          <Button variant="secondary" onClick={onStartExploring} className="shrink-0">
            Enter WildBuddy
          </Button>
        </div>
      </Card>
    </div>
  );
};
