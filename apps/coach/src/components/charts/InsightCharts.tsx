import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { spacing, useAppTheme, type PulseChartPoint } from '@openmat/shared';

interface LineChartProps {
  points: PulseChartPoint[];
  tint: string;
  height?: number;
}

export function LineChart({ points, tint, height = 168 }: LineChartProps) {
  const { colors } = useAppTheme();
  const [width, setWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const geometry = useMemo(() => {
    if (!points.length || width <= 0) return null;
    const padX = 8;
    const padTop = 12;
    const padBottom = 28;
    const chartW = Math.max(width - padX * 2, 1);
    const chartH = Math.max(height - padTop - padBottom, 1);
    const values = points.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = Math.max(max - min, 1);

    const coords = points.map((point, index) => {
      const x =
        padX +
        (points.length === 1 ? chartW / 2 : (index / (points.length - 1)) * chartW);
      const y = padTop + chartH - ((point.value - min) / span) * chartH;
      return { x, y, label: point.label, value: point.value };
    });

    const linePath = coords
      .map((coord, index) => `${index === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`)
      .join(' ');
    const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${
      padTop + chartH
    } L ${coords[0].x} ${padTop + chartH} Z`;

    return { coords, linePath, areaPath, padTop, chartH };
  }, [height, points, width]);

  return (
    <View style={{ height }} onLayout={onLayout}>
      {geometry && width > 0 ? (
        <Svg width={width} height={height}>
          {[0, 0.5, 1].map((ratio) => {
            const y = geometry.padTop + geometry.chartH * (1 - ratio);
            return (
              <Line
                key={ratio}
                x1={8}
                x2={width - 8}
                y1={y}
                y2={y}
                stroke={colors.border}
                strokeWidth={1}
              />
            );
          })}
          <Path d={geometry.areaPath} fill={tint} opacity={0.14} />
          <Path
            d={geometry.linePath}
            stroke={tint}
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {geometry.coords.map((coord) => (
            <Circle
              key={`${coord.label}-${coord.value}`}
              cx={coord.x}
              cy={coord.y}
              r={3.5}
              fill={colors.primaryBackground}
              stroke={tint}
              strokeWidth={2}
            />
          ))}
          {geometry.coords.map((coord, index) => {
            const show =
              points.length <= 8 ||
              index === 0 ||
              index === points.length - 1 ||
              index % 2 === 0;
            if (!show) return null;
            return (
              <SvgText
                key={`label-${coord.label}`}
                x={coord.x}
                y={height - 8}
                fill={colors.secondaryText}
                fontSize={10}
                textAnchor="middle"
              >
                {coord.label}
              </SvgText>
            );
          })}
        </Svg>
      ) : null}
    </View>
  );
}

interface BarChartProps {
  points: PulseChartPoint[];
  tint: string;
  height?: number;
}

export function BarChart({ points, tint, height = 168 }: BarChartProps) {
  const { colors } = useAppTheme();
  const [width, setWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const geometry = useMemo(() => {
    if (!points.length || width <= 0) return null;
    const padX = 4;
    const padTop = 10;
    const padBottom = 28;
    const chartW = Math.max(width - padX * 2, 1);
    const chartH = Math.max(height - padTop - padBottom, 1);
    const max = Math.max(...points.map((point) => Math.abs(point.value)), 1);
    const gap = 8;
    const barWidth = Math.max((chartW - gap * (points.length - 1)) / points.length, 8);

    return points.map((point, index) => {
      const magnitude = Math.abs(point.value) / max;
      const barHeight = Math.max(magnitude * chartH, 4);
      const x = padX + index * (barWidth + gap);
      const y = padTop + chartH - barHeight;
      return {
        ...point,
        x,
        y,
        barWidth,
        barHeight,
        labelY: height - 8,
      };
    });
  }, [height, points, width]);

  return (
    <View style={[styles.chartBox, { height }]} onLayout={onLayout}>
      {geometry && width > 0 ? (
        <Svg width={width} height={height}>
          {geometry.map((bar) => (
            <Rect
              key={bar.label}
              x={bar.x}
              y={bar.y}
              width={bar.barWidth}
              height={bar.barHeight}
              rx={6}
              fill={tint}
              opacity={0.9}
            />
          ))}
          {geometry.map((bar) => (
            <SvgText
              key={`label-${bar.label}`}
              x={bar.x + bar.barWidth / 2}
              y={bar.labelY}
              fill={colors.secondaryText}
              fontSize={10}
              textAnchor="middle"
            >
              {bar.label}
            </SvgText>
          ))}
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chartBox: {
    width: '100%',
  },
  spacer: {
    marginTop: spacing.xs,
  },
});
