import { describe, it, expect } from 'vitest';
import { generateDeterministicAdventure } from '../server/src/services/fallbackService';
import { generateClientOfflineAdventure } from '../client/src/services/offlineAdventureGenerator';
import { AdventureRequest } from '../client/src/types';

describe('Deterministic Adventure Generators', () => {
  it('generates 4 tasks for a 15-minute walk on the server', () => {
    const req: AdventureRequest = {
      durationMinutes: 15,
      environment: 'park',
      interest: 'birds',
      difficulty: 'easy'
    };

    const adv = generateDeterministicAdventure(req as any);
    expect(adv.tasks.length).toBe(4);
    expect(adv.estimatedTotalMinutes).toBe(15);
    expect(adv.environment).toBe('park');
    expect(adv.interest).toBe('birds');
    expect(adv.generatedBy).toBe('deterministic');
    expect(adv.safetyReminder.length).toBeGreaterThan(10);
  });

  it('generates 5 tasks for a 30-minute walk on the client offline generator', () => {
    const req: AdventureRequest = {
      durationMinutes: 30,
      environment: 'garden',
      interest: 'plants',
      difficulty: 'moderate'
    };

    const adv = generateClientOfflineAdventure(req);
    expect(adv.tasks.length).toBe(5);
    expect(adv.estimatedTotalMinutes).toBe(30);
    expect(adv.tasks.every((t) => t.instruction.length > 5)).toBe(true);
    expect(adv.tasks.every((t) => t.whatToObserve.length > 5)).toBe(true);
  });

  it('generates 6 tasks for a 60-minute deep immersion walk', () => {
    const req: AdventureRequest = {
      durationMinutes: 60,
      environment: 'forest',
      interest: 'mindfulness',
      difficulty: 'adventurous',
      accessibilityPreference: 'Seated observation intervals'
    };

    const adv = generateClientOfflineAdventure(req);
    expect(adv.tasks.length).toBe(6);
    expect(adv.estimatedTotalMinutes).toBe(60);
    expect(adv.accessibilityNotes).toContain('Seated observation intervals');
  });
});
