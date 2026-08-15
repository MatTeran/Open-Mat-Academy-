import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing, w1Shadow } from '../../lib/theme';
import { Text } from '../ui/Text';

interface CommunityHeaderProps {
  academyName?: string;
  academyLogoUrl?: string | null;
  unreadCount?: number;
  onPressNotifications?: () => void;
  onPressAcademy?: () => void;
}

export function CommunityHeader({
  academyName = 'My Gi',
  academyLogoUrl,
  unreadCount = 0,
  onPressNotifications,
  onPressAcademy,
}: CommunityHeaderProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrap}>
      <View style={styles.copy}>
        <Text variant="hero" style={styles.title}>
          Community
        </Text>
        <Text variant="bodyMuted" style={styles.subtitle}>
          Your academy. What&apos;s happening.
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : 'Notifications'
          }
          onPress={onPressNotifications}
          hitSlop={8}
          style={[
            styles.iconBtn,
            w1Shadow.soft,
            {
              backgroundColor: colors.secondaryBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color={colors.text}
          />
          {unreadCount > 0 ? (
            <View
              style={[styles.badge, { backgroundColor: colors.goldAccent }]}
            />
          ) : null}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${academyName} academy`}
          onPress={onPressAcademy}
          hitSlop={8}
          style={[
            styles.logoBtn,
            w1Shadow.soft,
            {
              backgroundColor: colors.goldMuted,
              borderColor: colors.border,
            },
          ]}
        >
          {academyLogoUrl ? (
            <Image
              source={{ uri: academyLogoUrl }}
              style={styles.logoImage}
              resizeMode="cover"
            />
          ) : (
            <Text
              variant="caption"
              style={{ color: colors.goldAccent, fontWeight: '700' }}
            >
              MG
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
  },
  title: {
    letterSpacing: 0.4,
  },
  subtitle: {
    marginTop: spacing.xxs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: 4,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  logoBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
});
