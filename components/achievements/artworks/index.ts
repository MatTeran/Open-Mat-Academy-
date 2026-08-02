import type { ComponentType } from 'react';

import { CenturyClubArt } from './CenturyClubArt';
import { ChallengeChampionArt } from './ChallengeChampionArt';
import { CompetitionReadyArt } from './CompetitionReadyArt';
import { EarlyBirdArt } from './EarlyBirdArt';
import { FirstClassArt } from './FirstClassArt';
import { FirstMatchArt } from './FirstMatchArt';
import { FoundersCrestArt } from './FoundersCrestArt';
import { GoldMedalistArt } from './GoldMedalistArt';
import { IronWillArt } from './IronWillArt';
import { MatFamilyArt } from './MatFamilyArt';
import { NightOwlArt } from './NightOwlArt';
import { OpenMatWarriorArt } from './OpenMatWarriorArt';
import { SeminarSeekerArt } from './SeminarSeekerArt';
import { Streak30Art } from './Streak30Art';
import { TechniqueScholarArt } from './TechniqueScholarArt';
import { TrainingPartnerArt } from './TrainingPartnerArt';
import type { MedalArtProps } from './types';
import { WeekOnFireArt } from './WeekOnFireArt';

export type { MedalArtProps } from './types';

/** Unique collectible artwork registry — one entry per achievement badge. */
export const MEDAL_ARTWORK: Record<string, ComponentType<MedalArtProps>> = {
  'badge-first-class': FirstClassArt,
  'badge-early-bird': EarlyBirdArt,
  'badge-night-owl': NightOwlArt,
  'badge-100-classes': CenturyClubArt,
  'badge-open-mat-warrior': OpenMatWarriorArt,
  'badge-7-day-streak': WeekOnFireArt,
  'badge-30-day-streak': Streak30Art,
  'badge-iron-will': IronWillArt,
  'badge-competition-ready': CompetitionReadyArt,
  'badge-technique-scholar': TechniqueScholarArt,
  'badge-challenge-champion': ChallengeChampionArt,
  'badge-first-match': FirstMatchArt,
  'badge-gold-medalist': GoldMedalistArt,
  'badge-mat-family': MatFamilyArt,
  'badge-training-partner': TrainingPartnerArt,
  'badge-seminar-seeker': SeminarSeekerArt,
  'badge-founders-crest': FoundersCrestArt,
};

export function getMedalArtwork(badgeId: string): ComponentType<MedalArtProps> | null {
  return MEDAL_ARTWORK[badgeId] ?? null;
}
