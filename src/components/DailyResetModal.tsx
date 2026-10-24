'use client';

import React from 'react';
import { LifeTask } from '../types';
import { Vaso } from 'vaso';
import {
  X,
  Sunrise,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Droplets,
  Dumbbell,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: LifeTask[];
  onConfirmReset: () => void;
}

export const DailyResetModal: React.FC<DailyResetModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onConfirmReset,
}) => {
  if (!isOpen) return null;

  const incompleteTasks = tasks.filter((t) => !t.done && !t.archived);
  const completedTasks = tasks.filter((t) => t.done && !t.archived);

  const handleConfirm = () => {
    onConfirmReset();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg apple-liquid-glass rounded-3xl overflow-hidden shadow-2xl border border-white/80 max-h-[90vh] flex flex-col">
        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center shadow-xs">
                <Sunrise className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-[#1D1D1F]">
                  Daily Reset & Task Rollover
                </h2>
                <p className="text-xs text-[#86868B] mt-0.5">
                  Start today with a fresh slate while carrying over leftover tasks
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#1D1D1F] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* What this does explanation */}
          <div className="space-y-3">
            {/* 1. Leftover Tasks to Roll Over */}
            <div className="p-4 rounded-2xl bg-white/80 border border-black/[0.06] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <h4 className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider">
                    Leftover Tasks Rolled Over ({incompleteTasks.length})
                  </h4>
                </div>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Will show today
                </span>
              </div>

              {incompleteTasks.length === 0 ? (
                <p className="text-xs text-neutral-500 italic">
                  🎉 No leftover tasks! You cleared everything yesterday.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {incompleteTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-neutral-50/80 border border-neutral-100 text-xs"
                    >
                      <span className="font-medium text-[#1D1D1F] truncate flex-1 mr-2">
                        {t.title}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            t.priority === 'must'
                              ? 'bg-red-50 text-red-700'
                              : t.priority === 'should'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {t.priority.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-amber-700 font-medium">
                          Rollover ↗
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Completed Tasks to Archive */}
            <div className="p-4 rounded-2xl bg-white/80 border border-black/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider">
                    Completed Tasks ({completedTasks.length})
                  </h4>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Archived to History
                </span>
              </div>
              <p className="text-xs text-[#86868B]">
                Previous completed tasks will be archived from today's active list, but preserved in your
                historical records and productivity charts.
              </p>
            </div>

            {/* 3. Daily Habits Reset */}
            <div className="p-3.5 rounded-2xl bg-white/80 border border-black/[0.06] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Droplets className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#1D1D1F]">Daily Habits & Routines Reset</p>
                <p className="text-[#86868B]">Water glasses, workouts, and routines reset to zero for the new day.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-black/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-black/[0.08] text-xs font-medium text-[#1D1D1F] hover:bg-black/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="relative overflow-hidden group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold active:scale-95 transition-all shadow-md"
            >
              <Vaso depth={0.8} blur={0.4} specular={0.7} dispersion={0.15} radius={12}>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Start Fresh Day Now</span>
                </div>
              </Vaso>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
