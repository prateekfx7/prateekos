'use client';

import React, { useState } from 'react';
import { Habit } from '../types';
import { Flame, Plus, Check, Trophy, Sparkles, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HabitsGridProps {
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'streak' | 'best_streak' | 'completed_today' | 'history'>) => void;
}

export const HabitsGrid: React.FC<HabitsGridProps> = ({ habits, onToggleHabit, onAddHabit }) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [slot, setSlot] = useState<'morning' | 'night' | 'anytime'>('morning');
  const [timeTarget, setTimeTarget] = useState<string>('08:00');

  // Generate last 30 days dates in order (oldest to newest)
  const past30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddHabit({
      name: name.trim(),
      icon: 'habit',
      routine_slot: slot,
      time_target: timeTarget,
    });
    setName('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-5">
      {/* Overview Card */}
      <div className="apple-card p-5 bg-white/95">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1D1D1F]">30-Day Consistency Grid</h2>
              <p className="text-xs text-[#86868B] mt-0.5">
                Streaks build momentum without punishing missed days.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-medium hover:bg-neutral-800 active:scale-95 transition-all shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Habit</span>
          </button>
        </div>
      </div>

      {/* Add Habit Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="apple-card p-4 bg-[#F8F6F0] space-y-3">
          <h4 className="text-xs font-bold text-[#1D1D1F]">Add Recurring Habit</h4>
          <div>
            <input
              type="text"
              autoFocus
              placeholder="Habit name (e.g. 10m Posture Stretch)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={slot}
              onChange={(e) => setSlot(e.target.value as 'morning' | 'night' | 'anytime')}
              className="bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs text-[#1D1D1F]"
            >
              <option value="morning">Morning Ritual</option>
              <option value="night">Night Wind-Down</option>
              <option value="anytime">Anytime Daily</option>
            </select>

            <input
              type="time"
              value={timeTarget}
              onChange={(e) => setTimeTarget(e.target.value)}
              className="bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs text-[#1D1D1F]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 text-xs text-[#86868B]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-black text-white text-xs font-medium"
            >
              Save Habit
            </button>
          </div>
        </form>
      )}

      {/* Habit Matrix Cards */}
      <div className="space-y-3">
        {habits.map((habit) => {
          return (
            <div key={habit.id} className="apple-card p-4 sm:p-5 bg-white/95 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-neutral-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
                      <span>{habit.name}</span>
                      <span className="text-[10px] font-semibold text-[#86868B] uppercase px-2 py-0.5 rounded-full bg-neutral-100">
                        {habit.routine_slot}
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#86868B]">
                      {habit.time_target && `Scheduled for ${habit.time_target} • `}
                      Best streak: {habit.best_streak} days
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 font-bold text-xs">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{habit.streak} day streak</span>
                  </div>

                  <button
                    onClick={() => {
                      onToggleHabit(habit.id);
                      if (!habit.completed_today) {
                        confetti({
                          particleCount: 30,
                          spread: 50,
                          origin: { y: 0.6 },
                        });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                      habit.completed_today
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-[#F4F2EB] hover:bg-[#EBE7DC] text-[#1D1D1F]'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{habit.completed_today ? 'Done Today' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>

              {/* 30-Day Dot Matrix */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#86868B] mb-1.5 px-0.5">
                  <span>30 days ago</span>
                  <span>Today</span>
                </div>

                <div className="grid grid-cols-15 sm:grid-cols-30 gap-1 sm:gap-1.5">
                  {past30Days.map((dateStr, idx) => {
                    const isToday = idx === past30Days.length - 1;
                    const isDone = isToday ? habit.completed_today : Boolean(habit.history[dateStr]);

                    return (
                      <div
                        key={dateStr}
                        title={`${dateStr}: ${isDone ? 'Completed' : 'Rest / Missed'}`}
                        className={`h-6 rounded-md transition-all flex items-center justify-center text-[9px] font-mono ${
                          isDone
                            ? 'bg-neutral-900 text-white shadow-2xs'
                            : 'bg-[#F3EFE6] text-neutral-400'
                        } ${isToday ? 'ring-2 ring-black/40' : ''}`}
                      >
                        {isDone ? '•' : ''}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
