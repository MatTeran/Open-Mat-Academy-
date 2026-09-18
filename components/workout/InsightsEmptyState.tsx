import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Text } from '../ui/Text';
import { Spacer } from '../ui/Spacer';

interface InsightsEmptyStateProps {
  message: string;
  onLogTraining?: () => void;
}

export function InsightsEmptyState({
  message,
  onLogTraining,
}: InsightsEmptyStateProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.goldMuted,
          borderColor: colors.border,
        },
      ]}
    >
      <Text variant="bodyMuted" style={styles.message}>
        {message}
      </Text>
      {onLogTraining ? (
        <>
          <Spacer size="sm" />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log Training"
            onPress={onLogTraining}
            hitSlop={6}
          >
            <Text variant="caption" style={{ color: colors.goldAccent }}>
              Log Training
            </Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  message: {
    lineHeight: 20,
  },
});
