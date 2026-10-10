import { describe, it, expect } from 'vitest';
import { evaluateAchievements } from '../client/src/utils/achievements';
import { Adventure, DailyActivity, Observation } from '../client/src/types';

describe('Achievements Evaluation', () => {
  it('locks all achievements when user has zero activity', () => {
    const achievements = evaluateAchievements([], [], [], 0);
    const unlocked = achievements.filter((a) => a.unlocked);
    expect(unlocked.length).toBe(0);
  });

  it('unlocks "First Discovery" when 1 observation is recorded', () => {
    const observations: Observation[] = [
      {
        id: 'obs-1',
        name: 'Dandelion',
        category: 'flower',
        date: new Date().toISOString(),
        notes: 'Bright yellow head.'
      }
    ];

    const achievements = evaluateAchievements(observations, [], [], 0);
    const firstDisc = achievements.find((a) => a.id === 'first-discovery');
    expect(firstDisc?.unlocked).toBe(true);

    const outdoorExplorer = achievements.find((a) => a.id === 'outdoor-explorer');
    expect(outdoorExplorer?.unlocked).toBe(false);
  });

  it('unlocks "Outdoor Explorer" after completing 3 adventures', () => {
    const adventures: Adventure[] = [
      {
        id: 'adv-1',
        title: 'Walk 1',
        introduction: '',
        estimatedTotalMinutes: 15,
        environment: 'park',
        interest: 'general',
        difficulty: 'easy',
        safetyReminder: '',
        tasks: [],
        generatedBy: 'deterministic',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      },
      {
        id: 'adv-2',
        title: 'Walk 2',
        introduction: '',
        estimatedTotalMinutes: 15,
        environment: 'garden',
        interest: 'plants',
        difficulty: 'easy',
        safetyReminder: '',
        tasks: [],
        generatedBy: 'deterministic',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      },
      {
        id: 'adv-3',
        title: 'Walk 3',
        introduction: '',
        estimatedTotalMinutes: 30,
        environment: 'forest',
        interest: 'photography',
        difficulty: 'moderate',
        safetyReminder: '',
        tasks: [],
        generatedBy: 'deterministic',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      }
    ];

    const achievements = evaluateAchievements([], adventures, [], 0);
    const badge = achievements.find((a) => a.id === 'outdoor-explorer');
    expect(badge?.unlocked).toBe(true);
  });

  it('unlocks "Plant Detective" only when 5 plant/leaf/flower items are saved', () => {
    const observations: Observation[] = [
      { id: '1', name: 'Oak Leaf', category: 'leaf', date: '', notes: '' },
      { id: '2', name: 'Pine Branch', category: 'plant', date: '', notes: '' },
      { id: '3', name: 'Rose', category: 'flower', date: '', notes: '' },
      { id: '4', name: 'Ivy', category: 'plant', date: '', notes: '' },
      { id: '5', name: 'Clover', category: 'leaf', date: '', notes: '' }
    ];

    const achievements = evaluateAchievements(observations, [], [], 0);
    const plantDet = achievements.find((a) => a.id === 'plant-detective');
    expect(plantDet?.unlocked).toBe(true);
  });

  it('unlocks "Five-Day Explorer" when streak is 5 or more', () => {
    const achievements = evaluateAchievements([], [], [], 5);
    const streakBadge = achievements.find((a) => a.id === 'five-day-explorer');
    expect(streakBadge?.unlocked).toBe(true);
  });
});
