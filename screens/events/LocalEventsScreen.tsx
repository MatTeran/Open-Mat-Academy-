import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import {
  Banner,
  Button,
  FadeIn,
  LocalEventCard,
  LocalEventSection,
  Screen,
  Spacer,
  Text,
} from '../../components';
import { useAppTheme } from '../../hooks';
import { spacing } from '../../lib/theme';
import {
  filterLocalEvents,
  getExternalSearchLinks,
  searchLocalEvents,
} from '../../services/events/localEventsSearch';
import type { LocalEvent, LocalEventFilter } from '../../types/localEvents';
import type { HomeStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<HomeStackParamList, 'LocalEvents'>;

type ViewMode = 'browse' | LocalEventFilter;

export function LocalEventsScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('browse');

  const query = useQuery({
    queryKey: ['local-events'],
    queryFn: () => searchLocalEvents({ radiusMiles: 250 }),
  });

  const allEvents = query.data?.events ?? [];
  const seminars = useMemo(
    () => filterLocalEvents(allEvents, 'seminar'),
    [allEvents],
  );
  const tournaments = useMemo(
    () => filterLocalEvents(allEvents, 'tournament'),
    [allEvents],
  );

  const locationLabel = query.data?.location.label ?? 'your area';
  const externalLinks = getExternalSearchLinks(locationLabel);

  const openUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      // Ignore if the device cannot open the URL.
    }
  };

  const openEvent = (event: LocalEvent) => {
    void openUrl(event.url);
  };

  const listEvents =
    viewMode === 'seminar'
      ? seminars
      : viewMode === 'tournament'
        ? tournaments
        : allEvents;

  const listTitle =
    viewMode === 'seminar'
      ? 'Seminars near you'
      : viewMode === 'tournament'
        ? 'Tournaments near you'
        : 'All nearby events';

  return (
    <Screen
      scroll
      contentStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={query.isRefetching}
          onRefresh={() => {
            void query.refetch();
          }}
          tintColor={colors.goldAccent}
        />
      }
    >
      <Button
        label="Back"
        variant="ghost"
        onPress={() => {
          if (viewMode !== 'browse') {
            setViewMode('browse');
            return;
          }
          navigation.goBack();
        }}
      />
      <Spacer size="md" />

      <FadeIn>
        <Text variant="hero">Local Events</Text>
        <Spacer size="sm" />
        <Text variant="bodyMuted">
          Flyers for seminars and tournaments near {locationLabel}.
        </Text>
      </FadeIn>

      <Spacer size="md" />

      {query.data?.usedFallback ? (
        <>
          <Banner
            tone="info"
            message="Location permission is off — showing events near Tracy, CA (My Gi). Enable location for results around you."
          />
          <Spacer size="md" />
        </>
      ) : null}

      {query.isError ? (
        <>
          <Banner message="Could not reach the online events feed. Pull to refresh, or search the web below." />
          <Spacer size="md" />
        </>
      ) : null}

      {query.isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.goldAccent} />
          <Spacer size="sm" />
          <Text variant="caption" style={{ color: colors.secondaryText }}>
            Searching online near {locationLabel}…
          </Text>
        </View>
      ) : viewMode === 'browse' ? (
        <FadeIn delay={40}>
          <LocalEventSection
            title="Seminars near you"
            icon="pricetag-outline"
            events={seminars}
            onPressEvent={openEvent}
            onViewAll={() => setViewMode('seminar')}
            emptyMessage="No seminars found nearby yet. Try Search online below."
          />

          <Spacer size="xl" />

          <LocalEventSection
            title="Tournaments near you"
            icon="trophy-outline"
            events={tournaments}
            onPressEvent={openEvent}
            onViewAll={() => setViewMode('tournament')}
            emptyMessage="No tournaments found nearby yet. Try Search online below."
          />
        </FadeIn>
      ) : (
        <FadeIn delay={40}>
          <Text variant="subtitle">{listTitle}</Text>
          <Spacer size="xs" />
          <Text variant="caption" style={{ color: colors.secondaryText }}>
            {listEvents.length} event{listEvents.length === 1 ? '' : 's'} within
            250 mi
          </Text>
          <Spacer size="md" />
          <View style={styles.fullList}>
            {listEvents.map((event) => (
              <LocalEventCard
                key={event.id}
                event={event}
                width="100%"
                onPress={() => openEvent(event)}
              />
            ))}
          </View>
        </FadeIn>
      )}

      <Spacer size="xl" />
      <Text variant="subtitle">Search online</Text>
      <Spacer size="xs" />
      <Text variant="caption" style={{ color: colors.secondaryText }}>
        Open a broader web search for more seminars and tournaments.
      </Text>
      <Spacer size="sm" />
      <View style={styles.links}>
        {externalLinks.map((link) => (
          <Pressable
            key={link.label}
            onPress={() => {
              void openUrl(link.url);
            }}
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            <View
              style={[
                styles.linkChip,
                {
                  borderColor: colors.goldAccent,
                  backgroundColor: colors.goldMuted,
                },
              ]}
            >
              <Text variant="caption" style={{ color: colors.goldAccent }}>
                {link.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.bottomSpace} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
  },
  loading: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullList: {
    width: '100%',
    gap: spacing.md,
  },
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  linkChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  pressed: {
    opacity: 0.88,
  },
  bottomSpace: {
    height: spacing.xxl,
  },
});
