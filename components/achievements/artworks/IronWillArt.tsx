import { Circle, G, Path } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Legendary 90-day streak — forged ring, layered ember, XC engraving. */
export function IronWillArt({ cx, cy, s, material, unlocked }: MedalArtProps) {
  const gold = unlocked ? materialPalette.goldHighlight : material.accent;
  const ember = unlocked ? materialPalette.crimsonEnamel : material.rimMid;
  const metal = unlocked ? materialPalette.primaryGold : material.rimMid;

  return (
    <G>
      <Circle
        cx={cx}
        cy={cy}
        r={18 * s}
        fill="none"
        stroke={metal}
        strokeWidth={2.4}
        opacity={unlocked ? 0.9 : 0.45}
      />
      <Circle
        cx={cx}
        cy={cy}
        r={14 * s}
        fill="none"
        stroke={gold}
        strokeWidth={1.2}
        strokeDasharray={`${3 * s} ${2.5 * s}`}
        opacity={unlocked ? 0.7 : 0.3}
      />
      <Path
        d={`M ${cx} ${cy + 8 * s}
          C ${cx - 8 * s} ${cy + 2 * s}, ${cx - 6 * s} ${cy - 8 * s}, ${cx} ${cy - 12 * s}
          C ${cx + 3 * s} ${cy - 4 * s}, ${cx + 7 * s} ${cy} ${cx + 5 * s} ${cy + 6 * s}
          C ${cx + 3 * s} ${cy + 9 * s}, ${cx + 1 * s} ${cy + 9 * s}, ${cx} ${cy + 8 * s}
          Z`}
        fill={ember}
        opacity={unlocked ? 0.85 : 0.4}
        stroke={gold}
        strokeWidth={1}
      />
      <Path
        d={`M ${cx - 8 * s} ${cy + 16 * s}
          L ${cx - 4 * s} ${cy + 12 * s}
          L ${cx} ${cy + 16 * s}
          L ${cx + 4 * s} ${cy + 12 * s}
          L ${cx + 8 * s} ${cy + 16 * s}`}
        fill="none"
        stroke={gold}
        strokeWidth={1.1}
        opacity={unlocked ? 0.65 : 0.3}
      />
    </G>
  );
}
