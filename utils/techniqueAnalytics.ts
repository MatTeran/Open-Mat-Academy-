import { getCategoryLabel } from '../lib/data/techniqueMeta';
import type {
  TechniqueCategory,
  TechniqueId,
  TechniqueListSort,
  TechniquePersonalStats,
  TechniqueResolver,
  YourGameOverview,
} from '../types/technique';
import type { Workout } from '../types/workout';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function buildTechniquePersonalStats(
  techniqueId: TechniqueId,
  workouts: Workout[],
  now = new Date(),
): TechniquePersonalStats {
  const withTechnique = [...workouts]
    .filter((workout) => workout.techniques.includes(techniqueId))
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

  const end = startOfDay(now);
  end.setDate(end.getDate() + 1);
  const start30 = new Date(end.getTime() - 30 * MS_PER_DAY);

  const last30Days = withTechnique.filter((workout) => {
    const ms = new Date(workout.date).getTime();
    return ms >= start30.getTime() && ms < end.getTime();
  }).length;

  const partnerSessions = new Map<string, { name: string; sessions: number }>();
  for (const workout of withTechnique) {
    for (const partner of workout.partners) {
      const key = partner.trim().toLowerCase();
      if (!key) {
        continue;
      }
      const existing = partnerSessions.get(key);
      if (existing) {
        existing.sessions += 1;
      } else {
        partnerSessions.set(key, { name: partner.trim(), sessions: 1 });
      }
    }
  }

  const partners = Array.from(partnerSessions.values())
    .sort((a, b) => b.sessions - a.sessions || a.name.localeCompare(b.name))
    .slice(0, 5);

  return {
    timesLogged: withTechnique.length,
    sessionsUsed: withTechnique.length,
    firstLogged:
      withTechnique.length > 0
        ? withTechnique[withTechnique.length - 1].date
        : null,
    lastLogged: withTechnique.length > 0 ? withTechnique[0].date : null,
    last30Days,
    partners,
    history: withTechnique.slice(0, 12).map((workout) => ({
      workoutId: workout.id,
      date: workout.date,
      className: workout.className,
      rounds: workout.rounds,
    })),
  };
}

export function buildYourGameOverview(
  workouts: Workout[],
  resolver: TechniqueResolver,
  now = new Date(),
): YourGameOverview {
  const counts = new Map<
    TechniqueId,
    { count: number; lastUsed: string | null }
  >();

  for (const workout of workouts) {
    for (const id of workout.techniques) {
      const current = counts.get(id) ?? { count: 0, lastUsed: null };
      current.count += 1;
      if (
        !current.lastUsed ||
        new Date(workout.date).getTime() >
          new Date(current.lastUsed).getTime()
      ) {
        current.lastUsed = workout.date;
      }
      counts.set(id, current);
    }
  }

  const monthStart = startOfMonth(now).getTime();
  const monthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
  ).getTime();
  const monthIds = new Set<TechniqueId>();
  for (const workout of workouts) {
    const ms = new Date(workout.date).getTime();
    if (ms >= monthStart && ms < monthEnd) {
      workout.techniques.forEach((id) => monthIds.add(id));
    }
  }

  const techniques = Array.from(counts.entries()).map(([id, meta]) => {
    const technique = resolver.getTechnique(id);
    return {
      id,
      label: resolver.getLabel(id),
      category: resolver.getCategory(id),
      count: meta.count,
      lastUsed: meta.lastUsed,
      sourceType: technique?.sourceType ?? 'system',
    };
  });

  techniques.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const mostUsed = techniques[0]
    ? {
        id: techniques[0].id,
        label: techniques[0].label,
        count: techniques[0].count,
      }
    : null;

  let newest: YourGameOverview['newest'] = null;
  for (const workout of [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )) {
    for (const id of workout.techniques) {
      const first = techniques.find((item) => item.id === id);
      if (!first) {
        continue;
      }
      // Track earliest first appearance overall; prefer latest-created among first-seen
      if (!newest) {
        newest = {
          id,
          label: resolver.getLabel(id),
          firstLogged: workout.date,
        };
      }
    }
  }

  // Newest = most recently first-logged technique
  const firstSeen = new Map<TechniqueId, string>();
  for (const workout of [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )) {
    for (const id of workout.techniques) {
      if (!firstSeen.has(id)) {
        firstSeen.set(id, workout.date);
      }
    }
  }
  let newestId: TechniqueId | null = null;
  let newestDate = '';
  for (const [id, date] of firstSeen) {
    if (!newestId || new Date(date).getTime() > new Date(newestDate).getTime()) {
      newestId = id;
      newestDate = date;
    }
  }
  newest =
    newestId != null
      ? {
          id: newestId,
          label: resolver.getLabel(newestId),
          firstLogged: newestDate,
        }
      : null;

  const categoryTotals = new Map<TechniqueCategory, number>();
  for (const item of techniques) {
    categoryTotals.set(
      item.category,
      (categoryTotals.get(item.category) ?? 0) + item.count,
    );
  }

  const categoryBreakdown = Array.from(categoryTotals.entries())
    .map(([category, count]) => ({
      category,
      label: getCategoryLabel(category),
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalUnique: techniques.length,
    loggedThisMonth: monthIds.size,
    mostUsed,
    newest,
    categoryBreakdown,
    techniques,
  };
}

export function sortTechniqueList<
  T extends { label: string; count: number; lastUsed: string | null },
>(items: T[], sort: TechniqueListSort): T[] {
  const copy = [...items];
  switch (sort) {
    case 'recent':
      return copy.sort((a, b) => {
        const at = a.lastUsed ? new Date(a.lastUsed).getTime() : 0;
        const bt = b.lastUsed ? new Date(b.lastUsed).getTime() : 0;
        return bt - at || a.label.localeCompare(b.label);
      });
    case 'least_used':
      return copy.sort(
        (a, b) => a.count - b.count || a.label.localeCompare(b.label),
      );
    case 'alpha':
      return copy.sort((a, b) => a.label.localeCompare(b.label));
    case 'most_used':
    default:
      return copy.sort(
        (a, b) => b.count - a.count || a.label.localeCompare(b.label),
      );
  }
}
