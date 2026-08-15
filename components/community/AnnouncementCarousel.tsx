import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing, w1Shadow } from '../../lib/theme';
import type { CommunityAnnouncement } from '../../types/communityHub';
import { Text } from '../ui/Text';

interface AnnouncementCarouselProps {
  announcements: CommunityAnnouncement[];
  onPressAnnouncement: (announcement: CommunityAnnouncement) => void;
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function AnnouncementCarousel({
  announcements,
  onPressAnnouncement,
}: AnnouncementCarouselProps) {
  const { colors } = useAppTheme();
  const [index, setIndex] = useState(0);
  const width = Dimensions.get('window').width - spacing.lg * 2;
  const scrolling = useRef(false);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / (width + spacing.sm));
    setIndex(Math.max(0, Math.min(announcements.length - 1, next)));
    scrolling.current = false;
  };

  if (announcements.length === 0) {
    return null;
  }

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled={false}
        decelerationRate="fast"
        snapToInterval={width + spacing.sm}
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => {
          scrolling.current = true;
        }}
        onMomentumScrollEnd={onScrollEnd}
        contentContainerStyle={styles.track}
      >
        {announcements.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={`${item.category}: ${item.title}`}
            onPress={() => onPressAnnouncement(item)}
            style={({ pressed }) => [
              styles.card,
              w1Shadow.card,
              { width, opacity: pressed ? 0.94 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] },
            ]}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(12,10,8,0.15)', 'rgba(12,10,8,0.78)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.content}>
              <View style={styles.topRow}>
                <Text variant="caption" style={styles.category}>
                  {item.category}
                </Text>
                {item.priority === 'important' || item.priority === 'urgent' ? (
                  <View style={[styles.priority, { backgroundColor: colors.goldAccent }]}>
                    <Text variant="caption" style={styles.priorityText}>
                      IMPORTANT
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text variant="subtitle" style={styles.headline} numberOfLines={2}>
                {item.title}
              </Text>
              <Text variant="bodyMuted" style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.footer}>
                <Text variant="caption" style={styles.meta}>
                  {item.authorName} · {relativeTime(item.createdAt)}
                </Text>
                <View style={[styles.cta, { backgroundColor: 'rgba(255,252,248,0.18)' }]}>
                  <Text variant="caption" style={styles.ctaText}>
                    View announcement
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {announcements.map((item, i) => (
          <View
            key={item.id}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === index ? colors.goldAccent : colors.border,
                width: i === index ? 16 : 6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  card: {
    height: 220,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.md,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  category: {
    color: 'rgba(255,252,248,0.78)',
    letterSpacing: 1,
    fontSize: 10,
    fontWeight: '700',
  },
  priority: {
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  priorityText: {
    color: '#FFFCF8',
    fontSize: 9,
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  headline: {
    color: '#FFFCF8',
    fontSize: 20,
    lineHeight: 26,
  },
  description: {
    color: 'rgba(255,252,248,0.82)',
  },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  meta: {
    color: 'rgba(255,252,248,0.7)',
    flex: 1,
  },
  cta: {
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  ctaText: {
    color: '#FFFCF8',
    fontWeight: '600',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
