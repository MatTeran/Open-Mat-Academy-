import { Circle, G, Path } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Mat Family — interlocking rings crest (not generic people icons). */
export function MatFamilyArt({ cx, cy, s, material, unlocked }: MedalArtProps) {
  const ring = unlocked ? materialPalette.brushedSilver : material.accent;
  const gold = unlocked ? materialPalette.paleGold : material.rimMid;

  return (
    <G>
      <Circle
        cx={cx - 7 * s}
        cy={cy}
        r={9 * s}
        fill="none"
        stroke={ring}
        strokeWidth={1.9}
        opacity={unlocked ? 0.92 : 0.45}
      />
      <Circle
        cx={cx + 7 * s}
        cy={cy}
        r={9 * s}
        fill="none"
        stroke={gold}
        strokeWidth={1.9}
        opacity={unlocked ? 0.92 : 0.45}
      />
      <Circle
        cx={cx}
        cy={cy - 6 * s}
        r={7 * s}
        fill="none"
        stroke={ring}
        strokeWidth={1.5}
        opacity={unlocked ? 0.7 : 0.35}
      />
      <Path
        d={`M ${cx} ${cy + 12 * s}
          Q ${cx - 10 * s} ${cy + 6 * s} ${cx - 12 * s} ${cy + 16 * s}
          M ${cx} ${cy + 12 * s}
          Q ${cx + 10 * s} ${cy + 6 * s} ${cx + 12 * s} ${cy + 16 * s}`}
        stroke={gold}
        strokeWidth={1.2}
        fill="none"
        opacity={unlocked ? 0.55 : 0.28}
      />
    </G>
  );
}
