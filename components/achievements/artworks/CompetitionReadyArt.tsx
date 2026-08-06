import { Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Competition Ready — tournament bracket on carbon weave, gold shield language. */
export function CompetitionReadyArt({
  cx,
  cy,
  s,
  material,
  unlocked,
}: MedalArtProps) {
  const gold = unlocked ? materialPalette.primaryGold : material.accent;
  const crimson = unlocked ? materialPalette.crimsonEnamel : material.rimMid;
  const weave = unlocked ? material.rimHighlight : material.rimMid;
  const uid = `cr-${Math.round(cx)}-${Math.round(s * 100)}`;

  return (
    <G>
      <Defs>
        <LinearGradient id={`${uid}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={unlocked ? materialPalette.goldHighlight : material.rimHighlight} />
          <Stop offset="100%" stopColor={gold} />
        </LinearGradient>
      </Defs>

      {/* Carbon weave */}
      {[-14, -7, 0, 7, 14].map((y) => (
        <Path
          key={`h-${y}`}
          d={`M ${cx - 16 * s} ${cy + y * s} H ${cx + 16 * s}`}
          stroke={weave}
          strokeOpacity={unlocked ? 0.1 : 0.06}
          strokeWidth={0.7}
        />
      ))}
      {[-14, -7, 0, 7, 14].map((x) => (
        <Path
          key={`v-${x}`}
          d={`M ${cx + x * s} ${cy - 16 * s} V ${cy + 16 * s}`}
          stroke={weave}
          strokeOpacity={unlocked ? 0.08 : 0.05}
          strokeWidth={0.7}
        />
      ))}

      {/* Bracket */}
      <Path
        d={`M ${cx - 14 * s} ${cy - 12 * s} H ${cx - 4 * s}
          M ${cx - 14 * s} ${cy - 2 * s} H ${cx - 4 * s}
          M ${cx - 4 * s} ${cy - 12 * s} V ${cy - 2 * s}
          M ${cx - 4 * s} ${cy - 7 * s} H ${cx + 2 * s}
          M ${cx - 14 * s} ${cy + 4 * s} H ${cx - 4 * s}
          M ${cx - 14 * s} ${cy + 14 * s} H ${cx - 4 * s}
          M ${cx - 4 * s} ${cy + 4 * s} V ${cy + 14 * s}
          M ${cx - 4 * s} ${cy + 9 * s} H ${cx + 2 * s}
          M ${cx + 2 * s} ${cy - 7 * s} V ${cy + 9 * s}
          M ${cx + 2 * s} ${cy + 1 * s} H ${cx + 11 * s}`}
        stroke={`url(#${uid}-g)`}
        strokeWidth={1.7}
        strokeLinecap="square"
        opacity={unlocked ? 0.95 : 0.48}
      />

      <Rect
        x={cx + 9 * s}
        y={cy - 3 * s}
        width={6.5 * s}
        height={8 * s}
        rx={1}
        fill={crimson}
        stroke={gold}
        strokeWidth={1}
        opacity={unlocked ? 0.95 : 0.45}
      />
    </G>
  );
}
