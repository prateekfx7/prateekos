import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import {
  LifeTask,
  DSAProblem,
  CollegeSubject,
  InterviewTopic,
  ClientProject,
  OutreachLead,
  HealthMetrics,
  ScheduleBlock,
  TimeBlockEvent,
} from '../types';

export interface UserSystemState {
  tasks: LifeTask[];
  dsaProblems: DSAProblem[];
  collegeSubjects: CollegeSubject[];
  interviewTopics: InterviewTopic[];
  clients: ClientProject[];
  outreachLeads: OutreachLead[];
  health: HealthMetrics;
  scheduleBlocks: ScheduleBlock[];
  timeBlockEvents: TimeBlockEvent[];
}

// Retrieve configured or custom Supabase credentials
export const getSupabaseConfig = () => {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('dsa_os_supabase_url');
    const customKey = localStorage.getItem('dsa_os_supabase_key');
    if (customUrl && customKey) {
      return { url: customUrl.trim(), key: customKey.trim() };
    }
  }

  return { url: envUrl.trim(), key: envKey.trim() };
};

export const saveSupabaseConfig = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    if (url && key) {
      localStorage.setItem('dsa_os_supabase_url', url.trim());
      localStorage.setItem('dsa_os_supabase_key', key.trim());
    } else {
      localStorage.removeItem('dsa_os_supabase_url');
      localStorage.removeItem('dsa_os_supabase_key');
    }
  }
  resetSupabaseClient();
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;

  if (!clientInstance) {
    clientInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return clientInstance;
};

export const resetSupabaseClient = () => {
  clientInstance = null;
};

export const isSupabaseConfigured = () => {
  const { url, key } = getSupabaseConfig();
  return Boolean(url && key);
};

// Authentication services
export const authService = {
  signInWithGoogle: async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase is not connected yet. Please enter your free Supabase URL & Anon Key.');
    const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });
    if (error) throw error;
    return data;
  },

  signInWithEmail: async (email: string, password?: string) => {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase is not connected yet. Please enter your free Supabase URL & Anon Key.');

    if (password) {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } else {
      // Passwordless magic link
      const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
      const { data, error } = await client.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) throw error;
      return data;
    }
  },

  signUpWithEmail: async (email: string, password: string) => {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase is not connected yet. Please enter your free Supabase URL & Anon Key.');
    const { data, error } = await client.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const client = getSupabaseClient();
    if (!client) return;
    await client.auth.signOut();
  },

  getUser: async (): Promise<User | null> => {
    const client = getSupabaseClient();
    if (!client) return null;
    const { data } = await client.auth.getUser();
    return data.user || null;
  },

  onAuthStateChange: (callback: (user: User | null) => void) => {
    const client = getSupabaseClient();
    if (!client) return () => {};
    const { data: subscription } = client.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null);
    });
    return () => subscription.subscription.unsubscribe();
  },
};

// Database Cloud Synchronization Services
export const cloudSyncService = {
  loadState: async (userId: string): Promise<UserSystemState | null> => {
    const client = getSupabaseClient();
    if (!client || !userId) return null;

    try {
      const { data, error } = await client
        .from('user_system_state')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Could not load user_system_state from cloud:', error.message);
        return null;
      }

      if (!data) return null;

      return {
        tasks: data.tasks || [],
        dsaProblems: data.dsa_problems || [],
        collegeSubjects: data.college_subjects || [],
        interviewTopics: data.interview_topics || [],
        clients: data.client_projects || [],
        outreachLeads: data.outreach_leads || [],
        health: data.health_metrics || {
          waterGlasses: 0,
          sleepHours: 7.0,
          workoutDone: false,
          energyScore: 8,
          morningRoutineDone: false,
          nightRoutineDone: false,
        },
        scheduleBlocks: data.schedule_blocks || [],
        timeBlockEvents: data.time_block_events || [],
      };
    } catch (err) {
      console.error('Failed to load user state from Supabase:', err);
      return null;
    }
  },

  saveState: async (userId: string, state: UserSystemState): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client || !userId) return false;

    try {
      const payload = {
        user_id: userId,
        tasks: state.tasks,
        dsa_problems: state.dsaProblems,
        college_subjects: state.collegeSubjects,
        interview_topics: state.interviewTopics,
        client_projects: state.clients,
        outreach_leads: state.outreachLeads,
        health_metrics: state.health,
        schedule_blocks: state.scheduleBlocks,
        time_block_events: state.timeBlockEvents,
        updated_at: new Date().toISOString(),
      };

      const { error } = await client
        .from('user_system_state')
        .upsert(payload, { onConflict: 'user_id' });

      if (error) {
        console.warn('Failed to upsert to user_system_state:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error saving state to Supabase:', err);
      return false;
    }
  },

  subscribeToRealtime: (userId: string, onRemoteUpdate: (state: UserSystemState) => void) => {
    const client = getSupabaseClient();
    if (!client || !userId) return () => {};

    const channel = client
      .channel(`sync-user-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_system_state',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new) {
            const data = payload.new as any;
            onRemoteUpdate({
              tasks: data.tasks || [],
              dsaProblems: data.dsa_problems || [],
              collegeSubjects: data.college_subjects || [],
              interviewTopics: data.interview_topics || [],
              clients: data.client_projects || [],
              outreachLeads: data.outreach_leads || [],
              health: data.health_metrics || {
                waterGlasses: 0,
                sleepHours: 7.0,
                workoutDone: false,
                energyScore: 8,
                morningRoutineDone: false,
                nightRoutineDone: false,
              },
              scheduleBlocks: data.schedule_blocks || [],
              timeBlockEvents: data.time_block_events || [],
            });
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  },
};
