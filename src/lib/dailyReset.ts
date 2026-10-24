import { LifeTask, HealthMetrics, ScheduleBlock } from '../types';

export interface DailyRolloverSummary {
  carriedOverTasks: LifeTask[];
  archivedTasks: LifeTask[];
  todayTasks: LifeTask[];
  carriedOverCount: number;
  archivedCount: number;
}

export interface DailyResetResult {
  updatedTasks: LifeTask[];
  resetHealth: HealthMetrics;
  updatedScheduleBlocks: ScheduleBlock[];
  summary: DailyRolloverSummary;
  newResetDate: string;
}

/**
 * Performs daily task reset and rollover:
 * 1. UNFINISHED tasks from yesterday (or earlier) are marked `carriedOver: true` and remain in today's active list.
 * 2. COMPLETED tasks from yesterday (or earlier) are marked `archived: true` so today starts with a fresh slate.
 * 3. Daily health habits (water glasses, workout, morning & night routines) reset for the new day.
 * 4. Completed schedule blocks from yesterday reset so the timeline is clean.
 */
export function performDailyReset(
  tasks: LifeTask[],
  health: HealthMetrics,
  scheduleBlocks: ScheduleBlock[] = [],
  targetDateStr?: string
): DailyResetResult {
  const effectiveDate = targetDateStr || new Date().toISOString().split('T')[0];
  const carriedOverTasks: LifeTask[] = [];
  const archivedTasks: LifeTask[] = [];
  const todayTasks: LifeTask[] = [];

  const updatedTasks: LifeTask[] = tasks.map((t) => {
    const taskDate = (t.completedAt || t.createdAt || '').split('T')[0];

    // Completed before today -> Archive into history so active list is clean
    if (t.done && taskDate < effectiveDate) {
      const archived: LifeTask = {
        ...t,
        archived: true,
      };
      archivedTasks.push(archived);
      return archived;
    }

    // Incomplete before today -> Roll over to today!
    if (!t.done && taskDate < effectiveDate) {
      const rolledOver: LifeTask = {
        ...t,
        carriedOver: true,
        originalDate: t.originalDate || taskDate,
        archived: false,
      };
      carriedOverTasks.push(rolledOver);
      return rolledOver;
    }

    // Today's active tasks
    if (!t.archived) {
      todayTasks.push(t);
    }
    return t;
  });

  // Daily Habits reset to 0/false for the new day
  const resetHealth: HealthMetrics = {
    ...health,
    waterGlasses: 0,
    workoutDone: false,
    morningRoutineDone: false,
    nightRoutineDone: false,
  };

  // Schedule blocks: reset checkboxes for the new day
  const updatedScheduleBlocks: ScheduleBlock[] = scheduleBlocks.map((b) => ({
    ...b,
    done: false,
  }));

  return {
    updatedTasks,
    resetHealth,
    updatedScheduleBlocks,
    summary: {
      carriedOverTasks,
      archivedTasks,
      todayTasks,
      carriedOverCount: carriedOverTasks.length,
      archivedCount: archivedTasks.length,
    },
    newResetDate: effectiveDate,
  };
}
