'use client';

import React, { useState } from 'react';
import { CalendarEvent, Task } from '../types';
import { Calendar as CalendarIcon, Clock, Plus, RotateCw, CheckCircle2, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

interface CalendarViewProps {
  events: CalendarEvent[];
  tasks: Task[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onSyncGCal: () => void;
  isSyncing: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  tasks,
  onAddEvent,
  onSyncGCal,
  isSyncing,
}) => {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('11:00');
  const [endTime, setEndTime] = useState<string>('12:00');
  const [location, setLocation] = useState<string>('Google Meet');
  const [color, setColor] = useState<string>('#3B82F6');

  // Time slots from 08:00 to 21:00
  const hours = Array.from({ length: 14 }, (_, i) => i + 8);

  const timedTasks = tasks.filter((t) => t.due_time && t.status !== 'done');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddEvent({
      title: title.trim(),
      start_time: startTime,
      end_time: endTime,
      date: new Date().toISOString().split('T')[0],
      location: location.trim() || undefined,
      color,
      is_gcal: true,
    });
    setTitle('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-5">
      {/* Calendar Header with Sync bar */}
      <div className="apple-card p-5 bg-white/95">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#1D1D1F]">Schedule & Calendar</h2>
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-bold">
                  2-Way Sync Active
                </span>
              </div>
              <p className="text-xs text-[#86868B] mt-0.5">
                Google Calendar connected • Push tasks to calendar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSyncGCal}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F6F4EE] hover:bg-[#EEECE4] text-xs font-semibold text-[#1D1D1F] active:scale-95 transition-all border border-black/[0.04]"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync GCal'}</span>
            </button>

            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-medium hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        {/* View Switcher & Date Indicator */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/[0.05]">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#1D1D1F]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
          </div>

          <div className="flex items-center bg-[#F4F2EB] p-1 rounded-xl">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'day' ? 'bg-white text-black shadow-xs' : 'text-[#86868B]'
              }`}
            >
              Day Grid
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'week' ? 'bg-white text-black shadow-xs' : 'text-[#86868B]'
              }`}
            >
              Week View
            </button>
          </div>
        </div>
      </div>

      {/* Quick Event Creation Form */}
      {isAdding && (
        <form onSubmit={handleCreateEvent} className="apple-card p-4 bg-[#F8F6F0] space-y-3">
          <h4 className="text-xs font-bold text-[#1D1D1F]">Schedule New Event / Time Block</h4>
          <input
            type="text"
            autoFocus
            placeholder="Event or Focus block title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-1 focus:ring-black"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-[#86868B] block mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-white border border-black/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-[#1D1D1F]"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#86868B] block mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-white border border-black/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-[#1D1D1F]"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#86868B] block mb-1">Location / Link</label>
              <input
                type="text"
                placeholder="Google Meet, Studio..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white border border-black/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-[#1D1D1F]"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#86868B] block mb-1">Color Tag</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-white border border-black/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-[#1D1D1F]"
              >
                <option value="#18181B">Charcoal (Priority)</option>
                <option value="#334155">Slate (Client)</option>
                <option value="#52525B">Zinc (Deep Work)</option>
                <option value="#71717A">Stone (Personal)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-[#86868B] hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-black text-white text-xs font-medium hover:bg-neutral-800"
            >
              Add to Schedule
            </button>
          </div>
        </form>
      )}

      {/* Hourly Timeline Grid */}
      <div className="apple-card p-5 bg-white/95">
        <div className="space-y-4">
          {hours.map((hour) => {
            const hourString = `${String(hour).padStart(2, '0')}:00`;
            const matchingEvents = events.filter((e) => {
              const eHour = parseInt(e.start_time.split(':')[0], 10);
              return eHour === hour;
            });
            const matchingTasks = timedTasks.filter((t) => {
              const tHour = parseInt(t.due_time!.split(':')[0], 10);
              return tHour === hour;
            });

            return (
              <div key={hour} className="flex items-start gap-4 border-t border-black/[0.04] pt-3">
                <span className="w-12 text-xs font-mono font-semibold text-[#86868B] shrink-0 text-right">
                  {hourString}
                </span>

                <div className="flex-1 space-y-2 min-h-[36px]">
                  {matchingEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3 rounded-xl border border-black/[0.06] shadow-2xs flex items-center justify-between"
                      style={{
                        backgroundColor: '#FBF9F5',
                        borderLeftColor: evt.color || '#18181B',
                        borderLeftWidth: '4px',
                      }}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-[#1D1D1F]">{evt.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-[#86868B] mt-0.5">
                          <span>{evt.start_time} - {evt.end_time}</span>
                          {evt.location && <span>• {evt.location}</span>}
                        </div>
                      </div>

                      {evt.is_gcal && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 border border-black/[0.05]">
                          Google Calendar
                        </span>
                      )}
                    </div>
                  ))}

                  {matchingTasks.map((tsk) => (
                    <div
                      key={tsk.id}
                      className="p-2.5 rounded-xl bg-neutral-50/80 border border-black/[0.06] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-neutral-600" />
                        <div>
                          <p className="text-xs font-semibold text-neutral-900">{tsk.title}</p>
                          <span className="text-[10px] text-neutral-500 font-mono">Timed Task • Due {tsk.due_time}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800">
                        Task
                      </span>
                    </div>
                  ))}

                  {matchingEvents.length === 0 && matchingTasks.length === 0 && (
                    <div className="h-6" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
