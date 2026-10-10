import { Adventure, AdventureRequest, AdventureTask } from '../types';

interface MissionTemplate {
  title: string;
  intro: string;
  tasks: Array<{ title: string; instruction: string; whatToObserve: string }>;
  safety: string;
}

const OFFLINE_MISSIONS: Record<string, MissionTemplate[]> = {
  plants: [
    {
      title: "Botanical Explorer Mission",
      intro: "Observe leaf geometry, venation, and bark patterns right where you stand.",
      safety: "Never consume wild plants or mushrooms. Observe without uprooting foliage.",
      tasks: [
        {
          title: "Find two leaves with distinctly different shapes",
          instruction: "Compare one rounded leaf with one slender, serrated, or needle-like leaf.",
          whatToObserve: "Notice edge serrations and branch veining patterns."
        },
        {
          title: "Inspect bark or stem texture up close",
          instruction: "Look closely at the surface of a tree trunk or woody shrub.",
          whatToObserve: "Look for fissures, moss patches, or lichen growth."
        },
        {
          title: "Locate a wild flower or path-edge sprout",
          instruction: "Spot a spontaneous wildflower thriving along a lawn or stone edge.",
          whatToObserve: "Notice petal symmetry and color vibrancy."
        },
        {
          title: "Observe leaf phyllotaxis (arrangement)",
          instruction: "Examine how leaves spiral or alternate along a branch to catch sun.",
          whatToObserve: "Notice the mathematical spacing of solar collectors."
        }
      ]
    }
  ],
  birds: [
    {
      title: "Avian Listening & Silhouette Safari",
      intro: "Tune your senses to avian flight paths, territorial calls, and high perches.",
      safety: "Keep a distance of at least 5 meters. Never approach nests or fledglings.",
      tasks: [
        {
          title: "Two-minute silence census",
          instruction: "Stand still and count how many unique bird calls or songs you hear.",
          whatToObserve: "Distinguish between sharp alarm chirps and melodious song phrases."
        },
        {
          title: "Spot a perched bird against the sky",
          instruction: "Scan rooftops, cables, and highest branches for a perched silhouette.",
          whatToObserve: "Notice posture, beak shape, and head movements."
        },
        {
          title: "Ground foraging search",
          instruction: "Look for small birds hopping through grass or under shrubs searching for seeds.",
          whatToObserve: "Observe their hopping cadence and cautious alertness."
        },
        {
          title: "Flight pattern tracking",
          instruction: "Track one bird as it flies across your line of sight.",
          whatToObserve: "Note whether it glides, flaps constantly, or dips in waves."
        }
      ]
    }
  ],
  insects: [
    {
      title: "Micro-Ecosystem Expedition",
      intro: "Step into the miniature civilization thriving in soil, petals, and tree bark.",
      safety: "Observe bees, wasps, and crawling insects from a safe distance without touching.",
      tasks: [
        {
          title: "Flower pollinator watch",
          instruction: "Find flowering blooms and observe for two minutes without moving.",
          whatToObserve: "Look for bees, hoverflies, or butterflies dusting pollen."
        },
        {
          title: "Ant trail navigation",
          instruction: "Inspect soil borders or stone pavers for an ant navigation highway.",
          whatToObserve: "Watch how ants touch antennae to exchange pheromone cues."
        },
        {
          title: "Spider web geometry",
          instruction: "Search for morning dew or sunlight catching a silken spider web.",
          whatToObserve: "Notice structural anchor lines and spiral sticky capture threads."
        },
        {
          title: "Bark crevice search",
          instruction: "Gently inspect bark grooves on a tree trunk for beetles or woodlice.",
          whatToObserve: "Notice protective camouflage matching the tree's tone."
        }
      ]
    }
  ],
  mindfulness: [
    {
      title: "Sensory Grounding & Fresh Air Immersion",
      intro: "Put your screen away. Allow soil, wind, and living sounds to calm your mind.",
      safety: "Pick a safe, quiet bench or grassy spot where you feel comfortable.",
      tasks: [
        {
          title: "Five deep sensory breaths",
          instruction: "Close your eyes. Inhale deeply through your nose. What does the air carry?",
          whatToObserve: "Notice petrichor, damp soil, pine needles, or fresh lawn scents."
        },
        {
          title: "Tactile nature contact",
          instruction: "Gently touch rough tree bark, smooth pebble, or soft grass blade.",
          whatToObserve: "Feel texture, moisture, and temperature against your skin."
        },
        {
          title: "Wind symphony listening",
          instruction: "Listen exclusively to leaves rustling in the breeze for 60 seconds.",
          whatToObserve: "Notice how different trees make different pitches in the wind."
        },
        {
          title: "Sun & shadow dance",
          instruction: "Watch dapples of sunlight shifting across the ground through tree crowns.",
          whatToObserve: "Notice the fluid, gentle movement of natural light."
        }
      ]
    }
  ],
  photography: [
    {
      title: "Nature Perspectives & Texture Framing",
      intro: "Capture storytelling compositions using natural contrast and micro-details.",
      safety: "Watch your footing. Keep both hands on your device when taking close-ups.",
      tasks: [
        {
          title: "Extreme macro texture",
          instruction: "Get as close as possible to leaf veins, tree bark, or a droplet of water.",
          whatToObserve: "Frame repeating micro-patterns that casual glances overlook."
        },
        {
          title: "Backlit leaf transparency",
          instruction: "Point your camera upward toward a sunny leaf against the light.",
          whatToObserve: "Capture the glowing luminous green and vascular ribs."
        },
        {
          title: "Natural framing",
          instruction: "Use arched branches or tree trunks to frame a distant subject.",
          whatToObserve: "Create depth and a feeling of looking through a natural portal."
        },
        {
          title: "Dynamic perspective",
          instruction: "Crouch down low to ground level and look upward at a small plant.",
          whatToObserve: "See how everyday weeds become majestic miniature forests."
        }
      ]
    }
  ],
  general: [
    {
      title: "Touch Grass Nature Detective",
      intro: "A balanced mission designed to engage your sight, hearing, and curiosity.",
      safety: "Remain aware of your footing and leave all natural elements undisturbed.",
      tasks: [
        {
          title: "Find two leaves with different shapes",
          instruction: "Compare one rounded leaf with one pointed or lobed leaf.",
          whatToObserve: "Examine edges, veining, and texture."
        },
        {
          title: "Observe a single plant for 60 seconds",
          instruction: "Stand motionless next to a plant and notice every minute detail.",
          whatToObserve: "Look for tiny buds, insect visitors, or morning dew."
        },
        {
          title: "Listen quietly for one minute",
          instruction: "Pause, mute all distractions, and identify 3 distinct natural sounds.",
          whatToObserve: "Wind in leaves, distant birds, or gentle water."
        },
        {
          title: "Look for an insect from a safe distance",
          instruction: "Find a beetle, ant, or butterfly on foliage or soil.",
          whatToObserve: "Watch its locomotion and feeding behavior."
        },
        {
          title: "Discover natural geometric symmetry",
          instruction: "Find a flower, leaf, or pine cone exhibiting spiral or bilateral symmetry.",
          whatToObserve: "Notice mathematics recurring everywhere in nature."
        }
      ]
    }
  ]
};

