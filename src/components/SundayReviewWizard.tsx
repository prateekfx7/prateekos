'use client';

import React, { useState } from 'react';
import { WeeklyReview, Task, Habit, FocusSession } from '../types';
import { Sparkles, Trophy, CheckCircle2, ArrowRight, ArrowLeft, Target, AlertTriangle, Lightbulb, Save } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SundayReviewWizardProps {
  tasks: Task[];
  habits: Habit[];
  focusSessions: FocusSession[];
  pastReviews: WeeklyReview[];
  onSaveReview: (review: Omit<WeeklyReview, 'id' | 'created_at'>) => void;
}

export const SundayReviewWizard: React.FC<SundayReviewWizardProps> = ({
  tasks,
  habits,
  focusSessions,
  pastReviews,
  onSaveReview,
}) => {
  const [step, setStep] = useState<number>(1);
  const [wins, setWins] = useState<string[]>([
    'Completed all client video cut iterations on schedule',
    'Hit 100% on morning hydration & sunlight routine',
    '',
  ]);
  const [stuck, setStuck] = useState<string[]>([
    'Midday interruptions pushed deep focus blocks past 16:00',
    '',
  ]);
  const [lessons, setLessons] = useState<string[]>([
    'Lock down afternoon focus blocks in calendar as non-negotiable',
    '',
  ]);
  const [targets, setTargets] = useState<string[]>([
    'Deliver final motion deliverables for client sign-off',
    'Draft content script for new system demo video',
    'Maintain daily Must task completion streak',
  ]);

  // Aggregate weekly metrics
  const completedTasks = tasks.filter((t) => t.status === 'done');
  const totalFocusMinutes = focusSessions.reduce((acc, curr) => acc + curr.duration_minutes, 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);
  const habitCompletionRate = Math.round(
    (habits.filter((h) => h.completed_today).length / Math.max(1, habits.length)) * 100
  );

  // Composite weekly score out of 10
  const calculatedScore = Math.min(
    9.8,
    Math.max(6.5, 7.0 + completedTasks.length * 0.3 + (habitCompletionRate / 100) * 1.5)
  );

  const handleFinish = () => {
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
    });
    onSaveReview({
      week_start: new Date().toISOString().split('T')[0],
      score: Number(calculatedScore.toFixed(1)),
      wins: wins.filter((w) => w.trim().length > 0),
      stuck: stuck.filter((s) => s.trim().length > 0),
      lessons: lessons.filter((l) => l.trim().length > 0),
      targets: targets.filter((t) => t.trim().length > 0),
    });
    setStep(6); // Success state
  };

  return (
    <div className="space-y-6">
      {/* Wizard Header Card */}
      <div className="apple-card p-6 bg-white/95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold">
              <Target className="w-5 h-5 text-neutral-800" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1D1D1F]">Sunday Weekly Review & Calibration</h2>
              <p className="text-xs text-[#86868B]">Step {step} of 5 • Calibrate momentum & set next week</p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 border border-black/[0.06]">
            Week of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-5 gap-2 mt-5">
          {['Metrics', 'Wins', 'Friction', 'Lessons', 'Targets'].map((label, idx) => (
            <div key={label} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  step > idx + 1
                    ? 'bg-neutral-900'
                    : step === idx + 1
                    ? 'bg-neutral-500'
                    : 'bg-neutral-200'
                }`}
              />
              <span className="text-[10px] font-semibold text-[#86868B] block text-center truncate">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="apple-card p-6 bg-white/95">
        {step === 1 && (
          <div className="space-y-5">
            <div className="text-center py-2">
              <span className="text-5xl font-extrabold text-[#1D1D1F] tracking-tight">
                {calculatedScore.toFixed(1)}
              </span>
              <p className="text-xs font-bold text-[#86868B] uppercase tracking-wider mt-1">
                Calculated Weekly Operating Score
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-black/[0.05] text-center">
                <span className="text-2xl font-bold text-neutral-900">{completedTasks.length}</span>
                <p className="text-xs font-medium text-neutral-600 mt-0.5">Tasks Completed</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-black/[0.05] text-center">
                <span className="text-2xl font-bold text-neutral-900">{habitCompletionRate}%</span>
                <p className="text-xs font-medium text-neutral-600 mt-0.5">Habit Consistency</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-black/[0.05] text-center">
                <span className="text-2xl font-bold text-neutral-900">{totalFocusHours}h</span>
                <p className="text-xs font-medium text-neutral-600 mt-0.5">Deep Focus Logged</p>
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed bg-[#FAF9F5] p-3.5 rounded-xl border border-black/[0.04]">
              <strong>System Insight:</strong> Your execution on high-leverage Must tasks is in the top quartile. Consolidate your afternoon schedule to protect consecutive deep work hours.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-[#1D1D1F]">What were your biggest wins this week?</h3>
            </div>
            <p className="text-xs text-[#86868B]">Record 2-3 tangible breakthroughs and completed deliverables.</p>

            {wins.map((win, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-5 text-xs font-mono font-bold text-[#86868B] text-center">{i + 1}.</span>
                <input
                  type="text"
                  placeholder="Win or deliverable accomplished..."
                  value={win}
                  onChange={(e) => {
                    const newWins = [...wins];
                    newWins[i] = e.target.value;
                    setWins(newWins);
                  }}
                  className="flex-1 bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-bold text-[#1D1D1F]">Where did friction or momentum loss occur?</h3>
            </div>
            <p className="text-xs text-[#86868B]">Identify bottlenecks, context switches, or stalled tasks.</p>

            {stuck.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-5 text-xs font-mono font-bold text-[#86868B] text-center">{i + 1}.</span>
                <input
                  type="text"
                  placeholder="Friction point or obstacle..."
                  value={item}
                  onChange={(e) => {
                    const newStuck = [...stuck];
                    newStuck[i] = e.target.value;
                    setStuck(newStuck);
                  }}
                  className="flex-1 bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-neutral-700" />
              <h3 className="text-sm font-bold text-[#1D1D1F]">Key Lessons & SOP Refinements</h3>
            </div>
            <p className="text-xs text-[#86868B]">What will you do differently next week to protect flow?</p>

            {lessons.map((lesson, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-5 text-xs font-mono font-bold text-[#86868B] text-center">{i + 1}.</span>
                <input
                  type="text"
                  placeholder="Lesson learned..."
                  value={lesson}
                  onChange={(e) => {
                    const newLessons = [...lessons];
                    newLessons[i] = e.target.value;
                    setLessons(newLessons);
                  }}
                  className="flex-1 bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            ))}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-neutral-800" />
              <h3 className="text-sm font-bold text-[#1D1D1F]">Top 3 Non-Negotiable Targets For Next Week</h3>
            </div>
            <p className="text-xs text-[#86868B]">Lock in the 3 outcomes that make the upcoming week a success.</p>

            {targets.map((tgt, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-5 text-xs font-mono font-bold text-neutral-800 text-center">{i + 1}.</span>
                <input
                  type="text"
                  placeholder={`Top Target #${i + 1}`}
                  value={tgt}
                  onChange={(e) => {
                    const newTargets = [...targets];
                    newTargets[i] = e.target.value;
                    setTargets(newTargets);
                  }}
                  className="flex-1 bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            ))}
          </div>
        )}

        {step === 6 && (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-900 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1D1D1F]">Weekly Calibration Complete!</h3>
            <p className="text-xs text-[#86868B] max-w-sm mx-auto">
              Your targets are locked into the system. Enjoy your Sunday recharge and step into Monday with clarity.
            </p>
            <button
              onClick={() => setStep(1)}
              className="mt-3 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800"
            >
              Back to Overview
            </button>
          </div>
        )}

        {/* Step Navigation Controls */}
        {step <= 5 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/[0.05]">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                step === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-neutral-100 text-[#1D1D1F]'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {step < 5 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Weekly Calibration</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Past Reviews Archive */}
      {pastReviews.length > 0 && (
        <div className="apple-card p-5 bg-white/95 space-y-3">
          <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider">
            Past Weekly Calibrations
          </h4>
          {pastReviews.map((rev) => (
            <div key={rev.id} className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-black/[0.04] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1D1D1F]">Week of {rev.week_start}</span>
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 font-mono text-xs font-bold border border-black/[0.05]">
                  Score: {rev.score}
                </span>
              </div>
              <div className="text-[11px] text-[#86868B]">
                <strong>Targets set:</strong> {rev.targets.join(' • ')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
