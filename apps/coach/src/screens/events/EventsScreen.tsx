import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  IconBadge,
  Screen,
  Spacer,
  Text,
  spacing,
  useAppTheme,
  type CoachEvent,
  type EventStatus,
  type IconName,
} from '@openmat/shared';

import {
  EmptyState,
  FadeInItem,
  SectionHeader,
  StatusPill,
} from '../../components/ui/Motion';
import { formatLabel } from '../../components/ui/Phase2Controls';
import { usePhase2Data } from '../../lib/providers/Phase2DataProvider';
import type { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'Events'>;

const STATUS_TINT: Record<EventStatus, string> = {
  draft: '#B8B8B8',
  published: '#22C55E',
  cancelled: '#FF4D4D',
  completed: '#38BDF8',
};

export function EventsScreen({ navigation }: Props) {
  const { events } = usePhase2Data();
  const publishedCount = events.filter((item) => item.status === 'published').length;

  return (
    <Screen scroll>
      <Text variant="hero">Events</Text>
      <Text variant="body" muted>
        Seminars, competitions, closures, promotions, and academy gatherings.
      </Text>
      <Spacer size="lg" />
      <Button
        label="Create Event"
        onPress={() => navigation.navigate('EventForm', undefined)}
      />

      <Spacer size="xl" />
      <SectionHeader
        title="Upcoming & Draft Events"
        subtitle={`${publishedCount} published / ${events.length} total`}
      />
      <View style={styles.stack}>
        {events.length === 0 ? (
          <EmptyState
            title="No events yet"
            subtitle="Create an event to start collecting RSVPs."
          />
        ) : (
          events.map((event, index) => (
            <FadeInItem key={event.id} index={index}>
              <EventCard
                event={event}
                onPress={() =>
                  navigation.navigate('EventForm', { eventId: event.id })
                }
              />
            </FadeInItem>
          ))
        )}
      </View>
      <Spacer size="xl" />
    </Screen>
  );
}

function EventCard({
  event,
  onPress,
}: {
  event: CoachEvent;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  const tint = STATUS_TINT[event.status];
  const capacityLabel =
    event.capacity === null ? 'No capacity limit' : `${event.rsvpCount}/${event.capacity} RSVP`;

  return (
    <Card elevated>
      <View style={styles.row}>
        <IconBadge name={'ticket-outline' as IconName} tint={tint} />
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text variant="subtitle" style={styles.flex}>
              {event.title}
            </Text>
            <StatusPill label={event.status} color={tint} />
          </View>
          <Text variant="caption" muted>
            {event.description}
          </Text>
        </View>
      </View>
      <Spacer size="md" />
      <View style={styles.metaRow}>
        <Text variant="caption" gold>
          {formatLabel(event.type)}
        </Text>
        <Text variant="caption" muted>
          {event.location}
        </Text>
        <Text variant="caption" muted>
          {capacityLabel}
        </Text>
        <Text variant="caption" muted>
          {event.waitlistCount} waitlist
        </Text>
      </View>
      <Spacer size="sm" />
      <Text variant="caption" style={{ color: colors.secondaryText }}>
        {event.startAt} - {event.endAt}
      </Text>
      <Spacer size="sm" />
      <Text variant="caption" muted>
        RSVP {event.allowRsvp ? 'enabled' : 'disabled'}
      </Text>
      <Spacer size="md" />
      <Button label="Edit Event" variant="outlineGold" onPress={onPress} />
    </Card>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
