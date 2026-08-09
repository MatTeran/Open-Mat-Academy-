import type { IntensityBand, TechniqueCategory, TechniqueId } from './workout';

export type TechniqueFilterId =
  | 'all'
  | 'submission'
  | 'sweep'
  | 'takedown'
  | 'escape'
  | 'position';

export interface IntensityWeekPoint {
  weekStartIso: string;
  monthLabel: string;
  /** Average intensity for the week; null when no rated sessions. */
  average: number | null;
  sampleSize: number;
}

export interface IntensityInsight {
  average: number | null;
  band: IntensityBand | null;
  /** Percent change vs previous 4 weeks; null when comparison not possible. */
  vsPreviousPercent: number | null;
  weeks: IntensityWeekPoint[];
  accessibilitySummary: string;
}

export interface PartnerInsight {
  name: string;
  rounds: number;
  sessions: number;
  averageIntensity: number | null;
  mostLoggedTechniqueId: TechniqueId | null;
  mostLoggedTechniqueLabel: string | null;
}

export interface PartnersInsight {
  partners: PartnerInsight[];
  uniqueCount: number;
  totalRounds: number;
  accessibilitySummary: string;
}

export interface TechniqueInsight {
  id: TechniqueId;
  label: string;
  category: TechniqueCategory;
  count: number;
}

export interface TechniqueCategoryHighlight {
  category: TechniqueCategory;
  label: string;
  techniqueId: TechniqueId;
  techniqueLabel: string;
  count: number;
}

export interface TechniquesInsight {
  techniques: TechniqueInsight[];
  highlights: TechniqueCategoryHighlight[];
  accessibilitySummary: string;
}

export interface TrainingInsights {
  intensity: IntensityInsight;
  partners: PartnersInsight;
  techniques: TechniquesInsight;
}
