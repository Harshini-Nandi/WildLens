import { Achievement, Adventure, DailyActivity, Observation } from '../types';

export function evaluateAchievements(
  observations: Observation[],
  adventures: Adventure[],
  activities: DailyActivity[],
  currentStreak: number
): Achievement[] {
  // Metric calculations
  const totalObservations = observations.length;
  const completedAdventures = adventures.filter(a => !!a.completedAt);
  const totalCompletedAdventures = completedAdventures.length;

  // Plant related: category === 'plant' or 'leaf' or 'flower'
  const plantRelatedCount = observations.filter(
    o => o.category === 'plant' || o.category === 'leaf' || o.category === 'flower'
  ).length;

  // Nature listener: completed mindfulness interest adventure OR any task containing 'listen' or 'sound'
  const hasCompletedListeningTask = completedAdventures.some(
    a => a.interest === 'mindfulness' || a.tasks.some(t => t.completed && (t.title.toLowerCase().includes('listen') || t.instruction.toLowerCase().includes('listen') || t.title.toLowerCase().includes('sound')))
  );

  // Unique categories count
  const uniqueCategories = new Set(observations.map(o => o.category));

  // Total outdoor minutes
  const totalMinutes = activities.reduce((sum, a) => sum + (a.outdoorMinutes || 0), 0);

  const achievementsList: Achievement[] = [
    {
      id: 'first-discovery',
      title: 'First Discovery',
      description: 'Record your very first nature observation in your digital journal.',
      iconName: 'Compass',
      category: 'discovery',
      unlocked: totalObservations >= 1,
      unlockedAt: totalObservations >= 1 ? observations[observations.length - 1]?.date : undefined,
      progress: Math.min(totalObservations, 1),
      maxProgress: 1
    },
    {
      id: 'outdoor-explorer',
      title: 'Outdoor Explorer',
      description: 'Step outside and complete at least three outdoor missions.',
      iconName: 'MapPin',
      category: 'adventure',
      unlocked: totalCompletedAdventures >= 3,
      progress: Math.min(totalCompletedAdventures, 3),
      maxProgress: 3
    },
    {
      id: 'nature-listener',
      title: 'Nature Listener',
      description: 'Tune into acoustic biodiversity by completing a quiet audio listening challenge.',
      iconName: 'Headphones',
      category: 'mindfulness',
      unlocked: hasCompletedListeningTask,
      progress: hasCompletedListeningTask ? 1 : 0,
      maxProgress: 1
    },
    {
      id: 'five-day-explorer',
      title: 'Five-Day Explorer',
      description: 'Step outside and touch grass 5 days in a row.',
      iconName: 'Flame',
      category: 'streak',
      unlocked: currentStreak >= 5,
      progress: Math.min(currentStreak, 5),
      maxProgress: 5
    },
    {
      id: 'plant-detective',
      title: 'Plant Detective',
      description: 'Observe and document 5 botanical specimens (leaves, flowers, or plants).',
      iconName: 'Leaf',
      category: 'discovery',
      unlocked: plantRelatedCount >= 5,
      progress: Math.min(plantRelatedCount, 5),
      maxProgress: 5
    },
    {
      id: 'biodiversity-seeker',
      title: 'Biodiversity Seeker',
      description: 'Observe life across 4 distinct categories (plants, flowers, birds, insects, etc.).',
      iconName: 'Eye',
      category: 'discovery',
      unlocked: uniqueCategories.size >= 4,
      progress: Math.min(uniqueCategories.size, 4),
      maxProgress: 4
    },
    {
      id: 'hour-in-the-wild',
      title: 'Hour in the Wild',
      description: 'Accumulate 60 minutes of real offline exploration away from the screen.',
      iconName: 'Clock',
      category: 'adventure',
      unlocked: totalMinutes >= 60,
      progress: Math.min(totalMinutes, 60),
      maxProgress: 60
    }
  ];

  return achievementsList;
}
