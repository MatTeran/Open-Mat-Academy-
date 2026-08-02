import { Circle, G, Path } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** First competition match — raised mat circle + starting whistle geometry. */
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
        strokeWidth={2}
        opacity={unlocked ? 0.85 : 0.45}
      />
      <Circle
        cx={cx}
        cy={cy}
        r={10 * s}
        fill="none"
        stroke={gold}
        strokeWidth={1.2}
        opacity={unlocked ? 0.7 : 0.35}
      />
      {/* Abstract starting mark */}
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
        strokeOpacity={unlocked ? 0.4 : 0.2}
        strokeWidth={1}
      />
    </G>
  );
}
