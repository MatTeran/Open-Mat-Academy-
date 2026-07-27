import { StyleSheet, View } from 'react-native';

import type { ActivityItem } from '../../types/home';
import { formatShortDate } from '../../utils';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { spacing } from '../../lib/theme';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface RecentActivityProps {
  items: ActivityItem[];
}

export function RecentActivity({ items }: RecentActivityProps) {
  const { colors } = useAppTheme();

  return (
    <View>
      <Text variant="subtitle">Recent Activity</Text>
      <Spacer size="md" />
      <Card padded={false}>
        {items.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.row,
              index < items.length - 1 && {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View
              style={[styles.dot, { backgroundColor: colors.goldAccent }]}
            />
            <View style={styles.copy}>
              <Text variant="body">{item.title}</Text>
              <Text variant="caption">
                {item.detail} · {formatShortDate(item.occurredAt)}
              </Text>
            </View>
          </View>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});
