import React from 'react';
import {
  Home,
  Camera,
  MapPin,
  BookOpen,
  Award,
  Settings,
  Flame,
  Clock
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface SidebarProps {
  currentTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  observationCount: number;
  currentStreak: number;
  todayMinutes: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  observationCount,
  currentStreak,
  todayMinutes
}) => {
  const navItems: Array<{
    id: ActiveTab;
    label: string;
    icon: any;
    badge?: number;
  }> = [
    { id: 'dashboard', label: 'Touch Grass', icon: Home },
    { id: 'identify', label: 'AI Identifier', icon: Camera },
    { id: 'adventures', label: 'Outdoor Missions', icon: MapPin },
    { id: 'journal', label: 'Nature Journal', icon: BookOpen, badge: observationCount },
    { id: 'progress', label: 'Badges & Stats', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-sage-border/60 min-h-[calc(100vh-4rem)] p-4 justify-between">
      {/* Navigation Links */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">
          Explore Nature
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-forest text-cream shadow-sm'
                  : 'text-charcoal hover:bg-sage-light hover:text-forest-dark'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-sage' : 'text-charcoal-muted'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-forest-dark text-sage' : 'bg-sage text-forest-dark'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mini Streak & Outdoor Time Card */}
      <div className="p-3.5 rounded-2xl bg-sage-light/70 border border-sage-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-forest-dark">
            <Flame className="w-4 h-4 text-terracotta" />
            <span>Streak</span>
          </div>
          <span className="text-sm font-bold text-forest-dark">
            {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-forest-dark">
            <Clock className="w-4 h-4 text-forest" />
            <span>Today's Time</span>
          </div>
          <span className="text-sm font-bold text-forest-dark">
            {todayMinutes}m
          </span>
        </div>

        <div className="text-[11px] text-charcoal-muted pt-1 border-t border-sage-border/50">
          🌱 Zero cloud tracking. 100% on your device.
        </div>
      </div>
    </aside>
  );
};
