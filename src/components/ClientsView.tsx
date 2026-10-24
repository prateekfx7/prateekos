'use client';

import React, { useState } from 'react';
import { ClientProject } from '../types';
import { CustomIcon } from './CustomIcon';
import {
  Check,
  Plus,
  ExternalLink,
} from 'lucide-react';

interface ClientsViewProps {
  clients: ClientProject[];
  onToggleTask: (clientId: string, taskId: string) => void;
  onUpdateStage: (clientId: string, stage: ClientProject['stage']) => void;
  onAddClient: (client: Omit<ClientProject, 'id'>) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  onToggleTask,
  onUpdateStage,
  onAddClient,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [clientName, setClientName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [dealValue, setDealValue] = useState('$1,500');
  const [deadline, setDeadline] = useState('Next Monday');

  const stages: ClientProject['stage'][] = [
    'Ingest & Rough Cut',
    'Revisions & Color',
    'Sound & Polish',
    'Ready to Deliver',
    'Completed',
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !projectTitle.trim()) return;
    onAddClient({
      clientName: clientName.trim(),
      projectTitle: projectTitle.trim(),
      dealValue: dealValue.trim(),
      stage: 'Ingest & Rough Cut',
      deadline: deadline.trim(),
      tasks: [
        { id: `t1-${Date.now()}`, text: 'A-roll assemble and timeline sync', done: false },
        { id: `t2-${Date.now()}`, text: 'B-roll, typography and color grade pass', done: false },
        { id: `t3-${Date.now()}`, text: 'Sound balance and export review link', done: false },
      ],
    });
    setClientName('');
    setProjectTitle('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="apple-card p-6 bg-white/95 border border-black/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center font-bold">
              <CustomIcon name="briefcase" className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1D1D1F]">Video Editing Client Deliverables</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-semibold">
                  Creative Pipeline
                </span>
              </div>
              <p className="text-xs text-[#86868B] mt-0.5">
                Manage active client edits, milestone tracking, and review links
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs self-start sm:self-auto"
          >
            <CustomIcon name="wand" className="w-3.5 h-3.5" white />
            <span>New Client Project</span>
          </button>
        </div>
      </div>

      {/* Add Client Modal / Drawer */}
      {isAdding && (
        <form onSubmit={handleCreate} className="apple-card p-5 bg-[#FAF9F5] border border-black/[0.08] space-y-3">
          <h4 className="text-xs font-bold text-[#1D1D1F]">Add Video Editing Client Project</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              autoFocus
              placeholder="Client Name or Brand (e.g. Alex Thorne / SaaS Startup)"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
            <input
              type="text"
              placeholder="Deliverable (e.g. 60s Motion Promo Video)"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Deal Value (e.g. $1,500 or 40,000 INR)"
              value={dealValue}
              onChange={(e) => setDealValue(e.target.value)}
              className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
            <input
              type="text"
              placeholder="Deadline (e.g. Tomorrow 5 PM or Oct 30)"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
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
              Save Client Deal
            </button>
          </div>
        </form>
      )}

      {/* Client Projects List */}
      <div className="space-y-4">
        {clients.map((client, idx) => {
          const completedTasks = client.tasks.filter((t) => t.done).length;
          const totalTasks = client.tasks.length;
          const isComplete = client.stage === 'Completed';

          return (
            <div
              key={client.id}
              className={`apple-card p-5 border transition-all duration-200 apple-spring-in hover:-translate-y-0.5 hover:shadow-md ${
                isComplete ? 'bg-neutral-50/70 border-neutral-200' : 'bg-white border-black/[0.06] hover:border-black/20'
              }`}
              style={{ animationDelay: `${idx * 45}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/[0.05]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-serif font-bold text-[#1D1D1F]">{client.clientName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-900 font-mono text-xs font-bold border border-black/[0.06]">
                      {client.dealValue}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-[#86868B] mt-0.5">{client.projectTitle}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-md">
                    Deadline: {client.deadline}
                  </span>
                </div>
              </div>

              {/* Stage Progression Selector */}
              <div className="pt-3">
                <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1.5">
                  Production Stage
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {stages.map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateStage(client.id, st)}
                      className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium active:scale-95 transition-all duration-150 ${
                        client.stage === st
                          ? 'bg-black text-white shadow-xs font-semibold'
                          : 'bg-[#FAF9F5] text-[#86868B] hover:text-black border border-black/[0.04]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Milestone Checklist */}
              <div className="pt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#86868B]">
                  <span>Milestones</span>
                  <span className="font-mono text-[11px]">{completedTasks}/{totalTasks} Done</span>
                </div>

                {client.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(client.id, task.id)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#FAF9F5] active:scale-[0.99] cursor-pointer transition-all duration-150 group"
                  >
                    <button
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-150 ${
                        task.done
                          ? 'bg-black border-black text-white apple-check-pop'
                          : 'border-black/25 bg-white group-hover:border-black'
                      }`}
                    >
                      {task.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </button>
                    <span className={`text-xs font-medium transition-all duration-200 ${task.done ? 'line-through text-neutral-400 opacity-60' : 'text-[#1D1D1F]'}`}>
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>

              {client.previewUrl && (
                <div className="pt-3 mt-2 border-t border-black/[0.04] flex justify-end">
                  <a
                    href={client.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-neutral-700 hover:text-black flex items-center gap-1"
                  >
                    <span>Open Review Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
