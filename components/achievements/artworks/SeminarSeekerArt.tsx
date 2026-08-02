import { Circle, G, Path, Polygon } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Commemorative coin star for guest seminars. */
export function SeminarSeekerArt({
  cx,
  cy,
  s,
  material,
  unlocked,
}: MedalArtProps) {
  const gold = unlocked ? materialPalette.paleGold : material.accent;
  const silver = unlocked ? materialPalette.brushedSilver : material.rimMid;

  return (
    <G>
      <Circle
        cx={cx}
        cy={cy}
        r={18 * s}
        fill="none"
        stroke={silver}
        strokeWidth={1.2}
        strokeDasharray={`${2.5 * s} ${2 * s}`}
        opacity={unlocked ? 0.55 : 0.28}
      />
      <Polygon
        points={`${cx},${cy - 14 * s} ${cx + 4 * s},${cy - 4 * s} ${cx + 14 * s},${cy - 4 * s} ${cx + 6 * s},${cy + 3 * s} ${cx + 9 * s},${cy + 14 * s} ${cx},${cy + 7 * s} ${cx - 9 * s},${cy + 14 * s} ${cx - 6 * s},${cy + 3 * s} ${cx - 14 * s},${cy - 4 * s} ${cx - 4 * s},${cy - 4 * s}`}
        fill={gold}
        opacity={unlocked ? 0.9 : 0.42}
        stroke={silver}
        strokeWidth={1}
      />
      <Path
        d={`M ${cx - 10 * s} ${cy + 18 * s} H ${cx + 10 * s}`}
        stroke={silver}
        strokeOpacity={unlocked ? 0.4 : 0.2}
        strokeWidth={1}
      />
    </G>
  );
}
