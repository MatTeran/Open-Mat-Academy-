import { Pressable, StyleSheet, View } from 'react-native';

import { radii, spacing } from '../../lib/theme';
import type { NotificationCategory } from '../../lib/notifications';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { Text } from '../ui/Text';

const CATEGORY_ICON: Record<
  NotificationCategory,
  { label: string; background: string; foreground: string }
> = {
  training: { label: 'TR', background: '#FFFFFF', foreground: '#0D0D0D' },
  journey: { label: 'JN', background: '#F59E0B', foreground: '#0D0D0D' },
  academy: { label: 'AC', background: '#7C3AED', foreground: '#FFFFFF' },
  competition: { label: 'CP', background: '#DC2626', foreground: '#FFFFFF' },
  recovery: { label: 'RC', background: '#0D9488', foreground: '#FFFFFF' },
};

export function formatRelativeTimestamp(iso: string, now = new Date()): string {
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60_000));
  if (minutes < 1) {
    return 'Just now';
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  if (days === 1) {
    return 'Yesterday';
  }
  if (days < 7) {
    return `${days}d ago`;
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

interface NotificationCategoryIconProps {
  category: NotificationCategory;
  size?: number;
}

export function NotificationCategoryIcon({
  category,
  size = 44,
}: NotificationCategoryIconProps) {
  const tone = CATEGORY_ICON[category];
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.icon,
        {
          width: size,
          height: size,
          borderRadius: radii.md,
          backgroundColor: tone.background,
        },
      ]}
    >
      <Text
        variant="caption"
        style={{
          color: tone.foreground,
          fontWeight: '700',
          fontSize: 12,
          letterSpacing: 0.4,
        }}
      >
        {tone.label}
      </Text>
    </View>
  );
}

interface NotificationCardProps {
  title: string;
  body: string;
  category: NotificationCategory;
  createdAt: string;
  isRead: boolean;
  actionLabel?: string;
  onPress: () => void;
}

export function NotificationCard({
  title,
  body,
  category,
  createdAt,
  isRead,
  actionLabel,
  onPress,
}: NotificationCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${isRead ? '' : 'Unread. '}${title}. ${body}. ${formatRelativeTimestamp(createdAt)}`}
      accessibilityState={{ selected: !isRead }}
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.elevatedSurface,
            borderColor: isRead ? colors.border : colors.goldAccent,
          },
        ]}
      >
        <NotificationCategoryIcon category={category} />
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text variant="subtitle" style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            {!isRead ? (
              <View
                accessibilityLabel="Unread"
                style={[styles.dot, { backgroundColor: colors.goldAccent }]}
              />
            ) : null}
          </View>
          <Text
            variant="caption"
            style={{ color: colors.secondaryText }}
            numberOfLines={3}
          >
            {body}
          </Text>
          <View style={styles.meta}>
            <Text variant="caption" style={{ color: colors.secondaryText }}>
              {formatRelativeTimestamp(createdAt)}
            </Text>
            {actionLabel ? (
              <Text variant="caption" style={{ color: colors.goldAccent }}>
                {actionLabel}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    minHeight: 88,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  meta: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.92,
  },
});
