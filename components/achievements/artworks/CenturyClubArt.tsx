import {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { materialPalette } from '../../../lib/achievements/materials';
import type { MedalArtProps } from './types';

/**
 * Century Club — production prototype.
 * Ceremonial coin: Roman C, laurel, deep gold, engraved “100 VERIFIED CLASSES”.
 */
export function CenturyClubArt({ cx, cy, s, material, unlocked }: MedalArtProps) {
  const gold = unlocked ? materialPalette.goldHighlight : material.accent;
  const deep = unlocked ? materialPalette.deepGold : material.rimInner;
  const leaf = unlocked ? materialPalette.primaryGold : material.rimMid;
  const enamel = unlocked ? materialPalette.obsidian : '#121418';
  const uid = `cc-${Math.round(cx)}-${Math.round(s * 100)}`;

  const leafPair = (side: 1 | -1, y: number, i: number) => (
    <Path
      key={`${side}-${i}`}
      d={`M ${cx + side * (11 + i * 0.4) * s} ${cy + y * s}
        q ${side * 6 * s} ${-2.5 * s} ${side * 2.2 * s} ${-7.5 * s}
        q ${side * -3 * s} ${3 * s} ${side * -5.5 * s} ${5 * s}
        Z`}
      fill={leaf}
      opacity={unlocked ? 0.85 - i * 0.08 : 0.4}
      stroke={gold}
      strokeWidth={0.5}
      strokeOpacity={0.35}
    />
  );

  return (
    <G>
      <Defs>
        <LinearGradient id={`${uid}-face`} x1="20%" y1="0%" x2="80%" y2="100%">
          <Stop offset="0%" stopColor={unlocked ? '#3A2A10' : '#1A1C20'} />
          <Stop offset="55%" stopColor={enamel} />
          <Stop offset="100%" stopColor="#050403" />
        </LinearGradient>
        <LinearGradient id={`${uid}-c`} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={gold} />
          <Stop offset="45%" stopColor={leaf} />
          <Stop offset="100%" stopColor={deep} />
        </LinearGradient>
      </Defs>

      <Circle cx={cx} cy={cy} r={21.5 * s} fill={`url(#${uid}-face)`} />

      {/* Double coin ring */}
      <Circle
        cx={cx}
        cy={cy}
        r={19.5 * s}
        fill="none"
        stroke={gold}
        strokeOpacity={unlocked ? 0.45 : 0.22}
        strokeWidth={1.1}
      />
      <Circle
        cx={cx}
        cy={cy}
        r={17.8 * s}
        fill="none"
        stroke={deep}
        strokeOpacity={unlocked ? 0.55 : 0.25}
        strokeWidth={0.8}
      />

      {/* Laurel stems */}
      <Path
        d={`M ${cx - 3 * s} ${cy + 15.5 * s}
          Q ${cx - 19 * s} ${cy + 7 * s} ${cx - 17 * s} ${cy - 13 * s}`}
        stroke={leaf}
        strokeWidth={1.7}
        fill="none"
        strokeLinecap="round"
        opacity={unlocked ? 0.95 : 0.45}
      />
      <Path
        d={`M ${cx + 3 * s} ${cy + 15.5 * s}
          Q ${cx + 19 * s} ${cy + 7 * s} ${cx + 17 * s} ${cy - 13 * s}`}
        stroke={leaf}
        strokeWidth={1.7}
        fill="none"
        strokeLinecap="round"
        opacity={unlocked ? 0.95 : 0.45}
      />

      {[-10, -4, 2, 8].map((y, i) => leafPair(-1, y, i))}
      {[-10, -4, 2, 8].map((y, i) => leafPair(1, y, i))}

      {/* Raised C medallion */}
      <Circle
        cx={cx}
        cy={cy - 1.5 * s}
        r={11.5 * s}
        fill={deep}
        stroke={gold}
        strokeWidth={1.6}
        opacity={unlocked ? 0.98 : 0.55}
      />
      <Circle
        cx={cx - 2.5 * s}
        cy={cy - 4.5 * s}
        r={4 * s}
        fill="#FFFFFF"
        opacity={unlocked ? 0.14 : 0.05}
      />
      <SvgText
        x={cx}
        y={cy + 4 * s}
        fill={`url(#${uid}-c)`}
        fontSize={16 * s}
        fontWeight="700"
        textAnchor="middle"
        opacity={unlocked ? 1 : 0.55}
      >
        C
      </SvgText>

      {/* Engraved banner */}
      <Path
        d={`M ${cx - 16 * s} ${cy + 17.5 * s}
          H ${cx + 16 * s}`}
        stroke={gold}
        strokeOpacity={unlocked ? 0.35 : 0.18}
        strokeWidth={0.7}
      />
      <SvgText
        x={cx}
        y={cy + 21.2 * s}
        fill={gold}
        fontSize={3.4 * s}
        fontWeight="600"
        textAnchor="middle"
        letterSpacing={0.8}
        opacity={unlocked ? 0.8 : 0.4}
      >
        100 VERIFIED CLASSES
      </SvgText>
    </G>
  );
}
