-- ==============================================================================
-- LIFE & CAREER OS: CROSS-DEVICE REALTIME SYNC SCHEMA
-- 100% Free Forever on Supabase Free Tier (PostgreSQL + RLS + Realtime)
--
-- Instructions:
-- 1. Create a free project at https://supabase.com
-- 2. Go to "SQL Editor" in your Supabase dashboard sidebar
-- 3. Paste this entire script and click "Run"
-- 4. Enable Google Provider in "Authentication" -> "Providers" -> "Google"
-- ==============================================================================

-- 1. Create the unified state table for each user
create table if not exists public.user_system_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tasks jsonb default '[]'::jsonb,
  dsa_problems jsonb default '[]'::jsonb,
  college_subjects jsonb default '[]'::jsonb,
  interview_topics jsonb default '[]'::jsonb,
  client_projects jsonb default '[]'::jsonb,
  outreach_leads jsonb default '[]'::jsonb,
  health_metrics jsonb default '{"waterGlasses": 0, "sleepHours": 7.0, "workoutDone": false, "morningRoutineDone": false, "nightRoutineDone": false, "energyScore": 8}'::jsonb,
  schedule_blocks jsonb default '[]'::jsonb,
  time_block_events jsonb default '[]'::jsonb,
  ratings jsonb default '[]'::jsonb,
  google_calendar_url text default '',
  last_reset_date text default '',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Ensure columns exist if table was already created
alter table public.user_system_state add column if not exists ratings jsonb default '[]'::jsonb;
alter table public.user_system_state add column if not exists google_calendar_url text default '';
alter table public.user_system_state add column if not exists last_reset_date text default '';

-- 2. Enable Row Level Security (RLS) so your data is strictly private to your account
alter table public.user_system_state enable row level security;

-- Drop old policies if re-running
drop policy if exists "Users can only view their own state" on public.user_system_state;
drop policy if exists "Users can insert their own state" on public.user_system_state;
drop policy if exists "Users can update their own state" on public.user_system_state;

-- 3. Create Security Policies
create policy "Users can only view their own state" on public.user_system_state
  for select using (auth.uid() = user_id);

create policy "Users can insert their own state" on public.user_system_state
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own state" on public.user_system_state
  for update using (auth.uid() = user_id);

-- 4. Turn on Realtime Replication so Mobile, iPad, and PC sync instantly without refresh
alter publication supabase_realtime add table public.user_system_state;
