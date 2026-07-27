import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';

interface ProgressInsightCardProps {
  sessionsToInsight: number;
}

export function ProgressInsightCard({
  sessionsToInsight,
}: ProgressInsightCardProps) {
  const { colors } = useAppTheme();

  const message =
    sessionsToInsight > 0
      ? `Log ${sessionsToInsight} more session${sessionsToInsight === 1 ? '' : 's'} this week to unlock intensity insights.`
      : 'Weekly intensity insights unlocked — keep stacking rounds.';

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text variant="caption" gold>
            Performance
          </Text>
          <Text variant="body" style={styles.message}>
            {message}
          </Text>
        </View>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: colors.goldMuted, borderColor: colors.border },
          ]}
        >
          <Ionicons
            name="analytics-outline"
            size={28}
            color={colors.goldAccent}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  message: {
    lineHeight: 22,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
