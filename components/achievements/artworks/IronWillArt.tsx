import { Circle, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Iron Will — legendary long streak: forged ring, massive ember, laurel hint. */
export function IronWillArt({ cx, cy, s, material, unlocked }: MedalArtProps) {
  const gold = unlocked ? materialPalette.goldHighlight : material.accent;
  const ember = unlocked ? materialPalette.crimsonEnamel : material.rimMid;
  const metal = unlocked ? materialPalette.primaryGold : material.rimMid;
  const uid = `iw-${Math.round(cx)}-${Math.round(s * 100)}`;

  return (
    <G>
      <Defs>
        <LinearGradient id={`${uid}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={gold} />
          <Stop offset="100%" stopColor={metal} />
        </LinearGradient>
      </Defs>

      <Circle
        cx={cx}
        cy={cy}
        r={18 * s}
        fill="none"
        stroke={`url(#${uid}-g)`}
        strokeWidth={2.6}
        opacity={unlocked ? 0.95 : 0.45}
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

      {/* Massive flame */}
      <Path
        d={`M ${cx} ${cy + 9 * s}
          C ${cx - 10 * s} ${cy + 2 * s}, ${cx - 9 * s} ${cy - 9 * s}, ${cx} ${cy - 14 * s}
          C ${cx + 4 * s} ${cy - 5 * s}, ${cx + 9 * s} ${cy} ${cx + 7 * s} ${cy + 7 * s}
          C ${cx + 4 * s} ${cy + 11 * s}, ${cx + 1 * s} ${cy + 11 * s}, ${cx} ${cy + 9 * s}
          Z`}
        fill={ember}
        opacity={unlocked ? 0.9 : 0.4}
        stroke={gold}
        strokeWidth={1.1}
      />
      <Path
        d={`M ${cx} ${cy + 5 * s}
          C ${cx - 4 * s} ${cy} ${cx - 3 * s} ${cy - 5 * s}, ${cx} ${cy - 8 * s}
          C ${cx + 2 * s} ${cy - 3 * s}, ${cx + 3.5 * s} ${cy + 1 * s}, ${cx} ${cy + 5 * s}
          Z`}
        fill={gold}
        opacity={unlocked ? 0.95 : 0.35}
      />

      {/* Mini laurel base */}
      <Path
        d={`M ${cx - 8 * s} ${cy + 16 * s}
          Q ${cx} ${cy + 12 * s} ${cx + 8 * s} ${cy + 16 * s}`}
        stroke={gold}
        strokeWidth={1.2}
        fill="none"
        opacity={unlocked ? 0.65 : 0.3}
      />
    </G>
  );
}
