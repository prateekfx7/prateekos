'use client';

import React, { useState } from 'react';
import { TimeBlockEvent } from '../types';
import { CustomIcon, CustomIconName } from './CustomIcon';
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WeeklyCalendarViewProps {
  events: TimeBlockEvent[];
  onAddEvent: (event: Omit<TimeBlockEvent, 'id'>) => void;
}

export const WeeklyCalendarView: React.FC<WeeklyCalendarViewProps> = ({
  events,
  onAddEvent,
}) => {
  const [activePopover, setActivePopover] = useState<{ dayIndex: number; hour: number } | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TimeBlockEvent['category']>('dsa');
  const [duration, setDuration] = useState(2);
  const [tag, setTag] = useState('Study');
  const [selectedDayIndex, setSelectedDayIndex] = useState(4); // Default to Friday

  const days = [
    { name: 'Mon', date: 20 },
    { name: 'Tue', date: 21 },
    { name: 'Wed', date: 22 },
    { name: 'Thu', date: 23 },
    { name: 'Fri', date: 24 },
    { name: 'Sat', date: 25 },
    { name: 'Sun', date: 26 },
  ];

  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  const formatHour = (h: number) => {
    if (h === 12) return '12 pm';
    return h > 12 ? `${h - 12} pm` : `${h} am`;
  };

  const categoryStyles: Record<
    TimeBlockEvent['category'],
    { bg: string; text: string; border: string; icon: CustomIconName }
  > = {
    dsa: { bg: 'bg-[#18181B] text-white', text: 'text-white', border: 'border-black', icon: 'target' },
    clients: { bg: 'bg-neutral-800 text-white', text: 'text-white', border: 'border-neutral-700', icon: 'briefcase' },
    outreach: { bg: 'bg-neutral-700 text-white', text: 'text-white', border: 'border-neutral-600', icon: 'network' },
    college: { bg: 'bg-[#FAF9F5] text-[#1D1D1F]', text: 'text-neutral-700', border: 'border-black/[0.08]', icon: 'easel' },
    interview: { bg: 'bg-[#F4F2EB] text-[#1D1D1F]', text: 'text-neutral-700', border: 'border-black/[0.08]', icon: 'venn' },
    health: { bg: 'bg-neutral-100 text-[#1D1D1F]', text: 'text-neutral-700', border: 'border-black/[0.08]', icon: 'water' },
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !activePopover) return;
    onAddEvent({
      dayIndex: activePopover.dayIndex,
      startHour: activePopover.hour,
      durationHours: duration,
      title: title.trim(),
      category,
      tag: tag.trim() || 'Focus',
    });
    setTitle('');
    setActivePopover(null);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="apple-card p-6 bg-white border border-black/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center font-bold">
              <CalendarIcon className="w-5 h-5 text-neutral-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1D1D1F]">
                  Weekly Time-Blocking Calendar
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-semibold">
                  Tasky Grid View
                </span>
              </div>
              <p className="text-xs text-[#86868B] mt-0.5">
                Protect deep work hours for DSA, client edits, lectures and outreach sprints
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#FAF9F5] border border-black/[0.06] rounded-xl px-2 py-1">
              <button className="p-1 hover:bg-neutral-200 rounded-lg text-neutral-600">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-serif font-bold px-2 text-[#1D1D1F]">
                October 2026
              </span>
              <button className="p-1 hover:bg-neutral-200 rounded-lg text-neutral-600">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setActivePopover({ dayIndex: 0, hour: 10 })}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Block Time</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Summary Panel + Center Weekly Time Grid (Image 4 exact layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Summary Card & Stacked Metric Pills (Image 4) */}
        <div className="space-y-4 lg:col-span-1">
          {/* "This week" Summary Card (Image 4) */}
          <div className="apple-card p-5 bg-[#FAF9F5] border border-black/[0.06] space-y-3">
            <h3 className="text-lg font-serif font-bold text-[#1D1D1F]">This week</h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              You have <span className="font-bold text-[#1D1D1F]">{events.length} time-blocked sessions</span> committed across your 6 pillars.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[10px] font-semibold">
                DSA
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[10px] font-semibold">
                Clients
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[10px] font-semibold">
                College
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[10px] font-semibold">
                Health
              </span>
            </div>
          </div>

          {/* Stacked Metric Counter Pills (Image 4 left column) */}
          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-between shadow-xs apple-spring-in stagger-1 hover:-translate-y-0.5 hover:shadow-sm active:scale-98 transition-all duration-150 cursor-default">
              <span className="text-2xl font-serif font-bold text-[#1D1D1F]">246</span>
              <div className="text-right">
                <span className="text-xs font-bold text-[#1D1D1F]">LeetCode Solved</span>
                <span className="block text-[10px] text-[#86868B]">Python 3 Target</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-between shadow-xs apple-spring-in stagger-2 hover:-translate-y-0.5 hover:shadow-sm active:scale-98 transition-all duration-150 cursor-default">
              <span className="text-2xl font-serif font-bold text-[#1D1D1F]">100%</span>
              <div className="text-right">
                <span className="text-xs font-bold text-[#1D1D1F]">Attendance Safe</span>
                <span className="block text-[10px] text-[#86868B]">Above 75% Criteria</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-between shadow-xs apple-spring-in stagger-3 hover:-translate-y-0.5 hover:shadow-sm active:scale-98 transition-all duration-150 cursor-default">
              <span className="text-2xl font-serif font-bold text-[#1D1D1F]">14</span>
              <div className="text-right">
                <span className="text-xs font-bold text-[#1D1D1F]">Days Running</span>
                <span className="block text-[10px] text-[#86868B]">Active Streak</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-between shadow-xs apple-spring-in stagger-4 hover:-translate-y-0.5 hover:shadow-sm active:scale-98 transition-all duration-150 cursor-default">
              <span className="text-2xl font-serif font-bold text-[#1D1D1F]">8</span>
              <div className="text-right">
                <span className="text-xs font-bold text-[#1D1D1F]">Client Retainers</span>
                <span className="block text-[10px] text-[#86868B]">Active Pipeline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right Column: Day-Focused on Mobile, 7-Day Grid on Tablet/Desktop */}
        <div className="lg:col-span-3 space-y-4">
          {/* A. MOBILE DAY-BY-DAY FOCUSED VIEW (< md screens) */}
          <div className="block md:hidden apple-card p-4 bg-white border border-black/[0.06] space-y-4">
            {/* Horizontal Day Picker Strip */}
            <div className="grid grid-cols-7 gap-1 pb-3 border-b border-black/[0.06]">
              {days.map((d, i) => {
                const isSelected = selectedDayIndex === i;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDayIndex(i)}
                    className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center active:scale-95 transition-all ${
                      isSelected
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-[#FAF9F5] text-neutral-600 hover:bg-[#F3EFE6]'
                    }`}
                  >
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-neutral-300' : 'text-[#86868B]'}`}>
                      {d.name}
                    </span>
                    <span className="text-sm font-bold font-mono mt-0.5">{d.date}</span>
                    {isSelected && <span className="w-1 h-1 rounded-full bg-white mt-1" />}
                  </button>
                );
              })}
            </div>

            {/* Selected Day Header */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <h4 className="text-base font-serif font-bold text-[#1D1D1F]">
                  {days[selectedDayIndex].name}, Oct {days[selectedDayIndex].date}
                </h4>
                <p className="text-[11px] text-[#86868B]">
                  {events.filter((e) => e.dayIndex === selectedDayIndex).length} time blocks scheduled
                </p>
              </div>

              <button
                onClick={() => setActivePopover({ dayIndex: selectedDayIndex, hour: 10 })}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-black text-white text-xs font-bold active:scale-95 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Block</span>
              </button>
            </div>

            {/* Chronological Hourly Slots for Selected Day */}
            <div className="space-y-2 pt-1">
              {hours.map((hour) => {
                const eventAtSlot = events.find(
                  (e) => e.dayIndex === selectedDayIndex && e.startHour === hour
                );

                return (
                  <div key={hour} className="flex items-start gap-3 py-1 border-b border-black/[0.04] last:border-0">
                    <span className="text-xs font-mono text-[#86868B] w-14 shrink-0 pt-1 text-right">
                      {formatHour(hour)}
                    </span>

                    <div className="flex-1 min-w-0">
                      {eventAtSlot ? (
                        <div
                          className={`p-3 rounded-2xl ${categoryStyles[eventAtSlot.category].bg} border ${categoryStyles[eventAtSlot.category].border} shadow-xs space-y-1 active:scale-[0.99] transition-all`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <CustomIcon
                                name={categoryStyles[eventAtSlot.category].icon}
                                className="w-3.5 h-3.5 shrink-0"
                                white={eventAtSlot.category === 'dsa' || eventAtSlot.category === 'clients' || eventAtSlot.category === 'outreach'}
                              />
                              <h5 className="text-xs font-bold truncate">{eventAtSlot.title}</h5>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/20 shrink-0">
                              {eventAtSlot.durationHours}h
                            </span>
                          </div>
                          <span className="text-[10px] font-mono uppercase tracking-wider block opacity-75">
                            {eventAtSlot.tag} • {eventAtSlot.category.toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActivePopover({ dayIndex: selectedDayIndex, hour })}
                          className="w-full py-2.5 px-3 rounded-xl border border-dashed border-black/[0.1] hover:border-black/30 hover:bg-[#FAF9F5] text-[11px] text-[#86868B] text-left transition-all active:scale-[0.99] flex items-center justify-between"
                        >
                          <span>Open slot</span>
                          <Plus className="w-3 h-3 text-neutral-400" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. DESKTOP 7-DAY TASKY GRID (md: and above screens) */}
          <div className="hidden md:block apple-card p-4 sm:p-5 bg-white border border-black/[0.06] overflow-x-auto">
            {/* Day Headers */}
            <div className="grid grid-cols-8 gap-2 pb-3 border-b border-black/[0.06] min-w-[640px]">
              <div className="text-right pr-2 text-[11px] font-mono text-[#86868B]">Time</div>
              {days.map((d, i) => (
                <div key={i} className="text-center group">
                  <span className="text-base font-bold font-mono text-[#1D1D1F] block group-hover:scale-105 transition-transform">{d.date}</span>
                  <span className="text-[11px] text-[#86868B] uppercase tracking-wider">{d.name}</span>
                </div>
              ))}
            </div>

            {/* Hourly Slots & Placed Blocks */}
            <div className="relative mt-2 space-y-1 min-w-[640px]">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-8 gap-2 items-center min-h-[52px] border-b border-black/[0.03]">
                  {/* Time Label */}
                  <div className="text-right pr-2 text-[11px] font-mono text-[#86868B]">
                    {formatHour(hour)}
                  </div>

                  {/* 7 Days Columns */}
                  {days.map((_, dayIdx) => {
                    const eventAtSlot = events.find((e) => e.dayIndex === dayIdx && e.startHour === hour);

                    return (
                      <div
                        key={dayIdx}
                        onClick={() => !eventAtSlot && setActivePopover({ dayIndex: dayIdx, hour })}
                        className={`relative h-full rounded-xl p-1.5 transition-all duration-150 cursor-pointer ${
                          eventAtSlot
                            ? `${categoryStyles[eventAtSlot.category].bg} shadow-xs border ${categoryStyles[eventAtSlot.category].border} hover:scale-[1.03] active:scale-[0.98]`
                            : 'hover:bg-[#FAF9F5] border border-transparent'
                        }`}
                      >
                        {eventAtSlot ? (
                          <div className="h-full flex flex-col justify-between text-left">
                            <div>
                              <div className="flex items-center gap-1">
                                <CustomIcon
                                  name={categoryStyles[eventAtSlot.category].icon}
                                  className="w-3 h-3"
                                  white={eventAtSlot.category === 'dsa' || eventAtSlot.category === 'clients' || eventAtSlot.category === 'outreach'}
                                />
                                <span className="text-[10px] font-bold truncate">
                                  {eventAtSlot.title}
                                </span>
                              </div>
                            </div>
                            <span className={`text-[9px] uppercase font-mono tracking-wider opacity-80`}>
                              {eventAtSlot.tag} • {eventAtSlot.durationHours}h
                            </span>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 text-neutral-300 transition-opacity">
                            <Plus className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popover / Modal to add Time-Block Event */}
      {activePopover && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 apple-fade-in">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-sm apple-liquid-glass rounded-t-3xl sm:rounded-3xl border border-white/75 p-5 space-y-3.5 shadow-2xl apple-sheet-spring sm:apple-modal-spring max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
              <div className="flex items-center gap-2">
                <CustomIcon name="easel" className="w-4 h-4 text-neutral-800" />
                <h4 className="text-sm font-serif font-bold text-[#1D1D1F]">
                  Block Time: {days[activePopover.dayIndex].name} at {formatHour(activePopover.hour)}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActivePopover(null)}
                className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                Event Title
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Kick-off: Branding / DSA Tree BFS"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                  Pillar
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TimeBlockEvent['category'])}
                  className="w-full bg-[#FAF9F5] border border-black/[0.08] rounded-xl px-2 py-1.5 text-xs text-[#1D1D1F]"
                >
                  <option value="dsa">DSA & LeetCode</option>
                  <option value="clients">Video Clients</option>
                  <option value="outreach">Outreach CRM</option>
                  <option value="college">College Subjects</option>
                  <option value="interview">Interview Prep</option>
                  <option value="health">Daily Health</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                  Duration (Hours)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full bg-[#FAF9F5] border border-black/[0.08] rounded-xl px-2 py-1.5 text-xs text-[#1D1D1F]"
                >
                  <option value={1}>1 Hour</option>
                  <option value={2}>2 Hours</option>
                  <option value={3}>3 Hours</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                Tag Label
              </label>
              <input
                type="text"
                placeholder="e.g. Study, Work, College, Health"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs text-[#1D1D1F]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={() => setActivePopover(null)}
                className="px-3 py-1.5 text-xs text-[#86868B] hover:text-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800"
              >
                Add Time Block
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
