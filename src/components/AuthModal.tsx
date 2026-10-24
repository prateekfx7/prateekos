'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import {
  authService,
  isSupabaseConfigured,
  getSupabaseConfig,
  saveSupabaseConfig,
} from '../lib/supabase';
import { storage } from '../lib/storage';
import { CustomIcon } from './CustomIcon';
import { Vaso } from 'vaso';
import {
  X,
  Mail,
  Lock,
  Sparkles,
  Check,
  LogOut,
  RefreshCw,
  Key,
  ShieldCheck,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  onClearLocalData: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  onClearLocalData,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'config'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Supabase config state
  const [projectUrl, setProjectUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getSupabaseConfig();
      setProjectUrl(cfg.url);
      setAnonKey(cfg.key);
      setIsConfigured(isSupabaseConfigured());
      setMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setMessage(null);
    try {
      await authService.signInWithGoogle();
      // Google redirects the browser
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to initialize Google login', type: 'error' });
      setIsSubmitting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      if (mode === 'signup') {
        if (!password || password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        await authService.signUpWithEmail(email.trim(), password);
        setMessage({
          text: 'Account created! Check your email to confirm or sign in directly.',
          type: 'success',
        });
      } else {
        // Sign in with password or magic link
        await authService.signInWithEmail(email.trim(), password ? password : undefined);
        const user = await authService.getUser();
        if (user) {
          onUserChange(user);
          setMessage({ text: 'Signed in successfully!', type: 'success' });
          setTimeout(() => onClose(), 800);
        } else {
          setMessage({ text: 'Magic link sent to your email inbox!', type: 'success' });
        }
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Authentication failed', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(projectUrl.trim(), anonKey.trim());
    setIsConfigured(isSupabaseConfigured());
    setMessage({
      text: 'Supabase cloud configuration saved! Cross-device sync is ready.',
      type: 'success',
    });
    setMode('signin');
  };

  const handleSignOut = async () => {
    await authService.signOut();
    onUserChange(null);
    setMessage({ text: 'Logged out successfully.', type: 'success' });
    setTimeout(() => onClose(), 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5 overflow-y-auto apple-fade-in">
      <div className="w-full max-w-lg apple-liquid-glass rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl apple-sheet-spring sm:apple-modal-spring max-h-[92vh] flex flex-col border border-white/80">
        {/* Grab Handle for Mobile */}
        <div className="w-10 h-1 rounded-full bg-black/20 mx-auto mt-2.5 sm:hidden" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-black/[0.06] flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shadow-xs border border-white/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#1D1D1F]">
                {currentUser ? 'Account & Cross-Device Sync' : 'Log In to Daily System OS'}
              </h3>
              <p className="text-[10px] text-[#86868B] font-mono">
                Sync across iPhone, iPad & PC in Realtime
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-neutral-500 active:scale-90 transition-all border border-white/90 border-b-black/[0.08] shadow-xs"
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
              {message.type === 'success' ? <Check className="w-4 h-4" /> : null}
              <span>{message.text}</span>
            </div>
          )}

          {/* Current User Session Card */}
          {currentUser ? (
            <div className="p-4 rounded-2xl bg-white/80 border border-white/90 border-b-black/[0.08] space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-black text-white font-serif font-bold flex items-center justify-center text-sm shadow-xs border border-white/20">
                    {currentUser.email ? currentUser.email[0].toUpperCase() : 'P'}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#1D1D1F] block truncate">
                      {currentUser.email || 'Google Account'}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Realtime Cloud Sync Active
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-semibold flex items-center gap-1.5 border border-black/[0.08] active:scale-95 transition-all shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>

              <div className="pt-2 border-t border-black/[0.05] text-[11px] text-[#86868B] leading-relaxed">
                Every task, timeline sprint, DSA question, client deal and health metric is continuously synchronized to your cloud database. Open this URL on your mobile or iPad and sign in to see updates live.
              </div>
            </div>
          ) : (
            <>
              {/* Not Configured Warning / Setup Accordion */}
              {!isConfigured && (
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <Key className="w-4 h-4 text-amber-800" />
                    <span>Free Supabase Project Connection</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    To sync between devices for free, create a project at{' '}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-bold inline-flex items-center gap-0.5"
                    >
                      supabase.com <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    and paste your Project URL & Anon Key below.
                  </p>
                  <button
                    onClick={() => setMode('config')}
                    className="px-3 py-1.5 rounded-lg bg-amber-900 text-white text-[11px] font-bold active:scale-95 transition-all shadow-xs"
                  >
                    Enter Free Supabase Keys
                  </button>
                </div>
              )}

              {/* Mode Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/70 border border-white/80 border-b-black/[0.06] shadow-xs">
                <button
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    mode === 'signin'
                      ? 'bg-black text-white shadow-xs font-bold'
                      : 'text-[#86868B] hover:text-black'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    mode === 'signup'
                      ? 'bg-black text-white shadow-xs font-bold'
                      : 'text-[#86868B] hover:text-black'
                  }`}
                >
                  Create Account
                </button>
                <button
                  onClick={() => setMode('config')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                    mode === 'config'
                      ? 'bg-black text-white shadow-xs font-bold'
                      : 'text-[#86868B] hover:text-black'
                  }`}
                >
                  Cloud Setup
                </button>
              </div>

              {/* 1-Tap Google Sign-In (Recommended by user) */}
              {mode !== 'config' && (
                <div className="space-y-3 pt-1">
                  <Vaso depth={0.8} blur={0.4} specular={0.8} dispersion={0.15} radius={14}>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isSubmitting || !isConfigured}
                      className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-50 text-[#1D1D1F] border border-white/90 border-b-black/[0.1] shadow-sm flex items-center justify-center gap-2.5 active:scale-98 transition-all font-semibold text-xs disabled:opacity-50"
                    >
                      {/* Google G Logo SVG */}
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.33 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2 0 10.04 0 12s.46 3.8 1.27 5.42l4.01-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                      <span>Continue with Google (1-Tap)</span>
                    </button>
                  </Vaso>

                  <div className="relative flex items-center justify-center my-3">
                    <div className="w-full border-t border-black/[0.08]" />
                    <span className="bg-[#FAF8F5] px-2 text-[10px] font-mono uppercase text-[#86868B] absolute">
                      or with email
                    </span>
                  </div>

                  {/* Email & Password Form */}
                  <form onSubmit={handleEmailAuth} className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="prateek@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/80 border border-white/90 border-b-black/[0.08] rounded-xl pl-9 pr-3 py-2 text-base sm:text-xs text-[#1D1D1F] focus:outline-none focus:ring-1 focus:ring-black shadow-xs"
                        />
                        <Mail className="w-4 h-4 text-[#86868B] absolute left-3 top-2.5" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">
                          Password {mode === 'signin' && <span className="font-normal">(optional for magic link)</span>}
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter password or leave blank for magic link'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white/80 border border-white/90 border-b-black/[0.08] rounded-xl pl-9 pr-3 py-2 text-base sm:text-xs text-[#1D1D1F] focus:outline-none focus:ring-1 focus:ring-black shadow-xs"
                        />
                        <Lock className="w-4 h-4 text-[#86868B] absolute left-3 top-2.5" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !isConfigured}
                      className="w-full py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-98 transition-all shadow-xs border border-white/20 disabled:opacity-50"
                    >
                      {isSubmitting
                        ? 'Connecting...'
                        : mode === 'signup'
                        ? 'Create Cloud Account'
                        : password
                        ? 'Sign In with Password'
                        : 'Send Magic Link to Email'}
                    </button>
                  </form>
                </div>
              )}

              {/* Cloud Setup Form */}
              {mode === 'config' && (
                <form onSubmit={handleSaveConfig} className="space-y-3 pt-1">
                  <div className="p-3 rounded-xl bg-white/60 border border-white/80 text-[11px] text-neutral-700 space-y-1">
                    <p className="font-bold text-[#1D1D1F]">Where do I get these free keys?</p>
                    <ol className="list-decimal pl-4 space-y-0.5 text-[#86868B]">
                      <li>Create free project at supabase.com (100% free)</li>
                      <li>Go to <strong>Project Settings</strong> &gt; <strong>API</strong></li>
                      <li>Copy <strong>Project URL</strong> and <strong>anon public key</strong></li>
                      <li>Paste below to enable instant multi-device syncing</li>
                    </ol>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                      Supabase Project URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://xyzcompany.supabase.co"
                      value={projectUrl}
                      onChange={(e) => setProjectUrl(e.target.value)}
                      className="w-full bg-white/80 border border-white/90 border-b-black/[0.08] rounded-xl px-3 py-2 text-base sm:text-xs text-[#1D1D1F] focus:outline-none focus:ring-1 focus:ring-black shadow-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                      Supabase Anon Public API Key
                    </label>
                    <textarea
                      rows={2}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={anonKey}
                      onChange={(e) => setAnonKey(e.target.value)}
                      className="w-full bg-white/80 border border-white/90 border-b-black/[0.08] rounded-xl px-3 py-2 text-base sm:text-xs text-[#1D1D1F] focus:outline-none focus:ring-1 focus:ring-black shadow-xs font-mono resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="px-3 py-1.5 text-xs text-[#86868B] hover:text-black"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 shadow-xs"
                    >
                      Save Cloud Connection
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Clean Slate & Mock Data Reset Button */}
          <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between">
            <div className="text-[11px] text-[#86868B]">
              <span>Need a fresh blank workspace?</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Clear all local data and start with a 100% blank slate?')) {
                  storage.clearAll();
                  onClearLocalData();
                  setMessage({ text: 'All local data wiped cleanly. Workspace is blank.', type: 'success' });
                }
              }}
              className="text-xs font-semibold text-neutral-600 hover:text-red-600 flex items-center gap-1 active:scale-95 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Wipe Clean Slate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
