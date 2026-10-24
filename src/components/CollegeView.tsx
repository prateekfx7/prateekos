'use client';

import React, { useState } from 'react';
import { CollegeSubject } from '../types';
import { CustomIcon } from './CustomIcon';
import {
  Plus,
} from 'lucide-react';

interface CollegeViewProps {
  subjects: CollegeSubject[];
  onUpdateAttendance: (subjectId: string, attended: boolean) => void;
  onToggleAssignment: (subjectId: string, assignmentText: string) => void;
  onAddSubject: (subject: Omit<CollegeSubject, 'id'>) => void;
}

export const CollegeView: React.FC<CollegeViewProps> = ({
  subjects,
  onUpdateAttendance,
  onToggleAssignment,
  onAddSubject,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState(4);
  const [nextExamDate, setNextExamDate] = useState('Nov 15');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddSubject({
      name: name.trim(),
      code: code.trim() || 'CS405',
      credits,
      attendancePresent: 20,
      attendanceTotal: 22,
      syllabusProgress: 50,
      assignmentsPending: ['Assignment 1 Submission'],
      nextExamDate,
    });
    setName('');
    setCode('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="apple-card p-6 bg-white/95 border border-black/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center font-bold">
              <CustomIcon name="easel" className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1D1D1F]">College Academics & Subjects</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-semibold">
                  75% Attendance Safeguard
                </span>
              </div>
              <p className="text-xs text-[#86868B] mt-0.5">
                Manage semester subjects, track attendance criteria, assignments & exam prep
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs self-start sm:self-auto"
          >
            <CustomIcon name="wand" className="w-3.5 h-3.5" white />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* Add Subject Modal / Drawer */}
      {isAdding && (
        <form onSubmit={handleCreate} className="apple-card p-5 bg-[#FAF9F5] border border-black/[0.08] space-y-3">
          <h4 className="text-xs font-bold text-[#1D1D1F]">Add Semester Subject</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              autoFocus
              placeholder="Subject Name (e.g. Distributed Systems)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="sm:col-span-2 bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
            <input
              type="text"
              placeholder="Course Code (e.g. CS405)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Credits (e.g. 4)"
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
              className="w-28 bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
            <input
              type="text"
              placeholder="Next Exam Date (e.g. Nov 20)"
              value={nextExamDate}
              onChange={(e) => setNextExamDate(e.target.value)}
              className="flex-1 bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
          </div>

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
              Save Subject
            </button>
          </div>
        </form>
      )}

      {/* Subjects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((subj, idx) => {
          const attendancePercent = Math.round((subj.attendancePresent / Math.max(1, subj.attendanceTotal)) * 100);
          const isSafe = attendancePercent >= 75;

          return (
            <div
              key={subj.id}
              className="apple-card p-5 bg-white border border-black/[0.06] space-y-4 apple-spring-in hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded-md">
                      {subj.code} • {subj.credits} Credits
                    </span>
                    {subj.nextExamDate && (
                      <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                        Exam: {subj.nextExamDate}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-serif font-bold text-[#1D1D1F] mt-1.5">{subj.name}</h3>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-md font-mono transition-colors ${
                      isSafe ? 'bg-neutral-100 text-neutral-900 border border-black/[0.06]' : 'bg-neutral-800 text-white'
                    }`}
                  >
                    {attendancePercent}%
                  </span>
                  <p className="text-[10px] text-[#86868B] mt-0.5 font-mono">
                    {subj.attendancePresent}/{subj.attendanceTotal} attended
                  </p>
                </div>
              </div>

              {/* Attendance Actions */}
              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-black/[0.03] flex items-center justify-between">
                <span className="text-xs font-medium text-[#1D1D1F]">Today's Lecture:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onUpdateAttendance(subj.id, true)}
                    className="px-2.5 py-1 rounded-lg bg-black text-white text-[11px] font-medium hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
                  >
                    + Attended
                  </button>
                  <button
                    onClick={() => onUpdateAttendance(subj.id, false)}
                    className="px-2.5 py-1 rounded-lg bg-neutral-200 text-neutral-800 text-[11px] font-medium hover:bg-neutral-300 active:scale-95 transition-all"
                  >
                    Missed
                  </button>
                </div>
              </div>

              {/* Syllabus Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#86868B]">
                  <span>Syllabus Covered</span>
                  <span className="font-mono font-bold text-[#1D1D1F]">{subj.syllabusProgress}%</span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden p-0.5 border border-black/[0.04]">
                  <div
                    className="bg-neutral-900 h-full rounded-full apple-liquid-bar transition-all duration-500 ease-out"
                    style={{ width: `${subj.syllabusProgress}%` }}
                  />
                </div>
              </div>

              {/* Pending Assignments */}
              <div className="space-y-1.5 pt-2 border-t border-black/[0.04]">
                <span className="text-[10px] font-bold uppercase text-[#86868B] tracking-wider block">
                  Assignments ({subj.assignmentsPending.length})
                </span>
                {subj.assignmentsPending.length === 0 ? (
                  <p className="text-xs text-neutral-600 font-medium">All assignments submitted.</p>
                ) : (
                  subj.assignmentsPending.map((assign, i) => (
                    <div
                      key={i}
                      onClick={() => onToggleAssignment(subj.id, assign)}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-50 active:scale-98 transition-all cursor-pointer text-xs group"
                    >
                      <button className="w-4 h-4 rounded border border-black/30 group-hover:border-black flex items-center justify-center shrink-0 transition-colors" />
                      <span className="text-neutral-800 truncate group-hover:text-black transition-colors">{assign}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
