export type NatureCategory = 'plant' | 'leaf' | 'flower' | 'bird' | 'insect' | 'other';
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface IdentificationResponse {
  suggestedName: string;
  category: NatureCategory;
  visibleFeatures: string[];
  explanation: string;
  confidence: ConfidenceLevel;
  safetyNote: string;
  isSimulation?: boolean;
  modelUsed?: string;
}

export interface IdentificationRequest {
  image: string; // Base64 data URL or pure base64
  category?: NatureCategory;
  preferSimulationIfOffline?: boolean;
}

export type AdventureEnvironment = 'garden' | 'park' | 'neighborhood' | 'forest' | 'any';
export type AdventureInterest = 'birds' | 'plants' | 'photography' | 'insects' | 'mindfulness' | 'general';
export type AdventureDifficulty = 'easy' | 'moderate' | 'adventurous';

export interface AdventureTask {
  id: string;
  title: string;
  estimatedMinutes: number;
  instruction: string;
  whatToObserve: string;
  completed?: boolean;
}

export interface Adventure {
  id: string;
  title: string;
  introduction: string;
  estimatedTotalMinutes: number;
  environment: AdventureEnvironment;
  interest: AdventureInterest;
  difficulty: AdventureDifficulty;
  accessibilityNotes?: string;
  safetyReminder: string;
  tasks: AdventureTask[];
  generatedBy: 'ollama' | 'deterministic';
  createdAt: string;
}

export interface AdventureRequest {
  durationMinutes: 15 | 30 | 60;
  environment: AdventureEnvironment;
  interest: AdventureInterest;
  difficulty: AdventureDifficulty;
  accessibilityPreference?: string;
}

export interface OllamaHealthInfo {
  status: 'connected' | 'disconnected';
  host: string;
  version?: string;
  availableModels: string[];
  configuredVisionModel: string;
  configuredTextModel: string;
  visionModelFound: boolean;
  textModelFound: boolean;
  message?: string;
}
