'use client';

import React from 'react';
import { Target, Sun, Moon, Timer, CheckCircle2, Sparkles, ArrowUpRight } from 'lucide-react';

interface ScoreRingProps {
  score: number;
  mustDone: boolean;
  morningRoutineDone: number;
  morningRoutineTotal: number;
  nightRoutineDone: number;
  nightRoutineTotal: number;
  focusMinutesToday: number;
  sopStepsDone: number;
  sopStepsTotal: number;
  onStartFocus: () => void;
  onOpenSOP: () => void;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  mustDone,
  morningRoutineDone,
  morningRoutineTotal,
  nightRoutineDone,
  nightRoutineTotal,
  focusMinutesToday,
  sopStepsDone,
  sopStepsTotal,
  onStartFocus,
  onOpenSOP,
}) => {
  // SVG circular arc calculations
  const size = 260;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Segment allocations for the 5 systems (Must, Morning, Night, Focus, SOP)
  // Total circumference is broken into 5 segments with gaps
  const gap = 14;
  const numSegments = 5;
  const totalGapLength = gap * numSegments;
  const availableCircumference = circumference - totalGapLength;
  const segmentLength = availableCircumference / numSegments;

  // Ratios (0 to 1) for each segment
  const rMust = mustDone ? 1 : 0.2;
  const rMorning = morningRoutineTotal > 0 ? morningRoutineDone / morningRoutineTotal : 0.2;
  const rNight = nightRoutineTotal > 0 ? nightRoutineDone / nightRoutineTotal : 0.1;
  const rFocus = Math.min(1, focusMinutesToday / 50); // 50 mins target
  const rSOP = sopStepsTotal > 0 ? sopStepsDone / sopStepsTotal : 0.2;

  const segments = [
    { name: 'Must Task', color: '#18181B', ratio: rMust, icon: Target },
    { name: 'Morning Ritual', color: '#334155', ratio: rMorning, icon: Sun },
    { name: 'Night Ritual', color: '#52525B', ratio: rNight, icon: Moon },
    { name: 'Focus Blocks', color: '#71717A', ratio: rFocus, icon: Timer },
    { name: 'SOP Progress', color: '#A1A1AA', ratio: rSOP, icon: CheckCircle2 },
  ];

  return (
    <div className="apple-card p-6 sm:p-7 relative overflow-hidden bg-white/95 border border-black/[0.06]">

      <div className="flex flex-col items-center">
        {/* The Circular Gauge */}
        <div className="relative w-[260px] h-[260px] flex items-center justify-center my-2">
          <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            {segments.map((seg, idx) => {
              const startOffset = idx * (segmentLength + gap);
              const activeLength = segmentLength * Math.max(0.15, seg.ratio);

              return (
                <g key={seg.name}>
                  {/* Background Track Segment */}
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={strokeWidth}
                    strokeOpacity={0.22}
                    strokeLinecap="round"
                    strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                    strokeDashoffset={-startOffset}
                  />
                  {/* Active Value Segment */}
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${activeLength} ${circumference - activeLength}`}
                    strokeDashoffset={-startOffset}
                    className="transition-all duration-700 ease-out"
                  />
                </g>
              );
            })}
          </svg>

          {/* Center Score Display (Inspired by Plan check-up.jpeg) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
            <span className="text-5xl font-bold tracking-tight text-[#1D1D1F] flex items-baseline">
              {score.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-[#86868B] tracking-wide uppercase mt-0.5">
              daily system score
            </span>
            <div className="mt-1 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[11px] font-medium border border-black/[0.05]">
              <Sparkles className="w-3 h-3 text-neutral-600" />
              <span>Optimal Momentum</span>
            </div>
          </div>
        </div>

        {/* Quick System Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <button
            onClick={onStartFocus}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1D1D1F] text-white text-xs font-medium hover:bg-black active:scale-95 transition-all shadow-sm"
          >
            <Timer className="w-3.5 h-3.5 text-neutral-300" />
            <span>25m Focus Block</span>
          </button>
          <button
            onClick={onOpenSOP}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F6F4EE] hover:bg-[#EEECE4] text-[#1D1D1F] text-xs font-medium active:scale-95 transition-all border border-black/[0.04]"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-700" />
            <span>Active SOP</span>
          </button>
        </div>

        {/* Dynamic Assistant Banner */}
        <div className="w-full mt-5 p-3.5 rounded-2xl bg-neutral-100/70 border border-black/[0.06] flex items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-bold">
              <Target className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-neutral-800 uppercase tracking-wider font-mono">
                System Assistant
              </p>
              <p className="text-xs font-medium text-[#1D1D1F] leading-snug">
                {mustDone
                  ? "Must task completed! You are in peak flow state."
                  : "Complete your Must task to push your system score above 9.2 today."}
              </p>
            </div>
          </div>
          <button
            onClick={onStartFocus}
            className="shrink-0 px-3 py-1.5 rounded-full bg-black text-white text-[11px] font-medium hover:opacity-90 active:scale-95 transition-all flex items-center gap-1 shadow-xs"
          >
            <span>Focus</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
