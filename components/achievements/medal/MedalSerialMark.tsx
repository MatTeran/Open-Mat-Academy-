import { G, Path, Text as SvgText } from 'react-native-svg';

type Props = {
  cx: number;
  cy: number;
  s: number;
  color: string;
  unlocked: boolean;
  /** e.g. OM-2026 */
  serial?: string;
  /** e.g. #0001 — only when size is large enough (detail view). */
  edition?: string;
  showDetail?: boolean;
};

/** Tiny Open Mat mark + optional serial — readable mostly in detail view. */
export function MedalSerialMark({
  cx,
  cy,
  s,
  color,
  unlocked,
  serial = 'OM-2026',
  edition = '#0001',
  showDetail = false,
}: Props) {
  const opacity = unlocked ? (showDetail ? 0.55 : 0.28) : 0.16;

  return (
    <G opacity={opacity}>
      {/* Tiny OM monogram */}
      <Path
        d={`M ${cx - 4.5 * s} ${cy + 20 * s}
          L ${cx - 2.2 * s} ${cy + 16.5 * s}
          L ${cx} ${cy + 19.2 * s}
          L ${cx + 2.2 * s} ${cy + 16.5 * s}
          L ${cx + 4.5 * s} ${cy + 20 * s}`}
        fill="none"
        stroke={color}
        strokeWidth={0.85}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showDetail ? (
        <>
          <SvgText
            x={cx}
            y={cy + 24.5 * s}
            fill={color}
            fontSize={3.6 * s}
            fontWeight="600"
            textAnchor="middle"
            letterSpacing={0.6}
          >
            {serial}
          </SvgText>
          <SvgText
            x={cx}
            y={cy + 28.2 * s}
            fill={color}
            fontSize={3.2 * s}
            fontWeight="500"
            textAnchor="middle"
            letterSpacing={0.4}
          >
            {edition}
          </SvgText>
        </>
      ) : null}
    </G>
  );
}
