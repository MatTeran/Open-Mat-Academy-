import { Circle, G, Path } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Technique Scholar — raised notebook / scroll plate for technique logging. */
export function TechniqueScholarArt({
  cx,
  cy,
  s,
  material,
  unlocked,
}: MedalArtProps) {
  const ink = unlocked ? materialPalette.brushedSilver : material.accent;
  const accent = unlocked ? materialPalette.paleGold : material.rimMid;

  return (
    <G>
      <Path
        d={`M ${cx - 12 * s} ${cy - 14 * s}
          H ${cx + 12 * s}
          V ${cy + 14 * s}
          H ${cx - 12 * s}
          Z`}
        fill={unlocked ? 'rgba(197,203,211,0.1)' : 'rgba(90,97,107,0.1)'}
        stroke={ink}
        strokeWidth={1.5}
        opacity={unlocked ? 0.95 : 0.5}
      />
      <Path
        d={`M ${cx - 12 * s} ${cy - 8 * s} H ${cx + 12 * s}`}
        stroke={accent}
        strokeWidth={1.3}
        opacity={unlocked ? 0.75 : 0.35}
      />
      {[-2, 3, 8].map((y) => (
        <Path
          key={y}
          d={`M ${cx - 8 * s} ${cy + y * s} H ${cx + 8 * s}`}
          stroke={ink}
          strokeOpacity={unlocked ? 0.5 : 0.22}
          strokeWidth={1}
        />
      ))}
      <Circle
        cx={cx + 7 * s}
        cy={cy - 11 * s}
        r={2.2 * s}
        fill={accent}
        opacity={unlocked ? 0.9 : 0.4}
      />
    </G>
  );
}
