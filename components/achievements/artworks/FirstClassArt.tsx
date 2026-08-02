import { Circle, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/**
 * First Class — production prototype.
 * Tied white belt on black tatami, silver challenge-coin language, engraved 01.
 */
export function FirstClassArt({ cx, cy, s, material, unlocked }: MedalArtProps) {
  const belt = unlocked ? '#F4F1EA' : '#8B9098';
  const beltShade = unlocked ? '#D8D2C4' : '#5E646C';
  const beltHi = unlocked ? '#FFFFFF' : '#A8ADB4';
  const engraving = unlocked ? material.engraving : material.accent;
  const tatami = unlocked ? '#141414' : '#101214';
  const uid = `fc-${Math.round(cx)}-${Math.round(s * 100)}`;

  return (
    <G>
      <Defs>
        <LinearGradient id={`${uid}-belt`} x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={beltHi} />
          <Stop offset="45%" stopColor={belt} />
          <Stop offset="100%" stopColor={beltShade} />
        </LinearGradient>
        <LinearGradient id={`${uid}-knot`} x1="20%" y1="0%" x2="80%" y2="100%">
          <Stop offset="0%" stopColor={beltHi} />
          <Stop offset="55%" stopColor={belt} />
          <Stop offset="100%" stopColor={beltShade} />
        </LinearGradient>
      </Defs>

      {/* Tatami plate */}
      <Circle cx={cx} cy={cy} r={21 * s} fill={tatami} opacity={unlocked ? 0.95 : 0.7} />

      {/* Dense tatami weave */}
      {Array.from({ length: 9 }).map((_, i) => {
        const x = cx - 18 * s + i * 4.5 * s;
        return (
          <Path
            key={`v-${i}`}
            d={`M ${x} ${cy - 17 * s} V ${cy + 15 * s}`}
            stroke={engraving}
            strokeOpacity={0.14 + (i % 2) * 0.04}
            strokeWidth={0.65}
          />
        );
      })}
      {Array.from({ length: 7 }).map((_, i) => {
        const y = cy - 14 * s + i * 4.5 * s;
        return (
          <Path
            key={`h-${i}`}
            d={`M ${cx - 18 * s} ${y} H ${cx + 18 * s}`}
            stroke={engraving}
            strokeOpacity={0.1 + (i % 2) * 0.03}
            strokeWidth={0.65}
          />
        );
      })}

      {/* Soft plate bevel ring */}
      <Circle
        cx={cx}
        cy={cy}
        r={20.2 * s}
        fill="none"
        stroke={material.rimHighlight}
        strokeOpacity={unlocked ? 0.18 : 0.1}
        strokeWidth={1}
      />

      {/* Belt band — raised cloth volume */}
      <Path
        d={`M ${cx - 19 * s} ${cy - 0.5 * s}
          H ${cx + 19 * s}
          V ${cy + 7.5 * s}
          H ${cx - 19 * s}
          Z`}
        fill={`url(#${uid}-belt)`}
      />
      <Path
        d={`M ${cx - 19 * s} ${cy - 0.5 * s} H ${cx + 19 * s}`}
        stroke={beltHi}
        strokeOpacity={unlocked ? 0.55 : 0.2}
        strokeWidth={1.1}
      />
      <Path
        d={`M ${cx - 19 * s} ${cy + 7.5 * s} H ${cx + 19 * s}`}
        stroke="#000000"
        strokeOpacity={0.35}
        strokeWidth={1.1}
      />
      {/* Cloth folds */}
      {[-10, -3, 4, 11].map((x) => (
        <Path
          key={`fold-${x}`}
          d={`M ${cx + x * s} ${cy} V ${cy + 7 * s}`}
          stroke="#000000"
          strokeOpacity={unlocked ? 0.12 : 0.08}
          strokeWidth={0.8}
        />
      ))}

      {/* Raised knot body */}
      <Path
        d={`M ${cx - 8 * s} ${cy - 8 * s}
          Q ${cx} ${cy - 15 * s} ${cx + 8 * s} ${cy - 8 * s}
          L ${cx + 6 * s} ${cy + 1.5 * s}
          Q ${cx} ${cy + 6.5 * s} ${cx - 6 * s} ${cy + 1.5 * s}
          Z`}
        fill={`url(#${uid}-knot)`}
        stroke={beltHi}
        strokeOpacity={unlocked ? 0.4 : 0.18}
        strokeWidth={1}
      />
      {/* Knot center crease */}
      <Path
        d={`M ${cx} ${cy - 11 * s} Q ${cx + 1 * s} ${cy - 2 * s} ${cx} ${cy + 4 * s}`}
        stroke="#000000"
        strokeOpacity={unlocked ? 0.18 : 0.1}
        strokeWidth={1}
        fill="none"
      />

      {/* Falling tails */}
      <Path
        d={`M ${cx - 3.2 * s} ${cy + 3.5 * s}
          Q ${cx - 9 * s} ${cy + 11 * s} ${cx - 12 * s} ${cy + 17 * s}`}
        stroke={`url(#${uid}-belt)`}
        strokeWidth={3.4 * s}
        strokeLinecap="round"
      />
      <Path
        d={`M ${cx + 3.2 * s} ${cy + 3.5 * s}
          Q ${cx + 9 * s} ${cy + 11 * s} ${cx + 12 * s} ${cy + 17 * s}`}
        stroke={`url(#${uid}-belt)`}
        strokeWidth={3.4 * s}
        strokeLinecap="round"
      />
      <Path
        d={`M ${cx - 3.2 * s} ${cy + 3.5 * s}
          Q ${cx - 9 * s} ${cy + 11 * s} ${cx - 12 * s} ${cy + 17 * s}`}
        stroke={beltHi}
        strokeOpacity={unlocked ? 0.35 : 0.12}
        strokeWidth={1}
        fill="none"
      />

      {/* Engraved 01 plate */}
      <Rect
        x={cx + 9 * s}
        y={cy - 18 * s}
        width={11 * s}
        height={8.5 * s}
        rx={1.6}
        fill={unlocked ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.25)'}
        stroke={engraving}
        strokeOpacity={unlocked ? 0.7 : 0.4}
        strokeWidth={0.9}
      />
      <Path
        d={`M ${cx + 11.8 * s} ${cy - 16 * s} V ${cy - 11.2 * s}
          M ${cx + 14.6 * s} ${cy - 16 * s}
          H ${cx + 18 * s}
          V ${cy - 11.2 * s}
          H ${cx + 14.6 * s}
          Z`}
        stroke={unlocked ? materialPalette.brushedSilver : engraving}
        strokeOpacity={unlocked ? 0.9 : 0.5}
        strokeWidth={1}
        fill="none"
      />
    </G>
  );
}
