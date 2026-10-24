'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  PillarTab,
  DSAProblem,
  CollegeSubject,
  InterviewTopic,
  ClientProject,
  OutreachLead,
  HealthMetrics,
  LifeTask,
  ScheduleBlock,
  TimeBlockEvent,
  DailyRating,
  GoogleCalendarEvent,
} from '../types';
import { storage } from '../lib/storage';
import {
  authService,
  cloudSyncService,
  UserSystemState,
} from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { Sidebar } from '../components/Sidebar';
import { DashboardView } from '../components/DashboardView';
import { DailyTimelineView } from '../components/DailyTimelineView';
import { WeeklyCalendarView } from '../components/WeeklyCalendarView';
import { DSAView } from '../components/DSAView';
import { ClientsView } from '../components/ClientsView';
import { OutreachView } from '../components/OutreachView';
import { CollegeView } from '../components/CollegeView';
import { InterviewView } from '../components/InterviewView';
import { HealthRoutineView } from '../components/HealthRoutineView';
import { QuickAddModal } from '../components/QuickAddModal';
import { AIPromptModal } from '../components/AIPromptModal';
import { AuthModal } from '../components/AuthModal';
import { DailyRatingModal } from '../components/DailyRatingModal';
import { GoogleCalendarModal } from '../components/GoogleCalendarModal';
import { CustomIcon } from '../components/CustomIcon';
import { AIParsedResult } from '../types';
import { Sparkles, Plus, Clock, Cloud, RefreshCw, Calendar } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<PillarTab>('dashboard');

  // Pillar States
  const [tasks, setTasks] = useState<LifeTask[]>([]);
  const [dsaProblems, setDSAProblems] = useState<DSAProblem[]>([]);
  const [collegeSubjects, setCollegeSubjects] = useState<CollegeSubject[]>([]);
  const [interviewTopics, setInterviewTopics] = useState<InterviewTopic[]>([]);
  const [clients, setClients] = useState<ClientProject[]>([]);
  const [outreachLeads, setOutreachLeads] = useState<OutreachLead[]>([]);
  const [health, setHealth] = useState<HealthMetrics>(storage.getHealth());
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  const [timeBlockEvents, setTimeBlockEvents] = useState<TimeBlockEvent[]>([]);

  // Daily Rating & Google Calendar States
  const [ratings, setRatings] = useState<DailyRating[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showGoogleCalendarModal, setShowGoogleCalendarModal] = useState(false);
  const [gcalEvents, setGcalEvents] = useState<GoogleCalendarEvent[]>([]);
  const [todayStr, setTodayStr] = useState('');
  const [currentDateFormatted, setCurrentDateFormatted] = useState('');

  // User Session & Cloud Sync
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [cloudSynced, setCloudSynced] = useState(false);

  // UI Modal State
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);

  // Initialize from storage
  useEffect(() => {
    setTasks(storage.getTasks());
    setDSAProblems(storage.getDSA());
    setCollegeSubjects(storage.getCollege());
    setInterviewTopics(storage.getInterview());
    setClients(storage.getClients());
    setOutreachLeads(storage.getOutreach());
    setHealth(storage.getHealth());
    setScheduleBlocks(storage.getScheduleBlocks());
    setTimeBlockEvents(storage.getTimeBlockEvents());
    setRatings(storage.getRatings());

    const now = new Date();
    setTodayStr(now.toISOString().split('T')[0]);
    setCurrentDateFormatted(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    setMounted(true);
  }, []);

  // Supabase Auth and Cloud Realtime Synchronization
  useEffect(() => {
    authService.getUser().then((user) => {
      setCurrentUser(user);
    });

    const unsubscribe = authService.onAuthStateChange(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const remote = await cloudSyncService.loadState(user.id);
          if (remote) {
            setTasks(remote.tasks);
            setDSAProblems(remote.dsaProblems);
            setCollegeSubjects(remote.collegeSubjects);
            setInterviewTopics(remote.interviewTopics);
            setClients(remote.clients);
            setOutreachLeads(remote.outreachLeads);
            setHealth(remote.health);
            setScheduleBlocks(remote.scheduleBlocks);
            setTimeBlockEvents(remote.timeBlockEvents);
            if (remote.ratings) {
              setRatings(remote.ratings);
              storage.saveRatings(remote.ratings);
            }

            storage.saveTasks(remote.tasks);
            storage.saveDSA(remote.dsaProblems);
            storage.saveCollege(remote.collegeSubjects);
            storage.saveInterview(remote.interviewTopics);
            storage.saveClients(remote.clients);
            storage.saveOutreach(remote.outreachLeads);
            storage.saveHealth(remote.health);
            storage.saveScheduleBlocks(remote.scheduleBlocks);
            storage.saveTimeBlockEvents(remote.timeBlockEvents);
            setCloudSynced(true);
          } else {
            const initialSync: UserSystemState = {
              tasks: storage.getTasks(),
              dsaProblems: storage.getDSA(),
              collegeSubjects: storage.getCollege(),
              interviewTopics: storage.getInterview(),
              clients: storage.getClients(),
              outreachLeads: storage.getOutreach(),
              health: storage.getHealth(),
              scheduleBlocks: storage.getScheduleBlocks(),
              timeBlockEvents: storage.getTimeBlockEvents(),
              ratings: storage.getRatings(),
              googleCalendarUrl: storage.getGoogleCalendarUrl(),
            };
            await cloudSyncService.saveState(user.id, initialSync);
            setCloudSynced(true);
          }
        } catch (err) {
          console.error('Failed to sync cloud state on auth change:', err);
        }
      } else {
        setCloudSynced(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Realtime subscription: updates automatically whenever edits happen on Mobile, iPad, or PC
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = cloudSyncService.subscribeToRealtime(currentUser.id, (remote) => {
      setTasks(remote.tasks);
      setDSAProblems(remote.dsaProblems);
      setCollegeSubjects(remote.collegeSubjects);
      setInterviewTopics(remote.interviewTopics);
      setClients(remote.clients);
      setOutreachLeads(remote.outreachLeads);
      setHealth(remote.health);
      setScheduleBlocks(remote.scheduleBlocks);
      setTimeBlockEvents(remote.timeBlockEvents);
      if (remote.ratings) {
        setRatings(remote.ratings);
        storage.saveRatings(remote.ratings);
      }

      storage.saveTasks(remote.tasks);
      storage.saveDSA(remote.dsaProblems);
      storage.saveCollege(remote.collegeSubjects);
      storage.saveInterview(remote.interviewTopics);
      storage.saveClients(remote.clients);
      storage.saveOutreach(remote.outreachLeads);
      storage.saveHealth(remote.health);
      storage.saveScheduleBlocks(remote.scheduleBlocks);
      storage.saveTimeBlockEvents(remote.timeBlockEvents);
      setCloudSynced(true);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  // Helper to sync state to Supabase when logged in
  const syncToCloud = (partial: Partial<UserSystemState>) => {
    if (!currentUser) return;
    const fullState: UserSystemState = {
      tasks: partial.tasks !== undefined ? partial.tasks : tasks,
      dsaProblems: partial.dsaProblems !== undefined ? partial.dsaProblems : dsaProblems,
      collegeSubjects: partial.collegeSubjects !== undefined ? partial.collegeSubjects : collegeSubjects,
      interviewTopics: partial.interviewTopics !== undefined ? partial.interviewTopics : interviewTopics,
      clients: partial.clients !== undefined ? partial.clients : clients,
      outreachLeads: partial.outreachLeads !== undefined ? partial.outreachLeads : outreachLeads,
      health: partial.health !== undefined ? partial.health : health,
      scheduleBlocks: partial.scheduleBlocks !== undefined ? partial.scheduleBlocks : scheduleBlocks,
      timeBlockEvents: partial.timeBlockEvents !== undefined ? partial.timeBlockEvents : timeBlockEvents,
      ratings: partial.ratings !== undefined ? partial.ratings : ratings,
      googleCalendarUrl: partial.googleCalendarUrl !== undefined ? partial.googleCalendarUrl : storage.getGoogleCalendarUrl(),
    };
    cloudSyncService.saveState(currentUser.id, fullState);
  };

  const handleClearLocalData = () => {
    storage.clearAll();
    setTasks([]);
    setDSAProblems([]);
    setCollegeSubjects([]);
    setInterviewTopics([]);
    setClients([]);
    setOutreachLeads([]);
    setHealth(storage.getHealth());
    setScheduleBlocks([]);
    setTimeBlockEvents([]);
    setRatings([]);
    setGcalEvents([]);

    if (currentUser) {
      cloudSyncService.saveState(currentUser.id, {
        tasks: [],
        dsaProblems: [],
        collegeSubjects: [],
        interviewTopics: [],
        clients: [],
        outreachLeads: [],
        health: storage.getHealth(),
        scheduleBlocks: [],
        timeBlockEvents: [],
        ratings: [],
        googleCalendarUrl: '',
      });
    }
  };

  // Global Keyboard Shortcuts (N for quick add, CMD+K for AI Prompt)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setShowAIPrompt((prev) => !prev);
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setShowQuickAdd(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mutators with localStorage & Cloud sync
  const updateTasks = (newTasks: LifeTask[]) => {
    setTasks(newTasks);
    storage.saveTasks(newTasks);
    syncToCloud({ tasks: newTasks });
  };

  const updateDSA = (newData: DSAProblem[]) => {
    setDSAProblems(newData);
    storage.saveDSA(newData);
    syncToCloud({ dsaProblems: newData });
  };

  const updateCollege = (newData: CollegeSubject[]) => {
    setCollegeSubjects(newData);
    storage.saveCollege(newData);
    syncToCloud({ collegeSubjects: newData });
  };

  const updateInterview = (newData: InterviewTopic[]) => {
    setInterviewTopics(newData);
    storage.saveInterview(newData);
    syncToCloud({ interviewTopics: newData });
  };

  const updateClients = (newData: ClientProject[]) => {
    setClients(newData);
    storage.saveClients(newData);
    syncToCloud({ clients: newData });
  };

  const updateOutreach = (newData: OutreachLead[]) => {
    setOutreachLeads(newData);
    storage.saveOutreach(newData);
    syncToCloud({ outreachLeads: newData });
  };

  const updateHealth = (newData: HealthMetrics) => {
    setHealth(newData);
    storage.saveHealth(newData);
    syncToCloud({ health: newData });
  };

  // Handlers for Universal Tasks
  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            done: !t.done,
            completedAt: !t.done ? new Date().toISOString() : undefined,
          }
        : t
    );
    updateTasks(updated);
  };

  const handleAddTask = (newTask: Omit<LifeTask, 'id' | 'createdAt'>) => {
    const created: LifeTask = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    updateTasks([created, ...tasks]);
  };

  // Handlers for Daily Rating
  const handleSaveRating = (newRating: DailyRating) => {
    const updated = [newRating, ...ratings.filter((r) => r.date !== newRating.date)];
    setRatings(updated);
    storage.saveRatings(updated);
    syncToCloud({ ratings: updated });
  };

  // Handlers for Google Calendar
  const handleSyncGoogleCalendar = (events: GoogleCalendarEvent[], url: string) => {
    setGcalEvents(events);
    storage.saveGoogleCalendarUrl(url);
    syncToCloud({ googleCalendarUrl: url });
  };

  // Handlers for DSA
  const handleToggleDSA = (id: string) => {
    const updated = dsaProblems.map((p) =>
      p.id === id ? { ...p, solved: !p.solved, solvedAt: !p.solved ? new Date().toISOString() : undefined } : p
    );
    updateDSA(updated);
  };

  const handleAddDSA = (newProblem: Omit<DSAProblem, 'id' | 'solved'>) => {
    const created: DSAProblem = {
      ...newProblem,
      id: `dsa-${Date.now()}`,
      solved: false,
    };
    updateDSA([...dsaProblems, created]);
  };

  // Handlers for Clients
  const handleToggleClientTask = (clientId: string, taskId: string) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        return {
          ...c,
          tasks: c.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
        };
      }
      return c;
    });
    updateClients(updated);
  };

  const handleUpdateClientStage = (clientId: string, stage: ClientProject['stage']) => {
    const updated = clients.map((c) => (c.id === clientId ? { ...c, stage } : c));
    updateClients(updated);
  };

  const handleAddClient = (newClient: Omit<ClientProject, 'id'>) => {
    const created: ClientProject = {
      ...newClient,
      id: `client-${Date.now()}`,
    };
    updateClients([...clients, created]);
  };

  // Handlers for Outreach
  const handleUpdateOutreachStatus = (leadId: string, status: OutreachLead['status']) => {
    const updated = outreachLeads.map((l) => (l.id === leadId ? { ...l, status } : l));
    updateOutreach(updated);
  };

  const handleAddOutreachLead = (newLead: Omit<OutreachLead, 'id'>) => {
    const created: OutreachLead = {
      ...newLead,
      id: `lead-${Date.now()}`,
    };
    updateOutreach([...outreachLeads, created]);
  };

  // Handlers for College
  const handleUpdateAttendance = (subjectId: string, attended: boolean) => {
    const updated = collegeSubjects.map((s) => {
      if (s.id === subjectId) {
        return {
          ...s,
          attendancePresent: attended ? s.attendancePresent + 1 : s.attendancePresent,
          attendanceTotal: s.attendanceTotal + 1,
        };
      }
      return s;
    });
    updateCollege(updated);
  };

  const handleToggleAssignment = (subjectId: string, assignmentText: string) => {
    const updated = collegeSubjects.map((s) => {
      if (s.id === subjectId) {
        return {
          ...s,
          assignmentsPending: s.assignmentsPending.filter((a) => a !== assignmentText),
        };
      }
      return s;
    });
    updateCollege(updated);
  };

  const handleAddSubject = (newSubject: Omit<CollegeSubject, 'id'>) => {
    const created: CollegeSubject = {
      ...newSubject,
      id: `subj-${Date.now()}`,
    };
    updateCollege([...collegeSubjects, created]);
  };

  // Handlers for Interview
  const handleToggleInterviewMastered = (id: string) => {
    const updated = interviewTopics.map((t) => (t.id === id ? { ...t, mastered: !t.mastered } : t));
    updateInterview(updated);
  };

  const handleAddInterviewTopic = (newTopic: Omit<InterviewTopic, 'id'>) => {
    const created: InterviewTopic = {
      ...newTopic,
      id: `int-${Date.now()}`,
    };
    updateInterview([...interviewTopics, created]);
  };

  // Handlers for Timeline & Weekly Time-Blocking
  const handleToggleScheduleBlock = (id: string) => {
    const updated = scheduleBlocks.map((b) => (b.id === id ? { ...b, done: !b.done } : b));
    setScheduleBlocks(updated);
    storage.saveScheduleBlocks(updated);
    syncToCloud({ scheduleBlocks: updated });
  };

  const handleAddScheduleBlock = (newBlock: Omit<ScheduleBlock, 'id'>) => {
    const created: ScheduleBlock = {
      ...newBlock,
      id: `sb-${Date.now()}`,
    };
    const updated = [...scheduleBlocks, created];
    setScheduleBlocks(updated);
    storage.saveScheduleBlocks(updated);
    syncToCloud({ scheduleBlocks: updated });
  };

  const handleAddTimeBlockEvent = (newEvent: Omit<TimeBlockEvent, 'id'>) => {
    const created: TimeBlockEvent = {
      ...newEvent,
      id: `tb-${Date.now()}`,
    };
    const updated = [...timeBlockEvents, created];
    setTimeBlockEvents(updated);
    storage.saveTimeBlockEvents(updated);
    syncToCloud({ timeBlockEvents: updated });
  };

  // AI 1-Click Multi-Pillar Distribution Handler (Atomic & Free of Mock Data)
  const handleApplyAIParsedResult = (parsed: AIParsedResult) => {
    let nextTasks = [...tasks];
    let nextDSA = [...dsaProblems];
    let nextClients = [...clients];
    let nextCollege = [...collegeSubjects];
    let nextOutreach = [...outreachLeads];
    let nextInterview = [...interviewTopics];
    let nextHealth = { ...health };
    let nextScheduleBlocks = [...scheduleBlocks];

    // 1. DSA Problems with automatic LeetCode URLs
    if (parsed.dsaProblems && parsed.dsaProblems.length > 0) {
      const newDSA: DSAProblem[] = parsed.dsaProblems.map((p, i) => ({
        ...p,
        id: `dsa-${Date.now()}-${i}`,
      }));
      nextDSA = [...newDSA, ...nextDSA];
    }

    // 2. Client Tasks & Deliverables (Preserves exact user text, zero fabricated retainers)
    if (parsed.clientTasks && parsed.clientTasks.length > 0) {
      parsed.clientTasks.forEach((c, idx) => {
        const existing = nextClients.find((cli) => cli.clientName.toLowerCase() === c.clientName.toLowerCase());
        if (existing) {
          existing.tasks.push({
            id: `task-${Date.now()}-${idx}`,
            text: c.taskText,
            done: false,
          });
          if (c.deadline) existing.deadline = c.deadline;
        } else {
          nextClients.unshift({
            id: `client-${Date.now()}-${idx}`,
            clientName: c.clientName,
            projectTitle: c.projectTitle || 'Deliverable',
            dealValue: c.dealValue || '',
            stage: 'Ingest & Rough Cut',
            deadline: c.deadline || 'Pending',
            tasks: [{ id: `t-${Date.now()}-${idx}`, text: c.taskText, done: false }],
          });
        }
      });
    }

    // 3. College Academics
    if (parsed.collegeTasks && parsed.collegeTasks.length > 0) {
      parsed.collegeTasks.forEach((col) => {
        const existing = nextCollege.find(
          (sub) =>
            sub.name.toLowerCase().includes(col.subjectName.toLowerCase()) ||
            (col.subjectCode && sub.code.toLowerCase() === col.subjectCode.toLowerCase())
        );
        if (existing) {
          if (col.attended) {
            existing.attendancePresent += 1;
            existing.attendanceTotal += 1;
          }
          if (col.assignmentText && !existing.assignmentsPending.includes(col.assignmentText)) {
            existing.assignmentsPending.push(col.assignmentText);
          }
        }
      });
    }

    // 4. Outreach CRM Leads
    if (parsed.outreachLeads && parsed.outreachLeads.length > 0) {
      const newLeads: OutreachLead[] = parsed.outreachLeads.map((l, i) => ({
        ...l,
        id: `lead-${Date.now()}-${i}`,
      }));
      nextOutreach = [...newLeads, ...nextOutreach];
    }

    // 5. Interview Prep Topics
    if (parsed.interviewTopics && parsed.interviewTopics.length > 0) {
      const newTopics: InterviewTopic[] = parsed.interviewTopics.map((t, i) => ({
        ...t,
        id: `topic-${Date.now()}-${i}`,
      }));
      nextInterview = [...newTopics, ...nextInterview];
    }

    // 6. Health & Routine
    if (parsed.healthMetrics) {
      nextHealth = {
        ...nextHealth,
        ...(parsed.healthMetrics.waterGlasses !== undefined ? { waterGlasses: parsed.healthMetrics.waterGlasses } : {}),
        ...(parsed.healthMetrics.sleepHours !== undefined ? { sleepHours: parsed.healthMetrics.sleepHours } : {}),
        ...(parsed.healthMetrics.workoutDone !== undefined ? { workoutDone: parsed.healthMetrics.workoutDone } : {}),
      };
    }

    // 7. Timeline Blocks
    if (parsed.timelineBlocks && parsed.timelineBlocks.length > 0) {
      const newBlocks: ScheduleBlock[] = parsed.timelineBlocks.map((b, i) => ({
        ...b,
        id: `sb-${Date.now()}-${i}`,
      }));
      nextScheduleBlocks = [...nextScheduleBlocks, ...newBlocks];
    }

    // 8. General Priority Tasks
    if (parsed.generalTasks && parsed.generalTasks.length > 0) {
      const newTasks: LifeTask[] = parsed.generalTasks.map((t, i) => ({
        ...t,
        id: `task-${Date.now()}-${i}`,
        createdAt: new Date().toISOString(),
      }));
      nextTasks = [...newTasks, ...nextTasks];
    }

    // Atomically commit all state & localStorage
    setTasks(nextTasks);
    storage.saveTasks(nextTasks);

    setDSAProblems(nextDSA);
    storage.saveDSA(nextDSA);

    setClients(nextClients);
    storage.saveClients(nextClients);

    setCollegeSubjects(nextCollege);
    storage.saveCollege(nextCollege);

    setOutreachLeads(nextOutreach);
    storage.saveOutreach(nextOutreach);

    setInterviewTopics(nextInterview);
    storage.saveInterview(nextInterview);

    setHealth(nextHealth);
    storage.saveHealth(nextHealth);

    setScheduleBlocks(nextScheduleBlocks);
    storage.saveScheduleBlocks(nextScheduleBlocks);

    // Atomically sync to cloud
    if (currentUser) {
      cloudSyncService.saveState(currentUser.id, {
        tasks: nextTasks,
        dsaProblems: nextDSA,
        collegeSubjects: nextCollege,
        interviewTopics: nextInterview,
        clients: nextClients,
        outreachLeads: nextOutreach,
        health: nextHealth,
        scheduleBlocks: nextScheduleBlocks,
        timeBlockEvents,
        ratings,
        googleCalendarUrl: storage.getGoogleCalendarUrl(),
      });
    }
  };

  // Live Composite 10-Point Score Calculation
  const dailyScore = useMemo(() => {
    let score = 5.0; // Base baseline
    const dsaSolved = dsaProblems.filter((p) => p.solved).length;
    score += Math.min(2.0, (dsaSolved / 3) * 2.0); // Up to 2 pts for DSA target

    const mustTasks = tasks.filter((t) => t.priority === 'must');
    const mustDone = mustTasks.filter((t) => t.done).length;
    if (mustTasks.length > 0) {
      score += (mustDone / mustTasks.length) * 1.5;
    } else {
      score += 1.0;
    }

    if (health.workoutDone) score += 0.5;
    if (health.morningRoutineDone) score += 0.4;
    score += (health.waterGlasses / 8) * 0.4;

    const callBooked = outreachLeads.some((l) => l.status === 'Call Booked' || l.status === 'Closed Won');
    if (callBooked) score += 0.5;

    return Math.min(10.0, Math.max(5.0, Number(score.toFixed(1))));
  }, [dsaProblems, tasks, health, outreachLeads]);

  // Today's Date String & Stored Rating
  const todayRating = useMemo(() => {
    if (!todayStr) return undefined;
    return ratings.find((r) => r.date === todayStr);
  }, [ratings, todayStr]);

  // Dynamic Sidebar Badges
  const badges = {
    dsaPending: dsaProblems.filter((p) => !p.solved).length,
    collegePending: collegeSubjects.reduce((acc, curr) => acc + curr.assignmentsPending.length, 0),
    interviewPending: interviewTopics.filter((t) => !t.mastered).length,
    clientsActive: clients.filter((c) => c.stage !== 'Completed').length,
    outreachLeads: outreachLeads.length,
    mustTasksPending: tasks.filter((t) => t.priority === 'must' && !t.done).length,
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FDFBF6] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-black/20 border-t-black animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF6] text-[#1D1D1F] flex flex-col lg:flex-row pb-12 selection:bg-amber-200">
      {/* Dynamic Sidebar with Badges */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenQuickAdd={() => setShowQuickAdd(true)}
        onOpenAIPrompt={() => setShowAIPrompt(true)}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        dailyScore={dailyScore}
        badges={badges}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 lg:ml-72 max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 pb-36 lg:pb-12">
        {/* Workspace Header */}
        <header className="flex items-center justify-between border-b border-black/[0.06] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${currentUser ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'}`} />
              <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                {currentDateFormatted || 'Today'}
              </span>
              {currentUser && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                  <Cloud className="w-3 h-3 text-emerald-600" />
                  Synced across devices
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#1D1D1F] mt-0.5">
              {activeTab === 'dashboard' && 'Master Life & Career Dashboard'}
              {activeTab === 'timeline' && "Today's Schedule & Timeline"}
              {activeTab === 'calendar' && 'Weekly Time-Blocking Calendar'}
              {activeTab === 'dsa' && 'DSA & LeetCode (Python 3)'}
              {activeTab === 'clients' && 'Video Editing Client Projects'}
              {activeTab === 'outreach' && 'High-Ticket Client Outreach'}
              {activeTab === 'college' && 'College Academics & Attendance'}
              {activeTab === 'interview' && 'Technical Interview Concepts'}
              {activeTab === 'health' && 'Health & Daily Routines'}
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setShowGoogleCalendarModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white text-[#1D1D1F] border border-black/[0.08] text-xs font-medium active:scale-95 transition-all shadow-xs"
              title="Sync with Google Calendar via private .ics link"
            >
              <Calendar className="w-3.5 h-3.5 text-neutral-600" />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white text-[#1D1D1F] border border-black/[0.08] text-xs font-medium active:scale-95 transition-all shadow-xs"
              title={currentUser ? `Logged in as ${currentUser.email}` : 'Sign in to sync across Mobile, iPad, and PC'}
            >
              {currentUser ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">{currentUser.email?.split('@')[0]}</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Sync Devices</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowAIPrompt(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF9F5] hover:bg-[#F3EFE6] text-[#1D1D1F] border border-black/[0.08] text-xs font-bold active:scale-95 transition-all shadow-xs"
            >
              <CustomIcon name="wand" className="w-3.5 h-3.5" />
              <span>AI Prompt (CMD+K)</span>
            </button>

            <button
              onClick={() => setShowQuickAdd(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Add Task</span>
            </button>
          </div>
        </header>

        {/* Tab Views with Fluid Spring Animation on Switch */}
        <div key={activeTab} className="apple-spring-in space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              score={dailyScore}
              userName={currentUser?.email?.split('@')[0] || 'Prateek'}
              tasks={tasks}
              dsaProblems={dsaProblems}
              clients={clients}
              outreachLeads={outreachLeads}
              collegeSubjects={collegeSubjects}
              interviewTopics={interviewTopics}
              health={health}
              todayRating={todayRating}
              onToggleTask={handleToggleTask}
              onSelectTab={setActiveTab}
              onOpenQuickAdd={() => setShowQuickAdd(true)}
              onOpenDailyRating={() => setShowRatingModal(true)}
              onOpenGoogleCalendar={() => setShowGoogleCalendarModal(true)}
            />
          )}

          {activeTab === 'timeline' && (
            <DailyTimelineView
              blocks={scheduleBlocks}
              onToggleBlock={handleToggleScheduleBlock}
              onAddBlock={handleAddScheduleBlock}
              onOpenGoogleCalendar={() => setShowGoogleCalendarModal(true)}
            />
          )}

          {activeTab === 'calendar' && (
            <WeeklyCalendarView
              events={timeBlockEvents}
              onAddEvent={handleAddTimeBlockEvent}
            />
          )}

          {activeTab === 'dsa' && (
            <DSAView
              problems={dsaProblems}
              onToggleProblem={handleToggleDSA}
              onAddProblem={handleAddDSA}
            />
          )}

          {activeTab === 'clients' && (
            <ClientsView
              clients={clients}
              onToggleTask={handleToggleClientTask}
              onUpdateStage={handleUpdateClientStage}
              onAddClient={handleAddClient}
            />
          )}

          {activeTab === 'outreach' && (
            <OutreachView
              leads={outreachLeads}
              onUpdateStatus={handleUpdateOutreachStatus}
              onAddLead={handleAddOutreachLead}
            />
          )}

          {activeTab === 'college' && (
            <CollegeView
              subjects={collegeSubjects}
              onUpdateAttendance={handleUpdateAttendance}
              onToggleAssignment={handleToggleAssignment}
              onAddSubject={handleAddSubject}
            />
          )}

          {activeTab === 'interview' && (
            <InterviewView
              topics={interviewTopics}
              onToggleMastered={handleToggleInterviewMastered}
              onAddTopic={handleAddInterviewTopic}
            />
          )}

          {activeTab === 'health' && (
            <HealthRoutineView
              health={health}
              onUpdateHealth={updateHealth}
            />
          )}
        </div>
      </main>

      {/* Fast Universal Quick Add Task Modal */}
      {showQuickAdd && (
        <QuickAddModal
          onAddTask={handleAddTask}
          onAddDSA={handleAddDSA}
          onClose={() => setShowQuickAdd(false)}
        />
      )}

      {/* Universal AI Prompt Intake Modal (CMD+K) */}
      <AIPromptModal
        isOpen={showAIPrompt}
        onClose={() => setShowAIPrompt(false)}
        onApplyParsedResult={handleApplyAIParsedResult}
      />

      {/* Daily End-of-Day Rating Modal */}
      <DailyRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        todayRating={todayRating}
        onSaveRating={handleSaveRating}
      />

      {/* Google Calendar iCal Sync Modal */}
      <GoogleCalendarModal
        isOpen={showGoogleCalendarModal}
        onClose={() => setShowGoogleCalendarModal(false)}
        onEventsSynced={handleSyncGoogleCalendar}
      />

      {/* Supabase Multi-Device Auth & Sync Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        onClearLocalData={handleClearLocalData}
      />
    </div>
  );
}
