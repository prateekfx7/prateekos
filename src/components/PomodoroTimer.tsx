'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Project, FocusSession } from '../types';
import { Play, Pause, RotateCcw, Check, Sparkles, X, ChevronDown, Bell, Timer } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PomodoroTimerProps {
  projects: Project[];
  activeTaskTitle?: string;
  onSessionComplete: (session: Omit<FocusSession, 'id'>) => void;
  onClose?: () => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  projects,
  activeTaskTitle,
  onSessionComplete,
  onClose,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(25); // minutes
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // seconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [customTaskTitle, setCustomTaskTitle] = useState<string>(activeTaskTitle || '');
  const [notes, setNotes] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play gentle Web Audio API chime on completion
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch {
      // AudioContext fallback
    }
  };

  const handlePresetChange = (mins: number) => {
    setSelectedDuration(mins);
    setTimeLeft(mins * 60);
    setIsRunning(false);
  };

  useEffect(() => {
    if (activeTaskTitle) {
      setCustomTaskTitle(activeTaskTitle);
    }
  }, [activeTaskTitle]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playChime();
            confetti({
              particleCount: 80,
              spread: 80,
              origin: { y: 0.6 },
            });
            onSessionComplete({
              project_id: selectedProjectId,
              task_title: customTaskTitle || 'Deep Work Focus Block',
              duration_minutes: selectedDuration,
              notes,
              started_at: new Date(Date.now() - selectedDuration * 60000).toISOString(),
              completed_at: new Date().toISOString(),
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, selectedDuration, selectedProjectId, customTaskTitle, notes, onSessionComplete]);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressRatio = (selectedDuration * 60 - timeLeft) / (selectedDuration * 60);

  return (
    <div className="apple-card p-6 bg-gradient-to-b from-white to-[#FAF8F2] relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 active:scale-90 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1D1D1F]">Focus Block Launcher</h3>
            <p className="text-[11px] text-[#86868B]">Recorded automatically in Adventure Log</p>
          </div>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1 bg-[#F1EFEA] p-1 rounded-xl">
          {[
            { label: '25m', val: 25 },
            { label: '50m', val: 50 },
            { label: '15m', val: 15 },
          ].map((preset) => (
            <button
              key={preset.val}
              onClick={() => handlePresetChange(preset.val)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedDuration === preset.val
                  ? 'bg-white text-black shadow-xs'
                  : 'text-[#86868B] hover:text-black'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Countdown Display */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Circular Progress */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#EBE7DE"
              strokeWidth="8"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#18181B"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 70}
              strokeDashoffset={2 * Math.PI * 70 * (1 - progressRatio)}
              className="transition-all duration-300 ease-linear"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold tracking-tight text-[#1D1D1F] font-mono">
              {formattedTime}
            </span>
            <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mt-1">
              {isRunning ? 'Session Active' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-2.5 rounded-full flex items-center gap-2 text-xs font-bold transition-all shadow-sm active:scale-95 ${
              isRunning
                ? 'bg-neutral-800 hover:bg-neutral-900 text-white'
                : 'bg-black hover:bg-neutral-800 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Block</span>
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="w-9 h-9 rounded-full bg-[#F1EFEA] hover:bg-[#E5E2D9] flex items-center justify-center text-neutral-600 active:scale-95 transition-all"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target Project and Task Binding */}
      <div className="mt-4 pt-4 border-t border-black/[0.06] space-y-2.5">
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider w-16 shrink-0">
            Project:
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="flex-1 bg-white border border-black/[0.08] rounded-xl px-2.5 py-1.5 text-xs font-medium text-[#1D1D1F] focus:outline-none focus:ring-1 focus:ring-black"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider w-16 shrink-0">
            Focus:
          </label>
          <input
            type="text"
            placeholder="What are you tackling right now?"
            value={customTaskTitle}
            onChange={(e) => setCustomTaskTitle(e.target.value)}
            className="flex-1 bg-white border border-black/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>
    </div>
  );
};
