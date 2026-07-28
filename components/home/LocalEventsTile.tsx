import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Text } from '../ui/Text';

interface LocalEventsTileProps {
  onPress: () => void;
  subtitle?: string;
}

/**
 * Home discovery tile for nearby seminars & tournaments.
 */
export function LocalEventsTile({
  onPress,
  subtitle = 'Find seminars & tournaments near you',
}: LocalEventsTileProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Local seminars and tournaments"
      accessibilityHint="Searches online for BJJ events near your location"
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <View
        style={[
          styles.tile,
          {
            backgroundColor: colors.secondaryBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={[styles.iconWrap, { backgroundColor: colors.goldMuted }]}
        >
          <Ionicons name="compass-outline" size={22} color={colors.goldAccent} />
        </View>

        <View style={styles.copy}>
          <Text variant="caption" style={{ color: colors.goldAccent }}>
            Near you
          </Text>
          <Text variant="subtitle" style={{ color: colors.text }}>
            Local Events
          </Text>
          <Text
            variant="caption"
            numberOfLines={2}
            style={{ color: colors.secondaryText, marginTop: 2 }}
          >
            {subtitle}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.secondaryText}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.92,
  },
  tile: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.xl,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
    minHeight: 88,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
});
