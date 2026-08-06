import { Circle, G, Path } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Night Owl — silver crescent, deep navy enamel, engraved stars, owl-eye geometry. */
export function NightOwlArt({ cx, cy, s, material, unlocked }: MedalArtProps) {
  const moon = unlocked ? materialPalette.brushedSilver : material.accent;
  const eye = unlocked ? materialPalette.paleGold : material.rimMid;
  const night = unlocked ? materialPalette.deepNavy : '#121418';

  const stars: Array<[number, number, number]> = [
    [-12, -10, 0.9],
    [10, -12, 0.7],
    [-8, 12, 0.65],
    [13, 6, 0.8],
    [0, -16, 0.55],
  ];

  return (
    <G>
      <Circle cx={cx} cy={cy} r={20.5 * s} fill={night} opacity={unlocked ? 0.9 : 0.55} />

      {/* Engraved stars */}
      {stars.map(([x, y, r], i) => (
        <Circle
          key={i}
          cx={cx + x * s}
          cy={cy + y * s}
          r={r * s}
          fill={moon}
          opacity={unlocked ? 0.55 : 0.25}
        />
      ))}

      {/* Crescent moon */}
      <Path
        d={`M ${cx + 8 * s} ${cy - 13 * s}
          A ${15 * s} ${15 * s} 0 1 0 ${cx + 8 * s} ${cy + 13 * s}
          A ${10.5 * s} ${10.5 * s} 0 1 1 ${cx + 8 * s} ${cy - 13 * s}
          Z`}
        fill={moon}
        opacity={unlocked ? 0.96 : 0.5}
      />
      <Circle
        cx={cx + 4 * s}
        cy={cy - 6 * s}
        r={2.2 * s}
        fill="#FFFFFF"
        opacity={unlocked ? 0.22 : 0.08}
      />

      {/* Minimal owl-eye geometry */}
      <Circle
        cx={cx - 7 * s}
        cy={cy + 7 * s}
        r={3.4 * s}
        fill="none"
        stroke={eye}
        strokeWidth={1.5}
        opacity={unlocked ? 0.92 : 0.45}
      />
      <Circle
        cx={cx + 1.5 * s}
        cy={cy + 7 * s}
        r={3.4 * s}
        fill="none"
        stroke={eye}
        strokeWidth={1.5}
        opacity={unlocked ? 0.92 : 0.45}
      />
      <Circle cx={cx - 7 * s} cy={cy + 7 * s} r={1.15 * s} fill={eye} opacity={unlocked ? 0.95 : 0.4} />
      <Circle cx={cx + 1.5 * s} cy={cy + 7 * s} r={1.15 * s} fill={eye} opacity={unlocked ? 0.95 : 0.4} />
      <Path
        d={`M ${cx - 11 * s} ${cy + 2.5 * s}
          Q ${cx - 2.5 * s} ${cy - 1 * s} ${cx + 5.5 * s} ${cy + 2.5 * s}`}
        stroke={moon}
        strokeWidth={1.15}
        fill="none"
        opacity={unlocked ? 0.45 : 0.22}
      />
    </G>
  );
}
