import React from 'react';
import { Home, Camera, MapPin, BookOpen, Award, Settings } from 'lucide-react';
import { ActiveTab } from '../../types';

interface BottomNavProps {
  currentTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  observationCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onNavigate,
  observationCount
}) => {
  const navTabs: Array<{ id: ActiveTab; label: string; icon: any; badge?: number }> = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'identify', label: 'Identify', icon: Camera },
    { id: 'adventures', label: 'Missions', icon: MapPin },
    { id: 'journal', label: 'Journal', icon: BookOpen, badge: observationCount },
    { id: 'progress', label: 'Badges', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-sage-border px-2 py-1.5 shadow-nature-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-forest font-semibold'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-forest' : ''}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-forest text-cream text-[9px] font-bold px-1 rounded-full min-w-3.5 h-3.5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-forest mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
