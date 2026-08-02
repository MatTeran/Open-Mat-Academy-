import {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Polygon,
  RadialGradient,
  Stop,
} from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/**
 * Gold Medalist — production prototype.
 * Museum-quality championship medallion: heavy gold, podium, laurel, ruby accent.
 */
export function GoldMedalistArt({
  cx,
  cy,
  s,
  material,
  unlocked,
}: MedalArtProps) {
  const gold = unlocked ? materialPalette.goldHighlight : material.accent;
  const mid = unlocked ? materialPalette.primaryGold : material.rimMid;
  const deep = unlocked ? materialPalette.deepGold : material.rimInner;
  const ruby = unlocked ? materialPalette.ruby : '#4A3036';
  const enamel = unlocked ? materialPalette.obsidian : '#121418';
  const uid = `gm-${Math.round(cx)}-${Math.round(s * 100)}`;

  return (
    <G>
      <Defs>
        <RadialGradient id={`${uid}-face`} cx="35%" cy="30%" r="70%">
          <Stop offset="0%" stopColor={unlocked ? '#3A2A12' : '#1A1C20'} />
          <Stop offset="60%" stopColor={enamel} />
          <Stop offset="100%" stopColor="#050403" />
        </RadialGradient>
        <LinearGradient id={`${uid}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={gold} />
          <Stop offset="48%" stopColor={mid} />
          <Stop offset="100%" stopColor={deep} />
        </LinearGradient>
      </Defs>

      <Circle cx={cx} cy={cy} r={21 * s} fill={`url(#${uid}-face)`} />

      {/* Championship rings */}
      <Circle
        cx={cx}
        cy={cy}
        r={19.8 * s}
        fill="none"
        stroke={`url(#${uid}-gold)`}
        strokeWidth={1.4}
        opacity={unlocked ? 0.85 : 0.4}
      />
      <Circle
        cx={cx}
        cy={cy}
        r={17.6 * s}
        fill="none"
        stroke={gold}
        strokeOpacity={unlocked ? 0.35 : 0.16}
        strokeWidth={0.8}
        strokeDasharray={`${1.2 * s} ${1.6 * s}`}
      />

      {/* Laurel */}
      <Path
        d={`M ${cx - 2.5 * s} ${cy + 15.5 * s}
          Q ${cx - 19 * s} ${cy + 5 * s} ${cx - 16 * s} ${cy - 14 * s}`}
        stroke={`url(#${uid}-gold)`}
        strokeWidth={1.9}
        fill="none"
        opacity={unlocked ? 0.95 : 0.45}
      />
      <Path
        d={`M ${cx + 2.5 * s} ${cy + 15.5 * s}
          Q ${cx + 19 * s} ${cy + 5 * s} ${cx + 16 * s} ${cy - 14 * s}`}
        stroke={`url(#${uid}-gold)`}
        strokeWidth={1.9}
        fill="none"
        opacity={unlocked ? 0.95 : 0.45}
      />
      {[-11, -5, 1, 7].map((y, i) => (
        <Path
          key={`ll-${i}`}
          d={`M ${cx - (10 + i * 0.3) * s} ${cy + y * s}
            q ${-6 * s} ${-2 * s} ${-2 * s} ${-6.5 * s}
            q ${-2.5 * s} ${3.5 * s} ${-1 * s} ${5.5 * s}
            Z`}
          fill={mid}
          opacity={unlocked ? 0.88 : 0.4}
        />
      ))}
      {[-11, -5, 1, 7].map((y, i) => (
        <Path
          key={`lr-${i}`}
          d={`M ${cx + (10 + i * 0.3) * s} ${cy + y * s}
            q ${6 * s} ${-2 * s} ${2 * s} ${-6.5 * s}
            q ${2.5 * s} ${3.5 * s} ${1 * s} ${5.5 * s}
            Z`}
          fill={mid}
          opacity={unlocked ? 0.88 : 0.4}
        />
      ))}

      {/* Raised podium */}
      <Path
        d={`M ${cx - 13 * s} ${cy + 9 * s}
          H ${cx - 4.5 * s} V ${cy + 1.5 * s}
          H ${cx + 4.5 * s} V ${cy - 5 * s}
          H ${cx + 13 * s} V ${cy + 9 * s} Z`}
        fill={deep}
        stroke={gold}
        strokeWidth={1.1}
        opacity={unlocked ? 0.95 : 0.5}
      />
      {/* Step highlights */}
      <Path
        d={`M ${cx - 4.5 * s} ${cy + 1.5 * s} H ${cx + 4.5 * s}`}
        stroke={gold}
        strokeOpacity={unlocked ? 0.45 : 0.2}
        strokeWidth={0.8}
      />
      <Path
        d={`M ${cx + 4.5 * s} ${cy - 5 * s} H ${cx + 13 * s}`}
        stroke="#FFFFFF"
        strokeOpacity={unlocked ? 0.2 : 0.08}
        strokeWidth={0.8}
      />

      {/* First-place crown mark */}
      <Polygon
        points={`${cx},${cy - 14 * s} ${cx + 5.5 * s},${cy - 4.5 * s} ${cx - 5.5 * s},${cy - 4.5 * s}`}
        fill={`url(#${uid}-gold)`}
        opacity={unlocked ? 0.98 : 0.45}
      />
      <Path
        d={`M ${cx} ${cy - 3 * s} V ${cy + 7.5 * s}`}
        stroke={gold}
        strokeWidth={2.6 * s}
        strokeLinecap="round"
        opacity={unlocked ? 1 : 0.5}
      />

      {/* Ruby accent gem */}
      <Circle
        cx={cx}
        cy={cy - 4.2 * s}
        r={2.6 * s}
        fill={ruby}
        stroke={gold}
        strokeWidth={0.9}
        opacity={unlocked ? 0.98 : 0.45}
      />
      <Circle
        cx={cx - 0.7 * s}
        cy={cy - 5 * s}
        r={0.8 * s}
        fill="#FFFFFF"
        opacity={unlocked ? 0.35 : 0.1}
      />
    </G>
  );
}
