/**
 * Helpers for the compact Log Workout flow — session dates + schedule prefills.
 */

import { getClassTypeLabel, SELF_TRAINING_INSTRUCTOR } from '../lib/data/workoutOptions';
import type { ScheduleClass } from '../types/schedule';
import type { GiType, Workout, WorkoutClassType, WorkoutDraft } from '../types/workout';
import {
  formatClock,
  getClassesForDay,
  getWeekdayFromDate,
} from './schedule';

export { SELF_TRAINING_INSTRUCTOR };

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isFutureLocalDay(date: Date, now = new Date()): boolean {
  return startOfLocalDay(date).getTime() > startOfLocalDay(now).getTime();
}

export function addLocalDays(date: Date, days: number): Date {
  const next = startOfLocalDay(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Preserve time-of-day when changing the calendar session day. */
export function applySessionDay(iso: string, day: Date): string {
  const previous = new Date(iso);
  const hours = Number.isNaN(previous.getTime()) ? 12 : previous.getHours();
  const minutes = Number.isNaN(previous.getTime()) ? 0 : previous.getMinutes();
  const next = startOfLocalDay(day);
  next.setHours(hours, minutes, 0, 0);
  return next.toISOString();
}

export function formatSessionDateLabel(iso: string, now = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return 'Choose date';
  }
  const formatted = date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  if (isSameLocalDay(date, now)) {
    return `Today · ${formatted}`;
  }
  if (isSameLocalDay(date, addLocalDays(now, -1))) {
    return `Yesterday · ${formatted}`;
  }
  return formatted;
}

export function formatClassesSectionLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return 'Classes';
  }
  const stamp = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  return `Classes on ${stamp}`;
}

export function getScheduledClassesForSessionDate(iso: string): ScheduleClass[] {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return [];
  }
  return getClassesForDay(getWeekdayFromDate(date), 'all', 'all');
}

export function scheduleDurationMinutes(item: ScheduleClass): number {
  const [sh, sm] = item.startTime.split(':').map(Number);
  const [eh, em] = item.endTime.split(':').map(Number);
  return Math.max(eh * 60 + em - (sh * 60 + sm), 0);
}

export function mapScheduleLevelToClassType(
  item: ScheduleClass,
): WorkoutClassType {
  const haystack = `${item.title} ${item.subtitle ?? ''} ${item.level}`.toLowerCase();
  if (item.level === 'open_mat' || haystack.includes('open mat')) {
    return 'open_mat';
  }
  if (haystack.includes('private')) {
    return 'private_lesson';
  }
  if (
    item.level === 'peak_performance' ||
    haystack.includes('competition') ||
    haystack.includes('comp ')
  ) {
    return 'competition';
  }
  if (haystack.includes('strength') || haystack.includes('lift')) {
    return 'strength_training';
  }
  if (haystack.includes('cardio') || haystack.includes('conditioning')) {
    return 'cardio';
  }
  if (haystack.includes('advanced') || haystack.includes('no-gi advanced')) {
    return 'advanced';
  }
  if (haystack.includes('fundament')) {
    return 'fundamentals';
  }
  // Default adult mat classes to fundamentals for logging.
  if (
    item.level === 'adult_bjj' ||
    item.level === 'youth_bjj' ||
    item.level === 'womens_bjj' ||
    item.level === 'pee_wee_bjj'
  ) {
    return 'fundamentals';
  }
  return 'fundamentals';
}

export function mapScheduleGiType(giType: ScheduleClass['giType']): GiType {
  return giType === 'no_gi' ? 'no_gi' : 'gi';
}

export function formatScheduleMeta(item: ScheduleClass): string {
  const duration = scheduleDurationMinutes(item);
  return `${formatClock(item.startTime)} · ${item.instructor} · ${duration} min`;
}

export function prefillDraftFromSchedule(
  draft: WorkoutDraft,
  item: ScheduleClass,
  sessionIso: string,
): WorkoutDraft {
  const classType = mapScheduleLevelToClassType(item);
  const duration = scheduleDurationMinutes(item) || draft.durationMinutes || 60;
  const [hours, minutes] = item.startTime.split(':').map(Number);
  const day = startOfLocalDay(new Date(sessionIso));
  day.setHours(hours || 12, minutes || 0, 0, 0);

  return {
    ...draft,
    date: day.toISOString(),
    scheduleClassId: item.id,
    classType,
    className: item.title || getClassTypeLabel(classType),
    instructor: item.instructor || SELF_TRAINING_INSTRUCTOR,
    durationMinutes: duration,
    giType: mapScheduleGiType(item.giType),
  };
}

export function isScheduleClassAlreadyLogged(
  workouts: Workout[],
  scheduleClassId: string,
  sessionIso: string,
  excludeWorkoutId?: string,
): boolean {
  const sessionDay = startOfLocalDay(new Date(sessionIso)).getTime();
  return workouts.some((workout) => {
    if (excludeWorkoutId && workout.id === excludeWorkoutId) {
      return false;
    }
    if (workout.scheduleClassId !== scheduleClassId) {
      return false;
    }
    return startOfLocalDay(new Date(workout.date)).getTime() === sessionDay;
  });
}
