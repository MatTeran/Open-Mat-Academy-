import { G, Path } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Training Partner — interlocking grip / chain links. */
export function TrainingPartnerArt({
  cx,
  cy,
  s,
  material,
  unlocked,
}: MedalArtProps) {
  const a = unlocked ? materialPalette.primaryGold : material.accent;
  const b = unlocked ? materialPalette.brushedSilver : material.rimMid;

  return (
    <G>
      <Path
        d={`M ${cx - 12 * s} ${cy - 4 * s}
          A ${7 * s} ${7 * s} 0 1 1 ${cx - 12 * s} ${cy + 8 * s}
          A ${7 * s} ${7 * s} 0 1 1 ${cx - 12 * s} ${cy - 4 * s}`}
        fill="none"
        stroke={a}
        strokeWidth={2.3}
        opacity={unlocked ? 0.95 : 0.48}
      />
      <Path
        d={`M ${cx + 12 * s} ${cy - 8 * s}
          A ${7 * s} ${7 * s} 0 1 1 ${cx + 12 * s} ${cy + 4 * s}
          A ${7 * s} ${7 * s} 0 1 1 ${cx + 12 * s} ${cy - 8 * s}`}
        fill="none"
        stroke={b}
        strokeWidth={2.3}
        opacity={unlocked ? 0.95 : 0.48}
      />
      <Path
        d={`M ${cx - 4 * s} ${cy + 2 * s} L ${cx + 4 * s} ${cy - 2 * s}`}
        stroke={a}
        strokeWidth={1.6}
        opacity={unlocked ? 0.7 : 0.35}
      />
    </G>
  );
}
