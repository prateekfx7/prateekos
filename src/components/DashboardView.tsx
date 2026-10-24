'use client';

import React, { useState } from 'react';
import {
  LifeTask,
  DSAProblem,
  ClientProject,
  OutreachLead,
  CollegeSubject,
  InterviewTopic,
  HealthMetrics,
  PillarTab,
} from '../types';
import { CustomIcon } from './CustomIcon';
import {
  Check,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Vaso } from 'vaso';

interface DashboardViewProps {
  score: number;
  tasks: LifeTask[];
  dsaProblems: DSAProblem[];
  clients: ClientProject[];
  outreachLeads: OutreachLead[];
  collegeSubjects: CollegeSubject[];
  interviewTopics: InterviewTopic[];
  health: HealthMetrics;
  onToggleTask: (id: string) => void;
  onSelectTab: (tab: PillarTab) => void;
  onOpenQuickAdd: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  score,
  tasks,
  dsaProblems,
  clients,
  outreachLeads,
  collegeSubjects,
  interviewTopics,
  health,
  onToggleTask,
  onSelectTab,
  onOpenQuickAdd,
}) => {
  const [taskFilter, setTaskFilter] = useState<'all' | 'dsa' | 'clients' | 'outreach' | 'college'>('all');
  const [chartRange, setChartRange] = useState<'7d' | '14d'>('7d');

  const dsaSolvedToday = dsaProblems.filter((p) => p.solved).length;
  const dsaTarget = 3;
  const mustTasks = tasks.filter((t) => t.priority === 'must');
  const activeClientsCount = clients.filter((c) => c.stage !== 'Completed').length;
  const completedTasksCount = tasks.filter((t) => t.done).length;

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'all') return true;
    return t.category === taskFilter;
  });

  // 14-day bar chart mock data for productivity hours (inspired by Image 1)
  const barData = [
    { day: '11', h: 4.5 },
    { day: '12', h: 6.0 },
    { day: '13', h: 5.2 },
    { day: '14', h: 7.8 },
    { day: '15', h: 9.0 },
    { day: '16', h: 8.4 },
    { day: '17', h: 7.0 },
    { day: '18', h: 6.2 },
    { day: '19', h: 5.8 },
    { day: '20', h: 8.0 },
    { day: '21', h: 7.5 },
    { day: '22', h: 6.8 },
    { day: '23', h: 8.2 },
    { day: '24', h: 9.5, isToday: true },
  ];

  const visibleBarData = chartRange === '7d' ? barData.slice(7) : barData;
  const maxH = 10.0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-sans">
      {/* 1. GREETING HERO BAR (Directly inspired by Image 3) */}
      <div className="apple-card p-6 bg-white border border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1D1D1F] tracking-tight mt-0.5">
            Hello Prateek!
          </h2>
          <p className="text-xs text-[#86868B] mt-1 font-sans">
            You've to complete <span className="font-bold text-[#1D1D1F]">{mustTasks.filter((t) => !t.done).length} priority tasks</span> today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('timeline')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/70 hover:bg-white text-xs font-bold text-[#1D1D1F] border border-white/80 border-b-black/[0.06] active:scale-95 transition-all shadow-xs"
          >
            <Clock className="w-3.5 h-3.5 text-neutral-700" />
            <span>Today's Timeline</span>
          </button>
          <Vaso depth={0.8} blur={0.4} specular={0.7} dispersion={0.15} radius={12}>
            <button
              onClick={onOpenQuickAdd}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/95 text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs border border-white/20"
            >
              <CustomIcon name="wand" className="w-3.5 h-3.5" white />
              <span>Capture Task</span>
            </button>
          </Vaso>
        </div>
      </div>

      {/* 2. BENTO ANALYTICS GRID (Directly inspired by Image 1 & 5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card A: Big Split Stat Metric (Image 1 top left) */}
        <div className="apple-card p-6 bg-white border border-black/[0.06] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#86868B] uppercase tracking-wider flex items-center gap-1.5">
                <CustomIcon name="target" className="w-4 h-4 text-neutral-800" />
                Momentum Score
              </span>
              <Vaso depth={0.6} blur={0.3} specular={0.6} radius={9999}>
                <span className="px-2.5 py-0.5 rounded-full bg-white/80 text-neutral-800 text-[10px] font-mono font-bold flex items-center gap-1 border border-white/90 border-b-black/[0.06] shadow-xs">
                  <TrendingUp className="w-3 h-3" />
                  <span>+14% 7D</span>
                </span>
              </Vaso>
            </div>

            <div className="mt-3">
              <span className="text-5xl sm:text-6xl font-serif font-bold tracking-tight text-[#1D1D1F] leading-none">
                {score.toFixed(1)}
              </span>
              <span className="text-base font-serif font-normal text-[#86868B] ml-2">/ 10.0</span>
            </div>
          </div>

          {/* Split divider at bottom (Image 1) */}
          <div className="pt-4 border-t border-black/[0.06] grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-serif font-bold text-[#1D1D1F]">246</span>
                <span className="text-[10px] text-[#86868B] font-mono uppercase">Solved</span>
              </div>
              <span className="text-xs text-[#86868B] block mt-0.5">LeetCode Python</span>
            </div>

            <div className="border-l border-black/[0.06] pl-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-serif font-bold text-[#1D1D1F]">{activeClientsCount}</span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700">
                  ↗ 12%
                </span>
              </div>
              <span className="text-xs text-[#86868B] block mt-0.5">Active Client Deals</span>
            </div>
          </div>
        </div>

        {/* Card B: Distribution Bubbles & Breakdown Table (Image 1 top right) */}
        <div className="apple-card p-6 bg-white border border-black/[0.06] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#86868B] uppercase tracking-wider flex items-center gap-1.5">
              <CustomIcon name="venn" className="w-4 h-4 text-neutral-800" />
              Energy Distribution
            </span>
            <span className="text-[11px] text-[#86868B] font-mono">This Week</span>
          </div>

          {/* 3 Circular Bubbles (Image 1) */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 py-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#18181B] text-white flex flex-col items-center justify-center shadow-sm apple-spring-in stagger-1 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shrink-0">
              <span className="text-base sm:text-lg font-serif font-bold">45%</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-mono text-neutral-300">DSA</span>
            </div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-neutral-700 text-white flex flex-col items-center justify-center shadow-sm apple-spring-in stagger-2 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shrink-0">
              <span className="text-xs sm:text-sm font-serif font-bold">30%</span>
              <span className="text-[7px] sm:text-[8px] uppercase tracking-wider font-mono text-neutral-200">Clients</span>
            </div>
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-neutral-200 text-neutral-800 flex flex-col items-center justify-center apple-spring-in stagger-3 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shrink-0">
              <span className="text-xs font-serif font-bold">25%</span>
              <span className="text-[7px] sm:text-[8px] uppercase tracking-wider font-mono">College</span>
            </div>
          </div>

          {/* Breakdown Table (Image 1) */}
          <div className="space-y-1.5 pt-2 border-t border-black/[0.06]">
            <div className="flex items-center justify-between text-xs hover:bg-neutral-50 px-2 py-1 rounded-lg transition-colors">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#18181B]" />
                <span className="font-medium text-[#1D1D1F]">DSA & Algorithms (Python 3)</span>
              </span>
              <span className="font-mono text-neutral-700 font-bold">45%</span>
            </div>
            <div className="flex items-center justify-between text-xs hover:bg-neutral-50 px-2 py-1 rounded-lg transition-colors">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-700" />
                <span className="font-medium text-[#1D1D1F]">Video Deliverables & Retainers</span>
              </span>
              <span className="font-mono text-neutral-700 font-bold">30%</span>
            </div>
            <div className="flex items-center justify-between text-xs hover:bg-neutral-50 px-2 py-1 rounded-lg transition-colors">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-300" />
                <span className="font-medium text-[#1D1D1F]">College Academics & Attendance</span>
              </span>
              <span className="font-mono text-neutral-700 font-bold">25%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE BENTO ROW: Focus Hours with 7D / 14D Toggle (Image 1 middle) */}
      <div className="apple-card p-5 sm:p-6 bg-white border border-black/[0.06] space-y-4 hover:-translate-y-0.5 transition-transform duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CustomIcon name="flame" className="w-4 h-4 text-neutral-800" />
              <h3 className="text-base font-serif font-bold text-[#1D1D1F]">Focus Hours & Streak Activity</h3>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-2 text-[#86868B]">
              <span>Avg: <strong className="text-[#1D1D1F] font-mono">7.2h</strong></span>
              <span>•</span>
              <span>Consistency: <strong className="text-[#1D1D1F] font-mono">94.5%</strong></span>
            </div>

            {/* Mobile & Desktop Range Toggle */}
            <Vaso depth={0.6} blur={0.3} specular={0.7} dispersion={0.15} radius={12}>
              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/80 border border-white/90 border-b-black/[0.08] shadow-xs">
                <button
                  onClick={() => setChartRange('7d')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    chartRange === '7d'
                      ? 'bg-black text-white shadow-xs font-bold'
                      : 'text-[#86868B] hover:text-black'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setChartRange('14d')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    chartRange === '14d'
                      ? 'bg-black text-white shadow-xs font-bold'
                      : 'text-[#86868B] hover:text-black'
                  }`}
                >
                  14 Days
                </button>
              </div>
            </Vaso>
          </div>
        </div>

        {/* Rounded Pill Bar Chart with Staggered Growth Animation */}
        <div className="pt-2">
          <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-32 px-1">
            {visibleBarData.map((b, i) => {
              const heightPct = Math.round((b.h / maxH) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none bg-black text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm z-20 whitespace-nowrap transform -translate-y-1 group-hover:translate-y-0">
                    {b.h} hrs
                  </div>

                  <div className={`w-full ${chartRange === '7d' ? 'max-w-[32px] sm:max-w-[28px]' : 'max-w-[20px]'} bg-neutral-100 rounded-full h-full flex items-end overflow-hidden p-0.5 cursor-pointer`}>
                    <div
                      className={`w-full rounded-full apple-bar-grow transition-all duration-300 relative overflow-hidden ${
                        b.isToday
                          ? 'bg-black shadow-sm ring-2 ring-black/20 group-hover:bg-neutral-800 apple-liquid-shimmer'
                          : 'bg-neutral-800 group-hover:bg-black'
                      }`}
                      style={{
                        height: `${heightPct}%`,
                        animationDelay: `${i * 35}ms`,
                      }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-mono transition-colors ${
                      b.isToday ? 'font-bold text-black' : 'text-[#86868B] group-hover:text-black'
                    }`}
                  >
                    {b.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. LOWER BENTO ROW: Solid Focus Sprint Card + Mini Metric Cards (Image 1 & 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* Solid Accent Card: Today's Focus Sprint (Image 1 bottom right & Image 3 blue card) */}
        <div className="md:col-span-2 apple-card p-6 bg-[#18181B] text-white rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                Today's Focus Sprint
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-white/10 px-2.5 py-1 rounded-md text-white">
              {mustTasks.filter((t) => !t.done).length} Tasks Left
            </span>
          </div>

          <div className="space-y-2">
            {mustTasks.length === 0 ? (
              <p className="text-xs text-neutral-400">All must-do focus tasks completed for today!</p>
            ) : (
              mustTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    onToggleTask(task.id);
                    if (!task.done) confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-[0.98] cursor-pointer transition-all duration-150 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-150 ${
                        task.done
                          ? 'bg-white border-white text-black apple-check-pop'
                          : 'border-white/40 bg-transparent group-hover:border-white/70'
                      }`}
                    >
                      {task.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </button>
                    <span
                      className={`text-xs font-medium truncate transition-all duration-200 ${
                        task.done ? 'line-through text-neutral-500 opacity-60' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-2 group-hover:translate-x-1 group-hover:text-white transition-all duration-150" />
                </div>
              ))
            )}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-neutral-400 border-t border-white/10">
            <span>Universal Priority Calibration</span>
            <button
              onClick={() => onSelectTab('timeline')}
              className="text-white font-bold hover:underline flex items-center gap-1 group"
            >
              <span>View Full Day Timeline</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Mini Metric Cards Stack (Image 1 bottom) */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="apple-card p-5 bg-white border border-black/[0.06] flex flex-col justify-between space-y-2 hover:-translate-y-0.5 transition-all duration-200">
            <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">
              Routine Discipline
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-serif font-bold text-[#1D1D1F]">4.9</span>
              <span className="text-xs font-mono text-neutral-600">/ 5.0</span>
            </div>
            <p className="text-[11px] text-[#86868B]">Hydration & Morning Anchor logged</p>
          </div>

          <div className="apple-card p-5 bg-white border border-black/[0.06] flex flex-col justify-between space-y-2 hover:-translate-y-0.5 transition-all duration-200">
            <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">
              Attendance Safe Margin
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-serif font-bold text-[#1D1D1F]">86%</span>
              <span className="text-xs font-mono font-bold text-neutral-800 bg-neutral-100 px-1.5 py-0.5 rounded">
                Safe
              </span>
            </div>
            <p className="text-[11px] text-[#86868B]">Comfortably above 75% college rule</p>
          </div>
        </div>
      </div>

      {/* 5. 6 LIFE & CAREER PILLARS (Chunky Interactive Cards) */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif font-bold text-[#1D1D1F] px-0.5">
            Life & Career Pillars
          </h3>
          <span className="text-xs text-[#86868B] font-mono">6 Pillars Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Pillar 1: DSA */}
          <div
            onClick={() => onSelectTab('dsa')}
            className="apple-card p-5 bg-white border border-black/[0.06] hover:border-black/20 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group apple-spring-in stagger-1"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <CustomIcon name="target" className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
                {dsaSolvedToday}/{dsaTarget} Done
              </span>
            </div>
            <div>
              <h4 className="text-base font-serif font-bold text-[#1D1D1F] group-hover:text-black transition-colors">
                DSA & LeetCode (Python)
              </h4>
              <p className="text-xs text-[#86868B] mt-0.5 line-clamp-2">
                Daily blind 75 problem solving with clean Python 3 complexity analysis.
              </p>
            </div>
          </div>

          {/* Pillar 2: Clients */}
          <div
            onClick={() => onSelectTab('clients')}
            className="apple-card p-5 bg-white border border-black/[0.06] hover:border-black/20 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group apple-spring-in stagger-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <CustomIcon name="briefcase" className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
                {clients.length} Active Deals
              </span>
            </div>
            <div>
              <h4 className="text-base font-serif font-bold text-[#1D1D1F] group-hover:text-black transition-colors">
                Video Editing Clients
              </h4>
              <p className="text-xs text-[#86868B] mt-0.5 line-clamp-2">
                Manage timeline cuts, revisions, color grading & review links.
              </p>
            </div>
          </div>

          {/* Pillar 3: Outreach */}
          <div
            onClick={() => onSelectTab('outreach')}
            className="apple-card p-5 bg-white border border-black/[0.06] hover:border-black/20 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group apple-spring-in stagger-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <CustomIcon name="network" className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
                {outreachLeads.length} Leads
              </span>
            </div>
            <div>
              <h4 className="text-base font-serif font-bold text-[#1D1D1F] group-hover:text-black transition-colors">
                High-Ticket Outreach CRM
              </h4>
              <p className="text-xs text-[#86868B] mt-0.5 line-clamp-2">
                1-Click copy DM & cold email scripts to close founder retainers.
              </p>
            </div>
          </div>

          {/* Pillar 4: College */}
          <div
            onClick={() => onSelectTab('college')}
            className="apple-card p-5 bg-white border border-black/[0.06] hover:border-black/20 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group apple-spring-in stagger-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <CustomIcon name="easel" className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
                {collegeSubjects.length} Subjects
              </span>
            </div>
            <div>
              <h4 className="text-base font-serif font-bold text-[#1D1D1F] group-hover:text-black transition-colors">
                College Academics
              </h4>
              <p className="text-xs text-[#86868B] mt-0.5 line-clamp-2">
                75% attendance safeguard, assignments, and semester syllabus tracker.
              </p>
            </div>
          </div>

          {/* Pillar 5: Interview */}
          <div
            onClick={() => onSelectTab('interview')}
            className="apple-card p-5 bg-white border border-black/[0.06] hover:border-black/20 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group apple-spring-in stagger-5"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <CustomIcon name="venn" className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
                {interviewTopics.filter((t) => t.mastered).length}/{interviewTopics.length} Mastered
              </span>
            </div>
            <div>
              <h4 className="text-base font-serif font-bold text-[#1D1D1F] group-hover:text-black transition-colors">
                Interview Prep (Core CS)
              </h4>
              <p className="text-xs text-[#86868B] mt-0.5 line-clamp-2">
                Operating Systems, DBMS, Networks, and High-Level System Architecture.
              </p>
            </div>
          </div>

          {/* Pillar 6: Health */}
          <div
            onClick={() => onSelectTab('health')}
            className="apple-card p-5 bg-white border border-black/[0.06] hover:border-black/20 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group apple-spring-in stagger-6"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <CustomIcon name="water" className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
                {health.waterGlasses}/8 Cups
              </span>
            </div>
            <div>
              <h4 className="text-base font-serif font-bold text-[#1D1D1F] group-hover:text-black transition-colors">
                Daily Health & Routines
              </h4>
              <p className="text-xs text-[#86868B] mt-0.5 line-clamp-2">
                Hydration, physical workouts, and anchor morning/night rituals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
