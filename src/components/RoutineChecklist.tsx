'use client';

import React from 'react';
import { Habit } from '../types';
import { Sun, Moon, Check, Flame, Clock, Sparkles } from 'lucide-react';

interface RoutineChecklistProps {
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
  onOpenHabitsTab: () => void;
}

export const RoutineChecklist: React.FC<RoutineChecklistProps> = ({
  habits,
  onToggleHabit,
  onOpenHabitsTab,
}) => {
  const morningHabits = habits.filter((h) => h.routine_slot === 'morning');
  const nightHabits = habits.filter((h) => h.routine_slot === 'night');

  const morningDone = morningHabits.filter((h) => h.completed_today).length;
  const nightDone = nightHabits.filter((h) => h.completed_today).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Morning Ritual Card */}
      <div className="apple-card p-5 bg-white/95 border border-black/[0.06]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider">
                Morning Ritual
              </h4>
              <span className="text-[11px] text-[#86868B] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Target: 08:00 - 08:30
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold font-mono border border-black/[0.05]">
            <span>{morningDone}</span>/<span>{morningHabits.length}</span>
          </div>
        </div>

        <div className="space-y-1.5 mt-2">
          {morningHabits.map((h) => (
            <div
              key={h.id}
              onClick={() => onToggleHabit(h.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all active:scale-[0.98] ${
                h.completed_today
                  ? 'bg-neutral-100/60 text-[#86868B]'
                  : 'bg-[#FBF9F4] hover:bg-[#F4F1E6] text-[#1D1D1F]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    h.completed_today
                      ? 'bg-black border-black text-white'
                      : 'border-black/20 bg-white'
                  }`}
                >
                  {h.completed_today && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <span className={`text-xs font-medium truncate ${h.completed_today ? 'line-through text-neutral-400' : ''}`}>
                  {h.name}
                </span>
              </div>

              {h.streak > 0 && (
                <div className="flex items-center gap-0.5 text-[11px] font-bold text-neutral-700 shrink-0">
                  <Flame className="w-3 h-3 fill-current" />
                  <span>{h.streak}d</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Night Wind-Down Card */}
      <div className="apple-card p-5 bg-white/95 border border-black/[0.06]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider">
                Night Wind-Down
              </h4>
              <span className="text-[11px] text-[#86868B] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Target: 21:30 - 22:00
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold font-mono border border-black/[0.05]">
            <span>{nightDone}</span>/<span>{nightHabits.length}</span>
          </div>
        </div>

        <div className="space-y-1.5 mt-2">
          {nightHabits.map((h) => (
            <div
              key={h.id}
              onClick={() => onToggleHabit(h.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all active:scale-[0.98] ${
                h.completed_today
                  ? 'bg-neutral-100/60 text-[#86868B]'
                  : 'bg-[#FBF9F4] hover:bg-[#F4F1E6] text-[#1D1D1F]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    h.completed_today
                      ? 'bg-black border-black text-white'
                      : 'border-black/20 bg-white'
                  }`}
                >
                  {h.completed_today && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <span className={`text-xs font-medium truncate ${h.completed_today ? 'line-through text-neutral-400' : ''}`}>
                  {h.name}
                </span>
              </div>

              {h.streak > 0 && (
                <div className="flex items-center gap-0.5 text-[11px] font-bold text-neutral-700 shrink-0">
                  <Flame className="w-3 h-3 fill-current" />
                  <span>{h.streak}d</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
