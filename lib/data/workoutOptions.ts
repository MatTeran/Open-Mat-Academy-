import type {
  IntensityBand,
  TrainingIntensity,
  WorkoutClassType,
  WorkoutMood,
} from '../../types/workout';
import type { TechniqueCategory, TechniqueId } from '../../types/technique';
import { SYSTEM_TECHNIQUES } from './systemTechniques';
import { getCategoryLabel } from './techniqueMeta';

export const CLASS_TYPE_OPTIONS: { value: WorkoutClassType; label: string }[] = [
  { value: 'fundamentals', label: 'Fundamentals' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'competition', label: 'Competition' },
  { value: 'open_mat', label: 'Open Mat' },
  { value: 'private_lesson', label: 'Private Lesson' },
  { value: 'strength_training', label: 'Strength Training' },
  { value: 'cardio', label: 'Cardio' },
];

export const INTENSITY_OPTIONS: { value: TrainingIntensity; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'hard', label: 'Hard' },
  { value: 'competition_pace', label: 'Competition Pace' },
];

/** System library options for chips / fallbacks. */
export const TECHNIQUE_OPTIONS: {
  value: TechniqueId;
  label: string;
  category: TechniqueCategory;
}[] = SYSTEM_TECHNIQUES.map((technique) => ({
  value: technique.id,
  label: technique.name,
  category: technique.category,
}));

export const TECHNIQUE_FILTER_OPTIONS: {
  value: 'all' | TechniqueCategory;
  label: string;
}[] = [
  { value: 'all', label: 'All' },
  { value: 'submission', label: 'Submissions' },
  { value: 'sweep', label: 'Sweeps' },
  { value: 'takedown', label: 'Takedowns' },
  { value: 'escape', label: 'Escapes' },
  { value: 'position', label: 'Positions' },
  { value: 'guard', label: 'Guards' },
  { value: 'guard_pass', label: 'Passes' },
  { value: 'transition', label: 'Transitions' },
  { value: 'other', label: 'Other' },
];

export const SUGGESTED_PARTNERS = [
  'Marco',
  'James',
  'Chris',
  'David',
  'Jordan',
  'Alex',
  'Sam',
  'Diego',
  'Maya',
] as const;

export const MOOD_OPTIONS: {
  value: WorkoutMood;
  label: string;
  emoji: string;
}[] = [
  { value: 'great', label: 'Great', emoji: '😀' },
  { value: 'good', label: 'Good', emoji: '🙂' },
  { value: 'average', label: 'Average', emoji: '😐' },
  { value: 'exhausted', label: 'Exhausted', emoji: '😫' },
];

export const INSTRUCTOR_OPTIONS = [
  'Coach Rivera',
  'Coach Silva',
  'Coach Park',
  'Coach Mendes',
] as const;

export function getClassTypeLabel(value: WorkoutClassType): string {
  return CLASS_TYPE_OPTIONS.find((item) => item.value === value)?.label ?? value;
}

/** Fallback label lookup from the system library only. */
export function getTechniqueLabel(value: TechniqueId): string {
  return (
    TECHNIQUE_OPTIONS.find((item) => item.value === value)?.label ??
    value
      .replace(/^custom[-_]/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export function getTechniqueCategory(
  value: TechniqueId,
): TechniqueCategory | undefined {
  return TECHNIQUE_OPTIONS.find((item) => item.value === value)?.category;
}

export function getIntensityLabel(value: TrainingIntensity): string {
  return INTENSITY_OPTIONS.find((item) => item.value === value)?.label ?? value;
}

export function intensityCategoryToScore(
  intensity: TrainingIntensity,
): number {
  switch (intensity) {
    case 'easy':
      return 3;
    case 'moderate':
      return 5;
    case 'hard':
      return 7;
    case 'competition_pace':
      return 9;
    default:
      return 5;
  }
}

export function intensityScoreToCategory(score: number): TrainingIntensity {
  if (score <= 3) {
    return 'easy';
  }
  if (score <= 6) {
    return 'moderate';
  }
  if (score <= 8) {
    return 'hard';
  }
  return 'competition_pace';
}

export function intensityScoreToBand(score: number): IntensityBand {
  if (score <= 3) {
    return 'Light';
  }
  if (score <= 6) {
    return 'Moderate';
  }
  if (score <= 8) {
    return 'Hard';
  }
  return 'Competition';
}

export function clampIntensityScore(score: number): number {
  return Math.min(10, Math.max(1, Math.round(score)));
}

export function resolveIntensityScore(workout: {
  intensity: TrainingIntensity;
  intensityScore?: number | null;
}): number | null {
  if (workout.intensityScore === null) {
    return null;
  }
  if (
    typeof workout.intensityScore === 'number' &&
    Number.isFinite(workout.intensityScore)
  ) {
    return clampIntensityScore(workout.intensityScore);
  }
  return intensityCategoryToScore(workout.intensity);
}

export { getCategoryLabel };
