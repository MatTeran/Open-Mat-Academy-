import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type { IntensityInsight } from '../../types/trainingInsights';
import { formatIntensityScore } from '../../utils/trainingInsights';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';
import { InsightsEmptyState } from './InsightsEmptyState';
import { IntensityTrendChart } from './IntensityTrendChart';

interface TrainingIntensityCardProps {
  insight: IntensityInsight;
  onLogTraining?: () => void;
}

export function TrainingIntensityCard({
  insight,
  onLogTraining,
}: TrainingIntensityCardProps) {
  const { colors } = useAppTheme();
  const hasData = insight.average != null;

  return (
    <Card style={styles.card}>
      <Text variant="subtitle">Training Intensity</Text>
      <Spacer size="xs" />
      <Text variant="caption" muted>
        Last 12 weeks
      </Text>

      {!hasData ? (
        <>
          <Spacer size="md" />
          <InsightsEmptyState
            message="Rate your training intensity after each session to see how hard you’ve been training."
            onLogTraining={onLogTraining}
          />
        </>
      ) : (
        <>
          <Spacer size="md" />
          <View
            accessible
            accessibilityRole="text"
            accessibilityLabel={insight.accessibilitySummary}
          >
            <View style={styles.metricRow}>
              <View>
                <Text variant="caption" muted>
                  Average Intensity
                </Text>
                <Text
                  variant="hero"
                  style={[styles.metricValue, { color: colors.text }]}
                >
                  {formatIntensityScore(insight.average!)}
                  <Text variant="subtitle" muted>
                    {' '}
                    / 10
                  </Text>
                </Text>
              </View>
              {insight.band ? (
                <View
                  style={[
                    styles.bandChip,
                    {
                      backgroundColor: colors.goldMuted,
                      borderColor: colors.goldAccent,
                    },
                  ]}
                >
                  <Text
                    variant="caption"
                    style={{ color: colors.goldAccent }}
                  >
                    {insight.band}
                  </Text>
                  <Text variant="caption" muted>
                    Avg. {formatIntensityScore(insight.average!)}
                  </Text>
                </View>
              ) : null}
            </View>
            {insight.vsPreviousPercent != null ? (
              <>
                <Spacer size="xs" />
                <Text
                  variant="caption"
                  style={{
                    color:
                      insight.vsPreviousPercent >= 0
                        ? colors.success
                        : colors.secondaryText,
                  }}
                >
                  {insight.vsPreviousPercent >= 0 ? '+' : ''}
                  {insight.vsPreviousPercent}% vs previous 4 weeks
                </Text>
              </>
            ) : null}
          </View>
          <Spacer size="sm" />
          <IntensityTrendChart points={insight.weeks} />
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  metricValue: {
    fontSize: 34,
    lineHeight: 40,
  },
  bandChip: {
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'flex-end',
    gap: 2,
  },
});
