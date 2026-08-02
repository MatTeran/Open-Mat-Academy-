import { Circle, G, Path } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Crossed mat lines + interlocking grappling arcs — gunmetal & gold. */
export function OpenMatWarriorArt({
  cx,
  cy,
  s,
  material,
  unlocked,
}: MedalArtProps) {
  const metal = unlocked ? materialPalette.primaryGold : material.accent;
  const gun = unlocked ? materialPalette.gunmetalLight : material.rimMid;
  const deep = unlocked ? materialPalette.deepGold : material.rimInner;

  return (
    <G>
      {/* Mat grid base */}
      {[-12, -4, 4, 12].map((x) => (
        <Path
          key={`v-${x}`}
          d={`M ${cx + x * s} ${cy - 16 * s} V ${cy + 16 * s}`}
          stroke={gun}
          strokeOpacity={unlocked ? 0.35 : 0.2}
          strokeWidth={0.9}
        />
      ))}
      {[-12, -4, 4, 12].map((y) => (
        <Path
          key={`h-${y}`}
          d={`M ${cx - 16 * s} ${cy + y * s} H ${cx + 16 * s}`}
          stroke={gun}
          strokeOpacity={unlocked ? 0.28 : 0.16}
          strokeWidth={0.9}
        />
      ))}

      {/* Interlocking grappling arcs (abstract, not people icons) */}
      <Path
        d={`M ${cx - 14 * s} ${cy - 2 * s}
          Q ${cx - 2 * s} ${cy - 16 * s} ${cx + 10 * s} ${cy - 4 * s}
          Q ${cx + 2 * s} ${cy + 2 * s} ${cx - 8 * s} ${cy + 10 * s}
          Q ${cx - 14 * s} ${cy + 6 * s} ${cx - 14 * s} ${cy - 2 * s}
          Z`}
        fill={deep}
        opacity={unlocked ? 0.55 : 0.3}
        stroke={metal}
        strokeWidth={1.3}
      />
      <Path
        d={`M ${cx + 14 * s} ${cy + 2 * s}
          Q ${cx + 2 * s} ${cy + 16 * s} ${cx - 10 * s} ${cy + 4 * s}
          Q ${cx - 2 * s} ${cy - 2 * s} ${cx + 8 * s} ${cy - 10 * s}
          Q ${cx + 14 * s} ${cy - 6 * s} ${cx + 14 * s} ${cy + 2 * s}
          Z`}
        fill={gun}
        opacity={unlocked ? 0.5 : 0.28}
        stroke={metal}
        strokeWidth={1.3}
      />

      <Circle
        cx={cx}
        cy={cy}
        r={4.5 * s}
        fill={metal}
        opacity={unlocked ? 0.95 : 0.5}
      />
      <Circle
        cx={cx}
        cy={cy}
        r={18 * s}
        fill="none"
        stroke={metal}
        strokeOpacity={unlocked ? 0.35 : 0.18}
        strokeWidth={1}
      />
    </G>
  );
}
