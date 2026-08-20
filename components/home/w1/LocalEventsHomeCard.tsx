import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Radii } from '../../../lib/theme';
import type { LocalEvent } from '../../../types/localEvents';
import { SectionLabel } from './SectionLabel';
import { SurfaceCard } from './SurfaceCard';

const fallbackImage = require('../../../assets/home-hero.png');

interface LocalEventsHomeCardProps {
  event: LocalEvent | null;
  loading?: boolean;
  onPressEvent: () => void;
  onViewAll: () => void;
}

export function LocalEventsHomeCard({
  event,
  loading = false,
  onPressEvent,
  onViewAll,
}: LocalEventsHomeCardProps) {
  const { colors } = useAppTheme();
  const [imageFailed, setImageFailed] = useState(false);
  const remoteImage =
    event?.coverImage && !imageFailed ? { uri: event.coverImage } : null;

  return (
    <SurfaceCard
      onPress={event ? onPressEvent : onViewAll}
      accessibilityLabel={
        event
          ? `Local event: ${event.title}`
          : 'Local events near you'
      }
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[styles.iconWrap, { backgroundColor: colors.goldMuted }]}
          >
            <Ionicons
              name="compass-outline"
              size={14}
              color={colors.goldAccent}
            />
          </View>
          <SectionLabel>Local Events</SectionLabel>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View all local events"
          onPress={onViewAll}
          hitSlop={8}
        >
          <Text style={[styles.viewAll, { color: colors.goldAccent }]}>
            View all
          </Text>
        </Pressable>
      </View>

      {loading && !event ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.goldAccent} />
          <Text style={[styles.meta, { color: colors.secondaryText }]}>
            Finding events near you…
          </Text>
        </View>
      ) : event ? (
        <View style={styles.content}>
          <View style={styles.copy}>
            <Text
              style={[styles.title, { color: colors.text }]}
              numberOfLines={2}
            >
              {event.title}
            </Text>
            <Text style={[styles.meta, { color: colors.secondaryText }]}>
              {event.periodLabel}
            </Text>
            <Text
              style={[styles.meta, { color: colors.secondaryText }]}
              numberOfLines={1}
            >
              {event.city}
              {event.country ? `, ${event.country}` : ''}
            </Text>
          </View>
          <Image
            source={remoteImage ?? fallbackImage}
            style={styles.photo}
            resizeMode="cover"
            accessibilityLabel={`${event.title} photo`}
            onError={() => setImageFailed(true)}
          />
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.copy}>
            <Text style={[styles.title, { color: colors.text }]}>
              Discover nearby events
            </Text>
            <Text style={[styles.meta, { color: colors.secondaryText }]}>
              Seminars and tournaments around Tracy
            </Text>
          </View>
          <Image source={fallbackImage} style={styles.photo} />
        </View>
      )}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: w1Radii.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAll: {
    fontFamily: fontFamilies.semibold,
    fontSize: 13,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    lineHeight: 21,
  },
  meta: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  photo: {
    width: 84,
    height: 68,
    borderRadius: 14,
    backgroundColor: 'rgba(154, 103, 53, 0.12)',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 68,
  },
});
