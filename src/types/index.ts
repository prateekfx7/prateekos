export type PillarTab = 
  | 'dashboard'
  | 'timeline'
  | 'calendar'
  | 'dsa'
  | 'college'
  | 'interview'
  | 'clients'
  | 'outreach'
  | 'health';

export interface ScheduleBlock {
  id: string;
  time: string; // e.g. "07:30 AM"
  endTime?: string; // e.g. "08:30 AM"
  title: string;
  description: string;
  category: 'dsa' | 'college' | 'interview' | 'clients' | 'outreach' | 'health' | 'general';
  done: boolean;
  highlight?: boolean; // active task card style from Image 2
}

export interface TimeBlockEvent {
  id: string;
  dayIndex: number; // 0 for Mon, 1 for Tue, ..., 6 for Sun
  startHour: number; // 8 to 19
  durationHours: number; // 1 to 3
  title: string;
  category: 'dsa' | 'college' | 'interview' | 'clients' | 'outreach' | 'health';
  color?: string;
  tag: string;
}

export interface AIParsedResult {
  summary: string;
  dsaProblems: Omit<DSAProblem, 'id'>[];
  clientTasks: {
    clientName: string;
    projectTitle: string;
    taskText: string;
    dealValue?: string;
    deadline?: string;
  }[];
  collegeTasks: {
    subjectName: string;
    subjectCode: string;
    assignmentText?: string;
    attended?: boolean;
  }[];
  outreachLeads: Omit<OutreachLead, 'id'>[];
  interviewTopics: Omit<InterviewTopic, 'id'>[];
  healthMetrics?: Partial<HealthMetrics>;
  timelineBlocks: Omit<ScheduleBlock, 'id'>[];
  generalTasks: Omit<LifeTask, 'id' | 'createdAt'>[];
}

// DSA & LeetCode Types
export interface DSAProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string; // Arrays, Two Pointers, Trees, Graphs, DP, Binary Search, etc.
  solved: boolean;
  notes?: string;
  codeSnippet?: string;
  leetcodeUrl?: string;
  solvedAt?: string;
}

// College & Academic Types
export interface CollegeSubject {
  id: string;
  name: string;
  code: string;
  credits: number;
  attendancePresent: number;
  attendanceTotal: number;
  syllabusProgress: number; // 0-100%
  assignmentsPending: string[];
  nextExamDate?: string;
}

// Interview Prep Types
export interface InterviewTopic {
  id: string;
  category: 'OS' | 'DBMS' | 'Computer Networks' | 'System Design' | 'Behavioral';
  title: string;
  mastered: boolean;
  notes?: string;
}

// Video Editing Client Types
export interface ClientProject {
  id: string;
  clientName: string;
  projectTitle: string;
  dealValue: string; // e.g. "$1,500" or "₹40,000"
  stage: 'Ingest & Rough Cut' | 'Revisions & Color' | 'Sound & Polish' | 'Ready to Deliver' | 'Completed';
  deadline: string;
  previewUrl?: string;
  tasks: { id: string; text: string; done: boolean }[];
}

// Outreach & High-Ticket Closing Types
export interface OutreachLead {
  id: string;
  name: string;
  platform: 'Twitter / X' | 'LinkedIn' | 'Cold Email' | 'Instagram';
  handle: string;
  niche: string; // e.g. "SaaS Founder", "YouTuber", "Agency Owner"
  status: 'Lead' | 'DM Sent' | 'Audit Sent' | 'Call Booked' | 'Closed Won';
  dealPotential: string;
  lastContacted: string;
  notes?: string;
}

// Daily Routine & Health Types
export interface HealthMetrics {
  waterGlasses: number; // target 8
  sleepHours: number; // target 7.5
  workoutDone: boolean;
  energyScore: number; // 1-10
  morningRoutineDone: boolean;
  nightRoutineDone: boolean;
}

// Universal Task
export interface LifeTask {
  id: string;
  title: string;
  category: 'dsa' | 'college' | 'interview' | 'clients' | 'outreach' | 'health' | 'general';
  priority: 'must' | 'should' | 'later';
  done: boolean;
  dueTime?: string;
  createdAt: string;
  completedAt?: string;
  carriedOver?: boolean; // True if rolled over from previous day
  originalDate?: string; // YYYY-MM-DD of original creation
  archived?: boolean; // True if completed on previous day and archived into history
}

// Daily End-of-Day Rating & Reflection
export interface DailyRating {
  id: string;
  date: string; // YYYY-MM-DD
  score: number; // 1-10
  focusLevel: 'Low' | 'Medium' | 'High' | 'Flow State';
  note?: string;
  wins?: string;
  tags?: string[];
  createdAt: string;
}

// Google Calendar iCal Event
export interface GoogleCalendarEvent {
  id: string;
  title: string;
  startTime: string; // e.g. "10:00 AM"
  endTime?: string; // e.g. "11:30 AM"
  date: string; // YYYY-MM-DD
  description?: string;
  location?: string;
  isAllDay?: boolean;
}

// Auxiliary types for backward compatibility across modules
export type Priority = 'must' | 'should' | 'later';
export type TaskStatus = 'open' | 'done';
export type RoutineSlot = 'morning' | 'night' | 'anytime';
export type SpaceType = 'client' | 'content' | 'personal' | 'system';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  due_at?: string;
  due_time?: string;
  priority: Priority;
  status: TaskStatus;
  project_id?: string;
  gcal_event_id?: string;
  completed_at?: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  space_type: SpaceType;
  icon: string;
  color: string;
  description?: string;
}

export interface SOPItem {
  id: string;
  text: string;
  notes?: string;
  done: boolean;
  done_at?: string;
  estimated_mins?: number;
}

export interface ProjectSOP {
  id: string;
  project_id: string;
  title: string;
  items: SOPItem[];
  created_at: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  routine_slot: RoutineSlot;
  time_target?: string;
  streak: number;
  best_streak: number;
  completed_today: boolean;
  history: Record<string, boolean>;
}

export interface FocusSession {
  id: string;
  project_id?: string;
  task_id?: string;
  task_title?: string;
  duration_minutes: number;
  notes?: string;
  started_at: string;
  completed_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  date: string;
  color: string;
  location?: string;
  is_gcal?: boolean;
}

export interface WeeklyReview {
  id: string;
  week_start: string;
  score: number;
  wins: string[];
  stuck: string[];
  lessons: string[];
  targets: string[];
  created_at: string;
}

export interface UserProfile {
  timezone: string;
  reminder_morning: string;
  reminder_midday: string;
  reminder_night: string;
  notifications_enabled: boolean;
  gcal_connected: boolean;
  supabase_url?: string;
  supabase_anon_key?: string;
}
