'use client';

import React from 'react';
import { HealthMetrics } from '../types';
import { CustomIcon } from './CustomIcon';
import {
  Check,
  Plus,
  Minus,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HealthRoutineViewProps {
  health: HealthMetrics;
  onUpdateHealth: (health: HealthMetrics) => void;
}

export const HealthRoutineView: React.FC<HealthRoutineViewProps> = ({
  health,
  onUpdateHealth,
}) => {
  const addWater = () => {
    onUpdateHealth({ ...health, waterGlasses: Math.min(12, health.waterGlasses + 1) });
  };

  const removeWater = () => {
    onUpdateHealth({ ...health, waterGlasses: Math.max(0, health.waterGlasses - 1) });
  };

  const toggleWorkout = () => {
    const next = !health.workoutDone;
    if (next) confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    onUpdateHealth({ ...health, workoutDone: next });
  };

  const toggleMorning = () => {
    const next = !health.morningRoutineDone;
    if (next) confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    onUpdateHealth({ ...health, morningRoutineDone: next });
  };

  const toggleNight = () => {
    const next = !health.nightRoutineDone;
    if (next) confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    onUpdateHealth({ ...health, nightRoutineDone: next });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="apple-card p-6 bg-white/95 border border-black/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center font-bold">
            <CustomIcon name="water" className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1D1D1F]">Daily Health & Routine Operating System</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-semibold">
                Daily Discipline
              </span>
            </div>
            <p className="text-xs text-[#86868B] mt-0.5">
              Hydration, restorative sleep, movement, and anchor morning/night rituals
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Water Intake */}
        <div className="apple-card p-5 bg-white border border-black/[0.06] flex flex-col justify-between space-y-3 apple-spring-in stagger-1 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
              <CustomIcon name="water" className="w-4 h-4 text-neutral-700" /> Water Intake
            </span>
            <span className="text-xs font-mono font-bold text-neutral-900">{health.waterGlasses}/8 cups</span>
          </div>

          <div className="flex items-center justify-center gap-1 my-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-6 rounded-sm transition-all duration-300 relative overflow-hidden ${
                  i < health.waterGlasses
                    ? 'bg-neutral-900 scale-105 shadow-xs apple-liquid-shimmer'
                    : 'bg-neutral-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={removeWater}
              className="flex-1 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 font-bold text-xs flex items-center justify-center transition-all"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={addWater}
              className="flex-1 py-1.5 rounded-lg bg-black hover:bg-neutral-800 active:scale-95 text-white font-bold text-xs flex items-center justify-center transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sleep Hours */}
        <div className="apple-card p-5 bg-white border border-black/[0.06] flex flex-col justify-between space-y-3 apple-spring-in stagger-2 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
              <CustomIcon name="cloud" className="w-4 h-4 text-neutral-700" /> Sleep Duration
            </span>
            <span className="text-xs font-mono font-bold text-neutral-900">{health.sleepHours} hrs</span>
          </div>

          <input
            type="range"
            min={4}
            max={10}
            step={0.5}
            value={health.sleepHours}
            onChange={(e) => onUpdateHealth({ ...health, sleepHours: Number(e.target.value) })}
            className="w-full accent-neutral-900 my-2 cursor-pointer"
          />

          <span className="text-[11px] text-[#86868B] text-center">
            {health.sleepHours >= 7 ? 'Optimal rest achieved' : 'Target: 7.5h'}
          </span>
        </div>

        {/* Workout / Gym */}
        <div className="apple-card p-5 bg-white border border-black/[0.06] flex flex-col justify-between space-y-3 apple-spring-in stagger-3 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
              <CustomIcon name="flame" className="w-4 h-4 text-neutral-700" /> Movement / Gym
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800">
              {health.workoutDone ? 'Done' : 'Pending'}
            </span>
          </div>

          <button
            onClick={toggleWorkout}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs ${
              health.workoutDone
                ? 'bg-black text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-[#1D1D1F]'
            }`}
          >
            {health.workoutDone ? 'Workout Logged' : 'Log Daily Workout'}
          </button>

          <span className="text-[11px] text-[#86868B] text-center">30-45m physical activity</span>
        </div>

        {/* Energy Rating */}
        <div className="apple-card p-5 bg-white border border-black/[0.06] flex flex-col justify-between space-y-3 apple-spring-in stagger-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
              Energy Level
            </span>
            <span className="text-xs font-mono font-bold text-neutral-900">{health.energyScore}/10</span>
          </div>

          <input
            type="range"
            min={1}
            max={10}
            value={health.energyScore}
            onChange={(e) => onUpdateHealth({ ...health, energyScore: Number(e.target.value) })}
            className="w-full accent-neutral-900 my-2 cursor-pointer"
          />

          <span className="text-[11px] text-[#86868B] text-center">Subjective focus level</span>
        </div>
      </div>

      {/* Anchor Rituals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Morning Ritual */}
        <div
          onClick={toggleMorning}
          className={`apple-card p-5 cursor-pointer border transition-all duration-200 active:scale-[0.99] hover:shadow-md ${
            health.morningRoutineDone ? 'bg-neutral-50/80 border-neutral-300' : 'bg-white border-black/[0.06] hover:border-black/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold">
                <CustomIcon name="leaf" className="w-4 h-4 text-neutral-800" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#1D1D1F]">Morning Anchor Ritual (08:00)</h3>
                <p className="text-xs text-[#86868B]">Hydrate + 10m Sunlight + Calibrate Today's Must Task</p>
              </div>
            </div>

            <button
              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-150 active:scale-90 ${
                health.morningRoutineDone
                  ? 'bg-black border-black text-white apple-check-pop'
                  : 'border-black/25 bg-white'
              }`}
            >
              {health.morningRoutineDone && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
          </div>
        </div>

        {/* Night Wind-Down */}
        <div
          onClick={toggleNight}
          className={`apple-card p-5 cursor-pointer border transition-all duration-200 active:scale-[0.99] hover:shadow-md ${
            health.nightRoutineDone ? 'bg-neutral-50/80 border-neutral-300' : 'bg-white border-black/[0.06] hover:border-black/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold">
                <CustomIcon name="eye_slash" className="w-4 h-4 text-neutral-800" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#1D1D1F]">Night Wind-Down Ritual (21:30)</h3>
                <p className="text-xs text-[#86868B]">Log daily progress + Screen shutdown + 20m analog read</p>
              </div>
            </div>

            <button
              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-150 active:scale-90 ${
                health.nightRoutineDone
                  ? 'bg-black border-black text-white apple-check-pop'
                  : 'border-black/25 bg-white'
              }`}
            >
              {health.nightRoutineDone && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
