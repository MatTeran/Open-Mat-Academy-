import { Circle, G, Path } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** First Match — raised mat circle + starting mark. */
export function FirstMatchArt({ cx, cy, s, material, unlocked }: MedalArtProps) {
  const metal = unlocked ? materialPalette.brushedSilver : material.accent;
  const gold = unlocked ? materialPalette.primaryGold : material.rimMid;

  return (
    <G>
      <Circle
        cx={cx}
        cy={cy}
        r={16 * s}
        fill="none"
        stroke={metal}
        strokeWidth={2.1}
        opacity={unlocked ? 0.9 : 0.45}
      />
      <Circle
        cx={cx}
        cy={cy}
        r={10 * s}
        fill="none"
        stroke={gold}
        strokeWidth={1.3}
        opacity={unlocked ? 0.75 : 0.35}
      />
      <Path
        d={`M ${cx - 3 * s} ${cy - 6 * s}
          L ${cx + 7 * s} ${cy}
          L ${cx - 3 * s} ${cy + 6 * s}
          Z`}
        fill={gold}
        opacity={unlocked ? 0.95 : 0.45}
      />
      <Path
        d={`M ${cx - 12 * s} ${cy + 14 * s} H ${cx + 12 * s}`}
        stroke={metal}
        strokeOpacity={unlocked ? 0.45 : 0.2}
        strokeWidth={1}
      />
    </G>
  );
}
