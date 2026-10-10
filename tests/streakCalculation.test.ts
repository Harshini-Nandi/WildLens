import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '../client/src/utils/streakUtils';
import { DailyActivity } from '../client/src/types';

describe('Streak Calculation', () => {
  const format = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  it('returns 0 for empty activity history', () => {
    expect(calculateCurrentStreak([])).toBe(0);
  });

  it('returns 1 if active today only', () => {
    const today = format(new Date());
    const activities: DailyActivity[] = [
      { date: today, outdoorMinutes: 20, observationsCount: 1, adventuresCompleted: 1 }
    ];
    expect(calculateCurrentStreak(activities)).toBe(1);
  });

  it('preserves streak if active yesterday but not yet today', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBefore = new Date();
    dayBefore.setDate(dayBefore.getDate() - 2);

    const activities: DailyActivity[] = [
      { date: format(dayBefore), outdoorMinutes: 15, observationsCount: 0, adventuresCompleted: 1 },
      { date: format(yesterday), outdoorMinutes: 30, observationsCount: 2, adventuresCompleted: 1 }
    ];

    expect(calculateCurrentStreak(activities)).toBe(2);
  });

  it('resets streak to 0 if gap is 2 or more days', () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const activities: DailyActivity[] = [
      { date: format(threeDaysAgo), outdoorMinutes: 40, observationsCount: 3, adventuresCompleted: 1 }
    ];

    expect(calculateCurrentStreak(activities)).toBe(0);
  });

  it('counts 5 consecutive days correctly', () => {
    const activities: DailyActivity[] = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      activities.push({
        date: format(d),
        outdoorMinutes: 30,
        observationsCount: 1,
        adventuresCompleted: 1
      });
    }

    expect(calculateCurrentStreak(activities)).toBe(5);
  });
});
