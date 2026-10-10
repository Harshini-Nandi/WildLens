export interface NatureFact {
  fact: string;
  topic: string;
  callToAction: string;
}

export const NATURE_FACTS: NatureFact[] = [
  {
    topic: 'Botanical Communication',
    fact: 'Trees share nutrients, water, and warning signals through an underground fungal mycorrhizal network often nicknamed the "Wood Wide Web".',
    callToAction: 'Look at the base of mature trees for moss and subtle fungal relationships.'
  },
  {
    topic: 'Morning Birds',
    fact: 'The "Dawn Chorus" occurs because early morning air is typically calmer and cooler, allowing bird song frequencies to travel up to 20 times farther.',
    callToAction: 'Step out before 8 AM and listen for which species sings first.'
  },
  {
    topic: 'Leaf Symmetry',
    fact: 'Plant leaves arrange themselves along stems according to the golden ratio (Fibonacci sequence) so that lower leaves are never completely shaded by upper ones.',
    callToAction: 'Look down straight from above on a plant to see spiral phyllotaxis in action.'
  },
  {
    topic: 'Scent of Rain',
    fact: 'Petrichor, the earthy scent following rain, is produced by soil actinobacteria releasing geosmin. Human noses can detect geosmin at 5 parts per trillion.',
    callToAction: 'Smell damp garden soil or wet pavement after a drizzle.'
  },
  {
    topic: 'Insect Navigation',
    fact: 'Dragonflies have nearly 360-degree vision and an astonishing 95% hunt success rate, making them nature\'s most efficient aerial predator.',
    callToAction: 'Watch ponds or sunny grass edges for hover-and-dart dragonfly flights.'
  },
  {
    topic: 'Foliage Thermodynamics',
    fact: 'A single mature leafy tree can transpire hundreds of liters of water daily, naturally lowering surrounding air temperatures by up to 5°C (9°F).',
    callToAction: 'Feel the immediate temperature drop when walking beneath a dense tree canopy.'
  },
  {
    topic: 'Pine Cones & Humidity',
    fact: 'Pine cones open their scales on dry sunny days to release windborne seeds, but close tightly when humidity rises to protect seeds from damp rotting.',
    callToAction: 'Find a pine cone on the forest floor and check whether its scales are open or closed.'
  },
  {
    topic: 'Lichen Longevity',
    fact: 'Lichens are mutualistic partnerships between fungi and algae that can survive in outer space vacuum and live for thousands of years on barren rock.',
    callToAction: 'Examine old brick walls or tree trunks for yellow, gray, or orange crustose lichens.'
  }
];

export function getFactOfTheDay(): NatureFact {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return NATURE_FACTS[dayOfYear % NATURE_FACTS.length];
}
