'use client';

import React, { useState } from 'react';
import { Task, Project, Priority } from '../types';
import { Check, Plus, Clock, MoreHorizontal, Flame, Trash2, ArrowUpCircle } from 'lucide-react';

interface TaskSectionProps {
  tasks: Task[];
  projects: Project[];
  onToggleComplete: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'created_at'>) => void;
  onDeleteTask: (taskId: string) => void;
  onPromoteToMust: (taskId: string) => void;
}

export const TaskSection: React.FC<TaskSectionProps> = ({
  tasks,
  projects,
  onToggleComplete,
  onAddTask,
  onDeleteTask,
  onPromoteToMust,
}) => {
  const [filter, setFilter] = useState<'should' | 'later' | 'done'>('should');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newPriority, setNewPriority] = useState<Priority>('should');
  const [newProjectId, setNewProjectId] = useState<string>(projects[0]?.id || '');
  const [newDueTime, setNewDueTime] = useState<string>('');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'done') return t.status === 'done';
    if (t.status === 'done') return false;
    return t.priority === filter;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      priority: newPriority,
      status: 'open',
      project_id: newProjectId,
      due_time: newDueTime || undefined,
    });
    setNewTitle('');
    setNewDueTime('');
    setIsAdding(false);
  };

  return (
    <div className="apple-card p-5 bg-white/95">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#1D1D1F]">Daily Task Stream</h3>
          <p className="text-[11px] text-[#86868B]">Organized by priority & project space</p>
        </div>

        {/* Priority Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#F4F2EB] p-1 rounded-xl self-start sm:self-auto">
          {[
            { key: 'should', label: 'Should Do', count: tasks.filter((t) => t.priority === 'should' && t.status !== 'done').length },
            { key: 'later', label: 'Later / Backlog', count: tasks.filter((t) => t.priority === 'later' && t.status !== 'done').length },
            { key: 'done', label: 'Done', count: tasks.filter((t) => t.status === 'done').length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as 'should' | 'later' | 'done')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === tab.key
                  ? 'bg-white text-black shadow-xs'
                  : 'text-[#86868B] hover:text-black'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-60 font-mono">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#86868B]">
            {filter === 'done'
              ? 'No tasks completed yet today. Let’s get momentum going!'
              : `No tasks in this list. Tap below to capture one.`}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const project = projects.find((p) => p.id === task.project_id);
            const isDone = task.status === 'done';

            return (
              <div
                key={task.id}
                className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-neutral-50/80 border-neutral-200/50 text-[#86868B]'
                    : 'bg-[#FAF9F5] hover:bg-[#F3F1E8] border-black/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => onToggleComplete(task.id)}
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isDone
                        ? 'bg-neutral-400 border-neutral-400 text-white'
                        : 'border-black/30 hover:border-black bg-white active:scale-90'
                    }`}
                  >
                    {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-semibold leading-tight truncate ${
                        isDone ? 'line-through text-[#86868B]' : 'text-[#1D1D1F]'
                      }`}
                    >
                      {task.title}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      {project && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#86868B]">
                          <span>{project.icon}</span>
                          <span className="truncate">{project.name}</span>
                        </span>
                      )}

                      {task.due_time && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-medium text-neutral-500">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{task.due_time}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover / Context actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!isDone && task.priority !== 'must' && (
                    <button
                      onClick={() => onPromoteToMust(task.id)}
                      title="Promote to Must Task"
                      className="p-1 rounded-md hover:bg-amber-100 text-amber-700 active:scale-90 transition-all text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Make Must</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    title="Delete Task"
                    className="p-1 rounded-md hover:bg-red-100 text-red-600 active:scale-90 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Add Form or Trigger */}
      {isAdding ? (
        <form onSubmit={handleCreate} className="mt-3 p-3 rounded-xl bg-[#F6F4EE] border border-black/[0.08] space-y-2.5">
          <input
            type="text"
            autoFocus
            placeholder="Task title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-white border border-black/[0.08] rounded-lg px-3 py-1.5 text-xs text-[#1D1D1F] focus:outline-none focus:ring-1 focus:ring-black"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Priority)}
                className="bg-white border border-black/[0.08] rounded-lg px-2 py-1 text-xs text-[#1D1D1F]"
              >
                <option value="should">Priority: Should</option>
                <option value="later">Priority: Later</option>
                <option value="must">Priority: Must</option>
              </select>

              <select
                value={newProjectId}
                onChange={(e) => setNewProjectId(e.target.value)}
                className="bg-white border border-black/[0.08] rounded-lg px-2 py-1 text-xs text-[#1D1D1F]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.icon} {p.name}
                  </option>
                ))}
              </select>

              <input
                type="time"
                value={newDueTime}
                onChange={(e) => setNewDueTime(e.target.value)}
                className="bg-white border border-black/[0.08] rounded-lg px-2 py-1 text-xs text-[#1D1D1F]"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 text-xs font-medium text-[#86868B] hover:text-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-black text-white text-xs font-medium hover:bg-neutral-800"
              >
                Save Task
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full mt-3 py-2 px-3 rounded-xl border border-dashed border-black/15 hover:border-black/30 hover:bg-[#FAF9F5] text-xs font-semibold text-[#86868B] hover:text-[#1D1D1F] flex items-center justify-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quick Add Task</span>
        </button>
      )}
    </div>
  );
};
