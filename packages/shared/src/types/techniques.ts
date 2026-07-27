export type TechniqueDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'competition';

export type TechniquePosition =
  | 'guard'
  | 'mount'
  | 'side_control'
  | 'back'
  | 'standing'
  | 'turtle'
  | 'knee_on_belly'
  | 'other';

export interface Technique {
  id: string;
  title: string;
  description: string;
  difficulty: TechniqueDifficulty;
  position: TechniquePosition;
  tags: string[];
  commonMistakes: string[];
  videoUri: string | null;
  imageUris: string[];
  isFavorite: boolean;
  authorId: string;
  authorName: string;
  academyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTechniqueInput {
  title: string;
  description: string;
  difficulty: TechniqueDifficulty;
  position: TechniquePosition;
  tags: string[];
  commonMistakes: string[];
  videoUri?: string | null;
  imageUris?: string[];
  isFavorite?: boolean;
}

export type UpdateTechniqueInput = Partial<CreateTechniqueInput>;
