# Daily System App: PRD and Implementation Plan

Owner: Prateek | Version 1.0 | 24 Oct 2026 | Status: Ready to build

## 1. Overview

A single installable web app (PWA) that runs the owner's day: calendar, to-do list, habits and routines, reusable SOP checklists, weekly review and notes, with daily reminders. It works on MacBook, iPad and Android phone from one codebase and one login.

**Problem:** Work is spread across too many places, nothing tells the owner what to do next, and planning overhead kills momentum.

**Product goal:** Open the app, see exactly what matters today, do it, review weekly.

**Primary user (v1):** The owner only. **Secondary (v2):** Students and freelancers who want a simple daily operating system.

## 2. Goals and Non-goals

**Goals (v1)**

- One Today screen showing tasks, habits and calendar events
- Two-way Google Calendar sync
- Reminders on Android phone and Mac
- Reusable SOP checklist templates
- Weekly review flow
- Usable end to end within 7 build days

**Non-goals (v1)**

- Native iOS or Android apps
- Team sharing, comments, collaboration
- Payments, public signup, onboarding flows
- AI features, WhatsApp or Telegram reminders
- Offline-first conflict resolution (basic caching only)

## 3. Success Metrics

- Opened and used on at least 6 of 7 days per week
- At least 1 "Must" task completed per day
- Weekly review completed every Sunday
- Reminder delivery success above 95% on Android and Mac
- Today screen loads in under 2 seconds

## 4. Features, User Stories and Acceptance Criteria

### F1. Authentication

- As a user, I log in with Google so I never manage a password.
- AC: Google OAuth via Supabase; session persists across devices; logout works; all data is scoped to the user id.

### F2. Today screen (home)

- As a user, I see everything for today in one place.
- AC: Shows today's Must task (highlighted), Should tasks, calendar events in time order, habits due today, routine progress. One tap completes a task or habit. Empty state prompts to add a Must task.

### F3. To-do list

- As a user, I capture and prioritise tasks fast.
- AC: Create task with title, due date and time, priority tag (Must, Should, Later), project label, notes. Max one Must per day (warn on second). Quick add from any screen. Complete, edit, delete, reschedule. Filters: Today, Upcoming, Overdue, By project.

### F4. Calendar and Google Calendar sync

- As a user, my Google Calendar events appear in the app and tasks with times appear in Google Calendar.
- AC: Day and week views. Pull events from the primary calendar. Tasks with a time block can be pushed to Google Calendar. Edits sync both ways within 5 minutes. Sync status and last-synced time visible. Sync failure shows a retry banner.

### F5. Habits and daily routine

- As a user, I follow a morning and night routine and track habits.
- AC: Create habits with frequency (daily or selected weekdays). Routine = ordered checklist with time slot (Morning, Night). Streak counter and 30-day completion grid. Missed days do not delete history.

### F6. SOP checklist templates

- As a user, I reuse the same process for every project.
- AC: Create template with name and ordered checklist items (with optional notes). Ships with starter templates: Video Editing Workflow, Client Delivery, Pitch Deck Process. "Use template" creates a project copy with its own progress state. Editing a template does not change past copies. Progress shown as x/y.

### F7. Weekly review and notes

- As a user, I review the week and set next week's targets.
- AC: Sunday review form: wins, what got stuck, lessons, top 3 targets for next week. Past reviews listed by week. Notes: create, edit, search, pin; plain text with simple formatting (markdown).

### F8. Reminders and notifications

- As a user, I get pushed at the right moments on phone and Mac.
- AC: Web Push on Android Chrome and Mac (Chrome or Safari). Scheduled: morning plan (default 8:00), midday check-in (14:00), night review (21:30), all editable. Per-task reminder at due time. Tapping a notification opens the relevant screen. Settings page to enable, disable and test notifications per device.

### F9. Settings

- AC: Reminder times, timezone (default Asia/Kolkata), connected Google account, notification devices, export data as JSON.

## 5. Screens

1. Login
2. Today (home)
3. Tasks
4. Calendar (day, week)
5. Habits and Routine
6. SOP Templates and Active Checklists
7. Weekly Review and past reviews
8. Notes
9. Settings

**Navigation:** Bottom tab bar on phone (Today, Tasks, Calendar, SOPs, More). Left sidebar on Mac and iPad. Global quick-add button.

## 6. Technical Architecture

| Layer | Choice |
| --- | --- |
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS |
| PWA | Web app manifest + service worker (next-pwa or Serwist) |
| Backend, DB, Auth | Supabase (Postgres, Row Level Security, Google OAuth) |
| Calendar | Google Calendar API v3 |
| Push | Web Push (VAPID keys, web-push library) |
| Scheduler | Supabase pg\_cron plus Edge Function, or Vercel Cron |
| Hosting | Vercel |

**Request flow:** Client (PWA) to Next.js API routes to Supabase. Scheduler checks due reminders every minute and sends Web Push to stored subscriptions. Calendar sync runs on login, on manual refresh, and every 5 minutes through a scheduled job.

## 7. Data Model

All tables include id (uuid), user\_id (uuid, RLS enforced), created\_at, updated\_at.

