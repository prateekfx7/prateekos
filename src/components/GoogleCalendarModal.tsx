'use client';

import React, { useState, useEffect } from 'react';
import { googleCalendarService } from '../lib/googleCalendar';
import { GoogleCalendarEvent } from '../types';
import { Vaso } from 'vaso';
import {
  X,
  Calendar,
  ExternalLink,
  Check,
  RefreshCw,
  AlertCircle,
  Trash2,
  Clock,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoogleCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventsSynced: (events: GoogleCalendarEvent[], icalUrl: string) => void;
}

export const GoogleCalendarModal: React.FC<GoogleCalendarModalProps> = ({
  isOpen,
  onClose,
  onEventsSynced,
}) => {
  const [icalUrl, setIcalUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [previewEvents, setPreviewEvents] = useState<GoogleCalendarEvent[]>([]);

  useEffect(() => {
    if (isOpen) {
      const stored = googleCalendarService.getStoredUrl();
      setIcalUrl(stored);
      if (stored) {
        handleTestSync(stored);
      }
      setMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestSync = async (urlToTest: string) => {
    if (!urlToTest.trim()) return;
    setIsLoading(true);
    setMessage(null);

    try {
      const events = await googleCalendarService.fetchEvents(urlToTest.trim());
      setPreviewEvents(events.slice(0, 10)); // Show preview of first 10
      setMessage({
        text: `Connected successfully! Found ${events.length} Google Calendar events.`,
        type: 'success',
      });
      googleCalendarService.saveStoredUrl(urlToTest.trim());
      onEventsSynced(events, urlToTest.trim());
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      console.error(err);
      setMessage({
        text: err.message || 'Could not connect to Google Calendar. Check your iCal address.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!icalUrl.trim()) return;
    handleTestSync(icalUrl.trim());
  };

  const handleDisconnect = () => {
    googleCalendarService.saveStoredUrl('');
    setIcalUrl('');
    setPreviewEvents([]);
    onEventsSynced([], '');
    setMessage({ text: 'Google Calendar disconnected.', type: 'success' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5 overflow-y-auto apple-fade-in font-sans">
      <div className="w-full max-w-lg apple-liquid-glass rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl apple-sheet-spring sm:apple-modal-spring max-h-[92vh] flex flex-col border border-white/80">
        {/* Mobile Drag Handle */}
        <div className="w-10 h-1 rounded-full bg-black/20 mx-auto mt-2.5 sm:hidden" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-black/[0.06] flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#1D1D1F]">
                Connect Google Calendar
              </h3>
              <p className="text-[11px] text-[#86868B]">
                100% Free • Private iCal Link • Realtime Schedule Sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-neutral-500 active:scale-90 transition-all border border-black/[0.06]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {message && (
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Step-by-step instructions */}
          <div className="p-3.5 rounded-2xl bg-white/80 border border-white/90 border-b-black/[0.06] text-xs space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1D1D1F]">How to get your private iCal link:</span>
              <a
                href="https://calendar.google.com/calendar/u/0/r/settings"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-neutral-800 underline inline-flex items-center gap-0.5"
              >
                <span>Google Calendar Settings</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-[#86868B] text-[11px] leading-relaxed">
              <li>Open Google Calendar on your PC or mobile browser</li>
              <li>Under <strong>"My calendars"</strong> on the left, click the <strong>3 dots ⋮</strong> next to your calendar &gt; <strong>Settings and sharing</strong></li>
              <li>Scroll down to the <strong>"Integrate calendar"</strong> section</li>
              <li>Copy the <strong>"Secret address in iCal format"</strong> (ends with <code>.ics</code>)</li>
              <li>Paste below and click <strong>Connect Calendar</strong></li>
            </ol>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                Google Calendar Secret iCal Address (.ics)
              </label>
              <textarea
                rows={2}
                required
                placeholder="https://calendar.google.com/calendar/ical/your_id/private-key/basic.ics"
                value={icalUrl}
                onChange={(e) => setIcalUrl(e.target.value)}
                className="w-full bg-white/80 border border-white/90 border-b-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-1 focus:ring-black shadow-xs font-mono resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {googleCalendarService.getStoredUrl() ? (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-[#86868B] hover:text-black"
                >
                  Cancel
                </button>
                <Vaso depth={0.8} blur={0.4} specular={0.7} dispersion={0.15} radius={12}>
                  <button
                    type="submit"
                    disabled={isLoading || !icalUrl.trim()}
                    className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs disabled:opacity-40 flex items-center gap-1.5 border border-white/20"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Syncing...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Connect Calendar</span>
                      </>
                    )}
                  </button>
                </Vaso>
              </div>
            </div>
          </form>

          {/* Preview of synced events */}
          {previewEvents.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-black/[0.06]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1D1D1F]">Preview of Synced Google Events</span>
                <span className="text-[11px] text-[#86868B] font-mono">{previewEvents.length} events</span>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {previewEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 rounded-xl bg-white/70 border border-black/[0.04] flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-[#1D1D1F] truncate">{ev.title}</p>
                      <p className="text-[10px] text-[#86868B] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{ev.date} • {ev.startTime}</span>
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] font-semibold text-neutral-700 shrink-0">
                      GCal
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
