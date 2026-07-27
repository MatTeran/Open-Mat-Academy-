import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '../../lib/theme';
import { Text } from '../ui/Text';

interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View
      accessibilityRole="text"
      style={styles.wrap}
      accessible
      accessibilityLabel={`${title}. ${message}`}
    >
      <Text variant="subtitle">{title}</Text>
      <Text variant="bodyMuted">{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.secondaryBackground,
  },
});
