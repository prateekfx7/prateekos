'use client';

import React, { useState } from 'react';
import { Task, Project, ProjectSOP, SOPItem, FocusSession } from '../types';
import {
  Inbox,
  Calendar,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Check,
  Plus,
  Play,
  RotateCcw,
  BookOpen,
  Folder,
  Layers,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CollectionsViewProps {
  tasks: Task[];
  projects: Project[];
  sops: ProjectSOP[];
  focusSessions: FocusSession[];
  onToggleTask: (taskId: string) => void;
  onToggleSOPItem: (sopId: string, itemId: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'created_at'>) => void;
  onResetSOP: (sopId: string) => void;
  onStartFocus: (taskTitle: string, projectId: string) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  tasks,
  projects,
  sops,
  focusSessions,
  onToggleTask,
  onToggleSOPItem,
  onAddTask,
  onResetSOP,
  onStartFocus,
}) => {
  const [activeCollection, setActiveCollection] = useState<'all' | 'inbox' | 'today' | 'someday' | 'upcoming' | 'adventure'>('all');
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({
    'proj-1': true,
    'proj-2': true,
    'proj-3': false,
    'proj-4': true,
  });
  const [expandedSOPs, setExpandedSOPs] = useState<Record<string, boolean>>({
    'sop-1': true,
    'sop-2': true,
  });

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSOP = (id: string) => {
    setExpandedSOPs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const inboxTasks = tasks.filter((t) => !t.project_id && t.status !== 'done');
  const todayTasks = tasks.filter((t) => t.status !== 'done');
  const somedayTasks = tasks.filter((t) => t.priority === 'later' && t.status !== 'done');

  return (
    <div className="space-y-6">
      {/* Top Skeuomorphic / Glossy Squircle Buckets (Inspired by Stuff _ ToDos and Lists.jpeg) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Inbox Bucket */}
        <div
          onClick={() => setActiveCollection(activeCollection === 'inbox' ? 'all' : 'inbox')}
          className={`cursor-pointer rounded-3xl p-5 relative overflow-hidden transition-all duration-200 border ${
            activeCollection === 'inbox'
              ? 'ring-2 ring-blue-500 shadow-md'
              : 'hover:shadow-md'
          } bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 text-white shadow-sm`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Inbox className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/25 backdrop-blur-md font-mono">
              {inboxTasks.length}
            </span>
          </div>

          <h3 className="text-lg font-bold tracking-tight">Inbox</h3>
          <p className="text-[11px] text-blue-100 font-medium">Quick capture queue</p>

          {/* Peeking Card graphic */}
          <div className="mt-3 p-2.5 rounded-xl bg-white/90 text-neutral-800 shadow-inner flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full border border-neutral-400 shrink-0" />
            <span className="text-xs font-medium truncate">
              {inboxTasks[0]?.title || 'Empty capture inbox'}
            </span>
          </div>
        </div>

        {/* Today Bucket */}
        <div
          onClick={() => setActiveCollection(activeCollection === 'today' ? 'all' : 'today')}
          className={`cursor-pointer rounded-3xl p-5 relative overflow-hidden transition-all duration-200 border ${
            activeCollection === 'today'
              ? 'ring-2 ring-neutral-700 shadow-md'
              : 'hover:shadow-md'
          } bg-gradient-to-br from-neutral-800 via-neutral-900 to-black text-white shadow-sm`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/25 backdrop-blur-md font-mono">
              {todayTasks.length}
            </span>
          </div>

          <h3 className="text-lg font-bold tracking-tight">Today</h3>
          <p className="text-[11px] text-neutral-300 font-medium">Active today agenda</p>

          {/* Peeking Card graphic */}
          <div className="mt-3 p-2.5 rounded-xl bg-white/95 text-neutral-800 shadow-inner flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full border border-neutral-400 shrink-0" />
            <span className="text-xs font-medium truncate">
              {todayTasks[0]?.title || 'All current tasks clear'}
            </span>
          </div>
        </div>
      </div>

      {/* Collections Row */}
      <div className="apple-card p-4 bg-white/90">
        <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider mb-2 px-1">
          Collections
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setActiveCollection(activeCollection === 'someday' ? 'all' : 'someday')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
              activeCollection === 'someday' ? 'bg-neutral-900 text-white font-bold' : 'bg-[#FBF9F4] hover:bg-[#F3EFE4] text-neutral-800'
            }`}
          >
            <Clock className="w-5 h-5 mb-1.5" />
            <span className="text-xs font-semibold">Someday</span>
            <span className={`text-[10px] ${activeCollection === 'someday' ? 'text-neutral-300' : 'text-[#86868B]'}`}>({somedayTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveCollection(activeCollection === 'upcoming' ? 'all' : 'upcoming')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
              activeCollection === 'upcoming' ? 'bg-neutral-900 text-white font-bold' : 'bg-[#FBF9F4] hover:bg-[#F3EFE4] text-neutral-800'
            }`}
          >
            <Calendar className="w-5 h-5 mb-1.5" />
            <span className="text-xs font-semibold">Upcoming</span>
            <span className={`text-[10px] ${activeCollection === 'upcoming' ? 'text-neutral-300' : 'text-[#86868B]'}`}>Timeline</span>
          </button>

          <button
            onClick={() => setActiveCollection(activeCollection === 'adventure' ? 'all' : 'adventure')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
              activeCollection === 'adventure' ? 'bg-neutral-900 text-white font-bold' : 'bg-[#FBF9F4] hover:bg-[#F3EFE4] text-neutral-800'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-1.5" />
            <span className="text-xs font-semibold">Adventure Log</span>
            <span className={`text-[10px] ${activeCollection === 'adventure' ? 'text-neutral-300' : 'text-[#86868B]'}`}>({focusSessions.length} logged)</span>
          </button>
        </div>
      </div>

      {/* Adventure Log Section (Shown when active) */}
      {activeCollection === 'adventure' && (
        <div className="apple-card p-5 bg-white border border-black/[0.08]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-neutral-700" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1D1D1F]">Adventure Log: Work Feed</h3>
                <p className="text-[11px] text-[#86868B]">Continuous record of completed focus blocks & accomplishments</p>
              </div>
            </div>
            <button
              onClick={() => setActiveCollection('all')}
              className="text-xs font-medium text-[#86868B] hover:text-black"
            >
              Close
            </button>
          </div>

          <div className="space-y-2 mt-3">
            {focusSessions.map((session) => {
              const project = projects.find((p) => p.id === session.project_id);
              const dateStr = new Date(session.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={session.id}
                  className="p-3 rounded-xl bg-neutral-50/80 border border-black/[0.05] flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-neutral-200 text-neutral-800 flex items-center justify-center font-bold text-xs">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1D1D1F]">{session.task_title || 'Deep Work Session'}</h4>
                      <p className="text-[11px] text-[#86868B] flex items-center gap-1.5 mt-0.5">
                        <span>{project?.name}</span>
                        <span>•</span>
                        <span>{session.notes || 'Focus session completed'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 font-mono text-xs font-bold border border-black/[0.05]">
                      +{session.duration_minutes}m
                    </span>
                    <p className="text-[10px] text-[#86868B] font-mono mt-0.5">{dateStr}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Spaces & Lists Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider">
            Spaces & Project Checklists
          </h4>
          <span className="text-[11px] text-[#86868B]">Collapsible in-place SOPs</span>
        </div>

        {projects.map((proj) => {
          const isExpanded = expandedProjects[proj.id];
          const projectTasks = tasks.filter((t) => t.project_id === proj.id);
          const projectSOPs = sops.filter((s) => s.project_id === proj.id);

          return (
            <div key={proj.id} className="apple-card overflow-hidden bg-white/95">
              {/* Project Header Banner */}
              <div
                onClick={() => toggleProject(proj.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#FAF9F5] transition-all select-none border-b border-black/[0.04]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shadow-2xs"
                    style={{ backgroundColor: `${proj.color}15` }}
                  >
                    <span>{proj.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1D1D1F]">{proj.name}</h4>
                    <p className="text-[11px] text-[#86868B]">{proj.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-[#86868B] px-2 py-0.5 rounded-full bg-neutral-100">
                    {projectTasks.filter((t) => t.status !== 'done').length} open
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  )}
                </div>
              </div>

              {/* Expanded Project Body */}
              {isExpanded && (
                <div className="p-4 space-y-4 bg-[#FDFCF9]">
                  {/* Embedded Nested SOP Checklist (Question 7 Choice!) */}
                  {projectSOPs.map((sop) => {
                    const isSOPExpanded = expandedSOPs[sop.id];
                    const doneCount = sop.items.filter((i: SOPItem) => i.done).length;
                    const totalCount = sop.items.length;
                    const progressPercent = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

                    return (
                      <div
                        key={sop.id}
                        className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden shadow-2xs"
                      >
                        {/* SOP Header */}
                        <div
                          onClick={() => toggleSOP(sop.id)}
                          className="p-3.5 bg-gradient-to-r from-neutral-50 to-white flex items-center justify-between cursor-pointer hover:bg-neutral-100/60 transition-all"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-bold">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-xs font-bold text-[#1D1D1F]">{sop.title}</h5>
                                <span className="text-[10px] font-bold text-neutral-800 px-2 py-0.5 rounded-full bg-neutral-100 font-mono">
                                  {doneCount}/{totalCount} Done
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onResetSOP(sop.id);
                              }}
                              title="Reset SOP checklist for next run"
                              className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 active:scale-90"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            {isSOPExpanded ? (
                              <ChevronDown className="w-4 h-4 text-neutral-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-neutral-400" />
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-neutral-100 h-1">
                          <div
                            className="bg-neutral-900 h-1 transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>

                        {/* SOP Items */}
                        {isSOPExpanded && (
                          <div className="p-3 space-y-1.5 divide-y divide-black/[0.03]">
                            {sop.items.map((item: SOPItem) => (
                              <div
                                key={item.id}
                                onClick={() => {
                                  onToggleSOPItem(sop.id, item.id);
                                  if (!item.done) {
                                    confetti({
                                      particleCount: 25,
                                      spread: 45,
                                      origin: { y: 0.7 },
                                    });
                                  }
                                }}
                                className={`flex items-start gap-2.5 pt-2 first:pt-0 cursor-pointer p-1.5 rounded-lg transition-all active:scale-[0.99] ${
                                  item.done ? 'text-[#86868B]' : 'hover:bg-[#FAF9F5]'
                                }`}
                              >
                                <button
                                  className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center border transition-all ${
                                    item.done
                                      ? 'bg-neutral-900 border-neutral-900 text-white'
                                      : 'border-black/25 bg-white'
                                  }`}
                                >
                                  {item.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                </button>

                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-xs font-medium leading-snug ${
                                      item.done ? 'line-through text-neutral-400' : 'text-[#1D1D1F]'
                                    }`}
                                  >
                                    {item.text}
                                  </p>
                                </div>

                                {item.estimated_mins && (
                                  <span className="text-[10px] font-mono text-[#86868B] shrink-0">
                                    ~{item.estimated_mins}m
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Project Tasks */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider block">
                      Tasks in Space
                    </span>
                    {projectTasks.length === 0 ? (
                      <p className="text-xs text-[#86868B] py-2">No tasks currently in this space.</p>
                    ) : (
                      projectTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-black/[0.04]"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <button
                              onClick={() => onToggleTask(task.id)}
                              className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                                task.status === 'done'
                                  ? 'bg-neutral-400 border-neutral-400 text-white'
                                  : 'border-black/25 bg-white'
                              }`}
                            >
                              {task.status === 'done' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </button>
                            <span
                              className={`text-xs font-medium truncate ${
                                task.status === 'done' ? 'line-through text-neutral-400' : 'text-[#1D1D1F]'
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>

                          <button
                            onClick={() => onStartFocus(task.title, proj.id)}
                            title="Start focus block for task"
                            className="p-1 rounded-md hover:bg-neutral-100 text-neutral-500 active:scale-90"
                          >
                            <Play className="w-3 h-3 fill-current text-neutral-800" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
