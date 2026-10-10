export type NatureCategory = 'plant' | 'leaf' | 'flower' | 'bird' | 'insect' | 'other';
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface Observation {
  id: string;
  name: string;
  category: NatureCategory;
  date: string; // ISO string
  photo?: string; // Base64 data URL or blob URL
  notes: string;
  location?: string;
  adventureId?: string;
  visibleFeatures?: string[];
  explanation?: string;
  confidence?: ConfidenceLevel;
  safetyNote?: string;
  identifiedBy?: string; // 'ollama:model' or 'demo' or 'manual'
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
  completedAt?: string;
  minutesSpent?: number;
}

export interface AdventureRequest {
  durationMinutes: 15 | 30 | 60;
  environment: AdventureEnvironment;
  interest: AdventureInterest;
  difficulty: AdventureDifficulty;
  accessibilityPreference?: string;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  outdoorMinutes: number;
  observationsCount: number;
  adventuresCompleted: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'discovery' | 'adventure' | 'streak' | 'mindfulness';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface UserSettings {
  dailyOutdoorGoalMinutes: number;
  preferredAdventureDuration: 15 | 30 | 60;
  accessibilityPreference: string;
  ollamaHost: string;
  ollamaVisionModel: string;
  ollamaTextModel: string;
  hasCompletedOnboarding: boolean;
  theme: 'nature';
}

export interface IdentificationResult {
  suggestedName: string;
  category: NatureCategory;
  visibleFeatures: string[];
  explanation: string;
  confidence: ConfidenceLevel;
  safetyNote: string;
  isSimulation?: boolean;
  modelUsed?: string;
}

export interface OllamaHealth {
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

export type ActiveTab = 'welcome' | 'dashboard' | 'identify' | 'adventures' | 'journal' | 'progress' | 'settings';
