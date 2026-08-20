export type TechniqueSourceType = 'system' | 'user' | 'academy';

export type TechniqueFormat = 'gi' | 'no_gi' | 'both';

export type TechniqueCategory =
  | 'submission'
  | 'sweep'
  | 'takedown'
  | 'escape'
  | 'position'
  | 'guard'
  | 'guard_pass'
  | 'transition'
  | 'defense'
  | 'control'
  | 'grip'
  | 'movement'
  | 'other';

/** Stable technique identifier — system slugs or custom UUIDs. */
export type TechniqueId = string;

export interface MemberTechnique {
  id: TechniqueId;
  name: string;
  category: TechniqueCategory;
  subcategory: string | null;
  position: string | null;
  format: TechniqueFormat;
  sourceType: TechniqueSourceType;
  createdByUserId: string | null;
  academyId: string | null;
  isPublic: boolean;
  archived: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemberTechniqueInput {
  name: string;
  category: TechniqueCategory;
  subcategory?: string | null;
  position?: string | null;
  format?: TechniqueFormat;
  notes?: string;
}

export type UpdateMemberTechniqueInput = Partial<
  Omit<
    MemberTechnique,
    'id' | 'sourceType' | 'createdByUserId' | 'academyId' | 'createdAt'
  >
>;

export interface TechniqueResolver {
  getLabel: (id: TechniqueId) => string;
  getCategory: (id: TechniqueId) => TechniqueCategory;
  getTechnique: (id: TechniqueId) => MemberTechnique | undefined;
}

export interface TechniquePersonalStats {
  timesLogged: number;
  sessionsUsed: number;
  firstLogged: string | null;
  lastLogged: string | null;
  last30Days: number;
  partners: Array<{ name: string; sessions: number }>;
  history: Array<{
    workoutId: string;
    date: string;
    className: string;
    rounds: number;
  }>;
}

export interface YourGameOverview {
  totalUnique: number;
  loggedThisMonth: number;
  mostUsed: { id: TechniqueId; label: string; count: number } | null;
  newest: { id: TechniqueId; label: string; firstLogged: string } | null;
  categoryBreakdown: Array<{
    category: TechniqueCategory;
    label: string;
    count: number;
  }>;
  techniques: Array<{
    id: TechniqueId;
    label: string;
    category: TechniqueCategory;
    count: number;
    lastUsed: string | null;
    sourceType: TechniqueSourceType;
  }>;
}

export type TechniqueListSort =
  | 'most_used'
  | 'recent'
  | 'least_used'
  | 'alpha';
