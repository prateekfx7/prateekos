'use client';

import React, { useState } from 'react';
import { OutreachLead } from '../types';
import { CustomIcon } from './CustomIcon';
import {
  Plus,
  Copy,
  Check,
  Mail,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OutreachViewProps {
  leads: OutreachLead[];
  onUpdateStatus: (leadId: string, status: OutreachLead['status']) => void;
  onAddLead: (lead: Omit<OutreachLead, 'id'>) => void;
}

export const OutreachView: React.FC<OutreachViewProps> = ({
  leads,
  onUpdateStatus,
  onAddLead,
}) => {
  const [copiedScriptIndex, setCopiedScriptIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<OutreachLead['platform']>('Twitter / X');
  const [handle, setHandle] = useState('');
  const [niche, setNiche] = useState('SaaS Founder');
  const [dealPotential, setDealPotential] = useState('$2,000 package');
  const [notes, setNotes] = useState('');

  const statuses: OutreachLead['status'][] = [
    'Lead',
    'DM Sent',
    'Audit Sent',
    'Call Booked',
    'Closed Won',
  ];

  const scripts = [
    {
      title: 'Twitter / LinkedIn 30s Video Audit Script (High-Ticket)',
      channel: 'Twitter & LinkedIn DMs',
      body: `Hey [Name]! Loved your recent post on [Topic].

Noticed your hero product video could easily get 2x higher retention with tighter typography and smoother pacing in the first 3 seconds.

I put together a quick 30s motion concept mock-up for you here: [Link to Loom / Review].

No pitch at all — just wanted to share the idea. Would love to hear what you think!`,
    },
    {
      title: 'High-Ticket Monthly Video Retainer Pitch (Cold Email)',
      channel: 'Cold Email to Founders',
      body: `Hi [Name],

Been following [Company] and love the momentum.

I help tech founders & high-growth creators turn complex product features into clean, high-conversion motion videos and product demos. We handle all editing, motion graphics, and audio sweetening on a flexible monthly retainer so you never have to search for editors.

Here is our portfolio reel & case study: [Portfolio Link]

Open to a brief 10-minute alignment chat next Tuesday at 3 PM?`,
    },
    {
      title: 'Quick 48-Hour Follow-Up',
      channel: 'Follow-Up Message',
      body: `Hey [Name] — just floating this to the top in case it got buried!

Did you get a chance to see that 30s motion mock-up? Happy to make any tweaks if you want to test it on your socials.`,
    },
  ];

  const handleCopyScript = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedScriptIndex(index);
    setTimeout(() => setCopiedScriptIndex(null), 2500);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddLead({
      name: name.trim(),
      platform,
      handle: handle.trim(),
      niche: niche.trim(),
      status: 'Lead',
      dealPotential: dealPotential.trim(),
      lastContacted: 'Today',
      notes: notes.trim() || undefined,
    });
    setName('');
    setHandle('');
    setNotes('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="apple-card p-6 bg-white/95 border border-black/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center font-bold">
              <CustomIcon name="network" className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1D1D1F]">Client Outreach CRM</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-semibold">
                  Closing Pipeline
                </span>
              </div>
              <p className="text-xs text-[#86868B] mt-0.5">
                Reach out to founders on Twitter, LinkedIn & Email • Close high-ticket retainer clients
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs self-start sm:self-auto"
          >
            <CustomIcon name="wand" className="w-3.5 h-3.5" white />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Ready-to-Send Outreach Message Scripts */}
      <div className="apple-card p-5 bg-white border border-black/[0.06] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CustomIcon name="chat_lock" className="w-4 h-4 text-neutral-700" />
            <h3 className="text-base font-serif font-bold text-[#1D1D1F]">Outreach Scripts</h3>
          </div>
          <span className="text-[11px] text-[#86868B]">1-Click Copy & Send</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {scripts.map((script, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#FAF9F5] border border-black/[0.05] flex flex-col justify-between space-y-2.5">
              <div>
                <span className="text-[10px] font-semibold uppercase text-neutral-700 bg-neutral-200 px-2 py-0.5 rounded-md">
                  {script.channel}
                </span>
                <h4 className="text-xs font-bold text-[#1D1D1F] mt-1.5 leading-snug">{script.title}</h4>
                <p className="text-[11px] text-[#86868B] line-clamp-3 mt-1 font-mono bg-white p-2 rounded-lg border border-black/[0.04]">
                  {script.body}
                </p>
              </div>

              <button
                onClick={() => handleCopyScript(script.body, idx)}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                  copiedScriptIndex === idx
                    ? 'bg-neutral-800 text-white'
                    : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                {copiedScriptIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Lead Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="apple-card p-5 bg-[#FAF9F5] border border-black/[0.08] space-y-3">
          <h4 className="text-xs font-bold text-[#1D1D1F]">Add Prospect to CRM</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              autoFocus
              placeholder="Founder / Creator Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as OutreachLead['platform'])}
              className="bg-white border border-black/[0.08] rounded-xl px-2.5 py-2 text-xs text-[#1D1D1F]"
            >
              <option value="Twitter / X">Twitter / X</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Cold Email">Cold Email</option>
              <option value="Instagram">Instagram</option>
            </select>
            <input
              type="text"
              placeholder="Handle (e.g. @founder_x)"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Niche (e.g. AI SaaS Founder)"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
            <input
              type="text"
              placeholder="Deal Potential (e.g. $2,500/mo retainer)"
              value={dealPotential}
              onChange={(e) => setDealPotential(e.target.value)}
              className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F]"
            />
          </div>

          <textarea
            placeholder="Context or personalized angle..."
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] resize-none"
          />

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
              Add Prospect
            </button>
          </div>
        </form>
      )}

      {/* Leads Pipeline Cards */}
      <div className="space-y-3">
        {leads.map((lead) => {
          return (
            <div
              key={lead.id}
              className="apple-card p-4 sm:p-5 border border-black/[0.06] bg-white transition-all hover:border-black/20"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-black/[0.05]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center font-bold text-xs text-neutral-700">
                    {lead.platform.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-serif font-bold text-[#1D1D1F]">{lead.name}</h4>
                      <span className="text-xs font-mono text-[#86868B]">{lead.handle}</span>
                    </div>
                    <span className="text-[11px] text-[#86868B]">{lead.niche} • {lead.platform}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-900 font-mono text-xs font-bold border border-black/[0.05]">
                    {lead.dealPotential}
                  </span>
                </div>
              </div>

              {/* Status Pipeline Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {statuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateStatus(lead.id, st);
                        if (st === 'Closed Won') {
                          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
                        }
                      }}
                      className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        lead.status === st
                          ? 'bg-black text-white font-semibold shadow-xs'
                          : 'bg-[#FAF9F5] text-[#86868B] hover:text-black border border-black/[0.04]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {lead.notes && (
                  <span className="text-xs text-[#86868B] truncate max-w-xs">
                    Note: {lead.notes}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