export function generateClientOfflineAdventure(params: AdventureRequest): Adventure {
  const interestKey = params.interest in OFFLINE_MISSIONS ? params.interest : 'general';
  const templates = OFFLINE_MISSIONS[interestKey] || OFFLINE_MISSIONS.general;
  const template = templates[0];

  const targetTaskCount = params.durationMinutes === 15 ? 4 : (params.durationMinutes === 30 ? 5 : 6);
  const minutesPerTask = Math.floor(params.durationMinutes / targetTaskCount);

  const baseTasks = [...template.tasks];
  while (baseTasks.length < targetTaskCount) {
    const fallbackTask = OFFLINE_MISSIONS.general[0].tasks[baseTasks.length % OFFLINE_MISSIONS.general[0].tasks.length];
    baseTasks.push(fallbackTask);
  }

  const tasks: AdventureTask[] = baseTasks.slice(0, targetTaskCount).map((t, idx) => ({
    id: `task-${Date.now()}-${idx + 1}`,
    title: t.title,
    estimatedMinutes: minutesPerTask,
    instruction: t.instruction,
    whatToObserve: t.whatToObserve,
    completed: false
  }));

  const envLabel = params.environment === 'any' ? 'Outdoors' : params.environment.charAt(0).toUpperCase() + params.environment.slice(1);

  return {
    id: `adv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: `${template.title} (${envLabel})`,
    introduction: `${template.intro} Optimized for a ${params.durationMinutes}-minute walk in your ${params.environment}.`,
    estimatedTotalMinutes: params.durationMinutes,
    environment: params.environment,
    interest: params.interest,
    difficulty: params.difficulty,
    accessibilityNotes: params.accessibilityPreference ? `Adjusted for preference: ${params.accessibilityPreference}` : undefined,
    safetyReminder: template.safety,
    tasks,
    generatedBy: 'deterministic',
    createdAt: new Date().toISOString()
  };
}
