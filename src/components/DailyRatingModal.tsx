'use client';

import React, { useState } from 'react';
import { DailyRating } from '../types';
import { CustomIcon } from './CustomIcon';
import { Vaso } from 'vaso';
import { X, Star, Sparkles, Check, Flame, Trophy, ThumbsUp } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  todayRating?: DailyRating;
  onSaveRating: (rating: DailyRating) => void;
}

export const DailyRatingModal: React.FC<DailyRatingModalProps> = ({
  isOpen,
  onClose,
  todayRating,
  onSaveRating,
}) => {
  const [score, setScore] = useState<number>(todayRating?.score || 8);
  const [focusLevel, setFocusLevel] = useState<DailyRating['focusLevel']>(
    todayRating?.focusLevel || 'High'
  );
  const [wins, setWins] = useState<string>(todayRating?.wins || '');
  const [improvements, setImprovements] = useState<string>(todayRating?.note || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    todayRating?.tags || ['Deep Work']
  );

  if (!isOpen) return null;

  const availableTags = [
    'Deep Work',
    'High Focus',
    'Cleared Must Tasks',
    'DSA Target Hit',
    'Workout Done',
    'Creative Flow',
    'Client Delivery',
    'Distracted',
    'Need More Sleep',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const getScoreDescription = (s: number) => {
    if (s >= 9) return { label: 'Peak Flow State', badge: 'bg-emerald-500 text-white', color: 'text-emerald-600' };
    if (s >= 7) return { label: 'High Productivity', badge: 'bg-neutral-900 text-white', color: 'text-neutral-900' };
    if (s >= 5) return { label: 'Steady Execution', badge: 'bg-amber-600 text-white', color: 'text-amber-700' };
    return { label: 'Recovery / Reset Needed', badge: 'bg-neutral-500 text-white', color: 'text-neutral-600' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];

    const rating: DailyRating = {
      id: todayRating?.id || `rating-${today}`,
      date: today,
      score,
      focusLevel,
      wins: wins.trim() || undefined,
      note: improvements.trim() || undefined,
      tags: selectedTags,
      createdAt: todayRating?.createdAt || new Date().toISOString(),
    };

    onSaveRating(rating);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    onClose();
  };

  const scoreInfo = getScoreDescription(score);

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5 overflow-y-auto apple-fade-in font-sans">
      <div className="w-full max-w-lg apple-liquid-glass rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl apple-sheet-spring sm:apple-modal-spring max-h-[92vh] flex flex-col border border-white/80">
        {/* Mobile handle */}
        <div className="w-10 h-1 rounded-full bg-black/20 mx-auto mt-2.5 sm:hidden" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-black/[0.06] flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
              <Star className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#1D1D1F]">
                End-of-Day Execution Rating
              </h3>
              <p className="text-[11px] text-[#86868B]">
                Calibrate daily focus, deep work momentum & wins
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-neutral-500 active:scale-90 transition-all border border-black/[0.06]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Rating Display */}
          <div className="p-4 rounded-2xl bg-white/80 border border-white/90 border-b-black/[0.06] space-y-3 text-center shadow-xs">
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-5xl font-serif font-extrabold text-[#1D1D1F] tracking-tight">
                {score}
              </span>
              <span className="text-xl font-bold text-[#86868B]">/10</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${scoreInfo.badge}`}>
                {scoreInfo.label}
              </span>
            </div>

            {/* Interactive Slider */}
            <div className="px-3 pt-2">
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={score}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setScore(val);
                  if (val >= 9) setFocusLevel('Flow State');
                  else if (val >= 7) setFocusLevel('High');
                  else if (val >= 5) setFocusLevel('Medium');
                  else setFocusLevel('Low');
                }}
                className="w-full accent-black cursor-pointer h-2 bg-neutral-200 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-[#86868B] font-mono mt-1 px-1">
                <span>1 (Off day)</span>
                <span>5 (Average)</span>
                <span>10 (Flawless)</span>
              </div>
            </div>
          </div>

          {/* Focus Level Selection */}
          <div>
            <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1.5">
              Subjective Focus Level
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Low', 'Medium', 'High', 'Flow State'] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setFocusLevel(lvl)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    focusLevel === lvl
                      ? 'bg-black text-white border-black shadow-xs font-bold'
                      : 'bg-white/80 text-neutral-700 border-black/[0.06] hover:bg-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Tags */}
          <div>
            <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1.5">
              Day Highlights & Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'bg-white/80 text-neutral-600 border border-black/[0.06] hover:text-black'
                    }`}
                  >
                    {active && <span className="mr-1">✓</span>}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reflection Notes */}
          <div className="space-y-2.5">
            <div>
              <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                Biggest Win Today (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Solved 2 graph problems and exported client promo video"
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                className="w-full bg-white/80 border border-white/90 border-b-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-1 focus:ring-black shadow-xs"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                One Focus For Tomorrow (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Protect 9-11am deep work block with phone in other room"
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                className="w-full bg-white/80 border border-white/90 border-b-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-1 focus:ring-black shadow-xs"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Vaso depth={0.8} blur={0.4} specular={0.7} dispersion={0.15} radius={12}>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-98 transition-all shadow-xs flex items-center justify-center gap-2 border border-white/20"
              >
                <Check className="w-4 h-4" />
                <span>Save Day Rating ({score}/10)</span>
              </button>
            </Vaso>
          </div>
        </form>
      </div>
    </div>
  );
};
