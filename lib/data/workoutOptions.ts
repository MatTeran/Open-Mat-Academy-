import type {
  IntensityBand,
  TechniqueCategory,
  TechniqueId,
  TrainingIntensity,
  WorkoutClassType,
  WorkoutMood,
} from '../../types/workout';

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

export const TECHNIQUE_OPTIONS: {
  value: TechniqueId;
  label: string;
  category: TechniqueCategory;
}[] = [
  { value: 'armbar', label: 'Armbar', category: 'submission' },
  { value: 'triangle', label: 'Triangle', category: 'submission' },
  { value: 'kimura', label: 'Kimura', category: 'submission' },
  {
    value: 'rear_naked_choke',
    label: 'Rear Naked Choke',
    category: 'submission',
  },
  { value: 'guillotine', label: 'Guillotine', category: 'submission' },
  { value: 'ankle_lock', label: 'Ankle Lock', category: 'submission' },
  { value: 'sweep', label: 'Sweep', category: 'sweep' },
  { value: 'hip_bump_sweep', label: 'Hip Bump Sweep', category: 'sweep' },
  { value: 'scissor_sweep', label: 'Scissor Sweep', category: 'sweep' },
  { value: 'single_leg', label: 'Single Leg', category: 'takedown' },
  { value: 'double_leg', label: 'Double Leg', category: 'takedown' },
  {
    value: 'side_control_escape',
    label: 'Side Control Escape',
    category: 'escape',
  },
  { value: 'hip_escape', label: 'Hip Escape', category: 'escape' },
  { value: 'mount', label: 'Mount', category: 'position' },
  { value: 'back_control', label: 'Back Control', category: 'position' },
  { value: 'closed_guard', label: 'Closed Guard', category: 'position' },
  { value: 'side_control', label: 'Side Control', category: 'position' },
  { value: 'guard_pass', label: 'Guard Pass', category: 'guard_pass' },
];

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

export function getTechniqueLabel(value: TechniqueId): string {
  return TECHNIQUE_OPTIONS.find((item) => item.value === value)?.label ?? value;
}

export function getTechniqueCategory(
  value: TechniqueId,
): TechniqueCategory | undefined {
  return TECHNIQUE_OPTIONS.find((item) => item.value === value)?.category;
}

export function getIntensityLabel(value: TrainingIntensity): string {
  return INTENSITY_OPTIONS.find((item) => item.value === value)?.label ?? value;
}

/** Map legacy categorical intensity to a 1–10 score midpoint. */
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

/**
 * Resolve a workout's numeric intensity for analytics.
 * Explicit null intensityScore means "not rated" and is excluded.
 * Missing intensityScore falls back to categorical intensity (legacy logs).
 */
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
