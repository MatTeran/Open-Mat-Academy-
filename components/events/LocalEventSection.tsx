import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { spacing } from '../../lib/theme';
import type { LocalEvent } from '../../types/localEvents';
import { Text } from '../ui/Text';
import { LocalEventCard } from './LocalEventCard';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface LocalEventSectionProps {
  title: string;
  icon: IconName;
  events: LocalEvent[];
  onPressEvent: (event: LocalEvent) => void;
  onViewAll: () => void;
  emptyMessage: string;
}

const CARD_WIDTH = 268;
const CARD_GAP = spacing.md;

export function LocalEventSection({
  title,
  icon,
  events,
  onPressEvent,
  onViewAll,
  emptyMessage,
}: LocalEventSectionProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name={icon} size={16} color={colors.goldAccent} />
          <Text variant="label" style={{ color: colors.secondaryText }}>
            {title}
          </Text>
        </View>
        {events.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View all ${title.toLowerCase()}`}
            onPress={onViewAll}
            hitSlop={8}
          >
            <Text variant="caption" style={{ color: colors.goldAccent }}>
              View all
            </Text>
          </Pressable>
        ) : null}
      </View>

      {events.length === 0 ? (
        <View
          style={[
            styles.empty,
            {
              backgroundColor: colors.secondaryBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <Text variant="caption" style={{ color: colors.secondaryText }}>
            {emptyMessage}
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + CARD_GAP}
        >
          {events.map((event) => (
            <LocalEventCard
              key={event.id}
              event={event}
              width={CARD_WIDTH}
              onPress={() => onPressEvent(event)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingRight: spacing.xxs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  carousel: {
    gap: CARD_GAP,
    paddingRight: spacing.lg,
  },
  empty: {
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.lg,
    minHeight: 88,
    justifyContent: 'center',
  },
});
