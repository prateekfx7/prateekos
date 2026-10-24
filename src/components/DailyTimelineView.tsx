'use client';

import React, { useState, useMemo } from 'react';
import { ScheduleBlock } from '../types';
import { CustomIcon, CustomIconName } from './CustomIcon';
import { googleCalendarService } from '../lib/googleCalendar';
import { Check, Plus, Clock, Sparkles, Calendar, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyTimelineViewProps {
  blocks: ScheduleBlock[];
  onToggleBlock: (id: string) => void;
  onAddBlock: (block: Omit<ScheduleBlock, 'id'>) => void;
  onOpenGoogleCalendar?: () => void;
}

export const DailyTimelineView: React.FC<DailyTimelineViewProps> = ({
  blocks,
  onToggleBlock,
  onAddBlock,
  onOpenGoogleCalendar,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => (new Date().getDay() + 6) % 7);
  const [isAdding, setIsAdding] = useState(false);
  const [time, setTime] = useState('03:00 PM');
  const [endTime, setEndTime] = useState('04:30 PM');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ScheduleBlock['category']>('dsa');

  // Real Dynamic Current Week Dates (Zero Mock Data)
  const days = useMemo(() => {
    const today = new Date();
    const currentDayOfWeek = (today.getDay() + 6) % 7; // 0 for Mon, 6 for Sun
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDayOfWeek);

    const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return names.map((name, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      return {
        name,
        num: d.getDate(),
        isToday: idx === currentDayOfWeek,
        dateStr: d.toISOString().split('T')[0],
      };
    });
  }, []);

  const categoryIconMap: Record<ScheduleBlock['category'], CustomIconName> = {
    dsa: 'target',
    clients: 'briefcase',
    outreach: 'network',
    college: 'easel',
    interview: 'venn',
    health: 'water',
    general: 'wand',
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddBlock({
      time,
      endTime: endTime.trim() || undefined,
      title: title.trim(),
      description: description.trim() || 'Daily schedule focus block',
      category,
      done: false,
    });
    setTitle('');
    setDescription('');
    setIsAdding(false);
  };

  const completedCount = blocks.filter((b) => b.done).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-sans">
      {/* Top Header & Day Picker Strip */}
      <div className="apple-card p-6 bg-white border border-black/[0.06] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1D1D1F] tracking-tight mt-0.5">
              Today's Schedule & Timeline
            </h2>
            <p className="text-xs text-[#86868B] mt-1">
              You have <span className="font-bold text-[#1D1D1F]">{blocks.length - completedCount} focus blocks</span> remaining for today
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenGoogleCalendar && (
              <button
                onClick={onOpenGoogleCalendar}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 border border-black/[0.08] active:scale-95 transition-all shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5 text-neutral-600" />
                <span>Google Calendar</span>
              </button>
            )}

            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-black/[0.06] text-[#1D1D1F]">
              {completedCount} / {blocks.length} Completed
            </span>

            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Block</span>
            </button>
          </div>
        </div>

        {/* Horizontal Weekly Day Selector Strip (Real Dynamic Dates) */}
        <div className="pt-2 border-t border-black/[0.05]">
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center active:scale-95 transition-all duration-150 ${
                    isSelected
                      ? 'bg-black text-white shadow-sm scale-102'
                      : day.isToday
                      ? 'bg-[#FAF9F5] text-black font-bold border border-black/30'
                      : 'bg-[#FAF9F5] text-neutral-600 hover:bg-[#F3EFE6] border border-black/[0.04]'
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider">{day.name}</span>
                  <span className="text-base sm:text-lg font-serif font-bold mt-0.5">{day.num}</span>
                  {day.isToday && <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Block Form Drawer */}
      {isAdding && (
        <form onSubmit={handleCreate} className="apple-card p-5 bg-[#FAF9F5] border border-black/[0.08] space-y-3 apple-sheet-spring">
          <h4 className="text-xs font-bold text-[#1D1D1F]">Schedule Chronological Focus Block</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              autoFocus
              required
              placeholder="Block Title (e.g. Deep Work: LeetCode Trees & BFS)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-1 focus:ring-black"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ScheduleBlock['category'])}
              className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            >
              <option value="dsa">DSA & LeetCode</option>
              <option value="clients">Video Clients</option>
              <option value="outreach">High-Ticket Outreach</option>
              <option value="college">College Lecture</option>
              <option value="interview">Interview Prep</option>
              <option value="health">Health & Routine</option>
              <option value="general">General Focus</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Start Time (e.g. 02:00 PM)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
            <input
              type="text"
              placeholder="End Time (e.g. 03:30 PM)"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
          </div>

          <input
            type="text"
            placeholder="Focus instructions / notes (e.g. 90-min phone-free sprint)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
          />

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-[#86868B] hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800"
            >
              Save Schedule Block
            </button>
          </div>
        </form>
      )}

      {/* Vertical Connected Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-4">
        {/* Continuous Connecting Vertical Line */}
        <div className="absolute left-[11px] sm:left-[15px] top-3 bottom-3 w-[2px] bg-neutral-200" />

        {blocks.length === 0 ? (
          <div className="apple-card p-10 text-center bg-white border border-black/[0.06] space-y-3 ml-2">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-[#1D1D1F]">Your Timeline is Open</h4>
              <p className="text-xs text-[#86868B] max-w-sm mx-auto mt-0.5">
                Add schedule focus blocks or sync your Google Calendar to view today's timeline.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Block</span>
              </button>
              {onOpenGoogleCalendar && (
                <button
                  onClick={onOpenGoogleCalendar}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-black/[0.08] text-neutral-800 text-xs font-semibold"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Sync Google Calendar</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          blocks.map((block, idx) => {
            const isDone = block.done;
            const isHighlight = block.highlight && !isDone;
            const gcalLink = googleCalendarService.generateQuickAddLink(
              block.title,
              block.time,
              block.description
            );

            return (
              <div
                key={block.id}
                className="relative flex items-start gap-4 apple-spring-in group"
                style={{ animationDelay: `${idx * 45}ms` }}
              >
                {/* Timeline Node Marker */}
                <div className="relative z-10 shrink-0 mt-3">
                  <button
                    onClick={() => {
                      onToggleBlock(block.id);
                      if (!isDone) confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
                    }}
                    className={`relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
                      isDone
                        ? 'bg-black text-white ring-4 ring-[#FDFBF6]'
                        : isHighlight
                        ? 'bg-white border-2 border-black ring-4 ring-black/10'
                        : 'bg-white border-2 border-neutral-300 ring-4 ring-[#FDFBF6] hover:border-black'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <span className={`w-2 h-2 rounded-full ${isHighlight ? 'bg-black' : 'bg-transparent'}`} />
                    )}
                  </button>
                </div>

                {/* Connected Schedule Card */}
                <div className="flex-1 min-w-0 transition-transform duration-200 group-hover:translate-x-1">
                  <div className={`apple-card p-5 rounded-2xl shadow-xs transition-all duration-200 border ${
                    isHighlight
                      ? 'bg-[#18181B] text-white border-neutral-900 shadow-md'
                      : isDone
                      ? 'bg-neutral-50/80 border-neutral-200/60'
                      : 'bg-white border-black/[0.06] hover:border-black/20'
                  }`}>
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-black/[0.06]">
                      <div className="flex items-center gap-2">
                        <CustomIcon name={categoryIconMap[block.category] || 'wand'} className="w-4 h-4" white={isHighlight} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isHighlight ? 'text-neutral-300' : 'text-[#86868B]'}`}>
                          {block.category}
                        </span>
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                        isHighlight ? 'bg-white/10 text-white' : 'bg-[#FAF9F5] text-neutral-800'
                      }`}>
                        {block.time} {block.endTime ? `- ${block.endTime}` : ''}
                      </span>
                    </div>

                    <div className="pt-2">
                      <h3 className={`text-base font-serif font-bold ${
                        isDone
                          ? 'line-through text-neutral-400'
                          : isHighlight
                          ? 'text-white'
                          : 'text-[#1D1D1F]'
                      }`}>
                        {block.title}
                      </h3>
                      {block.description && (
                        <p className={`text-xs mt-1 ${isHighlight ? 'text-neutral-300' : 'text-[#86868B]'}`}>
                          {block.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-black/[0.04]">
                      <span className={`text-[10px] ${isHighlight ? 'text-neutral-400' : 'text-[#86868B]'}`}>
                        {isDone ? 'Completed' : 'Pending focus block'}
                      </span>

                      <a
                        href={gcalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 text-[10px] font-medium hover:underline ${
                          isHighlight ? 'text-neutral-300' : 'text-neutral-600'
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Add to GCal</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
