import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Text } from '../ui/Text';

export function NotificationEmptyState() {
  const { colors } = useAppTheme();

  return (
    <View
      accessibilityRole="summary"
      style={[
        styles.shell,
        {
          backgroundColor: colors.elevatedSurface,
          borderColor: colors.border,
        },
      ]}
    >
      <Text variant="subtitle" style={styles.title}>
        You’re all caught up
      </Text>
      <Text
        variant="bodyMuted"
        style={[styles.body, { color: colors.secondaryText }]}
      >
        Important training updates, achievements, and academy announcements
        will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    fontSize: 20,
  },
  body: {
    lineHeight: 22,
  },
});
