import { Circle, G, Path } from 'react-native-svg';

import type { EdgeEngraving } from '../../../lib/achievements/meta';

type Props = {
  cx: number;
  cy: number;
  radius: number;
  type: EdgeEngraving;
  color: string;
  unlocked: boolean;
  /** Skip for non-circular shapes that handle their own edge. */
  enabled?: boolean;
};

/** Fine milled-edge detail around circular / near-circular medals. */
export function MedalEdgeEngraving({
  cx,
  cy,
  radius,
  type,
  color,
  unlocked,
  enabled = true,
}: Props) {
  if (!enabled) return null;
  const opacity = unlocked ? 0.55 : 0.28;
  const count =
    type === 'ridges' ? 48 : type === 'dots' ? 36 : type === 'diamond' ? 24 : 28;

  return (
    <G opacity={opacity}>
      {Array.from({ length: count }).map((_, i) => {
        const a = (Math.PI * 2 * i) / count - Math.PI / 2;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const outer = radius + 0.5;
        const inner =
          type === 'diamond'
            ? radius - 2.8
            : type === 'angular'
              ? radius - 2.4
              : type === 'diagonal'
                ? radius - 2.2
                : radius - 1.8;

        if (type === 'dots') {
          return (
            <Circle
              key={i}
              cx={cx + cos * (radius - 1.2)}
              cy={cy + sin * (radius - 1.2)}
              r={0.7}
              fill={color}
            />
          );
        }

        const offset =
          type === 'diagonal' ? 0.35 : type === 'angular' && i % 2 === 0 ? 0.5 : 0;
        const x1 = cx + cos * (inner + offset);
        const y1 = cy + sin * (inner + offset);
        const x2 = cx + cos * outer;
        const y2 = cy + sin * outer;

        return (
          <Path
            key={i}
            d={`M ${x1} ${y1} L ${x2} ${y2}`}
            stroke={color}
            strokeWidth={type === 'diamond' ? 1.15 : 0.85}
            strokeLinecap="round"
          />
        );
      })}
    </G>
  );
}
