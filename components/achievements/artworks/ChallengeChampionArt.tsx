import { Defs, G, LinearGradient, Path, Polygon, Stop } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Challenge Champion — lightning carved into metal on shield face. */
export function ChallengeChampionArt({
  cx,
  cy,
  s,
  material,
  unlocked,
}: MedalArtProps) {
  const gold = unlocked ? materialPalette.goldHighlight : material.accent;
  const deep = unlocked ? materialPalette.deepGold : material.rimInner;
  const bolt = unlocked ? materialPalette.crimsonEnamel : material.rimMid;
  const uid = `chc-${Math.round(cx)}-${Math.round(s * 100)}`;

  return (
    <G>
      <Defs>
        <LinearGradient id={`${uid}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={gold} />
          <Stop offset="100%" stopColor={deep} />
        </LinearGradient>
      </Defs>

      <Path
        d={`M ${cx} ${cy - 16 * s}
          L ${cx + 14 * s} ${cy - 8 * s}
          L ${cx + 14 * s} ${cy + 4 * s}
          Q ${cx + 14 * s} ${cy + 14 * s} ${cx} ${cy + 18 * s}
          Q ${cx - 14 * s} ${cy + 14 * s} ${cx - 14 * s} ${cy + 4 * s}
          L ${cx - 14 * s} ${cy - 8 * s}
          Z`}
        fill={deep}
        opacity={unlocked ? 0.4 : 0.2}
        stroke={`url(#${uid}-g)`}
        strokeWidth={1.4}
      />
      <Polygon
        points={`${cx + 2 * s},${cy - 12 * s} ${cx - 7 * s},${cy + 1 * s} ${cx},${cy + 1 * s} ${cx - 2 * s},${cy + 13 * s} ${cx + 8 * s},${cy - 1 * s} ${cx},${cy - 1 * s}`}
        fill={bolt}
        stroke={gold}
        strokeWidth={1.2}
        opacity={unlocked ? 0.95 : 0.45}
      />
    </G>
  );
}
