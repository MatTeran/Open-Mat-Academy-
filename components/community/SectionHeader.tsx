import { Pressable, StyleSheet, View } from 'react-native';

import { spacing } from '../../lib/theme';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text variant="subtitle">{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text variant="caption" gold>
            {actionLabel}
          </Text>
        </Pressable>
      ) : (
        <Spacer size="none" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
});
