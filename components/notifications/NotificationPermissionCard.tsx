import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { radii, spacing } from '../../lib/theme';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';

interface NotificationPermissionCardProps {
  loading?: boolean;
  statusMessage?: string | null;
  showOpenSettings?: boolean;
  onEnable: () => void;
  onNotNow: () => void;
  onOpenSettings?: () => void;
}

/**
 * Branded permission prompt — never auto-shown on cold launch.
 */
export function NotificationPermissionCard({
  loading = false,
  statusMessage,
  showOpenSettings = false,
  onEnable,
  onNotNow,
  onOpenSettings,
}: NotificationPermissionCardProps) {
  const { colors } = useAppTheme();

  return (
    <LinearGradient
      colors={['#141414', '#1B1B1B', '#2A2414']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.shell, { borderColor: colors.border }]}
    >
      <Text variant="subtitle" style={styles.title}>
        Stay connected to your training
      </Text>
      <Text
        variant="bodyMuted"
        style={[styles.body, { color: colors.secondaryText }]}
      >
        Get class reminders, waitlist openings, achievement updates, and
        important academy announcements.
      </Text>

      {statusMessage ? (
        <Text
          variant="caption"
          style={[styles.status, { color: colors.goldAccent }]}
        >
          {statusMessage}
        </Text>
      ) : null}

      <View style={styles.actions}>
        {showOpenSettings && onOpenSettings ? (
          <Button
            label="Open Settings"
            variant="primaryGold"
            onPress={onOpenSettings}
            accessibilityLabel="Open device settings for notifications"
          />
        ) : (
          <Button
            label="Enable Notifications"
            variant="primaryGold"
            loading={loading}
            onPress={onEnable}
            accessibilityLabel="Enable push notifications"
          />
        )}
        <Button
          label="Not Now"
          variant="ghost"
          disabled={loading}
          onPress={onNotNow}
          accessibilityLabel="Dismiss notification permission for now"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    fontSize: 20,
  },
  body: {
    lineHeight: 22,
  },
  status: {
    marginTop: spacing.xs,
  },
  actions: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
});
