import type {
  TechniqueId,
  TrainingIntensity,
  WorkoutClassType,
  WorkoutMood,
} from '../../types/workout';

export const SELF_TRAINING_INSTRUCTOR = 'No Instructor / Self Training';

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
  { value: 'competition_pace', label: 'War' },
];

export const TECHNIQUE_OPTIONS: { value: TechniqueId; label: string }[] = [
  { value: 'armbar', label: 'Armbar' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'kimura', label: 'Kimura' },
  { value: 'rear_naked_choke', label: 'Rear Naked Choke' },
  { value: 'guillotine', label: 'Guillotine' },
  { value: 'ankle_lock', label: 'Ankle Lock' },
  { value: 'sweep', label: 'Sweep' },
  { value: 'guard_pass', label: 'Guard Pass' },
  { value: 'mount', label: 'Mount' },
  { value: 'back_control', label: 'Back Control' },
];

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
  SELF_TRAINING_INSTRUCTOR,
] as const;

export function getClassTypeLabel(value: WorkoutClassType): string {
  return CLASS_TYPE_OPTIONS.find((item) => item.value === value)?.label ?? value;
}

export function getTechniqueLabel(value: TechniqueId): string {
  return TECHNIQUE_OPTIONS.find((item) => item.value === value)?.label ?? value;
}

export function getIntensityLabel(value: TrainingIntensity): string {
  return INTENSITY_OPTIONS.find((item) => item.value === value)?.label ?? value;
}
