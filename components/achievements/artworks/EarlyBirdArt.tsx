import { Circle, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Early Bird — embossed sunrise, amber enamel, gold rays, mountain horizon. */
export function EarlyBirdArt({ cx, cy, s, material, unlocked }: MedalArtProps) {
  const ray = unlocked ? materialPalette.goldHighlight : material.accent;
  const sun = unlocked ? materialPalette.primaryGold : material.rimMid;
  const amber = unlocked ? materialPalette.amberEnamel : '#3A3F46';
  const horizon = unlocked ? '#1A1008' : '#121418';
  const uid = `eb-${Math.round(cx)}-${Math.round(s * 100)}`;

  return (
    <G>
      <Defs>
        <LinearGradient id={`${uid}-sky`} x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor={unlocked ? '#3A2210' : '#1A1C20'} />
          <Stop offset="55%" stopColor={amber} stopOpacity={unlocked ? 0.55 : 0.25} />
          <Stop offset="100%" stopColor={horizon} />
        </LinearGradient>
      </Defs>

      <Circle cx={cx} cy={cy} r={20.5 * s} fill={`url(#${uid}-sky)`} />

      {/* Gold rays */}
      {[-75, -50, -30, -12, 0, 12, 30, 50, 75].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = cx + Math.sin(rad) * 5 * s;
        const y1 = cy + 1 * s - Math.cos(rad) * 5 * s;
        const x2 = cx + Math.sin(rad) * 19 * s;
        const y2 = cy + 1 * s - Math.cos(rad) * 19 * s;
        return (
          <Path
            key={deg}
            d={`M ${x1} ${y1} L ${x2} ${y2}`}
            stroke={ray}
            strokeWidth={unlocked ? 2 : 1.4}
            strokeLinecap="round"
            opacity={unlocked ? 0.88 : 0.4}
          />
        );
      })}

      {/* Raised sun disc */}
      <Circle
        cx={cx}
        cy={cy + 1 * s}
        r={8.8 * s}
        fill={sun}
        stroke={material.rimHighlight}
        strokeOpacity={unlocked ? 0.55 : 0.25}
        strokeWidth={1.2}
      />
      <Circle
        cx={cx - 2.4 * s}
        cy={cy - 1.5 * s}
        r={3 * s}
        fill="#FFFFFF"
        opacity={unlocked ? 0.28 : 0.1}
      />

      {/* Mountain silhouette */}
      <Path
        d={`M ${cx - 21 * s} ${cy + 12 * s}
          L ${cx - 12 * s} ${cy + 4 * s}
          L ${cx - 4 * s} ${cy + 9 * s}
          L ${cx + 6 * s} ${cy + 2 * s}
          L ${cx + 14 * s} ${cy + 8 * s}
          L ${cx + 21 * s} ${cy + 5 * s}
          L ${cx + 21 * s} ${cy + 18 * s}
          L ${cx - 21 * s} ${cy + 18 * s}
          Z`}
        fill={horizon}
        opacity={0.95}
      />
      <Path
        d={`M ${cx - 21 * s} ${cy + 12 * s}
          L ${cx - 12 * s} ${cy + 4 * s}
          L ${cx - 4 * s} ${cy + 9 * s}
          L ${cx + 6 * s} ${cy + 2 * s}
          L ${cx + 14 * s} ${cy + 8 * s}
          L ${cx + 21 * s} ${cy + 5 * s}`}
        stroke={ray}
        strokeOpacity={unlocked ? 0.4 : 0.18}
        strokeWidth={1}
        fill="none"
      />
    </G>
  );
}
