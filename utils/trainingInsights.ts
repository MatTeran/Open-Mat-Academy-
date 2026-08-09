import {
  getTechniqueCategory,
  getTechniqueLabel,
  intensityScoreToBand,
  resolveIntensityScore,
} from '../lib/data/workoutOptions';
import type {
  IntensityInsight,
  IntensityWeekPoint,
  PartnerInsight,
  PartnersInsight,
  TechniqueCategoryHighlight,
  TechniqueFilterId,
  TechniqueInsight,
  TechniquesInsight,
  TrainingInsights,
} from '../types/trainingInsights';
import type { TechniqueId, TechniqueResolver } from '../types/technique';
import type { TechniqueCategory, Workout } from '../types/workout';
import type { WorkoutMetricFilter } from '../types/workoutMetrics';
import { getWeekStart } from './workoutMetrics';

const DEFAULT_RESOLVER: TechniqueResolver = {
  getLabel: getTechniqueLabel,
  getCategory: (id) => getTechniqueCategory(id) ?? 'other',
  getTechnique: () => undefined,
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function monthLabel(date: Date): string {
  return date
    .toLocaleDateString('en-US', { month: 'short' })
    .toUpperCase();
}

function matchesFilter(workout: Workout, filter: WorkoutMetricFilter): boolean {
  if (filter === 'all') {
    return true;
  }
  return workout.giType === filter;
}

function workoutsInRange(
  workouts: Workout[],
  start: Date,
  endExclusive: Date,
  filter: WorkoutMetricFilter,
): Workout[] {
  const startMs = start.getTime();
  const endMs = endExclusive.getTime();
  return workouts.filter((workout) => {
    if (!matchesFilter(workout, filter)) {
      return false;
    }
    const ms = new Date(workout.date).getTime();
    return ms >= startMs && ms < endMs;
  });
}

function average(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }
  const sum = values.reduce((acc, value) => acc + value, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

function buildIntensityWeeks(
  workouts: Workout[],
  filter: WorkoutMetricFilter,
  now: Date,
  weekCount: number,
): IntensityWeekPoint[] {
  const currentWeekStart = getWeekStart(now);
  const points: IntensityWeekPoint[] = [];

  for (let i = weekCount - 1; i >= 0; i -= 1) {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(currentWeekStart.getDate() - i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const weekWorkouts = workoutsInRange(workouts, weekStart, weekEnd, filter);
    const scores = weekWorkouts
      .map((workout) => resolveIntensityScore(workout))
      .filter((score): score is number => score != null);

    points.push({
      weekStartIso: toIsoDate(weekStart),
      monthLabel: monthLabel(weekStart),
      average: average(scores),
      sampleSize: scores.length,
    });
  }

  return points;
}

function buildIntensityInsight(
  workouts: Workout[],
  filter: WorkoutMetricFilter,
  now: Date,
): IntensityInsight {
  const weeks = buildIntensityWeeks(workouts, filter, now, 12);
  const recentWeeks = weeks.slice(-4);
  const previousWeeks = weeks.slice(-8, -4);

  const recentScores = recentWeeks
    .map((week) => week.average)
    .filter((value): value is number => value != null);
  const previousScores = previousWeeks
    .map((week) => week.average)
    .filter((value): value is number => value != null);

  const avg = average(recentScores);
  const previousAvg = average(previousScores);

  let vsPreviousPercent: number | null = null;
  if (avg != null && previousAvg != null && previousAvg > 0) {
    vsPreviousPercent = Math.round(((avg - previousAvg) / previousAvg) * 100);
  }

  const band = avg != null ? intensityScoreToBand(avg) : null;

  const accessibilitySummary =
    avg != null
      ? `Training intensity averaged ${avg} out of 10 over the last 4 weeks${
          band ? `, rated ${band}` : ''
        }.`
      : 'No training intensity ratings logged yet.';

  return {
    average: avg,
    band,
    vsPreviousPercent,
    weeks,
    accessibilitySummary,
  };
}

function mostCommonTechnique(
  techniqueCounts: Map<TechniqueId, number>,
): TechniqueId | null {
  let best: TechniqueId | null = null;
  let bestCount = 0;
  for (const [id, count] of techniqueCounts) {
    if (count > bestCount) {
      best = id;
      bestCount = count;
    }
  }
  return best;
}

function buildPartnersInsight(
  workouts: Workout[],
  filter: WorkoutMetricFilter,
  now: Date,
  resolver: TechniqueResolver,
): PartnersInsight {
  const end = startOfDay(now);
  end.setDate(end.getDate() + 1);
  const start = new Date(end.getTime() - 30 * MS_PER_DAY);
  const recent = workoutsInRange(workouts, start, end, filter);

  type Acc = {
    name: string;
    rounds: number;
    sessions: number;
    intensityScores: number[];
    techniques: Map<TechniqueId, number>;
  };

  const byPartner = new Map<string, Acc>();

  for (const workout of recent) {
    if (workout.partners.length === 0) {
      continue;
    }
    const score = resolveIntensityScore(workout);
    for (const partner of workout.partners) {
      const key = partner.trim().toLowerCase();
      if (!key) {
        continue;
      }
      let entry = byPartner.get(key);
      if (!entry) {
        entry = {
          name: partner.trim(),
          rounds: 0,
          sessions: 0,
          intensityScores: [],
          techniques: new Map(),
        };
        byPartner.set(key, entry);
      }
      entry.rounds += workout.rounds;
      entry.sessions += 1;
      if (score != null) {
        entry.intensityScores.push(score);
      }
      for (const technique of workout.techniques) {
        entry.techniques.set(
          technique,
          (entry.techniques.get(technique) ?? 0) + 1,
        );
      }
    }
  }

  const partners: PartnerInsight[] = Array.from(byPartner.values())
    .map((entry) => {
      const techniqueId = mostCommonTechnique(entry.techniques);
      return {
        name: entry.name,
        rounds: entry.rounds,
        sessions: entry.sessions,
        averageIntensity: average(entry.intensityScores),
        mostLoggedTechniqueId: techniqueId,
        mostLoggedTechniqueLabel: techniqueId
          ? resolver.getLabel(techniqueId)
          : null,
      };
    })
    .sort((a, b) => b.rounds - a.rounds || a.name.localeCompare(b.name));

  const totalRounds = partners.reduce((sum, partner) => sum + partner.rounds, 0);
  const top = partners[0];
  const accessibilitySummary = top
    ? `${top.name} is your most frequent training partner with ${top.rounds} rounds.`
    : 'No training partners logged in the last 30 days.';

  return {
    partners,
    uniqueCount: partners.length,
    totalRounds,
    accessibilitySummary,
  };
}

const HIGHLIGHT_CATEGORIES: Array<{
  category: TechniqueCategory;
  label: string;
}> = [
  { category: 'submission', label: 'Most Used Submission' },
  { category: 'sweep', label: 'Most Used Sweep' },
  { category: 'takedown', label: 'Most Used Takedown' },
  { category: 'position', label: 'Most Used Position' },
  { category: 'escape', label: 'Most Used Escape' },
];

function buildTechniquesInsight(
  workouts: Workout[],
  filter: WorkoutMetricFilter,
  now: Date,
  resolver: TechniqueResolver,
): TechniquesInsight {
  const end = startOfDay(now);
  end.setDate(end.getDate() + 1);
  const start = new Date(end.getTime() - 30 * MS_PER_DAY);
  const recent = workoutsInRange(workouts, start, end, filter);

  const counts = new Map<TechniqueId, number>();
  for (const workout of recent) {
    for (const technique of workout.techniques) {
      counts.set(technique, (counts.get(technique) ?? 0) + 1);
    }
  }

  const techniques: TechniqueInsight[] = Array.from(counts.entries())
    .map(([id, count]) => ({
      id,
      label: resolver.getLabel(id),
      category: resolver.getCategory(id),
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const highlights: TechniqueCategoryHighlight[] = [];
  for (const item of HIGHLIGHT_CATEGORIES) {
    const top = techniques.find((tech) => tech.category === item.category);
    if (top) {
      highlights.push({
        category: item.category,
        label: item.label,
        techniqueId: top.id,
        techniqueLabel: top.label,
        count: top.count,
      });
    }
  }

  const top = techniques[0];
  const accessibilitySummary = top
    ? `${top.label} is your most logged technique with ${top.count} uses.`
    : 'No techniques logged in the last 30 days.';

  return {
    techniques,
    highlights,
    accessibilitySummary,
  };
}

export function buildTrainingInsights(
  workouts: Workout[],
  filter: WorkoutMetricFilter = 'all',
  now = new Date(),
  resolver: TechniqueResolver = DEFAULT_RESOLVER,
): TrainingInsights {
  return {
    intensity: buildIntensityInsight(workouts, filter, now),
    partners: buildPartnersInsight(workouts, filter, now, resolver),
    techniques: buildTechniquesInsight(workouts, filter, now, resolver),
  };
}

export function filterTechniquesByCategory(
  techniques: TechniqueInsight[],
  filter: TechniqueFilterId,
): TechniqueInsight[] {
  if (filter === 'all') {
    return techniques;
  }
  return techniques.filter((item) => item.category === filter);
}

export function formatIntensityScore(score: number): string {
  return Number.isInteger(score) ? `${score}` : score.toFixed(1);
}
