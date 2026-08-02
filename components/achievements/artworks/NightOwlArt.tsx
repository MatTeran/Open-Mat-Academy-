import { Circle, G, Path } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Crescent moon + minimal owl-eye geometry on midnight enamel. */
export function NightOwlArt({ cx, cy, s, material, unlocked }: MedalArtProps) {
  const moon = unlocked ? materialPalette.brushedSilver : material.accent;
  const eye = unlocked ? materialPalette.paleGold : material.rimMid;
  const night = unlocked ? materialPalette.midnightBlue : '#121418';

  return (
    <G>
      <Circle
        cx={cx}
        cy={cy}
        r={20 * s}
        fill={night}
        opacity={unlocked ? 0.55 : 0.35}
      />

      {/* Crescent moon */}
      <Path
        d={`M ${cx + 8 * s} ${cy - 14 * s}
          A ${16 * s} ${16 * s} 0 1 0 ${cx + 8 * s} ${cy + 14 * s}
          A ${11 * s} ${11 * s} 0 1 1 ${cx + 8 * s} ${cy - 14 * s}
          Z`}
        fill={moon}
        opacity={unlocked ? 0.95 : 0.5}
      />
      <Circle
        cx={cx + 4 * s}
        cy={cy - 6 * s}
        r={2.2 * s}
        fill="#FFFFFF"
        opacity={unlocked ? 0.22 : 0.08}
      />

      {/* Minimal paired owl eyes */}
      <Circle
        cx={cx - 7 * s}
        cy={cy + 6 * s}
        r={3.2 * s}
        fill="none"
        stroke={eye}
        strokeWidth={1.4}
        opacity={unlocked ? 0.9 : 0.45}
      />
      <Circle
        cx={cx + 1 * s}
        cy={cy + 6 * s}
        r={3.2 * s}
        fill="none"
        stroke={eye}
        strokeWidth={1.4}
        opacity={unlocked ? 0.9 : 0.45}
      />
      <Circle cx={cx - 7 * s} cy={cy + 6 * s} r={1.1 * s} fill={eye} opacity={unlocked ? 0.95 : 0.4} />
      <Circle cx={cx + 1 * s} cy={cy + 6 * s} r={1.1 * s} fill={eye} opacity={unlocked ? 0.95 : 0.4} />

      {/* Subtle brow geometry */}
      <Path
        d={`M ${cx - 11 * s} ${cy + 2 * s}
          Q ${cx - 3 * s} ${cy - 1 * s} ${cx + 5 * s} ${cy + 2 * s}`}
        stroke={moon}
        strokeWidth={1.1}
        fill="none"
        opacity={unlocked ? 0.45 : 0.22}
      />
    </G>
  );
}
