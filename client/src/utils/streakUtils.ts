import { DailyActivity } from '../types';

/**
 * Calculates current exploration streak based on real dates with activity.
 * An active day has > 0 outdoor minutes or at least 1 observation or completed adventure.
 */
export function calculateCurrentStreak(activities: DailyActivity[]): number {
  if (!activities || activities.length === 0) return 0;

  // Filter days that had actual activity
  const activeDates = new Set<string>();
  activities.forEach(a => {
    if (a.outdoorMinutes > 0 || a.observationsCount > 0 || a.adventuresCompleted > 0) {
      activeDates.add(a.date);
    }
  });

  if (activeDates.size === 0) return 0;

  const now = new Date();
  const format = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const todayStr = format(now);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = format(yesterday);

  let currentStreak = 0;
  let checkDate = new Date(now);

  // If active today, count backward starting from today
  // If not active today, check if active yesterday to preserve streak for today
  if (activeDates.has(todayStr)) {
    checkDate = new Date(now);
  } else if (activeDates.has(yesterdayStr)) {
    checkDate = new Date(yesterday);
  } else {
    // Gap of 2+ days means streak is 0
    return 0;
  }

  while (true) {
    const dStr = format(checkDate);
    if (activeDates.has(dStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return currentStreak;
}
