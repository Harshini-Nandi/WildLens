import { Adventure, AdventureRequest, AdventureTask, IdentificationResponse, NatureCategory } from '../types';

interface MissionTemplate {
  title: string;
  intro: string;
  tasks: Array<{ title: string; instruction: string; whatToObserve: string }>;
  safety: string;
}

const MISSIONS: Record<string, MissionTemplate[]> = {
  plants: [
    {
      title: "The Botanical Detective Walk",
      intro: "Sharpen your observational senses by inspecting leaf architectures, vein patterns, and wild foliage in your surroundings.",
      safety: "Never consume wild plants or mushrooms. Observe without uprooting or tearing live foliage.",
      tasks: [
        {
          title: "Find two leaves with distinctly different shapes",
          instruction: "Compare one rounded or lobed leaf with one slender, needle-like, or serrated leaf.",
          whatToObserve: "Notice margin serrations and whether veins branch outwards or run parallel."
        },
        {
          title: "Inspect bark or stem texture up close",
          instruction: "Look closely at the surface of a tree trunk or woody shrub without scratching it.",
          whatToObserve: "Observe fissures, lichen patches, moss colonization, or sap droplets."
        },
        {
          title: "Seek a wildflower or wild sprout",
          instruction: "Find a spontaneous plant growing along a pathway edge, brick crack, or meadow.",
          whatToObserve: "Check petal symmetry, color vibrancy, and whether pollen is visible."
        },
        {
          title: "Discover natural geometric symmetry",
          instruction: "Examine the arrangement of leaves around a single stem (spiral, alternate, or opposite).",
          whatToObserve: "Notice how plants optimize spacing to capture sunlight."
        }
      ]
    },
    {
      title: "Canopy & Understory Expedition",
      intro: "Explore how sunlight filters through the layers of plant life from tall branches down to ground moss.",
      safety: "Stay on accessible footpaths and watch your step around roots and damp stones.",
      tasks: [
        {
          title: "Identify three shades of green",
          instruction: "Look across the landscape and find lime green, deep emerald, and soft sage hues.",
          whatToObserve: "Notice how age and sunlight change leaf pigment."
        },
        {
          title: "Search for a seed pod, cone, or fallen fruit",
          instruction: "Look on the ground under trees for seed dispersal mechanisms.",
          whatToObserve: "Check the protective casing designed to shelter new life."
        },
        {
          title: "Examine underside of leaves",
          instruction: "Gently turn a fallen leaf over to inspect its reverse side.",
          whatToObserve: "Notice stomata texture, paler tone, and raised vascular veins."
        },
        {
          title: "Document an adaptive climber or vine",
          instruction: "Find ivy, tendrils, or clinging roots scaling a wall or trunk.",
          whatToObserve: "See how the plant anchors itself without a rigid trunk."
        }
      ]
    }
  ],
  birds: [
    {
      title: "Wings and Perches Safari",
      intro: "Slow down, tune your ears to high branches, and observe avian flight paths and territorial songs.",
      safety: "Maintain a respectful distance. Never approach nests, chicks, or feeding birds.",
      tasks: [
        {
          title: "Quiet listening census (2 minutes)",
          instruction: "Close your eyes or look down. Count how many distinct bird calls or songs you can hear.",
          whatToObserve: "Differentiate between short alarm chirps and melodic whistles."
        },
        {
          title: "Spot a high-altitude sentry",
          instruction: "Scan rooftops, power lines, and tall tree crowns for a perched songbird or raptor.",
          whatToObserve: "Observe their silhouette, tail feather shape, and head movements."
        },
        {
          title: "Ground forager observation",
          instruction: "Watch lawn or leaf litter for sparrows, thrushes, or pigeons searching for seeds.",
          whatToObserve: "Notice their hopping or walking cadence and scratching behavior."
        },
        {
          title: "Observe flight style",
          instruction: "Track a bird flying across open sky.",
          whatToObserve: "Look for gliding, undulating up-and-down flap cycles, or direct flapping."
        }
      ]
    }
  ],
  insects: [
    {
      title: "The Micro-Wilderness Safari",
      intro: "Step into the miniature kingdom thriving beneath our feet and among flowering blooms.",
      safety: "Keep a respectful distance from stinging insects like bees and wasps. Do not handle stinging or biting critters.",
      tasks: [
        {
          title: "Pollinator patrol",
          instruction: "Watch a patch of flowering weeds or garden flowers for two minutes.",
          whatToObserve: "Notice whether bees, hoverflies, or butterflies land and how pollen adheres to their bodies."
        },
        {
          title: "Ant highway survey",
          instruction: "Inspect the soil edge, garden stone, or tree base for an ant trail.",
          whatToObserve: "Observe how ants touch antennae to communicate navigation directions."
        },
        {
          title: "Spider silk architecture",
          instruction: "Look for a spider web glistening in indirect sunlight.",
          whatToObserve: "Check if it is an orb web, a funnel, or a tangled sheet web."
        },
        {
          title: "Bark crevice dweller",
          instruction: "Check an old tree trunk or dead wood for beetles, woodlice, or harmless crawling bugs.",
          whatToObserve: "Observe protective exoskeleton textures and camouflage."
        }
      ]
    }
  ],
  mindfulness: [
    {
      title: "Five-Sense Forest Bathing & Grounding",
      intro: "Leave the screen in your pocket. Reconnect your nervous system with wind, soil, scents, and natural stillness.",
      safety: "Choose a quiet, safe spot where you can comfortably stand or sit undisturbed.",
      tasks: [
        {
          title: "Deep breath & scent mapping",
          instruction: "Take 5 deep breaths through your nose. What does the air smell like?",
          whatToObserve: "Damp soil (geosmin), crushed pine needles, petrichor, or sweet blossoms."
        },
        {
          title: "Tactile textures (gentle touch)",
          instruction: "Safely touch smooth river stone, rough tree bark, and dry grass.",
          whatToObserve: "Feel temperatures and surface variations against your fingertips."
        },
        {
          title: "Wind choreography",
          instruction: "Watch tree leaves or tall grass sway with incoming breezes.",
          whatToObserve: "Notice the rhythm and sound of leaves rustling like gentle waves."
        },
        {
          title: "Shadow and light meditation",
          instruction: "Find dapple sunlight filtering through tree leaves onto the ground.",
          whatToObserve: "Observe how sunlight shifts and flickers as branches move."
        }
      ]
    }
  ],
  photography: [
    {
      title: "Macro & Composition Nature Safari",
      intro: "Practice visual storytelling using natural lighting, leading lines, and macro perspectives.",
      safety: "Stay on safe paths. Keep your camera strap secure and watch for low branches.",
      tasks: [
        {
          title: "Extreme macro texture",
          instruction: "Frame an extreme close-up of a leaf vein, moss patch, or stone fissure.",
          whatToObserve: "Focus on micro-details that are invisible from standing height."
        },
        {
          title: "Leading natural line",
          instruction: "Find a fallen branch, curving dirt trail, or stream leading into the distance.",
          whatToObserve: "Align your perspective to lead the eye through the scene."
        },
        {
          title: "Backlit transparency",
          instruction: "Position yourself so sunlight shines through a thin green leaf or petal.",
          whatToObserve: "Capture the glowing luminous green and inner cellular structure."
        },
        {
          title: "Frame within a frame",
          instruction: "Use overhanging branches, a hollow trunk, or twin trees to frame your subject.",
          whatToObserve: "Notice depth and three-dimensional perspective."
        }
      ]
    }
  ],
  general: [
    {
      title: "Backyard & Park Nature Detective",
      intro: "A balanced outdoor adventure designed to open your eyes to the living biodiversity right in your neighborhood.",
      safety: "Remain aware of your surroundings, traffic, and footing. Leave all natural items as you found them.",
      tasks: [
        {
          title: "Find two leaves with different shapes",
          instruction: "Compare one rounded leaf with one pointed, serrated, or compound leaf.",
          whatToObserve: "Examine edges, veining, and waxiness."
        },
        {
          title: "Observe a plant without touching it",
          instruction: "Stand still next to a plant for 60 seconds and observe every detail.",
          whatToObserve: "Look for small buds, insect visitors, or morning dew."
        },
        {
          title: "Listen quietly for one minute",
          instruction: "Pause, mute all distractions, and record the natural sounds you hear.",
          whatToObserve: "Wind in trees, distant bird calls, or buzzing insects."
        },
        {
          title: "Look for an insect from a safe distance",
          instruction: "Find a beetle, ant, fly, or butterfly on foliage or soil.",
          whatToObserve: "Watch its locomotion and feeding behavior."
        },
        {
          title: "Find one natural pattern and document it",
          instruction: "Find spirals (phyllotaxis), branching roots, or ripples in puddles.",
          whatToObserve: "Notice mathematics recurring in nature."
        }
      ]
    }
  ]
};

