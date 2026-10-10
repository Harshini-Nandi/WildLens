import React from 'react';
import {
  Award,
  Flame,
  Clock,
  Compass,
  CheckCircle2,
  Lock,
  Layers,
  MapPin,
  Headphones,
  Leaf,
  Eye
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Achievement, Adventure, DailyActivity, Observation } from '../../types';

interface ProgressViewProps {
  observations: Observation[];
  adventures: Adventure[];
  dailyActivities: DailyActivity[];
  weeklyChart: Array<{ date: string; dayName: string; minutes: number }>;
  currentStreak: number;
  achievements: Achievement[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  observations,
  adventures,
  dailyActivities,
  weeklyChart,
  currentStreak,
  achievements
}) => {
  const completedAdventuresCount = adventures.filter((a) => !!a.completedAt).length;
  const totalMinutes = dailyActivities.reduce((acc, a) => acc + (a.outdoorMinutes || 0), 0);
  const uniqueCategories = new Set(observations.map((o) => o.category));

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const maxWeeklyMinutes = Math.max(...weeklyChart.map((d) => d.minutes), 30);
  const hasAnyWeeklyActivity = weeklyChart.some((d) => d.minutes > 0);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Compass': return Compass;
      case 'MapPin': return MapPin;
      case 'Headphones': return Headphones;
      case 'Flame': return Flame;
      case 'Leaf': return Leaf;
      case 'Eye': return Eye;
      case 'Clock': return Clock;
      default: return Award;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-forest-dark uppercase tracking-wider mb-1">
          <Award className="w-3.5 h-3.5 text-forest" />
          <span>Real Activity & Milestones</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
          Progress & Achievements
        </h1>
        <p className="text-sm text-charcoal-muted mt-1">
          Every badge and minute here reflects real time spent in the natural world.
        </p>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <div className="text-xs text-charcoal-muted flex items-center gap-1.5 font-medium">
            <Clock className="w-4 h-4 text-forest" />
            Outdoor Time
          </div>
          <div className="text-2xl font-extrabold text-charcoal">
            {totalMinutes}m
          </div>
          <div className="text-[11px] text-charcoal-muted">Recorded offline</div>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="text-xs text-charcoal-muted flex items-center gap-1.5 font-medium">
            <Flame className="w-4 h-4 text-terracotta" />
            Active Streak
          </div>
          <div className="text-2xl font-extrabold text-charcoal">
            {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
          </div>
          <div className="text-[11px] text-charcoal-muted">Continuous outdoor habit</div>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="text-xs text-charcoal-muted flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed Missions
          </div>
          <div className="text-2xl font-extrabold text-charcoal">
            {completedAdventuresCount}
          </div>
          <div className="text-[11px] text-charcoal-muted">Adventures finished</div>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="text-xs text-charcoal-muted flex items-center gap-1.5 font-medium">
            <Layers className="w-4 h-4 text-forest" />
            Categories Found
          </div>
          <div className="text-2xl font-extrabold text-charcoal">
            {uniqueCategories.size} / 6
          </div>
          <div className="text-[11px] text-charcoal-muted">Biodiversity spread</div>
        </Card>
      </div>

      {/* Weekly Activity Bar Chart */}
      <Card className="p-6 space-y-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-charcoal">Weekly Outdoor Activity</h3>
            <p className="text-xs text-charcoal-muted">Minutes spent exploring per day over the last 7 days</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sage-light text-forest-dark">
            Last 7 Days
          </span>
        </div>

        {!hasAnyWeeklyActivity ? (
          <div className="py-8 text-center text-xs text-charcoal-muted">
            No outdoor minutes recorded yet this week. Complete an outdoor mission to populate this chart!
          </div>
        ) : (
          <div className="pt-4">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-36 border-b border-sage-border/60 pb-2">
              {weeklyChart.map((day) => {
                const heightPercent = day.minutes > 0
                  ? Math.max(12, Math.round((day.minutes / maxWeeklyMinutes) * 100))
                  : 0;

                return (
                  <div key={day.date} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[11px] font-bold text-charcoal-muted group-hover:text-forest transition-colors">
                      {day.minutes > 0 ? `${day.minutes}m` : ''}
                    </div>
                    <div className="w-full max-w-[36px] bg-sage-light rounded-t-lg h-full max-h-[90px] flex items-end overflow-hidden">
                      <div
                        className="w-full bg-forest hover:bg-forest-light transition-all rounded-t-lg"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <div className="text-xs font-medium text-charcoal-muted">
                      {day.dayName}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Achievement Badges Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-charcoal">Achievement Badges</h3>
            <p className="text-xs text-charcoal-muted">
              {unlockedCount} of {achievements.length} badges unlocked based on actual logged activities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const Icon = getIcon(ach.iconName);
            const isUnlocked = ach.unlocked;

            return (
              <Card
                key={ach.id}
                className={`p-5 space-y-3 transition-all border ${
                  isUnlocked
                    ? 'bg-white border-sage-border shadow-sm'
                    : 'bg-white/60 border-sage-border/40 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                      isUnlocked
                        ? 'bg-forest text-sage shadow-sm'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {isUnlocked ? (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sage text-forest-dark flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-charcoal">{ach.title}</h4>
                  <p className="text-xs text-charcoal-muted leading-relaxed mt-1">
                    {ach.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="w-full bg-sage-light/60 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${isUnlocked ? 'bg-forest' : 'bg-stone-300'}`}
                      style={{ width: `${Math.round((ach.progress / ach.maxProgress) * 100)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-charcoal-muted font-mono flex justify-between">
                    <span>Progress</span>
                    <span>{ach.progress} / {ach.maxProgress}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
