import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Radii } from '../../../lib/theme';
import type { UpcomingEvent } from '../../../types/home';
import { SectionLabel } from './SectionLabel';
import { SurfaceCard } from './SurfaceCard';

interface AcademyUpcomingEventsProps {
  events: UpcomingEvent[];
  onPressEvent?: (event: UpcomingEvent) => void;
}

export function AcademyUpcomingEvents({
  events,
  onPressEvent,
}: AcademyUpcomingEventsProps) {
  const { colors } = useAppTheme();

  if (events.length === 0) {
    return null;
  }

  return (
    <View>
      <SectionLabel style={styles.sectionLabel}>Upcoming Events</SectionLabel>
      <View style={styles.stack}>
        {events.map((event) => (
          <SurfaceCard
            key={event.id}
            padded={false}
            onPress={
              onPressEvent ? () => onPressEvent(event) : undefined
            }
            accessibilityLabel={`${event.title}. ${event.dateLabel}. ${event.meta}`}
          >
            <View style={styles.row}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: colors.goldMuted },
                ]}
              >
                <Text
                  style={[styles.badgeText, { color: colors.goldAccent }]}
                >
                  {event.dateLabel.toUpperCase()}
                </Text>
              </View>
              <View style={styles.copy}>
                <Text
                  style={[styles.title, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {event.title}
                </Text>
                <Text
                  style={[styles.meta, { color: colors.secondaryText }]}
                  numberOfLines={1}
                >
                  {event.meta}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.secondaryText}
              />
            </View>
          </SurfaceCard>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    marginBottom: spacing.sm,
  },
  stack: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 76,
  },
  badge: {
    minWidth: 72,
    maxWidth: 84,
    borderRadius: w1Radii.control,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    letterSpacing: 0.6,
    textAlign: 'center',
    lineHeight: 13,
  },
  copy: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    lineHeight: 20,
  },
  meta: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    lineHeight: 16,
  },
});
