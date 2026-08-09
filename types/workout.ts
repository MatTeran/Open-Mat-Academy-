import type { TechniqueCategory, TechniqueId } from './technique';

export type { TechniqueCategory, TechniqueId } from './technique';

export type WorkoutClassType =
  | 'fundamentals'
  | 'advanced'
  | 'competition'
  | 'open_mat'
  | 'private_lesson'
  | 'strength_training'
  | 'cardio';

export type TrainingIntensity =
  | 'easy'
  | 'moderate'
  | 'hard'
  | 'competition_pace';

export type WorkoutMood = 'great' | 'good' | 'average' | 'exhausted';

export type GiType = 'gi' | 'no_gi';

export type IntensityBand = 'Light' | 'Moderate' | 'Hard' | 'Competition';

export interface Workout {
  id: string;
  date: string; // ISO date
  className: string;
  classType: WorkoutClassType;
  instructor: string;
  durationMinutes: number;
  rounds: number;
  giType: GiType;
  /** Categorical intensity kept for labels / legacy display. */
  intensity: TrainingIntensity;
  /**
   * Optional 1–10 intensity score.
   * Null/undefined means the session is excluded from intensity averages.
   */
  intensityScore?: number | null;
  partners: string[];
  /** Technique IDs — system library slugs and/or custom technique IDs. */
  techniques: TechniqueId[];
  favoriteTechnique: TechniqueId | null;
  notes: string;
  rating: number; // 1-5
  mood: WorkoutMood;
  photoPlaceholder: boolean;
}

export type WorkoutDraft = Omit<Workout, 'id'>;

/** @deprecated Prefer TechniqueCategory from types/technique */
export type LegacyTechniqueCategory = TechniqueCategory;
