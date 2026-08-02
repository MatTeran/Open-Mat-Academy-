import { Circle, G, Path, Polygon } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Championship medallion — heavy gold, laurel, abstract first-place mark. */
export function GoldMedalistArt({
  cx,
  cy,
  s,
  material,
  unlocked,
}: MedalArtProps) {
  const gold = unlocked ? materialPalette.goldHighlight : material.accent;
  const deep = unlocked ? materialPalette.deepGold : material.rimInner;
  const enamel = unlocked ? materialPalette.obsidian : '#121418';

  return (
    <G>
      <Circle
        cx={cx}
        cy={cy}
        r={20 * s}
        fill={unlocked ? 'rgba(212,175,55,0.14)' : 'rgba(90,97,107,0.12)'}
      />

      {/* Laurel left / right */}
      <Path
        d={`M ${cx - 3 * s} ${cy + 16 * s}
          Q ${cx - 20 * s} ${cy + 6 * s} ${cx - 17 * s} ${cy - 14 * s}`}
        stroke={gold}
        strokeWidth={1.8}
        fill="none"
        opacity={unlocked ? 0.95 : 0.45}
      />
      <Path
        d={`M ${cx + 3 * s} ${cy + 16 * s}
          Q ${cx + 20 * s} ${cy + 6 * s} ${cx + 17 * s} ${cy - 14 * s}`}
        stroke={gold}
        strokeWidth={1.8}
        fill="none"
        opacity={unlocked ? 0.95 : 0.45}
      />
      {[-10, -2, 6].map((y, i) => (
        <Path
          key={`l-${i}`}
          d={`M ${cx - 11 * s - i} ${cy + y * s}
            q ${-5 * s} ${-2 * s} ${-1.5 * s} ${-6 * s}`}
          stroke={gold}
          strokeWidth={1.2}
          fill="none"
          opacity={unlocked ? 0.8 : 0.35}
        />
      ))}
      {[-10, -2, 6].map((y, i) => (
        <Path
          key={`r-${i}`}
          d={`M ${cx + 11 * s + i} ${cy + y * s}
            q ${5 * s} ${-2 * s} ${1.5 * s} ${-6 * s}`}
          stroke={gold}
          strokeWidth={1.2}
          fill="none"
          opacity={unlocked ? 0.8 : 0.35}
        />
      ))}

      {/* Abstract podium / #1 mark */}
      <Path
        d={`M ${cx - 12 * s} ${cy + 10 * s}
          H ${cx - 4 * s} V ${cy + 2 * s}
          H ${cx + 4 * s} V ${cy - 4 * s}
          H ${cx + 12 * s} V ${cy + 10 * s} Z`}
        fill={enamel}
        stroke={deep}
        strokeWidth={1.1}
        opacity={unlocked ? 0.9 : 0.5}
      />
      <Polygon
        points={`${cx},${cy - 14 * s} ${cx + 5 * s},${cy - 4 * s} ${cx - 5 * s},${cy - 4 * s}`}
        fill={gold}
        opacity={unlocked ? 0.95 : 0.45}
      />
      <Path
        d={`M ${cx} ${cy - 2 * s} V ${cy + 8 * s}`}
        stroke={gold}
        strokeWidth={2.4 * s}
        strokeLinecap="round"
        opacity={unlocked ? 1 : 0.5}
      />
      <Circle
        cx={cx}
        cy={cy - 4 * s}
        r={2.2 * s}
        fill={gold}
        opacity={unlocked ? 1 : 0.5}
      />
    </G>
  );
}
