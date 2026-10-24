'use client';

import React, { useState } from 'react';
import { DSAProblem } from '../types';
import { CustomIcon } from './CustomIcon';
import {
  Check,
  Plus,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DSAViewProps {
  problems: DSAProblem[];
  onToggleProblem: (id: string) => void;
  onAddProblem: (problem: Omit<DSAProblem, 'id' | 'solved'>) => void;
}

export const DSAView: React.FC<DSAViewProps> = ({
  problems,
  onToggleProblem,
  onAddProblem,
}) => {
  const [filterTopic, setFilterTopic] = useState<string>('All');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [topic, setTopic] = useState<string>('Arrays & Hashing');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [notes, setNotes] = useState<string>('');
  const [leetcodeUrl, setLeetcodeUrl] = useState<string>('');

  const solvedCount = problems.filter((p) => p.solved).length;
  const target = 3;

  const topics = ['All', 'Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Linked List', 'Trees', 'Dynamic Programming'];

  const filtered = problems.filter((p) => {
    return filterTopic === 'All' || p.topic === filterTopic;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddProblem({
      title: title.trim(),
      topic,
      difficulty,
      notes: notes.trim() || undefined,
      leetcodeUrl: leetcodeUrl.trim() || undefined,
    });
    setTitle('');
    setNotes('');
    setLeetcodeUrl('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-sans">
      {/* Top Banner */}
      <div className="apple-card p-6 bg-white/95 border border-black/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center p-2">
              <CustomIcon name="target" className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1D1D1F] tracking-tight">DSA & LeetCode (Python)</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-semibold font-sans">
                  NeetCode 150 & Striver SDE
                </span>
              </div>
              <p className="text-xs text-[#86868B] mt-0.5 font-sans">
                Target: 2-3 problems daily in Python 3 • Master core algorithmic patterns
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-900 text-xs font-semibold flex items-center gap-1.5 border border-black/[0.06] font-sans">
              <span>{solvedCount}/{target} Solved Today</span>
            </div>

            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs font-sans"
            >
              <CustomIcon name="wand" className="w-3.5 h-3.5" white />
              <span>Add Problem</span>
            </button>
          </div>
        </div>

        {/* Topic Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-4 border-t border-black/[0.05] scrollbar-none">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setFilterTopic(t)}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterTopic === t
                  ? 'bg-black text-white font-semibold shadow-xs'
                  : 'bg-[#F4F2EB] text-[#86868B] hover:text-black'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Add Problem Modal / Drawer */}
      {isAdding && (
        <form onSubmit={handleCreate} className="apple-card p-5 bg-[#FAF9F5] border border-black/[0.08] space-y-3">
          <h4 className="text-xs font-bold text-[#1D1D1F]">Queue New LeetCode Problem</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              autoFocus
              placeholder="Problem Name (e.g. Valid Anagram)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="sm:col-span-2 bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
              className="bg-white border border-black/[0.08] rounded-xl px-2.5 py-2 text-xs text-[#1D1D1F]"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            >
              {topics.filter((t) => t !== 'All').map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <input
              type="url"
              placeholder="https://leetcode.com/problems/..."
              value={leetcodeUrl}
              onChange={(e) => setLeetcodeUrl(e.target.value)}
              className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
          </div>

          <textarea
            placeholder="Python key approach & time complexity notes..."
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] resize-none"
          />

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-[#86868B] hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-black text-white text-xs font-bold"
            >
              Save Problem
            </button>
          </div>
        </form>
      )}

      {/* Problems List */}
      <div className="space-y-2.5">
        {filtered.map((problem, idx) => {
          return (
            <div
              key={problem.id}
              className={`apple-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border transition-all duration-200 apple-spring-in hover:-translate-y-0.5 hover:shadow-xs ${
                problem.solved
                  ? 'bg-neutral-50/70 border-neutral-200/60'
                  : 'bg-white border-black/[0.06] hover:border-black/20'
              }`}
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  onClick={() => {
                    onToggleProblem(problem.id);
                    if (!problem.solved) {
                      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
                    }
                  }}
                  className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 mt-0.5 transition-all duration-150 active:scale-90 ${
                    problem.solved
                      ? 'bg-black border-black text-white apple-check-pop'
                      : 'border-black/25 bg-white hover:border-black'
                  }`}
                >
                  {problem.solved && <Check className="w-3 h-3 stroke-[3]" />}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-xs sm:text-sm font-bold transition-all duration-200 ${problem.solved ? 'line-through text-[#86868B] opacity-60' : 'text-[#1D1D1F]'}`}>
                      {problem.title}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800">
                      {problem.difficulty}
                    </span>
                    <span className="text-[10px] font-medium text-[#86868B] bg-[#F4F2EB] px-2 py-0.5 rounded-md">
                      {problem.topic}
                    </span>
                  </div>

                  {problem.notes && (
                    <p className="text-xs text-[#86868B] mt-1 bg-[#FAF9F5] p-2 rounded-lg font-mono text-[11px] border border-black/[0.03]">
                      Approach: {problem.notes}
                    </p>
                  )}
                </div>
              </div>

              {problem.leetcodeUrl && (
                <a
                  href={problem.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-semibold text-neutral-700 hover:text-black shrink-0 self-end sm:self-center"
                >
                  <span>Solve on LeetCode</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
