import { Circle, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Open Mat Warrior — crossed belts, tatami, gold rim language, academy seal. */
export function OpenMatWarriorArt({
  cx,
  cy,
  s,
  material,
  unlocked,
}: MedalArtProps) {
  const gold = unlocked ? materialPalette.primaryGold : material.accent;
  const beltA = unlocked ? '#F2F0EA' : '#7A8088';
  const beltB = unlocked ? materialPalette.deepGold : material.rimMid;
  const gun = unlocked ? materialPalette.gunmetalLight : material.rimMid;
  const uid = `omw-${Math.round(cx)}-${Math.round(s * 100)}`;

  return (
    <G>
      <Defs>
        <LinearGradient id={`${uid}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={unlocked ? materialPalette.goldHighlight : material.rimHighlight} />
          <Stop offset="100%" stopColor={gold} />
        </LinearGradient>
      </Defs>

      <Circle cx={cx} cy={cy} r={20.5 * s} fill={materialPalette.obsidian} opacity={unlocked ? 0.7 : 0.45} />

      {/* Tatami weave */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Path
          key={`v-${i}`}
          d={`M ${cx - 16 * s + i * 4.5 * s} ${cy - 16 * s} V ${cy + 16 * s}`}
          stroke={gun}
          strokeOpacity={unlocked ? 0.28 : 0.14}
          strokeWidth={0.7}
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <Path
          key={`h-${i}`}
          d={`M ${cx - 16 * s} ${cy - 16 * s + i * 4.5 * s} H ${cx + 16 * s}`}
          stroke={gun}
          strokeOpacity={unlocked ? 0.22 : 0.12}
          strokeWidth={0.7}
        />
      ))}

      {/* Crossed belts */}
      <Path
        d={`M ${cx - 15 * s} ${cy - 10 * s}
          L ${cx + 15 * s} ${cy + 10 * s}
          L ${cx + 12 * s} ${cy + 14 * s}
          L ${cx - 18 * s} ${cy - 6 * s}
          Z`}
        fill={beltA}
        opacity={unlocked ? 0.95 : 0.5}
      />
      <Path
        d={`M ${cx + 15 * s} ${cy - 10 * s}
          L ${cx - 15 * s} ${cy + 10 * s}
          L ${cx - 12 * s} ${cy + 14 * s}
          L ${cx + 18 * s} ${cy - 6 * s}
          Z`}
        fill={beltB}
        opacity={unlocked ? 0.92 : 0.48}
      />

      {/* Academy seal */}
      <Circle
        cx={cx}
        cy={cy}
        r={6.5 * s}
        fill={materialPalette.obsidian}
        stroke={`url(#${uid}-gold)`}
        strokeWidth={1.5}
        opacity={unlocked ? 0.98 : 0.55}
      />
      <Path
        d={`M ${cx - 3 * s} ${cy + 1.5 * s}
          L ${cx - 1.2 * s} ${cy - 2.5 * s}
          L ${cx} ${cy} 
          L ${cx + 1.2 * s} ${cy - 2.5 * s}
          L ${cx + 3 * s} ${cy + 1.5 * s}`}
        fill="none"
        stroke={gold}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={unlocked ? 0.9 : 0.45}
      />
    </G>
  );
}
