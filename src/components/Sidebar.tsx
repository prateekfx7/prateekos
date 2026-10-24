'use client';

import React, { useState } from 'react';
import { PillarTab } from '../types';
import { CustomIcon, CustomIconName } from './CustomIcon';
import { Plus, X, ChevronRight, Layers } from 'lucide-react';
import { Vaso } from 'vaso';

import { User } from '@supabase/supabase-js';

interface SidebarProps {
  activeTab: PillarTab;
  onSelectTab: (tab: PillarTab) => void;
  onOpenQuickAdd: () => void;
  onOpenAIPrompt?: () => void;
  currentUser?: User | null;
  onOpenAuth?: () => void;
  dailyScore: number;
  badges: {
    dsaPending: number;
    collegePending: number;
    interviewPending: number;
    clientsActive: number;
    outreachLeads: number;
    mustTasksPending: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenQuickAdd,
  onOpenAIPrompt,
  currentUser,
  onOpenAuth,
  dailyScore,
  badges,
}) => {
  const [showMoreSheet, setShowMoreSheet] = useState(false);

  const menuItems: {
    tab: PillarTab;
    label: string;
    description: string;
    iconName: CustomIconName;
    badge: string | null;
    badgeColor: string;
  }[] = [
    {
      tab: 'dashboard',
      label: 'Dashboard Overview',
      description: 'Momentum score, analytics & daily targets',
      iconName: 'home',
      badge: badges.mustTasksPending > 0 ? `${badges.mustTasksPending} priority` : null,
      badgeColor: 'bg-neutral-900 text-white',
    },
    {
      tab: 'timeline',
      label: "Today's Timeline",
      description: 'Connected chronological focus blocks',
      iconName: 'cards',
      badge: 'Live',
      badgeColor: 'bg-neutral-900 text-white',
    },
    {
      tab: 'calendar',
      label: 'Weekly Calendar',
      description: 'Tasky 7-day time-blocking grid',
      iconName: 'easel',
      badge: 'Tasky Grid',
      badgeColor: 'bg-neutral-100 text-neutral-700',
    },
    {
      tab: 'dsa',
      label: 'DSA & LeetCode (Python)',
      description: 'Blind 75 & Python 3 problem analysis',
      iconName: 'target',
      badge: badges.dsaPending > 0 ? `${badges.dsaPending} due` : 'Done',
      badgeColor: badges.dsaPending > 0 ? 'bg-neutral-200 text-neutral-800' : 'bg-neutral-100 text-neutral-600',
    },
    {
      tab: 'clients',
      label: 'Video Clients & Projects',
      description: 'Timeline cuts, review links & stages',
      iconName: 'briefcase',
      badge: `${badges.clientsActive} active`,
      badgeColor: 'bg-neutral-100 text-neutral-700',
    },
    {
      tab: 'outreach',
      label: 'High-Ticket Outreach',
      description: 'Cold DMs, email CRM & client retainers',
      iconName: 'network',
      badge: `${badges.outreachLeads} leads`,
      badgeColor: 'bg-neutral-100 text-neutral-700',
    },
    {
      tab: 'college',
      label: 'College & Subjects',
      description: '75% attendance safeguard & coursework',
      iconName: 'easel',
      badge: badges.collegePending > 0 ? `${badges.collegePending} tasks` : null,
      badgeColor: 'bg-neutral-100 text-neutral-700',
    },
    {
      tab: 'interview',
      label: 'Interview Prep & CS',
      description: 'OS, DBMS, Networks & Core Architecture',
      iconName: 'venn',
      badge: badges.interviewPending > 0 ? `${badges.interviewPending} left` : null,
      badgeColor: 'bg-neutral-100 text-neutral-700',
    },
    {
      tab: 'health',
      label: 'Daily Routines & Health',
      description: 'Hydration, gym workout & anchor rituals',
      iconName: 'water',
      badge: 'Daily',
      badgeColor: 'bg-neutral-100 text-neutral-700',
    },
  ];

  // Primary tabs for mobile bottom navigation bar
  const isPrimaryTab = activeTab === 'dashboard' || activeTab === 'timeline' || activeTab === 'calendar';
  const otherPillarsCount =
    (badges.dsaPending > 0 ? 1 : 0) +
    (badges.collegePending > 0 ? 1 : 0) +
    (badges.interviewPending > 0 ? 1 : 0) +
    (badges.clientsActive > 0 ? 1 : 0);

  return (
    <>
      {/* Desktop Sidebar (lg: and above) */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-black/[0.06] bg-[#FAF8F5]/85 backdrop-blur-2xl p-5 shrink-0 min-h-screen justify-between fixed top-0 bottom-0 left-0 z-30 overflow-y-auto">
        <div className="space-y-6">
          {/* App Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => onSelectTab('dashboard')}>
              <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center p-1.5 shadow-xs group-hover:scale-105 active:scale-95 transition-all duration-150 border border-white/20">
                <CustomIcon name="cool_cat" className="w-5 h-5" white />
              </div>
              <div>
                <h1 className="text-lg font-serif font-bold text-[#1D1D1F] tracking-tight leading-none group-hover:text-black transition-colors">Prateek</h1>
                <p className="text-[10px] text-[#86868B] font-semibold tracking-wider uppercase font-sans mt-0.5">Life & Career OS</p>
              </div>
            </div>

            <Vaso depth={0.8} blur={0.4} specular={0.7} dispersion={0.15} radius={9999}>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/75 text-neutral-900 border border-white/90 border-b-black/[0.08] text-xs font-mono font-bold hover:scale-105 transition-transform shadow-xs">
                <span className="font-serif text-sm">{dailyScore.toFixed(1)}</span>
                <span className="text-[10px] text-neutral-400 font-normal font-sans">/10</span>
              </div>
            </Vaso>
          </div>

          {/* AI Intake & Quick Add Buttons */}
          <div className="space-y-1.5">
            <button
              onClick={onOpenAIPrompt || onOpenQuickAdd}
              className="w-full py-2.5 px-3.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 flex items-center justify-between shadow-xs active:scale-[0.97] transition-all duration-150 font-sans border border-white/20"
            >
              <div className="flex items-center gap-2">
                <CustomIcon name="wand" className="w-4 h-4" white />
                <span>AI Brain Dump</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-[10px]">
                CMD+K
              </span>
            </button>

            <button
              onClick={onOpenQuickAdd}
              className="w-full py-2 px-3.5 rounded-xl bg-white/70 hover:bg-white text-[#1D1D1F] border border-white/90 border-b-black/[0.08] shadow-xs text-xs font-medium flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all duration-150 font-sans"
            >
              <span>+ Quick Single Task (N)</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider px-3 mb-2 font-sans">
              Workspaces
            </div>
            {menuItems.map((item) => {
              const isActive = activeTab === item.tab;

              return (
                <button
                  key={item.tab}
                  onClick={() => onSelectTab(item.tab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 font-sans group active:scale-[0.98] ${
                    isActive
                      ? 'bg-white/95 text-black shadow-xs font-semibold border border-white/90 border-b-black/[0.08] translate-x-1'
                      : 'text-neutral-600 hover:text-black hover:bg-black/[0.03] hover:translate-x-0.5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="transition-transform duration-150 group-hover:scale-110">
                      <CustomIcon name={item.iconName} className="w-4 h-4 shrink-0" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md shrink-0 transition-transform group-hover:scale-105 ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status & Cloud Sync Card */}
        <div className="pt-3 border-t border-black/[0.06] space-y-2">
          {/* Cloud Sync Status Button */}
          <button
            onClick={onOpenAuth}
            className="w-full p-2.5 rounded-xl bg-white/70 hover:bg-white border border-white/90 border-b-black/[0.08] flex items-center justify-between text-left transition-all active:scale-[0.98] shadow-xs group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-serif shrink-0 border border-white/20 ${
                  currentUser ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                {currentUser?.email ? currentUser.email[0].toUpperCase() : '⚡'}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#1D1D1F] block truncate">
                  {currentUser ? currentUser.email : 'Multi-Device Sync'}
                </span>
                <span className="text-[10px] text-neutral-500 block truncate font-mono">
                  {currentUser ? '🟢 Live Realtime' : 'iPhone • iPad • PC'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-neutral-700 px-2 py-0.5 rounded-md bg-neutral-100 group-hover:bg-neutral-200 shrink-0">
              {currentUser ? 'Sync' : 'Log In'}
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Minimal Bar (< lg) */}
      <header className="lg:hidden sticky top-0 z-30 apple-liquid-glass px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
          <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center p-1 shadow-xs border border-white/20">
            <CustomIcon name="cool_cat" className="w-4 h-4" white />
          </div>
          <div>
            <h1 className="text-base font-serif font-bold text-[#1D1D1F] leading-none">Prateek's OS</h1>
            <span className="text-[10px] text-[#86868B] font-mono">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Vaso depth={0.8} blur={0.4} specular={0.7} dispersion={0.15} radius={9999}>
            <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-white/75 text-neutral-900 border border-white/90 border-b-black/[0.08] shadow-xs block">
              {dailyScore.toFixed(1)}/10
            </span>
          </Vaso>

          {/* Cloud Sync & Login Button for Mobile */}
          <button
            onClick={onOpenAuth}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-serif active:scale-95 transition-all border border-white/90 border-b-black/[0.08] shadow-xs ${
              currentUser ? 'bg-black text-white' : 'bg-white/80 hover:bg-white text-neutral-700'
            }`}
            title={currentUser ? `Logged in as ${currentUser.email}` : 'Log In to sync across devices'}
          >
            {currentUser?.email ? currentUser.email[0].toUpperCase() : '⚡'}
          </button>

          <button
            onClick={() => setShowMoreSheet(true)}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-neutral-700 active:scale-95 transition-all border border-white/90 border-b-black/[0.08] shadow-xs"
            title="All Workspaces"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Floating Action Pill (Bottom Center, elevated cleanly above the liquid dock) */}
      <div className="lg:hidden fixed bottom-21 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-3 duration-200">
        <Vaso depth={1.2} blur={0.6} specular={0.8} dispersion={0.2} radius={9999} className="rounded-full shadow-2xl">
          <div className="flex items-center gap-1.5 p-1.5 rounded-full apple-liquid-pill">
            <button
              onClick={onOpenAIPrompt || onOpenQuickAdd}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/95 text-white text-xs font-semibold active:scale-95 transition-all shadow-xs border border-white/20"
            >
              <CustomIcon name="wand" className="w-3.5 h-3.5" white />
              <span>AI Brain Dump</span>
            </button>

            <button
              onClick={onOpenQuickAdd}
              className="flex items-center gap-1 px-3 py-2 rounded-full bg-white/80 hover:bg-white text-[#1D1D1F] border border-white/90 border-b-black/[0.08] text-xs font-semibold active:scale-95 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Task</span>
            </button>
          </div>
        </Vaso>
      </div>

      {/* iOS Floating Liquid Glass Bottom Dock (< lg) */}
      <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-30 max-w-md mx-auto">
        <Vaso depth={1.5} blur={0.8} specular={0.9} dispersion={0.25} radius={28} className="w-full rounded-3xl shadow-2xl">
          <div className="apple-liquid-dock rounded-3xl p-1.5 shadow-xl">
            <div className="grid grid-cols-4 gap-1 items-center">
              {/* Tab 1: Dashboard */}
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 active:scale-95 ${
                  activeTab === 'dashboard'
                    ? 'apple-tab-active font-semibold'
                    : 'text-[#86868B] hover:text-black hover:bg-white/40'
                }`}
              >
                <CustomIcon name="home" className="w-4 h-4" white={activeTab === 'dashboard'} />
                <span className="text-[10px] mt-0.5 font-medium tracking-tight">Overview</span>
              </button>

              {/* Tab 2: Timeline */}
              <button
                onClick={() => onSelectTab('timeline')}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 active:scale-95 ${
                  activeTab === 'timeline'
                    ? 'apple-tab-active font-semibold'
                    : 'text-[#86868B] hover:text-black hover:bg-white/40'
                }`}
              >
                <CustomIcon name="cards" className="w-4 h-4" white={activeTab === 'timeline'} />
                <span className="text-[10px] mt-0.5 font-medium tracking-tight">Timeline</span>
              </button>

              {/* Tab 3: Calendar */}
              <button
                onClick={() => onSelectTab('calendar')}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 active:scale-95 ${
                  activeTab === 'calendar'
                    ? 'apple-tab-active font-semibold'
                    : 'text-[#86868B] hover:text-black hover:bg-white/40'
                }`}
              >
                <CustomIcon name="easel" className="w-4 h-4" white={activeTab === 'calendar'} />
                <span className="text-[10px] mt-0.5 font-medium tracking-tight">Calendar</span>
              </button>

              {/* Tab 4: More Pillars Drawer */}
              <button
                onClick={() => setShowMoreSheet(true)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 active:scale-95 ${
                  !isPrimaryTab
                    ? 'apple-tab-active font-semibold'
                    : 'text-[#86868B] hover:text-black hover:bg-white/40'
                }`}
              >
                <CustomIcon name="venn" className="w-4 h-4" white={!isPrimaryTab} />
                <span className="text-[10px] mt-0.5 font-medium tracking-tight">
                  {!isPrimaryTab ? activeTab.slice(0, 5).toUpperCase() : 'More'}
                </span>
                {otherPillarsCount > 0 && isPrimaryTab && (
                  <span className="absolute top-1.5 right-4 w-1.5 h-1.5 rounded-full bg-neutral-900" />
                )}
              </button>
            </div>
          </div>
        </Vaso>
      </nav>

      {/* "More Workspaces" iOS Slide-Up Bottom Sheet */}
      {showMoreSheet && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center apple-fade-in lg:hidden">
          <div className="w-full apple-liquid-sheet rounded-t-3xl border-t border-white/85 p-5 pb-8 shadow-2xl apple-sheet-spring space-y-4 max-h-[82vh] overflow-y-auto">
            {/* Grab Handle */}
            <div className="w-10 h-1 rounded-full bg-black/20 mx-auto" />

            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1D1D1F]">All Workspaces</h3>
                <p className="text-xs text-[#86868B]">Select any of your 9 life & career pillars</p>
              </div>

              <button
                onClick={() => setShowMoreSheet(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 active:scale-90 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {menuItems.map((item) => {
                const isActive = activeTab === item.tab;

                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      onSelectTab(item.tab);
                      setShowMoreSheet(false);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left border transition-all active:scale-98 ${
                      isActive
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'bg-white border-black/[0.06] hover:border-black/20 text-[#1D1D1F]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/15' : 'bg-neutral-100'}`}>
                        <CustomIcon name={item.iconName} className="w-4 h-4" white={isActive} />
                      </div>
                      <div className="min-w-0">
                        <span className={`text-xs font-bold block truncate ${isActive ? 'text-white' : 'text-[#1D1D1F]'}`}>
                          {item.label}
                        </span>
                        <span className={`text-[10px] block truncate ${isActive ? 'text-neutral-300' : 'text-[#86868B]'}`}>
                          {item.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {item.badge && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-neutral-300' : 'text-neutral-400'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
