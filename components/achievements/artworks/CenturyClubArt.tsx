import { Circle, G, Path, Text as SvgText } from 'react-native-svg';

import type { MedalMaterial } from '../../../lib/achievements/materials';
import { materialPalette } from '../../../lib/achievements/materials';

/** Ceremonial coin — C / 100 + laurel. */
export function CenturyClubArt({
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
  const gold = unlocked ? materialPalette.goldHighlight : material.accent;
  const deep = unlocked ? materialPalette.deepGold : material.rimInner;
  const leaf = unlocked ? materialPalette.primaryGold : material.rimMid;

  return (
    <G>
      <Circle
        cx={cx}
        cy={cy}
        r={21 * s}
        fill={unlocked ? 'rgba(212,175,55,0.12)' : 'rgba(90,97,107,0.12)'}
      />

      {/* Laurel left */}
      <Path
        d={`M ${cx - 4 * s} ${cy + 16 * s}
          Q ${cx - 20 * s} ${cy + 8 * s} ${cx - 18 * s} ${cy - 12 * s}`}
        stroke={leaf}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        opacity={unlocked ? 0.95 : 0.5}
      />
      {[-8, -2, 4, 10].map((y, i) => (
        <Path
          key={`ll-${i}`}
          d={`M ${cx - 12 * s - i} ${cy + y * s}
            q ${-5 * s} ${-3 * s} ${-2 * s} ${-7 * s}`}
          stroke={leaf}
          strokeWidth={1.3}
          fill="none"
          opacity={unlocked ? 0.85 : 0.4}
        />
      ))}

      {/* Laurel right */}
      <Path
        d={`M ${cx + 4 * s} ${cy + 16 * s}
          Q ${cx + 20 * s} ${cy + 8 * s} ${cx + 18 * s} ${cy - 12 * s}`}
        stroke={leaf}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        opacity={unlocked ? 0.95 : 0.5}
      />
      {[-8, -2, 4, 10].map((y, i) => (
        <Path
          key={`lr-${i}`}
          d={`M ${cx + 12 * s + i} ${cy + y * s}
            q ${5 * s} ${-3 * s} ${2 * s} ${-7 * s}`}
          stroke={leaf}
          strokeWidth={1.3}
          fill="none"
          opacity={unlocked ? 0.85 : 0.4}
        />
      ))}

      {/* Central C / 100 */}
      <Circle
        cx={cx}
        cy={cy - 1 * s}
        r={11 * s}
        fill={deep}
        stroke={gold}
        strokeWidth={1.4}
        opacity={unlocked ? 0.95 : 0.55}
      />
      <SvgText
        x={cx}
        y={cy + 4 * s}
        fill={gold}
        fontSize={14 * s}
        fontWeight="700"
        textAnchor="middle"
        opacity={unlocked ? 1 : 0.55}
      >
        C
      </SvgText>
      <SvgText
        x={cx}
        y={cy + 18 * s}
        fill={gold}
        fontSize={6.5 * s}
        fontWeight="600"
        textAnchor="middle"
        letterSpacing={1}
        opacity={unlocked ? 0.85 : 0.45}
      >
        100
      </SvgText>
    </G>
  );
}