- **profiles:** timezone, reminder\_morning, reminder\_midday, reminder\_night
- **tasks:** title, notes, due\_at, priority (must, should, later), status (open, done), project\_id, gcal\_event\_id, completed\_at
- **projects:** name, template\_id (nullable), status
- **habits:** name, frequency (jsonb), routine\_slot (morning, night, none), order\_index, archived
- **habit\_logs:** habit\_id, log\_date, done (unique habit\_id plus log\_date)
- **sop\_templates:** name, description
- **sop\_template\_items:** template\_id, text, notes, order\_index
- **sop\_runs:** template\_id, project\_id, name, created\_at
- **sop\_run\_items:** run\_id, text, notes, order\_index, done, done\_at
- **reviews:** week\_start, wins, stuck, lessons, targets (jsonb, 3 items)
- **notes:** title, body, pinned
- **push\_subscriptions:** endpoint, keys (jsonb), device\_label, last\_success\_at
- **google\_tokens:** access\_token, refresh\_token (encrypted), expires\_at, sync\_token

## 8. Key Technical Decisions

- **Google OAuth scopes:** openid, email, profile, calendar. Keep the Google Cloud project in Testing mode for personal use. Verification is required before public launch.
- **Token storage:** Refresh tokens stored server-side only, encrypted. Never exposed to the client.
- **Sync strategy:** Use Google syncToken for incremental pulls. Store gcal\_event\_id on tasks to prevent duplicates. Last-write-wins on conflicts for v1.
- **Timezones:** Store timestamps in UTC; render in profile timezone.
- **iPad notifications:** Works only after Add to Home Screen (iPadOS 16.4 or later). Document this in Settings.
- **Security:** RLS on every table, HTTPS only, no secrets in client bundle.

## 9. Non-functional Requirements

- Performance: Today screen under 2 seconds on 4G
- Availability: Rely on Vercel and Supabase free tier for v1
- Accessibility: Keyboard shortcuts on Mac (N new task, T Today), readable contrast, large touch targets
- Responsive: 360px phone to 1440px desktop
- Privacy: Data export and full account delete in Settings

## 10. Implementation Plan (7 Days)

Rule: 1 to 2 hours per day on the app. Client deadlines (motion video, demo video, pitch deck) come first.

**Day 1: Foundation**

- Create Next.js + Tailwind project, deploy to Vercel
- Create Supabase project, run schema migration for all tables with RLS
- Google login working, protected routes, app shell with navigation
- Done when: log in on Mac and phone and see an empty Today screen.

**Day 2: Tasks and Today**

- Task CRUD, priority tags, Must limit, filters
- Today screen with tasks, quick add, complete action
- Done when: tasks created on phone appear on Mac.

**Day 3: Habits and Routines**

- Habit CRUD, morning and night routine checklists
- Daily logs, streak and 30-day grid
- Habits shown on Today
- Done when: a routine can be completed and the streak updates.

**Day 4: SOP Templates**

- Template builder, three seeded starter templates
- Use template to create a run, check items, progress x/y
- Done when: a Video Editing run can be started and completed.

**Day 5: Google Calendar**

- OAuth calendar scope, token storage, pull events with syncToken
- Day and week calendar views, push timed tasks to Google Calendar
- Done when: an event added in Google Calendar shows up in the app, and a timed task shows up in Google Calendar.

**Day 6: PWA and Notifications**

- Manifest, icons, service worker, install prompt
- Push subscription flow, VAPID keys, scheduler for 3 daily reminders and per-task reminders
- Install on Mac, iPad (Home Screen) and Android
- Done when: all three reminders arrive on phone and Mac.

**Day 7: Review, Notes, Polish**

- Weekly review form and history, notes with search
- Settings page, data export, empty states, error states
- Bug fixing pass on all three devices
- Done when: the full acceptance checklist below passes.

## 11. Release Acceptance Checklist

- [ ] Google login works on Mac, iPad, Android
- [ ] Task created on one device appears on the others within 5 seconds
- [ ] Only one Must task per day enforced with warning
- [ ] Google Calendar two-way sync verified
- [ ] Habit streak and routine progress correct across a day boundary
- [ ] SOP run is independent of later template edits
- [ ] Morning, midday and night reminders received on phone and Mac
- [ ] Tapping a notification opens the right screen
- [ ] App installable as PWA on all three devices
- [ ] Data export works; RLS verified with a second test account

## 12. Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Building the app replaces doing the work | Time-box to 1 to 2 hours daily; client deadlines first |
| iPad push not working | Require Home Screen install; show setup guide in Settings |
| Google sync duplicates or conflicts | Store gcal\_event\_id, use syncToken, last-write-wins |
| Google verification needed to sell | Keep v1 personal; start verification only at v2 |
| Scope creep | Anything outside Section 4 goes to the v2 list |

## 13. Roadmap After v1

- **v1.1:** Email reminders, recurring tasks, task templates from SOP steps
- **v2:** Public signup, Google OAuth verification, pricing and payments, onboarding, team sharing
- **v3:** AI daily planner, WhatsApp or Telegram reminders, analytics dashboard

## 14. Open Items

- Final app name and logo
- Reminder default times (confirm 8:00, 14:00, 21:30)
- Free tier limits check for Supabase and Vercel before launch
