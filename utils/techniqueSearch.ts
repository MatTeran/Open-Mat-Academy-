import type { MemberTechnique, TechniqueId } from '../types/technique';
import type { Workout } from '../types/workout';

export interface TechniqueSearchOptions {
  query: string;
  catalog: MemberTechnique[];
  workouts: Workout[];
  /** Exclude archived unless true. */
  includeArchived?: boolean;
  limit?: number;
}

function usageCounts(workouts: Workout[]): Map<TechniqueId, number> {
  const counts = new Map<TechniqueId, number>();
  for (const workout of workouts) {
    for (const id of workout.techniques) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  return counts;
}

function recentOrder(workouts: Workout[]): TechniqueId[] {
  const seen = new Set<TechniqueId>();
  const ordered: TechniqueId[] = [];
  const sorted = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  for (const workout of sorted) {
    for (const id of workout.techniques) {
      if (!seen.has(id)) {
        seen.add(id);
        ordered.push(id);
      }
    }
  }
  return ordered;
}

/**
 * Rank:
 * Recent → Frequently used → Exact name → System starts-with → Other matches
 */
export function searchTechniques({
  query,
  catalog,
  workouts,
  includeArchived = false,
  limit = 40,
}: TechniqueSearchOptions): MemberTechnique[] {
  const q = query.trim().toLowerCase();
  const visible = catalog.filter(
    (item) => includeArchived || !item.archived,
  );

  if (!q) {
    const recent = recentOrder(workouts);
    const counts = usageCounts(workouts);
    return [...visible]
      .sort((a, b) => {
        const ai = recent.indexOf(a.id);
        const bi = recent.indexOf(b.id);
        if (ai !== -1 || bi !== -1) {
          if (ai === -1) {
            return 1;
          }
          if (bi === -1) {
            return -1;
          }
          return ai - bi;
        }
        const freq = (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0);
        if (freq !== 0) {
          return freq;
        }
        if (a.sourceType !== b.sourceType) {
          return a.sourceType === 'system' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      })
      .slice(0, limit);
  }

  const recent = recentOrder(workouts);
  const counts = usageCounts(workouts);
  const matches = visible.filter((item) =>
    item.name.toLowerCase().includes(q),
  );

  return matches
    .sort((a, b) => {
      const aExact = a.name.toLowerCase() === q ? 0 : 1;
      const bExact = b.name.toLowerCase() === q ? 0 : 1;
      if (aExact !== bExact) {
        return aExact - bExact;
      }

      const ai = recent.indexOf(a.id);
      const bi = recent.indexOf(b.id);
      if (ai !== -1 || bi !== -1) {
        if (ai === -1) {
          return 1;
        }
        if (bi === -1) {
          return -1;
        }
        return ai - bi;
      }

      const freq = (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0);
      if (freq !== 0) {
        return freq;
      }

      const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
      const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
      if (aStarts !== bStarts) {
        return aStarts - bStarts;
      }

      if (a.sourceType === 'system' && b.sourceType !== 'system') {
        return -1;
      }
      if (b.sourceType === 'system' && a.sourceType !== 'system') {
        return 1;
      }

      return a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

export function suggestedTechniques(
  catalog: MemberTechnique[],
  workouts: Workout[],
  limit = 5,
): MemberTechnique[] {
  const recent = new Set(recentOrder(workouts).slice(0, 8));
  return catalog
    .filter((item) => !item.archived && !recent.has(item.id))
    .slice(0, limit);
}

export function recentTechniques(
  catalog: MemberTechnique[],
  workouts: Workout[],
  limit = 6,
): MemberTechnique[] {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  const ordered: MemberTechnique[] = [];
  for (const id of recentOrder(workouts)) {
    const technique = byId.get(id);
    if (technique && !technique.archived) {
      ordered.push(technique);
      if (ordered.length >= limit) {
        break;
      }
    }
  }
  return ordered;
}
