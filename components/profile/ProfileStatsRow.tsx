import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Text } from '../ui/Text';

export interface ProfileStatItem {
  value: string;
  label: string;
}

interface ProfileStatsRowProps {
  stats: ProfileStatItem[];
}

export function ProfileStatsRow({ stats }: ProfileStatsRowProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: colors.secondaryBackground,
          borderColor: colors.border,
        },
      ]}
      accessibilityRole="summary"
      accessibilityLabel={stats
        .map((stat) => `${stat.value} ${stat.label}`)
        .join(', ')}
    >
      {stats.map((stat, index) => (
        <View key={stat.label} style={styles.stat}>
          {index > 0 ? (
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
          ) : null}
          <View style={styles.copy}>
            <Text variant="title" style={styles.value}>
              {stat.value}
            </Text>
            <Text variant="caption" muted>
              {stat.label}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: radii.xl,
    borderWidth: 1,
    paddingVertical: spacing.md,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginVertical: spacing.xxs,
  },
  copy: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.xs,
  },
  value: {
    fontSize: 22,
  },
});
