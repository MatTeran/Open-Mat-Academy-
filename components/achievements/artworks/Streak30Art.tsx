import { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/**
 * 30-Day Streak — production prototype.
 * Hexagonal obsidian plate, molten layered metallic flame.
 */
export function Streak30Art({ cx, cy, s, material, unlocked }: MedalArtProps) {
  const metal = unlocked ? materialPalette.primaryGold : material.rimMid;
  const molten = unlocked ? materialPalette.amberEnamel : material.accent;
  const core = unlocked ? materialPalette.goldHighlight : material.rimHighlight;
  const crimson = unlocked ? materialPalette.crimsonEnamel : material.rimInner;
  const uid = `s30-${Math.round(cx)}-${Math.round(s * 100)}`;

  const hex = (r: number) => {
    const pts = Array.from({ length: 6 }).map((_, i) => {
      const a = (Math.PI / 180) * (60 * i - 30);
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    });
    return `M ${pts.join(' L ')} Z`;
  };

  return (
    <G>
      <Defs>
        <LinearGradient id={`${uid}-flame`} x1="30%" y1="100%" x2="70%" y2="0%">
          <Stop offset="0%" stopColor={crimson} />
          <Stop offset="45%" stopColor={molten} />
          <Stop offset="100%" stopColor={core} />
        </LinearGradient>
        <LinearGradient id={`${uid}-metal`} x1="0%" y1="100%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={material.rimInner} />
          <Stop offset="50%" stopColor={metal} />
          <Stop offset="100%" stopColor={core} />
        </LinearGradient>
      </Defs>

      {/* Obsidian hex plate */}
      <Path
        d={hex(19 * s)}
        fill={materialPalette.obsidian}
        opacity={unlocked ? 0.75 : 0.45}
      />
      <Path
        d={hex(19 * s)}
        fill="none"
        stroke={metal}
        strokeOpacity={unlocked ? 0.35 : 0.18}
        strokeWidth={1}
      />

      {/* Diagonal machining hint inside plate */}
      {[-10, -5, 0, 5, 10].map((o) => (
        <Path
          key={o}
          d={`M ${cx - 12 * s + o * s} ${cy - 14 * s}
            L ${cx + 12 * s + o * s} ${cy + 14 * s}`}
          stroke={material.rimHighlight}
          strokeOpacity={unlocked ? 0.07 : 0.04}
          strokeWidth={0.8}
        />
      ))}

      {/* Outer flame metal shell */}
      <Path
        d={`M ${cx} ${cy + 13.5 * s}
          C ${cx - 13 * s} ${cy + 4 * s}, ${cx - 12 * s} ${cy - 8 * s}, ${cx - 1.5 * s} ${cy - 16.5 * s}
          C ${cx - 0.5 * s} ${cy - 8 * s}, ${cx + 7 * s} ${cy - 5 * s}, ${cx + 5.5 * s} ${cy + 2 * s}
          C ${cx + 11 * s} ${cy - 1 * s}, ${cx + 13 * s} ${cy + 7 * s}, ${cx + 8.5 * s} ${cy + 12 * s}
          C ${cx + 5 * s} ${cy + 16 * s}, ${cx + 2 * s} ${cy + 15.5 * s}, ${cx} ${cy + 13.5 * s}
          Z`}
        fill={`url(#${uid}-metal)`}
        opacity={unlocked ? 0.98 : 0.5}
      />

      {/* Amber enamel core */}
      <Path
        d={`M ${cx} ${cy + 11 * s}
          C ${cx - 9 * s} ${cy + 3 * s}, ${cx - 8.5 * s} ${cy - 6 * s}, ${cx} ${cy - 12.5 * s}
          C ${cx + 2.5 * s} ${cy - 5 * s}, ${cx + 7.5 * s} ${cy - 1 * s}, ${cx + 6 * s} ${cy + 5 * s}
          C ${cx + 8.5 * s} ${cy + 2 * s}, ${cx + 8.5 * s} ${cy + 8 * s}, ${cx + 4.5 * s} ${cy + 11 * s}
          C ${cx + 2 * s} ${cy + 13 * s}, ${cx + 1 * s} ${cy + 12 * s}, ${cx} ${cy + 11 * s}
          Z`}
        fill={`url(#${uid}-flame)`}
        opacity={unlocked ? 0.96 : 0.42}
      />

      {/* Hot core highlight */}
      <Path
        d={`M ${cx} ${cy + 6 * s}
          C ${cx - 3 * s} ${cy + 1 * s}, ${cx - 2.5 * s} ${cy - 3 * s}, ${cx} ${cy - 6.5 * s}
          C ${cx + 1.8 * s} ${cy - 2 * s}, ${cx + 2.8 * s} ${cy + 2 * s}, ${cx} ${cy + 6 * s}
          Z`}
        fill={core}
        opacity={unlocked ? 0.95 : 0.3}
      />
      <Path
        d={`M ${cx - 1.2 * s} ${cy - 1 * s}
          Q ${cx} ${cy - 4 * s} ${cx + 0.8 * s} ${cy - 0.5 * s}`}
        stroke="#FFFFFF"
        strokeOpacity={unlocked ? 0.35 : 0.1}
        strokeWidth={0.9}
        fill="none"
      />

      {/* Engraved 30 */}
      <Path
        d={`M ${cx - 7 * s} ${cy + 17.5 * s} H ${cx + 7 * s}`}
        stroke={material.rimHighlight}
        strokeOpacity={unlocked ? 0.4 : 0.18}
        strokeWidth={0.8}
      />
      <Path
        d={`M ${cx - 5 * s} ${cy + 19.5 * s}
          Q ${cx - 5 * s} ${cy + 22 * s} ${cx - 2 * s} ${cy + 22 * s}
          H ${cx + 1 * s}
          M ${cx + 3.5 * s} ${cy + 19.5 * s}
          H ${cx + 6.5 * s}
          V ${cy + 22 * s}
          H ${cx + 3.5 * s}
          Z`}
        stroke={metal}
        strokeOpacity={unlocked ? 0.7 : 0.35}
        strokeWidth={0.9}
        fill="none"
      />
    </G>
  );
}
