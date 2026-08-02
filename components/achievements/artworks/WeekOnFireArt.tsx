import { G, Path } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Compact 7-day streak flame with engraved VII. */
export function WeekOnFireArt({ cx, cy, s, material, unlocked }: MedalArtProps) {
  const flame = unlocked ? materialPalette.amberEnamel : material.accent;
  const core = unlocked ? materialPalette.goldHighlight : material.rimHighlight;
  const metal = unlocked ? materialPalette.primaryGold : material.rimMid;

  return (
    <G>
      <Path
        d={`M ${cx} ${cy + 12 * s}
          C ${cx - 11 * s} ${cy + 2 * s}, ${cx - 9 * s} ${cy - 8 * s}, ${cx} ${cy - 15 * s}
          C ${cx + 3 * s} ${cy - 6 * s}, ${cx + 10 * s} ${cy - 2 * s}, ${cx + 8 * s} ${cy + 8 * s}
          C ${cx + 6 * s} ${cy + 13 * s}, ${cx + 2 * s} ${cy + 14 * s}, ${cx} ${cy + 12 * s}
          Z`}
        fill={metal}
        opacity={unlocked ? 0.9 : 0.45}
      />
      <Path
        d={`M ${cx} ${cy + 9 * s}
          C ${cx - 7 * s} ${cy + 1 * s}, ${cx - 6 * s} ${cy - 6 * s}, ${cx} ${cy - 11 * s}
          C ${cx + 2 * s} ${cy - 4 * s}, ${cx + 6 * s} ${cy} ${cx + 5 * s} ${cy + 6 * s}
          C ${cx + 4 * s} ${cy + 10 * s}, ${cx + 1 * s} ${cy + 10 * s}, ${cx} ${cy + 9 * s}
          Z`}
        fill={flame}
        opacity={unlocked ? 0.95 : 0.4}
      />
      <Path
        d={`M ${cx} ${cy + 5 * s}
          C ${cx - 3 * s} ${cy + 1 * s}, ${cx - 2 * s} ${cy - 3 * s}, ${cx} ${cy - 6 * s}
          C ${cx + 1.5 * s} ${cy - 1 * s}, ${cx + 2.5 * s} ${cy + 2 * s}, ${cx} ${cy + 5 * s}
          Z`}
        fill={core}
        opacity={unlocked ? 0.95 : 0.35}
      />
      {/* VII marks */}
      {[-4, 0, 4].map((x) => (
        <Path
          key={x}
          d={`M ${cx + x * s} ${cy + 15 * s} V ${cy + 19 * s}`}
          stroke={material.rimHighlight}
          strokeOpacity={unlocked ? 0.45 : 0.22}
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      ))}
    </G>
  );
}
