'use client';

import React from 'react';
import {
  Sun,
  Layers,
  Calendar,
  Flame,
  Sparkles,
  Settings,
  Plus,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export type NavTab = 'today' | 'collections' | 'calendar' | 'habits' | 'review' | 'settings';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenQuickAdd: () => void;
  dailyScore: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenQuickAdd,
  dailyScore,
}) => {
  const tabs = [
    { key: 'today' as NavTab, label: 'Today', icon: Sun },
    { key: 'collections' as NavTab, label: 'Spaces', icon: Layers },
    { key: 'calendar' as NavTab, label: 'Schedule', icon: Calendar },
    { key: 'habits' as NavTab, label: 'Habits', icon: Flame },
    { key: 'review' as NavTab, label: 'Review', icon: Sparkles },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 border-r border-black/[0.06] bg-[#FBF9F5] p-5 shrink-0 min-h-screen justify-between fixed top-0 bottom-0 left-0 z-30">
        <div className="space-y-6">
          {/* App Branding Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs">
                OS
              </div>
              <div>
                <h1 className="text-sm font-bold text-[#1D1D1F] tracking-tight">Daily System</h1>
                <p className="text-[10px] text-[#86868B] font-semibold tracking-wider uppercase">Operating OS</p>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 border border-black/[0.06] text-[11px] font-mono font-bold">
              <span>{dailyScore.toFixed(1)}</span>
            </div>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={onOpenQuickAdd}
            className="w-full py-2.5 px-3 rounded-2xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Capture (N)</span>
          </button>

          {/* Nav Links */}
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => onSelectTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-black shadow-xs font-bold'
                      : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.02]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#86868B]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Settings Bar */}
        <div className="pt-4 border-t border-black/[0.06] space-y-2">
          <button
            onClick={() => onSelectTab('settings')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'settings' ? 'bg-white text-black shadow-xs' : 'text-[#86868B] hover:text-black'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4" />
              <span>Settings & Sync</span>
            </div>
          </button>

          <div className="px-3 py-2 rounded-xl bg-neutral-100/70 border border-black/[0.05] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-700 animate-pulse" />
            <span className="text-[10px] text-neutral-800 font-medium">GCal & PWA Connected</span>
          </div>
        </div>
      </aside>

      {/* Mobile Frosted Glass Bottom Tab Bar (Classic Apple Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 apple-glass border-t border-black/[0.08] px-3 py-2 pb-safe">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onSelectTab(tab.key)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-90 ${
                  isActive ? 'text-black font-bold' : 'text-[#86868B]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                <span className="text-[10px] mt-0.5">{tab.label}</span>
              </button>
            );
          })}

          {/* Mobile Central Quick Add */}
          <button
            onClick={onOpenQuickAdd}
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md active:scale-90 transition-all -mt-3 ring-4 ring-white"
            aria-label="Quick Add Task"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Settings Tab on mobile */}
          <button
            onClick={() => onSelectTab('settings')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-90 ${
              activeTab === 'settings' ? 'text-black font-bold' : 'text-[#86868B]'
            }`}
          >
            <Settings className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] mt-0.5">Settings</span>
          </button>
        </div>
      </nav>
    </>
  );
};
