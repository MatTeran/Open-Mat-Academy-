import { StyleSheet, View } from 'react-native';

import type { UpcomingEvent } from '../../types/home';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface UpcomingEventsProps {
  events: UpcomingEvent[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const { colors } = useAppTheme();

  return (
    <View>
      <Text variant="subtitle">Upcoming Events</Text>
      <Spacer size="md" />
      <View style={styles.stack}>
        {events.map((event) => (
          <Card key={event.id}>
            <View style={styles.row}>
              <View
                style={[styles.dateChip, { backgroundColor: colors.goldMuted }]}
              >
                <Text variant="caption" gold style={styles.dateText}>
                  {event.dateLabel}
                </Text>
              </View>
              <View style={styles.copy}>
                <Text variant="body">{event.title}</Text>
                <Text variant="caption">{event.meta}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dateChip: {
    minWidth: 88,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  dateText: {
    textAlign: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});
