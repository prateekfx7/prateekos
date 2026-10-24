'use client';

import React from 'react';
import { CalendarEvent } from '../types';
import { Calendar, Clock, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TodayScheduleProps {
  events: CalendarEvent[];
  onOpenCalendar: () => void;
}

export const TodaySchedule: React.FC<TodayScheduleProps> = ({ events, onOpenCalendar }) => {
  // Sort events by start_time
  const sortedEvents = [...events].sort((a, b) => a.start_time.localeCompare(b.start_time)).slice(0, 3);

  return (
    <div className="apple-card p-5 bg-white/95 border border-black/[0.06]">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1D1D1F]">Today's Timeline</h3>
            <p className="text-[11px] text-[#86868B] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 inline-block" />
              <span>Google Calendar 2-Way Synced</span>
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCalendar}
          className="text-xs font-semibold text-neutral-800 hover:text-black flex items-center gap-1 active:scale-95 transition-all"
        >
          <span>Day Grid</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {sortedEvents.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#86868B]">
          No events scheduled for today. Clean calendar ahead!
        </div>
      ) : (
        <div className="space-y-2">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] hover:bg-[#F4F2EB] border border-black/[0.04] transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Color Pill */}
                <div
                  className="w-1 h-8 rounded-full shrink-0"
                  style={{ backgroundColor: event.color || '#18181B' }}
                />

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#1D1D1F] truncate">{event.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#86868B] mt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {event.start_time} - {event.end_time}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {event.is_gcal && (
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-semibold shrink-0 border border-black/[0.05]">
                  GCal
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
