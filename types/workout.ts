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

export type TechniqueId =
  | 'armbar'
  | 'triangle'
  | 'kimura'
  | 'rear_naked_choke'
  | 'guillotine'
  | 'ankle_lock'
  | 'sweep'
  | 'guard_pass'
  | 'mount'
  | 'back_control';

export type GiType = 'gi' | 'no_gi';

export interface Workout {
  id: string;
  date: string; // ISO date
  className: string;
  classType: WorkoutClassType;
  instructor: string;
  durationMinutes: number;
  rounds: number;
  giType: GiType;
  intensity: TrainingIntensity;
  partners: string[];
  techniques: TechniqueId[];
  favoriteTechnique: TechniqueId | null;
  notes: string;
  rating: number; // 1-5
  mood: WorkoutMood;
  photoPlaceholder: boolean;
}

export type WorkoutDraft = Omit<Workout, 'id'>;
