import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing, w1Shadow } from '../../lib/theme';
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';

interface CommunityDetailSheetProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  body?: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  onClose: () => void;
}

/** Lightweight placeholder sheet for Community mock interactions. */
export function CommunityDetailSheet({
  visible,
  title,
  subtitle,
  body,
  primaryLabel = 'Done',
  onPrimary,
  onClose,
}: CommunityDetailSheetProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View
        style={[
          styles.sheet,
          w1Shadow.card,
          {
            backgroundColor: colors.secondaryBackground,
            paddingBottom: Math.max(insets.bottom, spacing.md),
          },
        ]}
      >
        <View style={styles.handleRow}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
            hitSlop={10}
          >
            <Ionicons name="close" size={22} color={colors.secondaryText} />
          </Pressable>
        </View>
        {subtitle ? (
          <Text variant="caption" gold style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
        <Text variant="subtitle" style={styles.title}>
          {title}
        </Text>
        {body ? (
          <Text variant="bodyMuted" style={styles.body}>
            {body}
          </Text>
        ) : null}
        <Button
          label={primaryLabel}
          onPress={() => {
            onPrimary?.();
            onClose();
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(12,10,8,0.45)',
  },
  sheet: {
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  handleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    marginLeft: '42%',
  },
  subtitle: {
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
  },
  body: {
    marginBottom: spacing.md,
    lineHeight: 22,
  },
});
