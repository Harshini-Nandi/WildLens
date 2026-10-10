import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { StatusBanner } from '../common/StatusBanner';
import { ActiveTab, OllamaHealth } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  currentTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  isOnline: boolean;
  aiHealth: OllamaHealth | null;
  onOpenSetupGuide: () => void;
  onQuickIdentify: () => void;
  observationCount: number;
  currentStreak: number;
  todayMinutes: number;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentTab,
  onNavigate,
  isOnline,
  aiHealth,
  onOpenSetupGuide,
  onQuickIdentify,
  observationCount,
  currentStreak,
  todayMinutes
}) => {
  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col selection:bg-sage selection:text-forest-dark">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={onNavigate}
        isOnline={isOnline}
        aiHealth={aiHealth}
        onOpenSetupGuide={onOpenSetupGuide}
        onQuickIdentify={onQuickIdentify}
      />

      {/* System Status Banner */}
      <StatusBanner
        isOnline={isOnline}
        aiHealth={aiHealth}
        onOpenSetupGuide={onOpenSetupGuide}
      />

      {/* Main App Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onNavigate={onNavigate}
          observationCount={observationCount}
          currentStreak={currentStreak}
          todayMinutes={todayMinutes}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={onNavigate}
        observationCount={observationCount}
      />
    </div>
  );
};
