'use client';

import React, { useState } from 'react';
import { AIParsedResult, LifeTask } from '../types';
import { CustomIcon } from './CustomIcon';
import { parsePromptWithHybridAI } from '../lib/aiParser';
import { storage } from '../lib/storage';
import {
  X,
  Sparkles,
  ArrowRight,
  Check,
  Key,
  Clock,
  Layers,
  ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyParsedResult: (parsed: AIParsedResult) => void;
}

export const AIPromptModal: React.FC<AIPromptModalProps> = ({
  isOpen,
  onClose,
  onApplyParsedResult,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<AIParsedResult | null>(null);
  const [usedEngine, setUsedEngine] = useState<'gemini' | 'builtin'>('builtin');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [apiKey, setApiKey] = useState(storage.getApiKey());

  if (!isOpen) return null;

  const examplePrompts = [
    {
      label: 'Full Day Focus Plan',
      text: 'Today solve Two Sum and 3Sum on LeetCode in Python, finish client motion edit by 5pm, attend Operating Systems lecture at 2pm, send 10 cold outreach DMs, drink 8 glasses of water and workout at 7pm.',
    },
    {
      label: 'DSA + Client Rush',
      text: 'Solve 1 Medium Tree problem on LeetCode with Python notes, then export video review link for client by 3pm, and hydrate 8 glasses.',
    },
    {
      label: 'Academics & System Design',
      text: 'Study Database Indexing at 11am, review System Design Caching concepts, send 5 audit messages on LinkedIn, and sleep 8 hours tonight.',
    },
  ];

  const handleSaveKey = () => {
    storage.saveApiKey(apiKey.trim());
    setShowKeyConfig(false);
  };

  const handleParse = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const { result, engine } = await parsePromptWithHybridAI(prompt, apiKey);
      setParsedData(result);
      setUsedEngine(engine);
    } catch (err) {
      console.error('Failed to parse prompt:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmApply = () => {
    if (!parsedData) return;
    onApplyParsedResult(parsedData);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
    onClose();
    setPrompt('');
    setParsedData(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5 overflow-y-auto apple-fade-in">
      <div className="w-full max-w-2xl apple-liquid-glass rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl apple-sheet-spring sm:apple-modal-spring max-h-[92vh] flex flex-col border border-white/80">
        {/* Grab Handle for Mobile */}
        <div className="w-10 h-1 rounded-full bg-black/20 mx-auto mt-2.5 sm:hidden" />

        {/* Modal Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-black/[0.06] flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#18181B] text-white flex items-center justify-center shadow-xs">
              <CustomIcon name="wand" className="w-5 h-5" white />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-[#1D1D1F]">
                  Universal AI Prompt Intake
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[10px] font-mono font-semibold">
                  CMD+K
                </span>
              </div>
              <p className="text-[11px] text-[#86868B] flex items-center gap-1.5 mt-0.5">
                <span>Free Hybrid Engine</span>
                <span>•</span>
                <button
                  onClick={() => setShowKeyConfig(!showKeyConfig)}
                  className="text-neutral-700 hover:text-black font-medium underline flex items-center gap-1"
                >
                  <Key className="w-3 h-3" />
                  <span>{apiKey ? 'Gemini Flash API Active' : 'Configure Free Gemini Key (Optional)'}</span>
                </button>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 active:scale-90 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free API Key Configuration Drawer */}
        {showKeyConfig && (
          <div className="p-4 bg-neutral-50 border-b border-black/[0.06] text-xs space-y-2.5 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1D1D1F]">Google Gemini Flash Free Tier API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-600 hover:underline"
              >
                Get Free API Key from Google AI Studio ↗
              </a>
            </div>
            <p className="text-[11px] text-[#86868B]">
              100% free forever (15 RPM free tier). If left blank, the app uses its built-in offline NLP engine with zero setup needed!
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs text-[#1D1D1F]"
              />
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800"
              >
                Save Key
              </button>
            </div>
          </div>
        )}

        {/* Prompt Input State OR 1-Click Review State */}
        {!parsedData ? (
          <form onSubmit={handleParse} className="p-5 sm:p-6 space-y-4">
            <div>
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider block mb-1.5">
                Describe your tasks, meetings, lectures & routines in plain words:
              </label>
              <textarea
                autoFocus
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Today I have to solve Two Sum and 3Sum on LeetCode in Python, deliver motion edit for client by 5pm, attend OS lecture at 2pm, send 10 cold DMs on Twitter, drink 8 glasses of water, and hit the gym at 7pm..."
                className="w-full bg-[#FAF9F5] border border-black/[0.08] rounded-2xl p-4 text-base sm:text-xs text-[#1D1D1F] placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-black resize-none leading-relaxed"
              />
            </div>

            {/* Quick Prompt Example Chips */}
            <div>
              <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1.5">
                Quick Example Prompts (Click to Fill):
              </span>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPrompt(ex.text)}
                    className="px-2.5 py-1 rounded-xl bg-[#FAF9F5] hover:bg-[#F3EFE6] text-neutral-700 text-[11px] font-medium border border-black/[0.04] active:scale-95 transition-all text-left truncate max-w-xs"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Parse Submit Action */}
            <div className="flex items-center justify-between pt-3 border-t border-black/[0.06]">
              <span className="text-[11px] text-[#86868B]">
                Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800 font-mono text-[10px]">CMD+Enter</kbd> to structure
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-[#86868B] hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!prompt.trim() || isProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs disabled:opacity-40"
                >
                  <CustomIcon name="wand" className="w-3.5 h-3.5" white />
                  <span>{isProcessing ? 'Structuring Tasks...' : 'Parse & Categorize All'}</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* 1-CLICK REVIEW & DISTRIBUTE SCREEN (User Choice) */
          <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 block">
                  Parsed via {usedEngine === 'gemini' ? 'Google Gemini Flash API' : 'Intelligent Built-in Parser'}
                </span>
                <h4 className="text-base font-serif font-bold text-[#1D1D1F] mt-0.5">
                  1-Click Multi-Pillar Review
                </h4>
              </div>

              <button
                onClick={() => setParsedData(null)}
                className="text-xs text-neutral-600 hover:text-black underline"
              >
                Edit Prompt
              </button>
            </div>

            {/* Parsed Categorized Breakdown Cards */}
            <div className="space-y-3">
              {/* DSA Items */}
              {parsedData.dsaProblems.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-black/[0.05] space-y-2">
                  <div className="flex items-center gap-2">
                    <CustomIcon name="target" className="w-4 h-4 text-neutral-800" />
                    <span className="text-xs font-bold text-[#1D1D1F]">
                      DSA & LeetCode ({parsedData.dsaProblems.length} Problems)
                    </span>
                  </div>
                  <div className="space-y-1 pl-6">
                    {parsedData.dsaProblems.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-neutral-800 truncate">• {p.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-200 text-neutral-800 shrink-0">
                          {p.difficulty} • {p.topic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Projects */}
              {parsedData.clientTasks.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-black/[0.05] space-y-2">
                  <div className="flex items-center gap-2">
                    <CustomIcon name="briefcase" className="w-4 h-4 text-neutral-800" />
                    <span className="text-xs font-bold text-[#1D1D1F]">
                      Video Client Deliverables ({parsedData.clientTasks.length} Projects)
                    </span>
                  </div>
                  <div className="space-y-1.5 pl-6">
                    {parsedData.clientTasks.map((c, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-[#1D1D1F]">{c.clientName}: </span>
                          <span className="text-neutral-700">{c.taskText}</span>
                        </div>
                        {c.deadline && (
                          <span className="text-[10px] font-mono text-neutral-600 bg-neutral-200 px-2 py-0.5 rounded shrink-0">
                            {c.deadline}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* College Academics */}
              {parsedData.collegeTasks.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-black/[0.05] space-y-2">
                  <div className="flex items-center gap-2">
                    <CustomIcon name="easel" className="w-4 h-4 text-neutral-800" />
                    <span className="text-xs font-bold text-[#1D1D1F]">
                      College Academics ({parsedData.collegeTasks.length} Lectures/Tasks)
                    </span>
                  </div>
                  <div className="space-y-1 pl-6 text-xs text-neutral-800">
                    {parsedData.collegeTasks.map((col, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span>• {col.subjectName} ({col.subjectCode})</span>
                        {col.assignmentText && (
                          <span className="text-[10px] bg-neutral-200 px-2 py-0.5 rounded">
                            {col.assignmentText}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Outreach Leads */}
              {parsedData.outreachLeads.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-black/[0.05] space-y-2">
                  <div className="flex items-center gap-2">
                    <CustomIcon name="network" className="w-4 h-4 text-neutral-800" />
                    <span className="text-xs font-bold text-[#1D1D1F]">
                      High-Ticket Outreach CRM ({parsedData.outreachLeads.length} Lead Sprints)
                    </span>
                  </div>
                  <div className="space-y-1 pl-6 text-xs text-neutral-800">
                    {parsedData.outreachLeads.map((l, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span>• {l.notes || l.name}</span>
                        <span className="text-[10px] font-mono bg-neutral-200 px-2 py-0.5 rounded">
                          {l.platform}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Health & Routine Goals */}
              {parsedData.healthMetrics && (parsedData.healthMetrics.waterGlasses || parsedData.healthMetrics.workoutDone !== undefined) && (
                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-black/[0.05] space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CustomIcon name="water" className="w-4 h-4 text-neutral-800" />
                    <span className="text-xs font-bold text-[#1D1D1F]">Health & Daily Routine</span>
                  </div>
                  <div className="flex items-center gap-3 pl-6 text-xs text-neutral-800 font-mono">
                    {parsedData.healthMetrics.waterGlasses && (
                      <span>Hydration Target: {parsedData.healthMetrics.waterGlasses} glasses</span>
                    )}
                    {parsedData.healthMetrics.workoutDone !== undefined && (
                      <span>• Workout Scheduled</span>
                    )}
                  </div>
                </div>
              )}

              {/* Timeline Time Blocks */}
              {parsedData.timelineBlocks.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-white border border-black/[0.08] space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-800" />
                    <span className="text-xs font-bold text-[#1D1D1F]">
                      Automatically Scheduled on Today's Timeline ({parsedData.timelineBlocks.length} Blocks)
                    </span>
                  </div>
                  <div className="space-y-1.5 pl-6">
                    {parsedData.timelineBlocks.map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#1D1D1F]">{t.title}</span>
                        <span className="text-[10px] font-mono bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-black/[0.05]">
                          {t.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm & Distribute Button */}
            <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between">
              <span className="text-xs text-[#86868B]">
                Review items above. Ready to deploy?
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setParsedData(null)}
                  className="px-3.5 py-2 rounded-xl text-xs text-[#86868B] hover:text-black font-semibold"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApply}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-md"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Distribute to All Systems & Timeline</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
