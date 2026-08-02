import { Circle, G, Path } from 'react-native-svg';

import type { MedalArtProps } from './types';

/**
 * Interim embossed Open Mat seal for non-prototype badges.
 * Dimensional shell stays; unique centerpieces land after prototype approval.
 */
export function InterimSealArt({ cx, cy, s, material, unlocked }: MedalArtProps) {
  const stroke = unlocked ? material.engraving : material.accent;
  const fill = unlocked ? material.rimMid : material.rimInner;
  const opacity = unlocked ? 0.9 : 0.55;

  return (
    <G opacity={opacity}>
      <Circle
        cx={cx}
        cy={cy}
        r={16 * s}
        fill="none"
        stroke={stroke}
        strokeWidth={1.3}
        strokeOpacity={0.45}
      />
      <Circle
        cx={cx}
        cy={cy}
        r={11 * s}
        fill={fill}
        fillOpacity={0.35}
        stroke={stroke}
        strokeWidth={1.1}
        strokeOpacity={0.55}
      />
      {/* Embossed OM monogram */}
      <Path
        d={`M ${cx - 7 * s} ${cy + 4 * s}
          L ${cx - 3.5 * s} ${cy - 5 * s}
          L ${cx} ${cy + 1 * s}
          L ${cx + 3.5 * s} ${cy - 5 * s}
          L ${cx + 7 * s} ${cy + 4 * s}`}
        fill="none"
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d={`M ${cx - 5 * s} ${cy + 8 * s} H ${cx + 5 * s}`}
        stroke={stroke}
        strokeOpacity={0.4}
        strokeWidth={0.9}
      />
    </G>
  );
}
