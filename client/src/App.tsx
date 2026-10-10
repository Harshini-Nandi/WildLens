import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { WelcomeView } from './features/onboarding/WelcomeView';
import { HomeDashboard } from './features/dashboard/HomeDashboard';
import { ImageIdentifier } from './features/identification/ImageIdentifier';
import { AdventureGenerator } from './features/adventures/AdventureGenerator';
import { ActiveAdventureView } from './features/adventures/ActiveAdventureView';
import { JournalView } from './features/journal/JournalView';
import { ProgressView } from './features/progress/ProgressView';
import { SettingsView } from './features/settings/SettingsView';
import { OllamaSetupGuideModal } from './features/identification/OllamaSetupGuideModal';
import { ObservationDetailModal } from './features/journal/ObservationDetailModal';

import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useAiHealth } from './hooks/useAiHealth';

import {
  getAllObservations,
  saveObservation,
  updateObservation,
  deleteObservation,
  getAllAdventures,
  saveAdventure,
  updateAdventureTask,
  completeAdventure,
  getAllDailyActivities,
  getLast7DaysActivity,
  getUserSettings,
  saveUserSettings,
  clearAllLocalData,
  getTodayDateString,
  getDailyActivity,
  DEFAULT_SETTINGS
} from './db/indexedDb';

