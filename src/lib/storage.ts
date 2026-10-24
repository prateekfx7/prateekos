import {
  DSAProblem,
  CollegeSubject,
  InterviewTopic,
  ClientProject,
  OutreachLead,
  HealthMetrics,
  LifeTask,
  ScheduleBlock,
  TimeBlockEvent,
} from '../types';

// Clean Blank Slate — 0 Mock Data (Ready for real personal entries across PC, Mobile, and iPad)
export const INITIAL_DSA_PROBLEMS: DSAProblem[] = [];
export const INITIAL_COLLEGE_SUBJECTS: CollegeSubject[] = [];
export const INITIAL_INTERVIEW_TOPICS: InterviewTopic[] = [];
export const INITIAL_CLIENTS: ClientProject[] = [];
export const INITIAL_OUTREACH: OutreachLead[] = [];

export const INITIAL_HEALTH: HealthMetrics = {
  waterGlasses: 0,
  sleepHours: 7.0,
  workoutDone: false,
  energyScore: 8,
  morningRoutineDone: false,
  nightRoutineDone: false,
};

export const INITIAL_LIFE_TASKS: LifeTask[] = [];
export const INITIAL_SCHEDULE_BLOCKS: ScheduleBlock[] = [];
export const INITIAL_TIME_BLOCK_EVENTS: TimeBlockEvent[] = [];

const KEYS = {
  DSA: 'dsa_os_problems',
  COLLEGE: 'dsa_os_college',
  INTERVIEW: 'dsa_os_interview',
  CLIENTS: 'dsa_os_clients',
  OUTREACH: 'dsa_os_outreach',
  HEALTH: 'dsa_os_health',
  TASKS: 'dsa_os_tasks',
};

export const storage = {
  getDSA: (): DSAProblem[] => {
    if (typeof window === 'undefined') return INITIAL_DSA_PROBLEMS;
    const d = localStorage.getItem(KEYS.DSA);
    return d ? JSON.parse(d) : INITIAL_DSA_PROBLEMS;
  },
  saveDSA: (data: DSAProblem[]) => {
    if (typeof window !== 'undefined') localStorage.setItem(KEYS.DSA, JSON.stringify(data));
  },

  getCollege: (): CollegeSubject[] => {
    if (typeof window === 'undefined') return INITIAL_COLLEGE_SUBJECTS;
    const d = localStorage.getItem(KEYS.COLLEGE);
    return d ? JSON.parse(d) : INITIAL_COLLEGE_SUBJECTS;
  },
  saveCollege: (data: CollegeSubject[]) => {
    if (typeof window !== 'undefined') localStorage.setItem(KEYS.COLLEGE, JSON.stringify(data));
  },

  getInterview: (): InterviewTopic[] => {
    if (typeof window === 'undefined') return INITIAL_INTERVIEW_TOPICS;
    const d = localStorage.getItem(KEYS.INTERVIEW);
    return d ? JSON.parse(d) : INITIAL_INTERVIEW_TOPICS;
  },
  saveInterview: (data: InterviewTopic[]) => {
    if (typeof window !== 'undefined') localStorage.setItem(KEYS.INTERVIEW, JSON.stringify(data));
  },

  getClients: (): ClientProject[] => {
    if (typeof window === 'undefined') return INITIAL_CLIENTS;
    const d = localStorage.getItem(KEYS.CLIENTS);
    return d ? JSON.parse(d) : INITIAL_CLIENTS;
  },
  saveClients: (data: ClientProject[]) => {
    if (typeof window !== 'undefined') localStorage.setItem(KEYS.CLIENTS, JSON.stringify(data));
  },

  getOutreach: (): OutreachLead[] => {
    if (typeof window === 'undefined') return INITIAL_OUTREACH;
    const d = localStorage.getItem(KEYS.OUTREACH);
    return d ? JSON.parse(d) : INITIAL_OUTREACH;
  },
  saveOutreach: (data: OutreachLead[]) => {
    if (typeof window !== 'undefined') localStorage.setItem(KEYS.OUTREACH, JSON.stringify(data));
  },

  getHealth: (): HealthMetrics => {
    if (typeof window === 'undefined') return INITIAL_HEALTH;
    const d = localStorage.getItem(KEYS.HEALTH);
    return d ? JSON.parse(d) : INITIAL_HEALTH;
  },
  saveHealth: (data: HealthMetrics) => {
    if (typeof window !== 'undefined') localStorage.setItem(KEYS.HEALTH, JSON.stringify(data));
  },

  getTasks: (): LifeTask[] => {
    if (typeof window === 'undefined') return INITIAL_LIFE_TASKS;
    const d = localStorage.getItem(KEYS.TASKS);
    return d ? JSON.parse(d) : INITIAL_LIFE_TASKS;
  },
  saveTasks: (data: LifeTask[]) => {
    if (typeof window !== 'undefined') localStorage.setItem(KEYS.TASKS, JSON.stringify(data));
  },

  getScheduleBlocks: (): ScheduleBlock[] => {
    if (typeof window === 'undefined') return INITIAL_SCHEDULE_BLOCKS;
    const d = localStorage.getItem('dsa_os_schedule_blocks');
    return d ? JSON.parse(d) : INITIAL_SCHEDULE_BLOCKS;
  },
  saveScheduleBlocks: (data: ScheduleBlock[]) => {
    if (typeof window !== 'undefined') localStorage.setItem('dsa_os_schedule_blocks', JSON.stringify(data));
  },

  getTimeBlockEvents: (): TimeBlockEvent[] => {
    if (typeof window === 'undefined') return INITIAL_TIME_BLOCK_EVENTS;
    const d = localStorage.getItem('dsa_os_time_blocks');
    return d ? JSON.parse(d) : INITIAL_TIME_BLOCK_EVENTS;
  },
  saveTimeBlockEvents: (data: TimeBlockEvent[]) => {
    if (typeof window !== 'undefined') localStorage.setItem('dsa_os_time_blocks', JSON.stringify(data));
  },

  getApiKey: (): string => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('dsa_os_gemini_api_key') || '';
  },
  saveApiKey: (key: string) => {
    if (typeof window !== 'undefined') localStorage.setItem('dsa_os_gemini_api_key', key);
  },

  clearAll: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(KEYS.DSA);
      localStorage.removeItem(KEYS.COLLEGE);
      localStorage.removeItem(KEYS.INTERVIEW);
      localStorage.removeItem(KEYS.CLIENTS);
      localStorage.removeItem(KEYS.OUTREACH);
      localStorage.removeItem(KEYS.HEALTH);
      localStorage.removeItem(KEYS.TASKS);
      localStorage.removeItem('dsa_os_schedule_blocks');
      localStorage.removeItem('dsa_os_time_blocks');
    }
  },
};
