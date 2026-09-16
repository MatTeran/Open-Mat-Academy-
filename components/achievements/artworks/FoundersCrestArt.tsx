import { Circle, Defs, G, LinearGradient, Path, Polygon, Stop } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/** Founders Crest — ancient coin aesthetic, My Gi seal, legendary. */
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
  const uid = `fcst-${Math.round(cx)}-${Math.round(s * 100)}`;

  return (
    <G>
      <Defs>
        <LinearGradient id={`${uid}-g`} x1="15%" y1="0%" x2="85%" y2="100%">
          <Stop offset="0%" stopColor={gold} />
          <Stop offset="55%" stopColor={edge} />
          <Stop offset="100%" stopColor={deep} />
        </LinearGradient>
      </Defs>

      <Path
        d={`M ${cx} ${cy - 18 * s}
          L ${cx + 16 * s} ${cy - 6 * s}
          L ${cx + 12 * s} ${cy + 12 * s}
          L ${cx} ${cy + 18 * s}
          L ${cx - 12 * s} ${cy + 12 * s}
          L ${cx - 16 * s} ${cy - 6 * s}
          Z`}
        fill={deep}
        opacity={unlocked ? 0.45 : 0.22}
        stroke={`url(#${uid}-g)`}
        strokeWidth={1.5}
      />

      {/* Ancient ring ticks */}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (Math.PI * 2 * i) / 16;
        return (
          <Path
            key={i}
            d={`M ${cx + Math.cos(a) * 14 * s} ${cy + Math.sin(a) * 14 * s}
              L ${cx + Math.cos(a) * 16.5 * s} ${cy + Math.sin(a) * 16.5 * s}`}
            stroke={gold}
            strokeOpacity={unlocked ? 0.45 : 0.2}
            strokeWidth={0.9}
          />
        );
      })}

      <Polygon
        points={`${cx},${cy - 10 * s} ${cx + 8 * s},${cy} ${cx},${cy + 10 * s} ${cx - 8 * s},${cy}`}
        fill={`url(#${uid}-g)`}
        opacity={unlocked ? 0.95 : 0.42}
      />
      <Circle
        cx={cx}
        cy={cy}
        r={3.2 * s}
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
