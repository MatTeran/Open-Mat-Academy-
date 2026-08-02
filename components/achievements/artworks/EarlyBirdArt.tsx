import { Circle, G, Path } from 'react-native-svg';

import type { MedalMaterial } from '../../../lib/achievements/materials';
import { materialPalette } from '../../../lib/achievements/materials';

/** Sunrise rays + warm amber enamel horizon. */
export function EarlyBirdArt({
  cx,
  cy,
  s,
  material,
  unlocked,
}: {
  cx: number;
  cy: number;
  s: number;
  material: MedalMaterial;
  unlocked: boolean;
}) {
  const ray = unlocked ? materialPalette.goldHighlight : material.accent;
  const sun = unlocked ? materialPalette.primaryGold : material.rimMid;
  const amber = unlocked ? materialPalette.amberEnamel : '#3A3F46';
  const horizon = unlocked ? '#1A1008' : '#121418';

  return (
    <G>
      {/* Warm enamel wash */}
      <Circle
        cx={cx}
        cy={cy + 2 * s}
        r={20 * s}
        fill={amber}
        opacity={unlocked ? 0.35 : 0.2}
      />

      {/* Rays */}
      {[-70, -45, -22, 0, 22, 45, 70].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = cx + Math.sin(rad) * 6 * s;
        const y1 = cy + 2 * s - Math.cos(rad) * 6 * s;
        const x2 = cx + Math.sin(rad) * 20 * s;
        const y2 = cy + 2 * s - Math.cos(rad) * 20 * s;
        return (
          <Path
            key={deg}
            d={`M ${x1} ${y1} L ${x2} ${y2}`}
            stroke={ray}
            strokeWidth={unlocked ? 2.2 : 1.6}
            strokeLinecap="round"
            opacity={unlocked ? 0.9 : 0.45}
          />
        );
      })}

      {/* Sun disc */}
      <Circle
        cx={cx}
        cy={cy + 2 * s}
        r={8.5 * s}
        fill={sun}
        stroke={material.rimHighlight}
        strokeOpacity={unlocked ? 0.55 : 0.25}
        strokeWidth={1.2}
      />
      <Circle
        cx={cx - 2.5 * s}
        cy={cy}
        r={3 * s}
        fill="#FFFFFF"
        opacity={unlocked ? 0.28 : 0.1}
      />

      {/* Dark horizon */}
      <Path
        d={`M ${cx - 22 * s} ${cy + 10 * s}
          Q ${cx} ${cy + 6 * s} ${cx + 22 * s} ${cy + 10 * s}
          L ${cx + 22 * s} ${cy + 20 * s}
          L ${cx - 22 * s} ${cy + 20 * s}
          Z`}
        fill={horizon}
        opacity={0.92}
      />
      <Path
        d={`M ${cx - 22 * s} ${cy + 10 * s}
          Q ${cx} ${cy + 6 * s} ${cx + 22 * s} ${cy + 10 * s}`}
        stroke={ray}
        strokeOpacity={unlocked ? 0.45 : 0.2}
        strokeWidth={1}
        fill="none"
      />
    </G>
  );
}
