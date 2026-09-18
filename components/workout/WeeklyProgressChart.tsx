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
import type {
  WeeklyMetricPoint,
  WorkoutMetricFilter,
} from '../../types/workoutMetrics';
import { formatChartHours } from '../../utils/workoutMetrics';
import { Text } from '../ui/Text';

interface WeeklyProgressChartProps {
  points: WeeklyMetricPoint[];
  filter: WorkoutMetricFilter;
}

/** Compact chart so the Progress top tile can sit at roughly half height. */
const CHART_HEIGHT = 84;
const PAD_LEFT = 8;
const PAD_RIGHT = 32;
const PAD_TOP = 6;
const PAD_BOTTOM = 18;

/** Distinct No-Gi stroke — cool slate against warm bronze Gi. */
const NO_GI_STROKE = '#5B6B7A';

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

function seriesCoords(
  values: number[],
  maxValue: number,
  plotWidth: number,
  plotHeight: number,
): Array<{ x: number; y: number }> {
  return values.map((value, index) => {
    const x =
      PAD_LEFT +
      (values.length <= 1
        ? plotWidth / 2
        : (plotWidth * index) / (values.length - 1));
    const y = PAD_TOP + plotHeight - (value / maxValue) * plotHeight;
    return { x, y };
  });
}

export function WeeklyProgressChart({
  points,
  filter,
}: WeeklyProgressChartProps) {
  const { colors } = useAppTheme();
  const [width, setWidth] = useState(0);
  const dual = filter === 'all';

  const totalValues = points.map((point) => point.matMinutes / 60);
  const giValues = points.map((point) => point.giMatMinutes / 60);
  const noGiValues = points.map((point) => point.noGiMatMinutes / 60);

  const maxValue = Math.max(
    4,
    ...(dual ? [...giValues, ...noGiValues] : totalValues),
    0.1,
  );

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

  const singleCoords = seriesCoords(
    totalValues,
    maxValue,
    plotWidth,
    plotHeight,
  );
  const giCoords = seriesCoords(giValues, maxValue, plotWidth, plotHeight);
  const noGiCoords = seriesCoords(noGiValues, maxValue, plotWidth, plotHeight);

  const singleLine = buildLinePath(singleCoords);
  const giLine = buildLinePath(giCoords);
  const noGiLine = buildLinePath(noGiCoords);

  const areaPath =
    !dual && singleCoords.length > 0
      ? `${singleLine} L ${singleCoords[singleCoords.length - 1].x} ${PAD_TOP + plotHeight} L ${singleCoords[0].x} ${PAD_TOP + plotHeight} Z`
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

  const pointCount = points.length;

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      <View style={styles.header}>
        <Text variant="caption" muted>
          Past 12 weeks
        </Text>
        {dual ? (
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.swatch, { backgroundColor: colors.goldAccent }]}
              />
              <Text variant="caption" style={{ color: colors.secondaryText }}>
                Gi
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.swatch, { backgroundColor: NO_GI_STROKE }]}
              />
              <Text variant="caption" style={{ color: colors.secondaryText }}>
                No-Gi
              </Text>
            </View>
          </View>
        ) : null}
      </View>
      {width > 0 ? (
        <Svg width={chartWidth} height={CHART_HEIGHT}>
          <Defs>
            <LinearGradient id="matFill" x1="0" y1="0" x2="0" y2="1">
              <Stop
                offset="0%"
                stopColor={colors.goldAccent}
                stopOpacity={0.35}
              />
              <Stop
                offset="100%"
                stopColor={colors.goldAccent}
                stopOpacity={0.02}
              />
            </LinearGradient>
          </Defs>

          {yTicks.map((tick) => {
            const y = PAD_TOP + plotHeight - (tick / maxValue) * plotHeight;
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

          {dual ? (
            <>
              {giLine ? (
                <Path
                  d={giLine}
                  stroke={colors.goldAccent}
                  strokeWidth={2.5}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}
              {noGiLine ? (
                <Path
                  d={noGiLine}
                  stroke={NO_GI_STROKE}
                  strokeWidth={2.5}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}
              {giCoords.map((point, index) => (
                <Circle
                  key={`gi-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r={2.4}
                  fill={colors.goldAccent}
                  stroke={colors.secondaryBackground}
                  strokeWidth={1.2}
                />
              ))}
              {noGiCoords.map((point, index) => (
                <Circle
                  key={`nogi-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r={2.4}
                  fill={NO_GI_STROKE}
                  stroke={colors.secondaryBackground}
                  strokeWidth={1.2}
                />
              ))}
            </>
          ) : (
            <>
              {areaPath ? <Path d={areaPath} fill="url(#matFill)" /> : null}
              {singleLine ? (
                <Path
                  d={singleLine}
                  stroke={colors.goldAccent}
                  strokeWidth={2.5}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}
              {singleCoords.map((point, index) => (
                <Circle
                  key={`dot-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r={2.5}
                  fill={colors.goldAccent}
                  stroke={colors.secondaryBackground}
                  strokeWidth={1.2}
                />
              ))}
            </>
          )}

          {axisLabels.map((item) => {
            const x =
              PAD_LEFT +
              (pointCount <= 1
                ? plotWidth / 2
                : (plotWidth * item.index) / (pointCount - 1));
            return (
              <SvgText
                key={`${item.label}-${item.index}`}
                x={x}
                y={CHART_HEIGHT - 4}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  swatch: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
