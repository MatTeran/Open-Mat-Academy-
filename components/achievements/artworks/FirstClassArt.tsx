import { Circle, G, Path, Rect } from 'react-native-svg';

import type { MedalMaterial } from '../../../lib/achievements/materials';

/** Raised white belt knot + mat grid + engraved 01. */
export function FirstClassArt({
  cx,
  cy,
  s,
  material,
  unlocked,
}: {
  cx: number;
  cy: number;
  s: number;
  material: MedalMaterial;
  unlocked: boolean;
}) {
  const belt = unlocked ? '#F2F0EA' : '#8B9098';
  const knot = unlocked ? '#E7E2D6' : '#6E747C';
  const engraving = unlocked ? material.rimMid : material.accent;

  return (
    <G>
      {/* Mat grid texture */}
      {[-2, -1, 0, 1, 2].map((i) => (
        <Path
          key={`v-${i}`}
          d={`M ${cx + i * 7 * s} ${cy - 18 * s} V ${cy + 14 * s}`}
          stroke={engraving}
          strokeOpacity={0.18}
          strokeWidth={0.8}
        />
      ))}
      {[-2, -1, 0, 1].map((i) => (
        <Path
          key={`h-${i}`}
          d={`M ${cx - 16 * s} ${cy + i * 6 * s} H ${cx + 16 * s}`}
          stroke={engraving}
          strokeOpacity={0.14}
          strokeWidth={0.8}
        />
      ))}

      {/* Belt band */}
      <Path
        d={`M ${cx - 20 * s} ${cy - 1 * s}
          H ${cx + 20 * s}
          V ${cy + 7 * s}
          H ${cx - 20 * s}
          Z`}
        fill={belt}
        opacity={0.95}
      />
      <Path
        d={`M ${cx - 20 * s} ${cy - 1 * s} H ${cx + 20 * s}`}
        stroke="#FFFFFF"
        strokeOpacity={unlocked ? 0.35 : 0.12}
        strokeWidth={1}
      />
      <Path
        d={`M ${cx - 20 * s} ${cy + 7 * s} H ${cx + 20 * s}`}
        stroke="#000000"
        strokeOpacity={0.28}
        strokeWidth={1}
      />

      {/* Tied knot */}
      <Path
        d={`M ${cx - 7 * s} ${cy - 8 * s}
          Q ${cx} ${cy - 14 * s} ${cx + 7 * s} ${cy - 8 * s}
          L ${cx + 5 * s} ${cy + 2 * s}
          Q ${cx} ${cy + 6 * s} ${cx - 5 * s} ${cy + 2 * s}
          Z`}
        fill={knot}
        stroke={unlocked ? '#FFFFFF' : material.rimHighlight}
        strokeOpacity={0.35}
        strokeWidth={1}
      />
      <Path
        d={`M ${cx - 3 * s} ${cy + 4 * s}
          Q ${cx - 8 * s} ${cy + 12 * s} ${cx - 11 * s} ${cy + 16 * s}
          M ${cx + 3 * s} ${cy + 4 * s}
          Q ${cx + 8 * s} ${cy + 12 * s} ${cx + 11 * s} ${cy + 16 * s}`}
        stroke={belt}
        strokeWidth={3.2 * s}
        strokeLinecap="round"
      />

      {/* Engraved 01 */}
      <Rect
        x={cx + 10 * s}
        y={cy - 18 * s}
        width={10 * s}
        height={8 * s}
        rx={1.5}
        fill="none"
        stroke={engraving}
        strokeOpacity={0.55}
        strokeWidth={0.9}
      />
      <Path
        d={`M ${cx + 12.5 * s} ${cy - 16 * s} V ${cy - 11.5 * s}
          M ${cx + 15.2 * s} ${cy - 16 * s}
          H ${cx + 18 * s}
          V ${cy - 11.5 * s}
          H ${cx + 15.2 * s}
          Z`}
        stroke={engraving}
        strokeOpacity={0.7}
        strokeWidth={0.9}
        fill="none"
      />

      <Circle
        cx={cx}
        cy={cy}
        r={22 * s}
        fill="none"
        stroke={material.rimHighlight}
        strokeOpacity={0.12}
        strokeWidth={1}
      />
    </G>
  );
}
