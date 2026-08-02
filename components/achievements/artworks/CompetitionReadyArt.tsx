import { G, Path, Rect } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Abstract tournament bracket — sharp athletic geometry, gold + crimson. */
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

  return (
    <G>
      {/* Subtle woven / carbon texture lines */}
      {[-14, -7, 0, 7, 14].map((y) => (
        <Path
          key={y}
          d={`M ${cx - 16 * s} ${cy + y * s} H ${cx + 16 * s}`}
          stroke={weave}
          strokeOpacity={unlocked ? 0.1 : 0.06}
          strokeWidth={0.7}
        />
      ))}

      {/* Bracket tree */}
      <Path
        d={`M ${cx - 14 * s} ${cy - 12 * s} H ${cx - 4 * s}
          M ${cx - 14 * s} ${cy - 2 * s} H ${cx - 4 * s}
          M ${cx - 4 * s} ${cy - 12 * s} V ${cy - 2 * s}
          M ${cx - 4 * s} ${cy - 7 * s} H ${cx + 2 * s}`}
        stroke={gold}
        strokeWidth={1.6}
        strokeLinecap="square"
        opacity={unlocked ? 0.95 : 0.5}
      />
      <Path
        d={`M ${cx - 14 * s} ${cy + 4 * s} H ${cx - 4 * s}
          M ${cx - 14 * s} ${cy + 14 * s} H ${cx - 4 * s}
          M ${cx - 4 * s} ${cy + 4 * s} V ${cy + 14 * s}
          M ${cx - 4 * s} ${cy + 9 * s} H ${cx + 2 * s}`}
        stroke={gold}
        strokeWidth={1.6}
        strokeLinecap="square"
        opacity={unlocked ? 0.85 : 0.42}
      />
      <Path
        d={`M ${cx + 2 * s} ${cy - 7 * s} V ${cy + 9 * s}
          M ${cx + 2 * s} ${cy + 1 * s} H ${cx + 12 * s}`}
        stroke={crimson}
        strokeWidth={1.8}
        strokeLinecap="square"
        opacity={unlocked ? 0.95 : 0.45}
      />

      {/* Finalist node */}
      <Rect
        x={cx + 10 * s}
        y={cy - 3 * s}
        width={6 * s}
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
