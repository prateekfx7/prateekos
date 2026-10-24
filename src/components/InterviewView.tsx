'use client';

import React, { useState } from 'react';
import { InterviewTopic } from '../types';
import { CustomIcon } from './CustomIcon';
import {
  Check,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InterviewViewProps {
  topics: InterviewTopic[];
  onToggleMastered: (id: string) => void;
  onAddTopic: (topic: Omit<InterviewTopic, 'id'>) => void;
}

export const InterviewView: React.FC<InterviewViewProps> = ({
  topics,
  onToggleMastered,
  onAddTopic,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<InterviewTopic['category']>('OS');
  const [notes, setNotes] = useState('');

  const categories = ['All', 'OS', 'DBMS', 'Computer Networks', 'System Design', 'Behavioral'];

  const filtered = topics.filter((t) => selectedCat === 'All' || t.category === selectedCat);

  const masteredCount = topics.filter((t) => t.mastered).length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTopic({
      title: title.trim(),
      category,
      mastered: false,
      notes: notes.trim() || undefined,
    });
    setTitle('');
    setNotes('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="apple-card p-6 bg-white/95 border border-black/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center font-bold">
              <CustomIcon name="venn" className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1D1D1F]">Technical Interview Preparation</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-semibold">
                  Core CS & System Design
                </span>
              </div>
              <p className="text-xs text-[#86868B] mt-0.5">
                Revise fundamental concepts in OS, DBMS, Networks & High-Level System Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-900 text-xs font-semibold flex items-center gap-2 border border-black/[0.06]">
              <CustomIcon name="trophy" className="w-4 h-4" />
              <span>{masteredCount}/{topics.length} Mastered</span>
            </div>

            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
            >
              <CustomIcon name="wand" className="w-3.5 h-3.5" white />
              <span>Add Concept</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-4 border-t border-black/[0.05] scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCat === c
                  ? 'bg-black text-white shadow-xs font-semibold'
                  : 'bg-[#F4F2EB] text-[#86868B] hover:text-black'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Add Topic Drawer */}
      {isAdding && (
        <form onSubmit={handleCreate} className="apple-card p-5 bg-[#FAF9F5] border border-black/[0.08] space-y-3">
          <h4 className="text-xs font-bold text-[#1D1D1F]">Add Core Interview Question or Concept</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              autoFocus
              placeholder="Concept (e.g. Virtual Memory & Thrashing)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="sm:col-span-2 bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as InterviewTopic['category'])}
              className="bg-white border border-black/[0.08] rounded-xl px-2.5 py-2 text-xs text-[#1D1D1F]"
            >
              <option value="OS">OS</option>
              <option value="DBMS">DBMS</option>
              <option value="Computer Networks">Computer Networks</option>
              <option value="System Design">System Design</option>
              <option value="Behavioral">Behavioral</option>
            </select>
          </div>

          <textarea
            placeholder="Revision summary & key talking points..."
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
              Save Concept
            </button>
          </div>
        </form>
      )}

      {/* Concepts List */}
      <div className="space-y-3">
        {filtered.map((topic) => (
          <div
            key={topic.id}
            className={`apple-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border transition-all ${
              topic.mastered ? 'bg-neutral-50/70 border-neutral-200' : 'bg-white border-black/[0.06] hover:border-black/20'
            }`}
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <button
                onClick={() => {
                  onToggleMastered(topic.id);
                  if (!topic.mastered) {
                    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
                  }
                }}
                className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 mt-0.5 transition-all ${
                  topic.mastered
                    ? 'bg-black border-black text-white'
                    : 'border-black/25 bg-white hover:border-black'
                }`}
              >
                {topic.mastered && <Check className="w-3 h-3 stroke-[3]" />}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm sm:text-base font-serif font-bold ${topic.mastered ? 'line-through text-[#86868B]' : 'text-[#1D1D1F]'}`}>
                    {topic.title}
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800">
                    {topic.category}
                  </span>
                </div>

                {topic.notes && (
                  <p className="text-xs text-[#86868B] mt-1 bg-[#FAF9F5] p-2 rounded-lg font-mono text-[11px] border border-black/[0.03]">
                    {topic.notes}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => onToggleMastered(topic.id)}
              className="text-xs font-medium px-3 py-1 rounded-lg bg-[#FAF9F5] hover:bg-[#F3EFE6] text-[#1D1D1F] border border-black/[0.04] shrink-0 self-end sm:self-center"
            >
              {topic.mastered ? 'Mastered' : 'Mark Mastered'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
