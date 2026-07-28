import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type { LocalEvent } from '../../types/localEvents';
import { formatDistanceMiles } from '../../utils/geo';
import { Text } from '../ui/Text';

interface LocalEventCardProps {
  event: LocalEvent;
  onPress: () => void;
  /** Fixed width for horizontal carousels, or full width in lists. */
  width?: number | `${number}%`;
}

/**
 * Flyer-forward event card — large cover image on top, details below.
 */
export function LocalEventCard({
  event,
  onPress,
  width = 268,
}: LocalEventCardProps) {
  const { colors } = useAppTheme();
  const [imageFailed, setImageFailed] = useState(false);
  const showFlyer = Boolean(event.coverImage) && !imageFailed;
  const metaLine = [event.periodLabel, event.city].filter(Boolean).join(' · ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${event.title}, ${formatDistanceMiles(event.distanceMiles)} away`}
      onPress={onPress}
      style={({ pressed }) => [
        { width },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.secondaryBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.flyerWrap,
            { backgroundColor: colors.goldMuted },
          ]}
        >
          {showFlyer ? (
            <Image
              source={{ uri: event.coverImage as string }}
              style={styles.flyer}
              resizeMode="cover"
              accessibilityLabel={`${event.title} flyer`}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <View style={styles.flyerFallback}>
              <Ionicons
                name="image-outline"
                size={36}
                color={colors.goldAccent}
              />
              <Text
                variant="caption"
                style={{ color: colors.secondaryText, marginTop: spacing.xs }}
              >
                Flyer coming soon
              </Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <Text
            variant="subtitle"
            numberOfLines={2}
            style={[styles.title, { color: colors.text }]}
          >
            {event.title}
          </Text>

          <Text
            variant="caption"
            numberOfLines={2}
            style={{ color: colors.secondaryText, marginTop: spacing.xs }}
          >
            {metaLine}
          </Text>

          <View style={styles.footer}>
            <Text variant="caption" style={{ color: colors.goldAccent }}>
              {formatDistanceMiles(event.distanceMiles)}
            </Text>
            <Text variant="caption" style={{ color: colors.secondaryText }}>
              external event
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.985 }],
  },
  card: {
    borderRadius: radii.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  flyerWrap: {
    width: '100%',
    height: 168,
  },
  flyer: {
    width: '100%',
    height: '100%',
  },
  flyerFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    minHeight: 118,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
  },
  footer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
});
