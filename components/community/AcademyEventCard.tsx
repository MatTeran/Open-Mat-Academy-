import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing, w1Shadow } from '../../lib/theme';
import type { CommunityAcademyEvent } from '../../types/communityHub';
import { Text } from '../ui/Text';

interface AcademyEventCardProps {
  event: CommunityAcademyEvent;
  onPress: () => void;
}

export function AcademyEventCard({ event, onPress }: AcademyEventCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${event.title} on ${event.dateLabel}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        w1Shadow.soft,
        {
          borderColor: colors.border,
          opacity: pressed ? 0.94 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
      ]}
    >
      <Image
        source={{ uri: event.imageUrl }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(12,10,8,0.1)', 'rgba(12,10,8,0.82)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.datePill, { backgroundColor: 'rgba(255,252,248,0.16)' }]}>
        <Text variant="caption" style={styles.month}>
          {event.monthLabel}
        </Text>
        <Text variant="subtitle" style={styles.day}>
          {event.dayLabel}
        </Text>
      </View>
      <View style={styles.copy}>
        <Text variant="body" style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        {event.coach ? (
          <Text variant="caption" style={styles.meta} numberOfLines={1}>
            {event.coach}
          </Text>
        ) : event.audience ? (
          <Text variant="caption" style={styles.meta} numberOfLines={1}>
            {event.audience}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 168,
    height: 210,
    borderRadius: radii.xl,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: spacing.sm,
  },
  datePill: {
    alignSelf: 'flex-start',
    borderRadius: radii.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  month: {
    color: '#FFFCF8',
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '700',
  },
  day: {
    color: '#FFFCF8',
    fontSize: 18,
    lineHeight: 22,
  },
  copy: {
    gap: 4,
  },
  title: {
    color: '#FFFCF8',
    fontWeight: '700',
  },
  meta: {
    color: 'rgba(255,252,248,0.78)',
  },
});
