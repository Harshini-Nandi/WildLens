import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  CheckCircle2,
  Lock,
  ShieldAlert,
  ArrowLeft,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Adventure } from '../../types';

interface ActiveAdventureViewProps {
  adventure: Adventure;
  onUpdateTask: (taskId: string, completed: boolean) => void;
  onFinishAdventure: (adventure: Adventure, minutesSpent: number) => void;
  onCancelAdventure: () => void;
}

export const ActiveAdventureView: React.FC<ActiveAdventureViewProps> = ({
  adventure,
  onUpdateTask,
  onFinishAdventure,
  onCancelAdventure
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    adventure.estimatedTotalMinutes * 60
  );
  const [isActive, setIsActive] = useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showMinimalScreen, setShowMinimalScreen] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      // Time is up!
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const completedCount = adventure.tasks.filter((t) => t.completed).length;
  const allTasksDone = completedCount === adventure.tasks.length && adventure.tasks.length > 0;

  const handleFinish = () => {
    // Fire festive celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#245C45', '#DCE8D5', '#C77B57']
    });

    const minutesSpent = Math.max(1, Math.round(elapsedSeconds / 60) || adventure.estimatedTotalMinutes);
    onFinishAdventure(adventure, minutesSpent);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancelAdventure}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-charcoal"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Adventure
        </button>

        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="sm">
            {adventure.environment.toUpperCase()}
          </Badge>
          <Badge variant="success" size="sm">
            {adventure.generatedBy === 'ollama' ? 'AI Planned' : 'Outdoor Mission'}
          </Badge>
        </div>
      </div>

      {/* Timer and Screen-Minimal Mode Callout */}
      <Card variant="forest" className="p-6 text-center space-y-4">
        <div className="space-y-1">
          <span className="text-xs uppercase font-bold tracking-wider text-sage">
            {isActive ? 'Mission In Progress' : 'Mission Paused'}
          </span>
          <div className="text-5xl sm:text-6xl font-black text-cream font-mono tracking-tight">
            {formatTime(secondsRemaining)}
          </div>
          <div className="text-xs text-sage">
            {completedCount} of {adventure.tasks.length} outdoor observations logged
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant={isActive ? 'secondary' : 'terracotta'}
            size="sm"
            onClick={toggleTimer}
            icon={isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          >
            {isActive ? 'Pause Timer' : 'Resume Timer'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMinimalScreen(!showMinimalScreen)}
            className="text-sage hover:text-cream hover:bg-forest"
            icon={<Smartphone className="w-4 h-4" />}
          >
            {showMinimalScreen ? 'Show Tasks' : 'Screen-Off Mode'}
          </Button>
        </div>
      </Card>

      {/* Screen-Minimal Encouragement Mode */}
      {showMinimalScreen ? (
        <Card variant="sage" className="p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-forest text-cream mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-forest-dark">Time to Put Your Phone Away</h3>
            <p className="text-sm text-charcoal leading-relaxed">
              WildBuddy's goal is to minimize screen time. Lock your phone, walk outdoors, look around, and listen. Return when you're ready to check off your discoveries.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowMinimalScreen(false)}
          >
            I'm Back, Show My Checklist
          </Button>
        </Card>
      ) : (
        /* Checklist Mode */
        <div className="space-y-4">
          {/* Title and Intro */}
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-charcoal">{adventure.title}</h2>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              {adventure.introduction}
            </p>
          </div>

          {/* Safety Reminder Alert */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Safety Note:</strong> {adventure.safetyReminder}
            </div>
          </div>

          {/* Tasks Checklist */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Outdoor Tasks Checklist
            </h4>

            {adventure.tasks.map((task, idx) => (
              <Card
                key={task.id}
                onClick={() => onUpdateTask(task.id, !task.completed)}
                className={`p-4 cursor-pointer transition-all border ${
                  task.completed
                    ? 'bg-sage-light/60 border-forest/40'
                    : 'bg-white border-sage-border/80 hover:border-forest/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={!!task.completed}
                      onChange={() => {}}
                      className="w-5 h-5 rounded text-forest focus:ring-forest border-sage-border cursor-pointer"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-bold ${task.completed ? 'line-through text-charcoal-muted' : 'text-charcoal'}`}>
                        {idx + 1}. {task.title}
                      </h4>
                      <span className="text-[11px] font-mono text-charcoal-muted">
                        ~{task.estimatedMinutes}m
                      </span>
                    </div>

                    <p className="text-xs text-charcoal-muted">
                      {task.instruction}
                    </p>

                    <div className="text-[11px] text-forest font-semibold pt-1">
                      👀 Look for: {task.whatToObserve}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Finish Adventure CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-sage-border">
            <div className="text-xs text-charcoal-muted text-center sm:text-left">
              {allTasksDone ? 'All outdoor tasks completed! 🎉' : `${completedCount} of ${adventure.tasks.length} tasks completed.`}
            </div>

            <Button
              variant={allTasksDone ? 'primary' : 'secondary'}
              size="lg"
              icon={<CheckCircle2 className="w-5 h-5" />}
              onClick={handleFinish}
              className="w-full sm:w-auto"
            >
              Finish & Log Outdoor Time
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
