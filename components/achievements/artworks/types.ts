import type { MedalMaterial } from '../../../lib/achievements/materials';

export type MedalArtProps = {
  cx: number;
  cy: number;
  s: number;
  material: MedalMaterial;
  unlocked: boolean;
};
