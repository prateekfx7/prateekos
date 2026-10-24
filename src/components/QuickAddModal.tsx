'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LifeTask } from '../types';
import { CustomIcon } from './CustomIcon';
import { getLeetCodeUrl, getProblemMetadata } from '../lib/leetcode';
import { Vaso } from 'vaso';
import { X, Plus, Clock, ExternalLink, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickAddModalProps {
  onAddTask: (task: Omit<LifeTask, 'id' | 'createdAt'>) => void;
  onAddDSA?: (problem: { title: string; difficulty: 'Easy' | 'Medium' | 'Hard'; topic: string; leetcodeUrl?: string; notes?: string }) => void;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  onAddTask,
  onAddDSA,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<LifeTask['category']>('general');
  const [priority, setPriority] = useState<LifeTask['priority']>('must');
  const [dueTime, setDueTime] = useState('');
  const [dsaDifficulty, setDsaDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [dsaTopic, setDsaTopic] = useState('Arrays & Hashing');
  const [keepOpen, setKeepOpen] = useState(false);
  const [justAddedCount, setJustAddedCount] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // When title changes and category is dsa, auto-detect topic and difficulty
  useEffect(() => {
    if (category === 'dsa' && title.trim().length > 3) {
      const meta = getProblemMetadata(title.trim());
      setDsaDifficulty(meta.difficulty);
      setDsaTopic(meta.topic);
    }
  }, [title, category]);

  const categories: { id: LifeTask['category']; label: string; icon: string }[] = [
    { id: 'dsa', label: 'DSA & LeetCode', icon: 'target' },
    { id: 'clients', label: 'Video Clients', icon: 'briefcase' },
    { id: 'outreach', label: 'Outreach CRM', icon: 'network' },
    { id: 'college', label: 'College Academics', icon: 'easel' },
    { id: 'interview', label: 'Interview Prep', icon: 'note_smile' },
    { id: 'health', label: 'Health & Routine', icon: 'water' },
    { id: 'general', label: 'General Focus', icon: 'wand' },
  ];

  const quickTimes = ['09:00 AM', '11:00 AM', '02:00 PM', '05:00 PM', '08:00 PM'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const trimmedTitle = title.trim();

    // 1. Add to Universal Tasks
    onAddTask({
      title: trimmedTitle,
      category,
      priority,
      done: false,
      dueTime: dueTime.trim() || undefined,
    });

    // 2. If it's a DSA problem and callback provided, also queue in DSAView
    if (category === 'dsa' && onAddDSA) {
      const leetUrl = getLeetCodeUrl(trimmedTitle);
      onAddDSA({
        title: trimmedTitle,
        difficulty: dsaDifficulty,
        topic: dsaTopic,
        leetcodeUrl: leetUrl,
        notes: `Quick added on ${new Date().toLocaleDateString()}`,
      });
    }

    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    setJustAddedCount((prev) => prev + 1);

    if (keepOpen) {
      setTitle('');
      setDueTime('');
      inputRef.current?.focus();
    } else {
      onClose();
    }
  };

  const generatedLeetCodeUrl = category === 'dsa' && title.trim().length > 1
    ? getLeetCodeUrl(title.trim())
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5 overflow-y-auto apple-fade-in font-sans">
      <div className="w-full max-w-lg apple-liquid-glass rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl apple-sheet-spring sm:apple-modal-spring max-h-[92vh] flex flex-col border border-white/80">
        {/* Grab Handle for Mobile */}
        <div className="w-10 h-1 rounded-full bg-black/20 mx-auto mt-2.5 sm:hidden" />

        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-black/[0.06] flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-bold text-[#1D1D1F]">
                  Fast Add Task
                </h3>
                {justAddedCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {justAddedCount} added
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#86868B]">
                Press Enter to save instantly • Auto-assigns workspace
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Main Title Input */}
          <div>
            <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
              Task Title / What to accomplish?
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                required
                placeholder="e.g. Solve Two Sum in Python, Export client rough cut, Attend OS lecture..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/90 border border-white/90 border-b-black/[0.1] rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-black/20 shadow-xs placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Workspace Category Pills */}
          <div>
            <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1.5">
              Workspace Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all text-left ${
                    category === c.id
                      ? 'bg-black text-white border-black shadow-xs font-bold'
                      : 'bg-white/70 text-neutral-700 border-black/[0.06] hover:bg-white'
                  }`}
                >
                  <CustomIcon name={c.icon as any} className="w-3.5 h-3.5 shrink-0" white={category === c.id} />
                  <span className="truncate">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* If DSA Category Selected: Realtime LeetCode Link Preview & Difficulty */}
          {category === 'dsa' && (
            <div className="p-3.5 rounded-2xl bg-[#F6F5EF] border border-black/[0.08] space-y-2.5 apple-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                  <CustomIcon name="target" className="w-3.5 h-3.5" />
                  <span>Automatic LeetCode Problem Link</span>
                </span>
                {generatedLeetCodeUrl && (
                  <a
                    href={generatedLeetCodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-neutral-800 underline flex items-center gap-1 hover:text-black"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {generatedLeetCodeUrl ? (
                <div className="p-2 rounded-xl bg-white border border-black/[0.06] text-[11px] font-mono text-neutral-600 truncate flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">{generatedLeetCodeUrl}</span>
                </div>
              ) : (
                <p className="text-[11px] text-[#86868B]">
                  Type a problem name above (e.g. <em>Two Sum</em>) and the official LeetCode link will be generated automatically.
                </p>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                    Difficulty
                  </label>
                  <select
                    value={dsaDifficulty}
                    onChange={(e) => setDsaDifficulty(e.target.value as any)}
                    className="w-full bg-white border border-black/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-[#1D1D1F]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                    Pattern Topic
                  </label>
                  <input
                    type="text"
                    value={dsaTopic}
                    onChange={(e) => setDsaTopic(e.target.value)}
                    placeholder="e.g. Trees, Dynamic Programming"
                    className="w-full bg-white border border-black/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-[#1D1D1F]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Priority Tier Pills */}
          <div>
            <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1.5">
              Priority Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('must')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                  priority === 'must'
                    ? 'bg-neutral-900 text-white border-neutral-900 font-bold shadow-xs'
                    : 'bg-white/80 text-neutral-700 border-black/[0.06] hover:bg-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Must (Non-negotiable)</span>
              </button>
              <button
                type="button"
                onClick={() => setPriority('should')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                  priority === 'should'
                    ? 'bg-neutral-900 text-white border-neutral-900 font-bold shadow-xs'
                    : 'bg-white/80 text-neutral-700 border-black/[0.06] hover:bg-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Should (Important)</span>
              </button>
              <button
                type="button"
                onClick={() => setPriority('later')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                  priority === 'later'
                    ? 'bg-neutral-900 text-white border-neutral-900 font-bold shadow-xs'
                    : 'bg-white/80 text-neutral-700 border-black/[0.06] hover:bg-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-neutral-400" />
                <span>Later (Backlog)</span>
              </button>
            </div>
          </div>

          {/* Due Time Presets */}
          <div>
            <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1.5">
              Due Time / Schedule Target (Optional)
            </label>
            <div className="flex flex-wrap gap-1.5 items-center">
              {quickTimes.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setDueTime(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    dueTime === t
                      ? 'bg-black text-white font-bold'
                      : 'bg-white/80 text-neutral-600 border border-black/[0.06] hover:text-black'
                  }`}
                >
                  {t}
                </button>
              ))}
              <input
                type="text"
                placeholder="Custom time (e.g. 3:30 PM)"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="bg-white/80 border border-black/[0.08] rounded-lg px-2.5 py-1 text-xs text-[#1D1D1F] flex-1 min-w-[120px]"
              />
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-2 flex items-center justify-between border-t border-black/[0.06]">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#86868B] select-none">
              <input
                type="checkbox"
                checked={keepOpen}
                onChange={(e) => setKeepOpen(e.target.checked)}
                className="rounded accent-black w-3.5 h-3.5"
              />
              <span>Keep open to add another</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-[#86868B] hover:text-black"
              >
                Cancel
              </button>
              <Vaso depth={0.8} blur={0.4} specular={0.7} dispersion={0.15} radius={12}>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs disabled:opacity-40 flex items-center gap-1.5 border border-white/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Task</span>
                </button>
              </Vaso>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
