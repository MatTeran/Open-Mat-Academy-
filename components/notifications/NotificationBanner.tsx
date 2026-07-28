import { Pressable, StyleSheet, View } from 'react-native';

import type { NotificationCategory } from '../../lib/notifications';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { NotificationCategoryIcon } from './NotificationCard';
import { Text } from '../ui/Text';

interface NotificationBannerProps {
  title: string;
  body: string;
  category: NotificationCategory;
  onPress: () => void;
  onDismiss: () => void;
}

/**
 * Non-blocking foreground banner — not a modal.
 */
export function NotificationBanner({
  title,
  body,
  category,
  onPress,
  onDismiss,
}: NotificationBannerProps) {
  const { colors } = useAppTheme();

  return (
    <View
      pointerEvents="box-none"
      style={styles.overlay}
      accessibilityLiveRegion="polite"
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${body}. Double tap to open.`}
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.elevatedSurface,
              borderColor: colors.goldAccent,
            },
          ]}
        >
          <NotificationCategoryIcon category={category} size={40} />
          <View style={styles.copy}>
            <Text variant="subtitle" numberOfLines={1}>
              {title}
            </Text>
            <Text
              variant="caption"
              numberOfLines={2}
              style={{ color: colors.secondaryText }}
            >
              {body}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss notification banner"
            hitSlop={12}
            onPress={onDismiss}
            style={styles.dismissHit}
          >
            <Text variant="caption" style={{ color: colors.secondaryText }}>
              Close
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 56,
    left: spacing.md,
    right: spacing.md,
    zIndex: 50,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    minHeight: 72,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  dismissHit: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.92,
  },
});
