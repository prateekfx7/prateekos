'use client';

import React, { useState } from 'react';
import { LifeTask } from '../types';
import { CustomIcon } from './CustomIcon';
import { X } from 'lucide-react';

interface QuickAddModalProps {
  onAddTask: (task: Omit<LifeTask, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  onAddTask,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<LifeTask['category']>('dsa');
  const [priority, setPriority] = useState<LifeTask['priority']>('must');
  const [dueTime, setDueTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      category,
      priority,
      done: false,
      dueTime: dueTime.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 apple-fade-in">
      <div className="w-full max-w-md apple-liquid-glass rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl apple-sheet-spring sm:apple-modal-spring max-h-[92vh] overflow-y-auto border border-white/75">
        {/* Grab Handle for Mobile */}
        <div className="w-10 h-1 rounded-full bg-black/20 mx-auto mt-2.5 sm:hidden" />

        <div className="p-4 border-b border-black/[0.06] flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center border border-white/20 shadow-xs">
              <CustomIcon name="wand" className="w-4 h-4" white />
            </div>
            <h3 className="text-base font-serif font-bold text-[#1D1D1F]">Add Universal Task</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 active:scale-90 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
              Task Description
            </label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Solve 1 Tree BFS problem in Python..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-[#1D1D1F] focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                Workspace
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as LifeTask['category'])}
                className="w-full bg-[#FAF9F5] border border-black/[0.08] rounded-xl px-3 py-2 text-base sm:text-xs text-[#1D1D1F]"
              >
                <option value="dsa">DSA & LeetCode</option>
                <option value="clients">Video Clients</option>
                <option value="outreach">High-Ticket Outreach</option>
                <option value="college">College & Subjects</option>
                <option value="interview">Interview Prep</option>
                <option value="health">Health & Routine</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as LifeTask['priority'])}
                className="w-full bg-[#FAF9F5] border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
              >
                <option value="must">Must Priority</option>
                <option value="should">Should Do</option>
                <option value="later">Later / Backlog</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
              Target Time (Optional)
            </label>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-[#86868B] hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
            >
              <CustomIcon name="wand" className="w-3.5 h-3.5" white />
              <span>Add Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
