import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing, w1Shadow } from '../../lib/theme';
import { Text } from '../ui/Text';

interface LocalEventsDiscoveryCardProps {
  onPress: () => void;
}

export function LocalEventsDiscoveryCard({
  onPress,
}: LocalEventsDiscoveryCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Explore local BJJ events"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        w1Shadow.soft,
        {
          backgroundColor: colors.goldTintSurface,
          borderColor: colors.border,
          opacity: pressed ? 0.94 : 1,
        },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: colors.goldMuted }]}>
        <Ionicons name="compass-outline" size={22} color={colors.goldAccent} />
      </View>
      <View style={styles.copy}>
        <Text variant="caption" style={{ color: colors.goldAccent, letterSpacing: 1 }}>
          DISCOVER LOCAL BJJ
        </Text>
        <Text variant="body" style={{ fontWeight: '600' }}>
          Seminars, tournaments & open mats near you.
        </Text>
        <Text variant="caption" style={{ color: colors.goldAccent }}>
          Explore Local Events →
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radii.xl,
    padding: spacing.md,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
});
