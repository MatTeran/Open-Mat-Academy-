import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Radii } from '../../../lib/theme';
import { SectionLabel } from './SectionLabel';
import { SurfaceCard } from './SurfaceCard';

interface LocalEventsCardProps {
  subtitle?: string;
  onPress: () => void;
}

/**
 * Home discovery card — nearby seminars & tournaments.
 */
export function LocalEventsCard({
  subtitle = 'Seminars & tournaments near Central Valley',
  onPress,
}: LocalEventsCardProps) {
  const { colors } = useAppTheme();

  return (
    <SurfaceCard
      onPress={onPress}
      accessibilityLabel="Local events. Find seminars and tournaments near you"
    >
      <View style={styles.row}>
        <View
          style={[styles.iconWrap, { backgroundColor: colors.goldMuted }]}
        >
          <Ionicons name="compass-outline" size={20} color={colors.goldAccent} />
        </View>

        <View style={styles.copy}>
          <SectionLabel tone="accent">Local Events</SectionLabel>
          <Text style={[styles.title, { color: colors.text }]}>
            Discover nearby
          </Text>
          <Text
            style={[styles.subtitle, { color: colors.secondaryText }]}
            numberOfLines={2}
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
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: w1Radii.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 16,
  },
});