import { calculateCurrentStreak } from './utils/streakUtils';
import { evaluateAchievements } from './utils/achievements';
import { ActiveTab, Adventure, DailyActivity, Observation, UserSettings } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  // Core Data State
  const [observations, setObservations] = useState<Observation[]>([]);
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>([]);
  const [weeklyChart, setWeeklyChart] = useState<Array<{ date: string; dayName: string; minutes: number }>>([]);
  const [todayMinutes, setTodayMinutes] = useState<number>(0);

  // Active Adventure State
  const [activeAdventure, setActiveAdventure] = useState<Adventure | null>(null);

  // Modals
  const [setupGuideOpen, setSetupGuideOpen] = useState<boolean>(false);
  const [inspectObservation, setInspectObservation] = useState<Observation | null>(null);

  // Hooks
  const isOnline = useOnlineStatus();
  const { health: aiHealth, refreshHealth } = useAiHealth();

  // Load all local data from IndexedDB
  const reloadData = useCallback(async () => {
    try {
      const [obs, advs, acts, chart, userSettings, todayAct] = await Promise.all([
        getAllObservations(),
        getAllAdventures(),
        getAllDailyActivities(),
        getLast7DaysActivity(),
        getUserSettings(),
        getDailyActivity(getTodayDateString())
      ]);

      setObservations(obs);
      setAdventures(advs);
      setDailyActivities(acts);
      setWeeklyChart(chart);
      setSettings(userSettings);
      setTodayMinutes(todayAct?.outdoorMinutes || 0);

      // Check if user has an uncompleted active adventure
      const uncompleted = advs.find((a) => !a.completedAt);
      if (uncompleted) {
        setActiveAdventure(uncompleted);
      }

      // Check if first-time user
      if (!userSettings.hasCompletedOnboarding) {
        setActiveTab('welcome');
      }
    } catch (err) {
      console.error('Failed to load IndexedDB data:', err);
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  // Derived metrics
  const currentStreak = useMemo(() => {
    return calculateCurrentStreak(dailyActivities);
  }, [dailyActivities]);

  const achievements = useMemo(() => {
    return evaluateAchievements(observations, adventures, dailyActivities, currentStreak);
  }, [observations, adventures, dailyActivities, currentStreak]);

  // Observation actions
  const handleSaveObservation = async (obs: Observation) => {
    await saveObservation(obs);
    await reloadData();
    setActiveTab('journal');
  };

  const handleUpdateObservation = async (obs: Observation) => {
    await updateObservation(obs);
    await reloadData();
  };

  const handleDeleteObservation = async (id: string) => {
    await deleteObservation(id);
    await reloadData();
  };

  // Adventure actions
  const handleStartAdventure = async (adv: Adventure) => {
    await saveAdventure(adv);
    setActiveAdventure(adv);
    setActiveTab('adventures');
  };

  const handleUpdateAdventureTask = async (taskId: string, completed: boolean) => {
    if (!activeAdventure) return;
    const updated = await updateAdventureTask(activeAdventure.id, taskId, completed);
    if (updated) {
      setActiveAdventure({ ...updated });
    }
  };

  const handleFinishAdventure = async (adv: Adventure, minutesSpent: number) => {
    await completeAdventure(adv.id, minutesSpent);
    setActiveAdventure(null);
    await reloadData();
    setActiveTab('progress');
  };

  const handleCancelAdventure = () => {
    setActiveAdventure(null);
  };

  // Settings actions
  const handleUpdateSettings = async (newSettings: UserSettings) => {
    await saveUserSettings(newSettings);
    setSettings(newSettings);
  };

  const handleClearAllData = async () => {
    await clearAllLocalData();
    setActiveAdventure(null);
    setObservations([]);
    setAdventures([]);
    setDailyActivities([]);
    setTodayMinutes(0);
    setWeeklyChart([]);
    setActiveTab('welcome');
  };

  const handleStartExploringFromWelcome = async () => {
    const updated = { ...settings, hasCompletedOnboarding: true };
    await saveUserSettings(updated);
    setSettings(updated);
    setActiveTab('dashboard');
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-forest border-t-transparent animate-spin mx-auto" />
          <h2 className="text-lg font-bold text-forest-dark">Opening WildBuddy...</h2>
          <p className="text-xs text-charcoal-muted">Initializing offline IndexedDB storage</p>
        </div>
      </div>
    );
  }

  // Welcome / Onboarding View
  if (activeTab === 'welcome') {
    return (
      <div className="min-h-screen bg-cream px-4">
        <WelcomeView onStartExploring={handleStartExploringFromWelcome} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Layout
        currentTab={activeTab}
        onNavigate={setActiveTab}
        isOnline={isOnline}
        aiHealth={aiHealth}
        onOpenSetupGuide={() => setSetupGuideOpen(true)}
        onQuickIdentify={() => setActiveTab('identify')}
        observationCount={observations.length}
        currentStreak={currentStreak}
        todayMinutes={todayMinutes}
      >
        {/* View Router */}
        {activeTab === 'dashboard' && (
          <HomeDashboard
            onNavigate={setActiveTab}
            observations={observations}
            activeAdventure={activeAdventure}
            onOpenObservation={(obs) => setInspectObservation(obs)}
            todayMinutes={todayMinutes}
            currentStreak={currentStreak}
            settings={settings}
          />
        )}

        {activeTab === 'identify' && (
          <ImageIdentifier
            onSaveToJournal={handleSaveObservation}
            onOpenSetupGuide={() => setSetupGuideOpen(true)}
            aiHealth={aiHealth}
          />
        )}

        {activeTab === 'adventures' && (
          activeAdventure ? (
            <ActiveAdventureView
              adventure={activeAdventure}
              onUpdateTask={handleUpdateAdventureTask}
              onFinishAdventure={handleFinishAdventure}
              onCancelAdventure={handleCancelAdventure}
            />
          ) : (
            <AdventureGenerator
              onStartAdventure={handleStartAdventure}
              savedAdventures={adventures}
              aiHealth={aiHealth}
            />
          )
        )}

        {activeTab === 'journal' && (
          <JournalView
            observations={observations}
            onUpdateObservation={handleUpdateObservation}
            onDeleteObservation={handleDeleteObservation}
            onNavigate={setActiveTab}
            onRefreshData={reloadData}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            observations={observations}
            adventures={adventures}
            dailyActivities={dailyActivities}
            weeklyChart={weeklyChart}
            currentStreak={currentStreak}
            achievements={achievements}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onClearAllData={handleClearAllData}
            aiHealth={aiHealth}
            onRefreshHealth={refreshHealth}
          />
        )}

        {/* Global Inspection Modal */}
        <ObservationDetailModal
          observation={inspectObservation}
          isOpen={!!inspectObservation}
          onClose={() => setInspectObservation(null)}
          onUpdate={handleUpdateObservation}
          onDelete={handleDeleteObservation}
        />

        {/* Ollama Setup Modal */}
        <OllamaSetupGuideModal
          isOpen={setupGuideOpen}
          onClose={() => setSetupGuideOpen(false)}
          aiHealth={aiHealth}
          onRefreshHealth={refreshHealth}
        />
      </Layout>
    </ErrorBoundary>
  );
};
export default App;
