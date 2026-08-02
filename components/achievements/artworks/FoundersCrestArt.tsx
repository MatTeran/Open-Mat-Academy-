import { Circle, G, Path, Polygon } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Legendary founders crest — diamond facet + Open Mat mark. */
export function FoundersCrestArt({
  cx,
  cy,
  s,
  material,
  unlocked,
}: MedalArtProps) {
  const gold = unlocked ? materialPalette.goldHighlight : material.accent;
  const deep = unlocked ? materialPalette.deepGold : material.rimInner;
  const edge = unlocked ? materialPalette.primaryGold : material.rimMid;

  return (
    <G>
      <Path
        d={`M ${cx} ${cy - 18 * s}
          L ${cx + 16 * s} ${cy - 6 * s}
          L ${cx + 12 * s} ${cy + 12 * s}
          L ${cx} ${cy + 18 * s}
          L ${cx - 12 * s} ${cy + 12 * s}
          L ${cx - 16 * s} ${cy - 6 * s}
          Z`}
        fill={deep}
        opacity={unlocked ? 0.4 : 0.22}
        stroke={edge}
        strokeWidth={1.4}
      />
      <Polygon
        points={`${cx},${cy - 10 * s} ${cx + 8 * s},${cy} ${cx},${cy + 10 * s} ${cx - 8 * s},${cy}`}
        fill={gold}
        opacity={unlocked ? 0.92 : 0.42}
        stroke="#FFF6D0"
        strokeOpacity={unlocked ? 0.45 : 0.15}
        strokeWidth={1}
      />
      <Circle
        cx={cx}
        cy={cy}
        r={3 * s}
        fill={materialPalette.obsidian}
        stroke={gold}
        strokeWidth={1}
        opacity={unlocked ? 0.95 : 0.5}
      />
      <Path
        d={`M ${cx - 5 * s} ${cy + 14 * s}
          L ${cx - 2 * s} ${cy + 11 * s}
          L ${cx} ${cy + 13 * s}
          L ${cx + 2 * s} ${cy + 11 * s}
          L ${cx + 5 * s} ${cy + 14 * s}`}
        fill="none"
        stroke={gold}
        strokeOpacity={unlocked ? 0.55 : 0.28}
        strokeWidth={0.9}
      />
    </G>
  );
}
