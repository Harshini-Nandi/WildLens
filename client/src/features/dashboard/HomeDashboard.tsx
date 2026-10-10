import React from 'react';
import {
  Compass,
  MapPin,
  Camera,
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Leaf
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { getFactOfTheDay } from '../../utils/natureFacts';
import { ActiveTab, Adventure, Observation, UserSettings } from '../../types';

interface HomeDashboardProps {
  onNavigate: (tab: ActiveTab) => void;
  observations: Observation[];
  activeAdventure: Adventure | null;
  onOpenObservation: (obs: Observation) => void;
  todayMinutes: number;
  currentStreak: number;
  settings: UserSettings;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  observations,
  activeAdventure,
  onOpenObservation,
  todayMinutes,
  currentStreak,
  settings
}) => {
  const fact = getFactOfTheDay();
  const dailyGoal = settings.dailyOutdoorGoalMinutes || 30;
  const progressPercent = Math.min(Math.round((todayMinutes / dailyGoal) * 100), 100);

  const recentObservations = observations.slice(0, 4);
  const totalDiscoveries = observations.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Personalized Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-forest-dark uppercase tracking-wider mb-1">
            <Leaf className="w-3.5 h-3.5 text-forest" />
            <span>Outdoor Nature Companion</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
            Ready to touch grass?
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Step away from screens and observe the living ecosystems right around you.
          </p>
        </div>

        {/* Quick Action CTA Group */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            icon={<Camera className="w-4 h-4" />}
            onClick={() => onNavigate('identify')}
          >
            Identify
          </Button>
          <Button
            variant="primary"
            icon={<MapPin className="w-4 h-4" />}
            onClick={() => onNavigate('adventures')}
          >
            Start an Adventure
          </Button>
        </div>
      </div>

      {/* Stats and Goal Progress Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Daily Outdoor Goal Card */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-medium text-charcoal-muted mb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-forest" />
              Daily Outdoor Goal
            </span>
            <span className="font-bold text-charcoal">{todayMinutes} / {dailyGoal}m</span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full bg-sage-light rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-forest h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-charcoal-muted font-medium">
              <span>{progressPercent}% completed</span>
              {progressPercent >= 100 && (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Goal Reached!
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Exploration Streak Card */}
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-charcoal-muted">Exploration Streak</div>
            <div className="text-2xl font-extrabold text-charcoal mt-0.5">
              {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
            </div>
            <div className="text-[11px] text-charcoal-muted">
              {currentStreak > 0 ? 'Consistent outdoor habit' : 'Take a walk today to start'}
            </div>
          </div>
        </Card>

        {/* Nature Discoveries Card */}
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sage text-forest-dark flex items-center justify-center shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-charcoal-muted">Total Discoveries</div>
            <div className="text-2xl font-extrabold text-charcoal mt-0.5">
              {totalDiscoveries} {totalDiscoveries === 1 ? 'Specimen' : 'Specimens'}
            </div>
            <div className="text-[11px] text-charcoal-muted">
              Cataloged in private journal
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Outdoor Mission Card */}
      <Card variant="forest" className="p-6 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest text-sage text-xs font-semibold border border-forest-light">
              <Sparkles className="w-3.5 h-3.5 text-sage" />
              <span>Today's Outdoor Mission</span>
            </div>
            {activeAdventure && !activeAdventure.completedAt && (
              <span className="px-2.5 py-0.5 rounded-full bg-terracotta text-cream text-xs font-bold animate-pulse">
                In Progress
              </span>
            )}
          </div>

          {activeAdventure && !activeAdventure.completedAt ? (
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-cream">
                {activeAdventure.title}
              </h3>
              <p className="text-sm text-sage max-w-xl">
                {activeAdventure.introduction}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Button
                  variant="terracotta"
                  onClick={() => onNavigate('adventures')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Resume Mission ({activeAdventure.tasks.filter(t => t.completed).length} / {activeAdventure.tasks.length} tasks)
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-cream">
                The Botanical Detective Walk
              </h3>
              <p className="text-sm text-sage max-w-xl">
                Take a 15-minute screen-free walk. Find two leaves with contrasting vein structures, observe a wild bloom, and listen quietly for avian songs.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() => onNavigate('adventures')}
                  icon={<MapPin className="w-4 h-4" />}
                >
                  Start Mission
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onNavigate('adventures')}
                  className="text-sage hover:text-cream hover:bg-forest"
                >
                  Customize Time & Environment
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Fact of the Day Card */}
      <Card variant="sage" className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-forest-dark flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-forest" />
            <span>Nature Fact of the Day: {fact.topic}</span>
          </div>
          <p className="text-sm text-charcoal leading-relaxed font-medium">
            "{fact.fact}"
          </p>
          <p className="text-xs text-forest-dark font-semibold">
            👉 Today's observation cue: {fact.callToAction}
          </p>
        </div>
      </Card>

      {/* Recently Saved Observations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-charcoal">Recent Nature Journal Entries</h2>
          {observations.length > 0 && (
            <button
              onClick={() => onNavigate('journal')}
              className="text-xs font-semibold text-forest hover:text-forest-dark hover:underline flex items-center gap-1"
            >
              View all ({observations.length}) <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {observations.length === 0 ? (
          /* Welcoming Empty State */
          <Card className="p-8 text-center space-y-4 bg-white/70 border-dashed">
            <div className="w-14 h-14 rounded-2xl bg-sage-light text-forest mx-auto flex items-center justify-center">
              <Compass className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-bold text-base text-charcoal">Your Nature Journal is Fresh</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Step outside, find a leaf, flower, insect, or bird, and take a photo. WildBuddy will suggest an identification and preserve it in your offline journal.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Button
                variant="primary"
                icon={<Camera className="w-4 h-4" />}
                onClick={() => onNavigate('identify')}
              >
                Record First Discovery
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentObservations.map((obs) => (
              <Card
                key={obs.id}
                hoverable
                onClick={() => onOpenObservation(obs)}
                className="overflow-hidden p-0 flex flex-col group"
              >
                <div className="aspect-[4/3] bg-cream-dark relative overflow-hidden">
                  {obs.photo ? (
                    <img
                      src={obs.photo}
                      alt={obs.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-forest/40">
                      <Leaf className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge category={obs.category} size="sm" />
                  </div>
                </div>

                <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-charcoal line-clamp-1 group-hover:text-forest transition-colors">
                      {obs.name}
                    </h4>
                    {obs.notes && (
                      <p className="text-xs text-charcoal-muted line-clamp-1 mt-0.5">
                        {obs.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-[11px] text-charcoal-muted pt-2 border-t border-sage-border/50 flex items-center justify-between">
                    <span>{new Date(obs.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    {obs.confidence && <span className="capitalize">{obs.confidence} conf.</span>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
