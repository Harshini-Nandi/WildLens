import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Observation, Adventure, DailyActivity, UserSettings } from '../types';

interface WildBuddyDB extends DBSchema {
  observations: {
    key: string;
    value: Observation;
    indexes: {
      'by-date': string;
      'by-category': string;
    };
  };
  adventures: {
    key: string;
    value: Adventure;
    indexes: {
      'by-created': string;
    };
  };
  dailyActivity: {
    key: string; // YYYY-MM-DD
    value: DailyActivity;
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'wildbuddy_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<WildBuddyDB>> | null = null;

export function getDb(): Promise<IDBPDatabase<WildBuddyDB>> {
  if (!dbPromise) {
    dbPromise = openDB<WildBuddyDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Observations store
        if (!db.objectStoreNames.contains('observations')) {
          const obsStore = db.createObjectStore('observations', { keyPath: 'id' });
          obsStore.createIndex('by-date', 'date');
          obsStore.createIndex('by-category', 'category');
        }

        // Adventures store
        if (!db.objectStoreNames.contains('adventures')) {
          const advStore = db.createObjectStore('adventures', { keyPath: 'id' });
          advStore.createIndex('by-created', 'createdAt');
        }

        // Daily Activity store (key: YYYY-MM-DD)
        if (!db.objectStoreNames.contains('dailyActivity')) {
          db.createObjectStore('dailyActivity', { keyPath: 'date' });
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ----------------- OBSERVATIONS -----------------

export async function getAllObservations(): Promise<Observation[]> {
  const db = await getDb();
  const items = await db.getAllFromIndex('observations', 'by-date');
  return items.reverse(); // Newest first
}

export async function getObservationById(id: string): Promise<Observation | undefined> {
  const db = await getDb();
  return db.get('observations', id);
}

export async function saveObservation(obs: Observation): Promise<void> {
  const db = await getDb();
  await db.put('observations', obs);

  // Increment today's observation count in daily activity
  const today = getTodayDateString();
  const existing = await db.get('dailyActivity', today);
  const updated: DailyActivity = existing
    ? { ...existing, observationsCount: existing.observationsCount + 1 }
    : { date: today, outdoorMinutes: 0, observationsCount: 1, adventuresCompleted: 0 };
  await db.put('dailyActivity', updated);
}

export async function updateObservation(obs: Observation): Promise<void> {
  const db = await getDb();
  await db.put('observations', obs);
}

export async function deleteObservation(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('observations', id);
}

// ----------------- ADVENTURES -----------------

export async function getAllAdventures(): Promise<Adventure[]> {
  const db = await getDb();
  const items = await db.getAllFromIndex('adventures', 'by-created');
  return items.reverse();
}

export async function getAdventureById(id: string): Promise<Adventure | undefined> {
  const db = await getDb();
  return db.get('adventures', id);
}

export async function saveAdventure(adv: Adventure): Promise<void> {
  const db = await getDb();
  await db.put('adventures', adv);
}

export async function updateAdventureTask(advId: string, taskId: string, completed: boolean): Promise<Adventure | null> {
  const db = await getDb();
  const adv = await db.get('adventures', advId);
  if (!adv) return null;

  adv.tasks = adv.tasks.map(t => t.id === taskId ? { ...t, completed } : t);
  await db.put('adventures', adv);
  return adv;
}

export async function completeAdventure(advId: string, minutesSpent: number): Promise<Adventure | null> {
  const db = await getDb();
  const adv = await db.get('adventures', advId);
  if (!adv) return null;

  adv.completedAt = new Date().toISOString();
  adv.minutesSpent = minutesSpent;
  adv.tasks = adv.tasks.map(t => ({ ...t, completed: true }));
  await db.put('adventures', adv);

  // Increment today's activity
  const today = getTodayDateString();
  const existing = await db.get('dailyActivity', today);
  const updated: DailyActivity = existing
    ? {
        ...existing,
        outdoorMinutes: existing.outdoorMinutes + minutesSpent,
        adventuresCompleted: existing.adventuresCompleted + 1
      }
    : {
        date: today,
        outdoorMinutes: minutesSpent,
        observationsCount: 0,
        adventuresCompleted: 1
      };
  await db.put('dailyActivity', updated);

  return adv;
}

// ----------------- DAILY ACTIVITY & STREAKS -----------------

export async function getDailyActivity(date: string): Promise<DailyActivity | undefined> {
  const db = await getDb();
  return db.get('dailyActivity', date);
}

export async function getAllDailyActivities(): Promise<DailyActivity[]> {
  const db = await getDb();
  return db.getAll('dailyActivity');
}

export async function recordOutdoorMinutes(minutes: number): Promise<void> {
  const db = await getDb();
  const today = getTodayDateString();
  const existing = await db.get('dailyActivity', today);
  const updated: DailyActivity = existing
    ? { ...existing, outdoorMinutes: existing.outdoorMinutes + minutes }
    : { date: today, outdoorMinutes: minutes, observationsCount: 0, adventuresCompleted: 0 };
  await db.put('dailyActivity', updated);
}

export async function getLast7DaysActivity(): Promise<Array<{ date: string; dayName: string; minutes: number }>> {
  const db = await getDb();
  const days: Array<{ date: string; dayName: string; minutes: number }> = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

    const record = await db.get('dailyActivity', dateStr);
    days.push({
      date: dateStr,
      dayName,
      minutes: record ? record.outdoorMinutes : 0
    });
  }

  return days;
}

// ----------------- USER SETTINGS -----------------

export const DEFAULT_SETTINGS: UserSettings = {
  dailyOutdoorGoalMinutes: 30,
  preferredAdventureDuration: 30,
  accessibilityPreference: '',
  ollamaHost: 'http://127.0.0.1:11434',
  ollamaVisionModel: 'gemma3',
  ollamaTextModel: 'gemma3',
  hasCompletedOnboarding: false,
  theme: 'nature'
};

export async function getUserSettings(): Promise<UserSettings> {
  const db = await getDb();
  const record = await db.get('settings', 'user_settings');
  return record ? { ...DEFAULT_SETTINGS, ...record.value } : DEFAULT_SETTINGS;
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
  const db = await getDb();
  await db.put('settings', { key: 'user_settings', value: settings });
}

// ----------------- BACKUP & CLEAR -----------------

export async function exportAllData(): Promise<string> {
  const db = await getDb();
  const observations = await db.getAll('observations');
  const adventures = await db.getAll('adventures');
  const dailyActivity = await db.getAll('dailyActivity');
  const settings = await getUserSettings();

  const backupData = {
    app: 'WildBuddy',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    data: {
      observations,
      adventures,
      dailyActivity,
      settings
    }
  };

  return JSON.stringify(backupData, null, 2);
}

export async function importAllData(jsonString: string): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !parsed.data) {
      return { success: false, message: 'Invalid WildBuddy backup format: missing data payload' };
    }

    const db = await getDb();
    const tx = db.transaction(['observations', 'adventures', 'dailyActivity', 'settings'], 'readwrite');

    let obsCount = 0;
    if (Array.isArray(parsed.data.observations)) {
      for (const obs of parsed.data.observations) {
        if (obs.id && obs.name) {
          await tx.objectStore('observations').put(obs);
          obsCount++;
        }
      }
    }

    if (Array.isArray(parsed.data.adventures)) {
      for (const adv of parsed.data.adventures) {
        if (adv.id && adv.title) {
          await tx.objectStore('adventures').put(adv);
        }
      }
    }

    if (Array.isArray(parsed.data.dailyActivity)) {
      for (const act of parsed.data.dailyActivity) {
        if (act.date) {
          await tx.objectStore('dailyActivity').put(act);
        }
      }
    }

    if (parsed.data.settings) {
      await tx.objectStore('settings').put({ key: 'user_settings', value: parsed.data.settings });
    }

    await tx.done;
    return {
      success: true,
      message: `Successfully restored ${obsCount} observations and activity history.`,
      count: obsCount
    };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: `Failed to import data: ${error.message}` };
  }
}

export async function clearAllLocalData(): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(['observations', 'adventures', 'dailyActivity', 'settings'], 'readwrite');
  await tx.objectStore('observations').clear();
  await tx.objectStore('adventures').clear();
  await tx.objectStore('dailyActivity').clear();
  await tx.objectStore('settings').clear();
  await tx.done;
}
