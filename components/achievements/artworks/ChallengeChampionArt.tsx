import { G, Path, Polygon } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Epic shield bolt — layered metal lightning for challenge mastery. */
export function ChallengeChampionArt({
  cx,
  cy,
  s,
  material,
  unlocked,
}: MedalArtProps) {
  const gold = unlocked ? materialPalette.goldHighlight : material.accent;
  const deep = unlocked ? materialPalette.deepGold : material.rimInner;
  const crimson = unlocked ? materialPalette.crimsonEnamel : material.rimMid;

  return (
    <G>
      <Path
        d={`M ${cx} ${cy - 16 * s}
          L ${cx + 14 * s} ${cy - 8 * s}
          L ${cx + 14 * s} ${cy + 4 * s}
          Q ${cx + 14 * s} ${cy + 14 * s} ${cx} ${cy + 18 * s}
          Q ${cx - 14 * s} ${cy + 14 * s} ${cx - 14 * s} ${cy + 4 * s}
          L ${cx - 14 * s} ${cy - 8 * s}
          Z`}
        fill={deep}
        opacity={unlocked ? 0.35 : 0.2}
        stroke={gold}
        strokeWidth={1.3}
      />
      <Polygon
        points={`${cx + 2 * s},${cy - 12 * s} ${cx - 7 * s},${cy + 1 * s} ${cx},${cy + 1 * s} ${cx - 2 * s},${cy + 13 * s} ${cx + 8 * s},${cy - 1 * s} ${cx},${cy - 1 * s}`}
        fill={crimson}
        stroke={gold}
        strokeWidth={1.2}
        opacity={unlocked ? 0.95 : 0.45}
      />
    </G>
  );
}
