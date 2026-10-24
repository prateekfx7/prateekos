'use client';

import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Bell, Cloud, Calendar, Download, Volume2, Shield, X, Check, Settings } from 'lucide-react';

interface SettingsModalProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onExportData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  onSaveProfile,
  onExportData,
  onClose,
}) => {
  const [morning, setMorning] = useState<string>(profile.reminder_morning);
  const [midday, setMidday] = useState<string>(profile.reminder_midday);
  const [night, setNight] = useState<string>(profile.reminder_night);
  const [timezone, setTimezone] = useState<string>(profile.timezone);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(profile.notifications_enabled);
  const [supabaseUrl, setSupabaseUrl] = useState<string>(profile.supabase_url || '');
  const [supabaseKey, setSupabaseKey] = useState<string>(profile.supabase_anon_key || '');
  const [testNotificationSent, setTestNotificationSent] = useState<boolean>(false);

  const handleSave = () => {
    onSaveProfile({
      ...profile,
      reminder_morning: morning,
      reminder_midday: midday,
      reminder_night: night,
      timezone,
      notifications_enabled: notificationsEnabled,
      supabase_url: supabaseUrl.trim() || undefined,
      supabase_anon_key: supabaseKey.trim() || undefined,
    });
    onClose();
  };

  const handleTestNotification = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('Daily System App: Test Reminder', {
          body: 'Morning anchor reminder test active. Your notification engine is operational.',
        });
        setTestNotificationSent(true);
        setTimeout(() => setTestNotificationSent(false), 3000);
      } else {
        alert('Browser notifications were blocked. Please enable them in your browser settings.');
      }
    } else {
      alert('Your browser does not support Web Push notifications.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="apple-card w-full max-w-lg bg-white overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1D1D1F]">System Preferences & Sync</h3>
              <p className="text-[11px] text-[#86868B]">Daily anchors, Google sync & Supabase backend</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Triple Anchor Reminders */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#1D1D1F] flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-neutral-800" />
              <span>Daily Anchor Push Reminders (F8 in PRD)</span>
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-black/[0.04]">
                <label className="text-[10px] font-bold text-[#86868B] uppercase block mb-1">
                  Morning Plan
                </label>
                <input
                  type="time"
                  value={morning}
                  onChange={(e) => setMorning(e.target.value)}
                  className="w-full bg-white border border-black/[0.08] rounded-lg px-2 py-1 text-xs font-mono font-bold"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-black/[0.04]">
                <label className="text-[10px] font-bold text-[#86868B] uppercase block mb-1">
                  Midday Check-In
                </label>
                <input
                  type="time"
                  value={midday}
                  onChange={(e) => setMidday(e.target.value)}
                  className="w-full bg-white border border-black/[0.08] rounded-lg px-2 py-1 text-xs font-mono font-bold"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-black/[0.04]">
                <label className="text-[10px] font-bold text-[#86868B] uppercase block mb-1">
                  Night Review
                </label>
                <input
                  type="time"
                  value={night}
                  onChange={(e) => setNight(e.target.value)}
                  className="w-full bg-white border border-black/[0.08] rounded-lg px-2 py-1 text-xs font-mono font-bold"
                />
              </div>
            </div>

            <button
              onClick={handleTestNotification}
              className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{testNotificationSent ? 'Test Notification Dispatched!' : 'Test Device Push Notification'}</span>
            </button>
          </div>

          {/* Timezone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1D1F]">Primary Timezone</label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
          </div>

          {/* Supabase Cloud Link */}
          <div className="space-y-3 pt-3 border-t border-black/[0.06]">
            <h4 className="text-xs font-bold text-[#1D1D1F] flex items-center gap-2">
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supabase Cloud Integration</span>
            </h4>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="https://xyz.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs"
              />
              <input
                type="password"
                placeholder="Supabase Anon Public API Key"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          {/* Data Export (PRD F9) */}
          <div className="pt-3 border-t border-black/[0.06]">
            <button
              onClick={onExportData}
              className="w-full py-2.5 px-3 rounded-xl bg-[#F6F4EE] hover:bg-[#EBE7DC] text-[#1D1D1F] text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-black/[0.04]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All App Data as JSON Backup</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-[#FAF9F5] border-t border-black/[0.06] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#86868B] hover:text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