export function generateDeterministicAdventure(params: AdventureRequest): Adventure {
  const interestKey = (params.interest in MISSIONS) ? params.interest : 'general';
  const templates = MISSIONS[interestKey] || MISSIONS.general;
  const template = templates[Math.floor(Math.random() * templates.length)];

  // Scale tasks count based on duration
  const targetTaskCount = params.durationMinutes === 15 ? 4 : (params.durationMinutes === 30 ? 5 : 6);
  const minutesPerTask = Math.floor(params.durationMinutes / targetTaskCount);

  const baseTasks = [...template.tasks];
  // If need more tasks, borrow from general
  while (baseTasks.length < targetTaskCount) {
    const generalTask = MISSIONS.general[0].tasks[baseTasks.length % MISSIONS.general[0].tasks.length];
    baseTasks.push(generalTask);
  }

  const tasks: AdventureTask[] = baseTasks.slice(0, targetTaskCount).map((t, idx) => ({
    id: `task-${Date.now()}-${idx + 1}`,
    title: t.title,
    estimatedMinutes: minutesPerTask,
    instruction: t.instruction,
    whatToObserve: t.whatToObserve,
    completed: false
  }));

  const environmentLabel = params.environment === 'any' ? 'Outdoors' : params.environment.charAt(0).toUpperCase() + params.environment.slice(1);

  return {
    id: `adv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: `${template.title} (${environmentLabel})`,
    introduction: `${template.intro} Tailored for a ${params.durationMinutes}-minute walk in your ${params.environment}.`,
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

export function getSampleDemonstrationIdentification(category?: NatureCategory): IdentificationResponse {
  const categorySamples: Record<NatureCategory, IdentificationResponse> = {
    leaf: {
      suggestedName: "English Oak Leaf (Quercus robur)",
      category: "leaf",
      visibleFeatures: [
        "Deeply lobed rounded margins with 4-7 pairs of lobes",
        "Short petiole (leaf stalk) with distinct ear-shaped auricles at base",
        "Smooth upper surface with pronounced pinnate veining"
      ],
      explanation: "This leaf shows the classic sinusoidal lobes and auriculate base characteristic of white and English oak species. Oak leaves provide habitat and nourishment for hundreds of insect species.",
      confidence: "medium",
      safetyNote: "Oak leaves and acorns contain tannins which make them bitter and unpalatable. Appreciate without tasting.",
      isSimulation: true,
      modelUsed: "Demo Simulation (Local Ollama offline)"
    },
    plant: {
      suggestedName: "Broadleaf Plantain (Plantago major)",
      category: "plant",
      visibleFeatures: [
        "Broad, oval basal rosette of leaves",
        "Prominent parallel longitudinal veins (5-9 veins)",
        "Spike of tiny dense greenish-brown flowers"
      ],
      explanation: "A hardy, widespread perennial herb often found along paths and trodden ground. Its leaves grow in a low rosette to withstand trampling, and Native Americans called it 'White Man's Footprint' because it followed settler pathways.",
      confidence: "medium",
      safetyNote: "Always verify wild plants with field botanists before considering any herbal application.",
      isSimulation: true,
      modelUsed: "Demo Simulation (Local Ollama offline)"
    },
    flower: {
      suggestedName: "Common Dandelion (Taraxacum officinale)",
      category: "flower",
      visibleFeatures: [
        "Bright golden-yellow composite flower head made of numerous ray florets",
        "Hollow milky stem (exudes latex when broken)",
        "Deeply toothed, lion-tooth shaped basal leaves"
      ],
      explanation: "One of the most vital early spring nectar sources for honeybees and native solitary pollinators. Each yellow head is actually a bouquet of up to 200 tiny individual flowers.",
      confidence: "high",
      safetyNote: "Avoid picking flowers growing near high-traffic roadways or areas treated with chemical herbicides.",
      isSimulation: true,
      modelUsed: "Demo Simulation (Local Ollama offline)"
    },
    bird: {
      suggestedName: "House Sparrow (Passer domesticus)",
      category: "bird",
      visibleFeatures: [
        "Chunky body with stout conical seed-eating bill",
        "Brown streaked back with black bib and gray crown on males",
        "Energetic ground-hopping foraging behavior"
      ],
      explanation: "A highly adaptable urban and rural songbird that has lived alongside human settlements for millennia. They are social dust-bathers and frequent bird feeders.",
      confidence: "medium",
      safetyNote: "Never disturb active bird nests, fledglings, or roosting areas. Maintain a distance of at least 5 meters.",
      isSimulation: true,
      modelUsed: "Demo Simulation (Local Ollama offline)"
    },
    insect: {
      suggestedName: "Seven-Spot Ladybird (Coccinella septempunctata)",
      category: "insect",
      visibleFeatures: [
        "Domed red elytra with seven distinct black spots (three on each side, one shared at base)",
        "Black pronotum with two pale white angular markings",
        "Short clubbed antennae and tiny black legs"
      ],
      explanation: "A beneficial predatory beetle beloved by gardeners. Both larvae and adult ladybirds consume hundreds of agricultural pest aphids each day.",
      confidence: "high",
      safetyNote: "Ladybirds are harmless to humans, but can exude a harmless bitter yellow fluid (reflex bleeding) if handled roughly.",
      isSimulation: true,
      modelUsed: "Demo Simulation (Local Ollama offline)"
    },
    other: {
      suggestedName: "Common Lichen (Xanthoria parietina)",
      category: "other",
      visibleFeatures: [
        "Vibrant yellow-orange circular crust or foliose lobe rosette",
        "Adhering tightly to tree bark or stone surface",
        "Central cup-like reproductive apothecia discs"
      ],
      explanation: "Lichen is not a single plant, but a composite mutualistic organism composed of a fungus and photosynthetic algae or cyanobacteria. Lichens serve as natural bioindicators of clean air quality.",
      confidence: "medium",
      safetyNote: "Observe without scraping lichens off trees or historic stone walls.",
      isSimulation: true,
      modelUsed: "Demo Simulation (Local Ollama offline)"
    }
  };

  const cat = category || 'plant';
  return categorySamples[cat] || categorySamples.plant;
}
