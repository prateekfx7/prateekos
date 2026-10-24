'use client';

import React, { useState } from 'react';
import { ScheduleBlock } from '../types';
import { CustomIcon, CustomIconName } from './CustomIcon';
import { Check, Plus, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyTimelineViewProps {
  blocks: ScheduleBlock[];
  onToggleBlock: (id: string) => void;
  onAddBlock: (block: Omit<ScheduleBlock, 'id'>) => void;
}

export const DailyTimelineView: React.FC<DailyTimelineViewProps> = ({
  blocks,
  onToggleBlock,
  onAddBlock,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(4); // Friday
  const [isAdding, setIsAdding] = useState(false);
  const [time, setTime] = useState('03:00 PM');
  const [endTime, setEndTime] = useState('04:30 PM');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ScheduleBlock['category']>('dsa');

  const days = [
    { name: 'Mon', num: 20 },
    { name: 'Tue', num: 21 },
    { name: 'Wed', num: 22 },
    { name: 'Thu', num: 23 },
    { name: 'Fri', num: 24 },
    { name: 'Sat', num: 25 },
    { name: 'Sun', num: 26 },
  ];

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
      endTime,
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Day Picker Strip (Inspired by Image 2 & 3) */}
      <div className="apple-card p-6 bg-white border border-black/[0.06] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1D1D1F] tracking-tight mt-0.5">
              Today's Schedule
            </h2>
            <p className="text-xs text-[#86868B] mt-1">
              You have <span className="font-bold text-[#1D1D1F]">{blocks.length - completedCount} focus blocks</span> remaining for today
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-black/[0.06] text-[#1D1D1F]">
              {completedCount} / {blocks.length} Completed
            </span>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
            >
              <CustomIcon name="wand" className="w-3.5 h-3.5" white />
              <span>Add Block</span>
            </button>
          </div>
        </div>

        {/* Horizontal Weekly Day Selector Strip (Image 2 exact pattern) */}
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
                      : 'bg-[#FAF9F5] text-neutral-600 hover:bg-[#F3EFE6] hover:-translate-y-0.5 border border-black/[0.04]'
                  }`}
                >
                  <span className={`text-[11px] font-medium ${isSelected ? 'text-neutral-300' : 'text-[#86868B]'}`}>
                    {day.name}
                  </span>
                  <span className="text-sm font-bold font-mono mt-0.5">{day.num}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 apple-breathing" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Add Form Drawer */}
      {isAdding && (
        <form onSubmit={handleCreate} className="apple-card p-5 bg-[#FAF9F5] border border-black/[0.08] space-y-3 apple-spring-in">
          <div className="flex items-center gap-2">
            <CustomIcon name="wand" className="w-4 h-4 text-neutral-800" />
            <h4 className="text-sm font-serif font-bold text-[#1D1D1F]">Schedule New Focus Block</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              autoFocus
              placeholder="Block Title (e.g. DSA Trees BFS)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="sm:col-span-2 bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-1 focus:ring-black"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ScheduleBlock['category'])}
              className="bg-white border border-black/[0.08] rounded-xl px-2.5 py-2 text-xs text-[#1D1D1F]"
            >
              <option value="dsa">DSA & LeetCode</option>
              <option value="clients">Video Clients</option>
              <option value="outreach">Outreach CRM</option>
              <option value="college">College Subjects</option>
              <option value="interview">Interview Prep</option>
              <option value="health">Daily Health</option>
              <option value="general">General</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-[#86868B] block mb-1">Start Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="09:00 AM"
                className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs text-[#1D1D1F]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#86868B] block mb-1">End Time</label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="10:30 AM"
                className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs text-[#1D1D1F]"
              />
            </div>
          </div>

          <input
            type="text"
            placeholder="Details or deliverables..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
          />

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-[#86868B] hover:text-black active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 shadow-xs"
            >
              Save Schedule Block
            </button>
          </div>
        </form>
      )}

      {/* Vertical Connected Timeline (Directly from Image 2) */}
      <div className="relative pl-6 sm:pl-8 space-y-4">
        {/* Continuous Connecting Vertical Line */}
        <div className="absolute left-[11px] sm:left-[15px] top-3 bottom-3 w-[2px] bg-neutral-200" />

        {blocks.map((block, idx) => {
          const isDone = block.done;
          const isHighlight = block.highlight && !isDone;

          return (
            <div
              key={block.id}
              className="relative flex items-start gap-4 apple-spring-in group"
              style={{ animationDelay: `${idx * 45}ms` }}
            >
              {/* Timeline Node Marker */}
              <div className="relative z-10 shrink-0 mt-3">
                {isHighlight && (
                  <span className="absolute -inset-1 rounded-full bg-black/20 apple-radar pointer-events-none" />
                )}
                <button
                  onClick={() => {
                    onToggleBlock(block.id);
                    if (!isDone) confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
                  }}
                  className={`relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
                    isDone
                      ? 'bg-black text-white ring-4 ring-[#FDFBF6] apple-check-pop'
                      : isHighlight
                      ? 'bg-white border-2 border-black ring-4 ring-black/10'
                      : 'bg-white border-2 border-neutral-300 ring-4 ring-[#FDFBF6] hover:border-black'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : (
                    <span className={`w-2 h-2 rounded-full ${isHighlight ? 'bg-black apple-breathing' : 'bg-transparent'}`} />
                  )}
                </button>
              </div>

              {/* Connected Schedule Card */}
              <div className="flex-1 min-w-0 transition-transform duration-200 group-hover:translate-x-1">
                {isHighlight ? (
                  /* Solid Highlight Active Card (Cobalt / Charcoal Accent from Image 2 & 3) */
                  <div className="apple-card p-5 bg-[#18181B] text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99]">
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-300">
                          Active Focus Sprint
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-white bg-white/10 px-2.5 py-1 rounded-md">
                        {block.time} {block.endTime ? `- ${block.endTime}` : ''}
                      </span>
                    </div>

                    <div className="pt-3">
                      <div className="flex items-center gap-2">
                        <CustomIcon name={categoryIconMap[block.category]} className="w-5 h-5" white />
                        <h3 className="text-lg font-serif font-bold text-white">{block.title}</h3>
                      </div>
                      <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                        {block.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-semibold">
                          {block.category.toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-neutral-300 text-[10px]">
                          Due: Today
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          onToggleBlock(block.id);
                          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                        }}
                        className="px-3 py-1 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-100 active:scale-95 transition-all shadow-xs"
                      >
                        Complete Sprint
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Neutral Timeline Card */
                  <div
                    className={`apple-card p-4 sm:p-5 rounded-2xl border transition-all duration-200 active:scale-[0.99] ${
                      isDone
                        ? 'bg-neutral-50/70 border-neutral-200'
                        : 'bg-white border-black/[0.06] hover:border-black/20 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <CustomIcon
                            name={categoryIconMap[block.category]}
                            className="w-4 h-4 text-neutral-700 shrink-0"
                          />
                          <h4
                            className={`text-sm sm:text-base font-serif font-bold transition-all duration-200 ${
                              isDone ? 'line-through text-neutral-400 opacity-60' : 'text-[#1D1D1F]'
                            }`}
                          >
                            {block.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[10px] font-semibold shrink-0">
                            {block.category}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 leading-relaxed transition-all duration-200 ${isDone ? 'text-neutral-400' : 'text-[#86868B]'}`}>
                          {block.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-neutral-800 bg-[#FAF9F5] px-2.5 py-1 rounded-lg border border-black/[0.04]">
                          {block.time}
                        </span>
                        {block.endTime && (
                          <span className="block text-[10px] font-mono text-[#86868B] mt-1">
                            to {block.endTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
