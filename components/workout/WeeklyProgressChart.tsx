import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { spacing } from '../../lib/theme';
import type { WeeklyMetricPoint } from '../../types/workoutMetrics';
import { formatChartHours } from '../../utils/workoutMetrics';
import { Text } from '../ui/Text';

interface WeeklyProgressChartProps {
  points: WeeklyMetricPoint[];
}

const CHART_HEIGHT = 148;
const PAD_LEFT = 8;
const PAD_RIGHT = 36;
const PAD_TOP = 12;
const PAD_BOTTOM = 28;

function buildLinePath(coords: Array<{ x: number; y: number }>): string {
  if (coords.length === 0) {
    return '';
  }
  return coords
    .map((point, index) =>
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`,
    )
    .join(' ');
}

export function WeeklyProgressChart({ points }: WeeklyProgressChartProps) {
  const { colors } = useAppTheme();
  const [width, setWidth] = useState(0);

  const values = points.map((point) => point.matMinutes / 60);
  const maxValue = Math.max(4, ...values, 0.1);

  const yTicks = useMemo(() => {
    const top = Math.ceil(maxValue);
    const mid = Math.round(top / 2);
    return [0, mid, top];
  }, [maxValue]);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const chartWidth = Math.max(width, 1);
  const plotWidth = chartWidth - PAD_LEFT - PAD_RIGHT;
  const plotHeight = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;

  const coords = values.map((value, index) => {
    const x =
      PAD_LEFT +
      (values.length <= 1 ? plotWidth / 2 : (plotWidth * index) / (values.length - 1));
    const y = PAD_TOP + plotHeight - (value / maxValue) * plotHeight;
    return { x, y, value };
  });

  const linePath = buildLinePath(coords);
  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x} ${PAD_TOP + plotHeight} L ${coords[0].x} ${PAD_TOP + plotHeight} Z`
      : '';

  const axisLabels = useMemo(() => {
    const labels: Array<{ index: number; label: string }> = [];
    let lastMonth = '';
    points.forEach((point, index) => {
      if (point.monthLabel !== lastMonth) {
        labels.push({ index, label: point.monthLabel });
        lastMonth = point.monthLabel;
      }
    });
    return labels;
  }, [points]);

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      <View style={styles.header}>
        <Text variant="caption" muted>
          Past 12 weeks
        </Text>
      </View>
      {width > 0 ? (
        <Svg width={chartWidth} height={CHART_HEIGHT}>
          <Defs>
            <LinearGradient id="matFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={colors.goldAccent} stopOpacity={0.35} />
              <Stop offset="100%" stopColor={colors.goldAccent} stopOpacity={0.02} />
            </LinearGradient>
          </Defs>

          {yTicks.map((tick) => {
            const y =
              PAD_TOP + plotHeight - (tick / maxValue) * plotHeight;
            return (
              <SvgText
                key={`y-${tick}`}
                x={chartWidth - 4}
                y={y + 4}
                fill={colors.secondaryText}
                fontSize={10}
                textAnchor="end"
              >
                {formatChartHours(tick * 60)}
              </SvgText>
            );
          })}

          {areaPath ? (
            <Path d={areaPath} fill="url(#matFill)" />
          ) : null}
          {linePath ? (
            <Path
              d={linePath}
              stroke={colors.goldAccent}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {coords.map((point, index) => (
            <Circle
              key={`dot-${index}`}
              cx={point.x}
              cy={point.y}
              r={3.5}
              fill={colors.goldAccent}
              stroke={colors.secondaryBackground}
              strokeWidth={1.5}
            />
          ))}

          {axisLabels.map((item) => {
            const x =
              PAD_LEFT +
              (values.length <= 1
                ? plotWidth / 2
                : (plotWidth * item.index) / (values.length - 1));
            return (
              <SvgText
                key={`${item.label}-${item.index}`}
                x={x}
                y={CHART_HEIGHT - 8}
                fill={colors.secondaryText}
                fontSize={10}
                textAnchor="middle"
              >
                {item.label}
              </SvgText>
            );
          })}
        </Svg>
      ) : (
        <View style={{ height: CHART_HEIGHT }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  header: {
    marginBottom: spacing.xs,
  },
});
