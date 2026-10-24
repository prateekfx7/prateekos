'use client';

import React from 'react';
import { Task, Project } from '../types';
import { Check, Flame, Clock, Play, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MustHeroCardProps {
  task?: Task;
  project?: Project;
  onToggleComplete: (taskId: string) => void;
  onStartFocus: (task: Task) => void;
  onSetMust: () => void;
}

export const MustHeroCard: React.FC<MustHeroCardProps> = ({
  task,
  project,
  onToggleComplete,
  onStartFocus,
  onSetMust,
}) => {
  const handleToggle = (id: string, currentlyDone: boolean) => {
    if (!currentlyDone) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#18181B', '#334155', '#52525B', '#71717A', '#A1A1AA'],
      });
    }
    onToggleComplete(id);
  };

  if (!task) {
    return (
      <div className="apple-card p-5 border border-dashed border-black/20 bg-[#FAF9F5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5 text-neutral-700" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1D1D1F]">No Must Task Set For Today</h4>
            <p className="text-xs text-[#86868B]">Identify your single highest-leverage priority.</p>
          </div>
        </div>
        <button
          onClick={onSetMust}
          className="px-4 py-2 rounded-xl bg-black text-white text-xs font-medium hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
        >
          Set Must Task
        </button>
      </div>
    );
  }

  const isDone = task.status === 'done';

  return (
    <div
      className={`apple-card p-5 relative overflow-hidden transition-all duration-300 border ${
        isDone
          ? 'bg-neutral-50/80 border-neutral-200'
          : 'bg-white border-black/[0.08]'
      }`}
    >
      {/* Decorative top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isDone ? 'bg-neutral-400' : 'bg-neutral-900'
        }`}
      />

      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
              isDone ? 'bg-neutral-100 text-neutral-800' : 'bg-black text-white'
            }`}
          >
            <Flame className="w-3 h-3 fill-current" />
            {isDone ? 'Must Completed' : "Today's #1 Must"}
          </span>

          {project && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#86868B]">
              <span>{project.name}</span>
            </span>
          )}
        </div>

        {task.due_time && (
          <div className="flex items-center gap-1 text-xs font-semibold text-[#86868B]">
            <Clock className="w-3.5 h-3.5" />
            <span>Target: {task.due_time}</span>
          </div>
        )}
      </div>

      <div className="flex items-start gap-3.5 mt-2">
        {/* Apple Style Checkbox */}
        <button
          onClick={() => handleToggle(task.id, isDone)}
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-200 mt-0.5 ${
            isDone
              ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs'
              : 'border-black/30 hover:border-black bg-white active:scale-90'
          }`}
          aria-label="Toggle Must Task Complete"
        >
          {isDone && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={`text-base font-semibold leading-tight text-[#1D1D1F] transition-all ${
              isDone ? 'line-through text-[#86868B]' : ''
            }`}
          >
            {task.title}
          </h3>

          {task.notes && (
            <p className="text-xs text-[#86868B] mt-1 line-clamp-2">
              {task.notes}
            </p>
          )}

          {/* Action Row */}
          {!isDone && (
            <div className="flex items-center gap-2 mt-3.5">
              <button
                onClick={() => onStartFocus(task)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-white text-xs font-medium hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
              >
                <Play className="w-3 h-3 fill-current text-white" />
                <span>Start Focus Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
