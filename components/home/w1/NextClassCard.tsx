import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Radii } from '../../../lib/theme';
import type {
  NextClassReservationStatus,
  NextClassSummary,
} from '../../../types/home';
import { SectionLabel } from './SectionLabel';
import { StatusChip } from './StatusChip';
import { SurfaceCard } from './SurfaceCard';

interface NextClassCardProps {
  nextClass: NextClassSummary;
  reservationStatus: NextClassReservationStatus;
  actionLoading?: boolean;
  xpEarnedLabel?: string | null;
  onPrimaryAction: () => void;
  onOpenDetails?: () => void;
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Compact relative timing for the status chip. */
function relativeTimingLabel(iso: string, now = new Date()): string {
  const start = new Date(iso);
  if (Number.isNaN(start.getTime())) {
    return 'Upcoming';
  }
  const dayDiff = Math.round(
    (startOfLocalDay(start).getTime() - startOfLocalDay(now).getTime()) /
      (24 * 60 * 60 * 1000),
  );
  if (dayDiff <= 0) return 'Today';
  if (dayDiff === 1) return 'Tomorrow';
  if (dayDiff <= 6) return `${dayDiff} Days`;
  return start.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

function formatClassWhen(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function statusChipLabel(
  nextClass: NextClassSummary,
  reservation: NextClassReservationStatus,
): string {
  if (reservation === 'checked_in') return 'Checked In';
  if (reservation === 'check_in') return 'Check In';
  if (reservation === 'reserved') return 'Reserved';
  if (nextClass.status === 'live') return 'Live';
  return relativeTimingLabel(nextClass.startsAt);
}

function primaryLabel(
  reservation: NextClassReservationStatus,
  loading?: boolean,
): string {
  if (loading) return 'Working…';
  switch (reservation) {
    case 'available':
      return 'Reserve Spot';
    case 'reserved':
      return 'Reserved';
    case 'check_in':
      return 'Check In';
    case 'checked_in':
      return 'Checked In';
    case 'class_full':
      return 'Join Waitlist';
    default:
      return 'Reserve Spot';
  }
}

export function NextClassCard({
  nextClass,
  reservationStatus,
  actionLoading,
  xpEarnedLabel,
  onPrimaryAction,
  onOpenDetails,
}: NextClassCardProps) {
  const { colors } = useAppTheme();
  const checkedIn = reservationStatus === 'checked_in';
  const disabled =
    actionLoading ||
    reservationStatus === 'reserved' ||
    reservationStatus === 'checked_in';

  const mapsQuery = encodeURIComponent(
    `My Gi ${nextClass.location || 'Central Valley'} California`,
  );

  return (
    <SurfaceCard
      accessibilityLabel={`Next class ${nextClass.title}`}
      style={styles.card}
    >
      <View style={styles.header}>
        <SectionLabel tone="accent">Next Class</SectionLabel>
        <StatusChip
          label={statusChipLabel(nextClass, reservationStatus)}
        />
      </View>

      <View style={styles.primaryZone}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {nextClass.title.toUpperCase()}
        </Text>

        <View style={styles.metaBlock}>
          <Text
            style={[styles.metaPrimary, { color: colors.secondaryText }]}
            numberOfLines={1}
          >
            {formatClassWhen(nextClass.startsAt)}
          </Text>
          <Text
            style={[styles.metaSecondary, { color: colors.secondaryText }]}
            numberOfLines={1}
          >
            {`${nextClass.durationMinutes} min`}
            {nextClass.location ? ` · ${nextClass.location}` : ''}
          </Text>
        </View>
      </View>

      <View style={styles.actionZone}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={onPrimaryAction}
          style={({ pressed }) => [
            styles.primaryBtn,
            {
              backgroundColor: checkedIn
                ? colors.goldMuted
                : colors.goldAccent,
              opacity: pressed || actionLoading ? 0.88 : 1,
            },
          ]}
        >
          {checkedIn ? (
            <View
              style={[
                styles.checkIcon,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              <Ionicons name="checkmark" size={14} color={colors.goldAccent} />
            </View>
          ) : null}
          <Text
            style={[
              styles.primaryLabel,
              {
                color: checkedIn ? colors.goldAccent : colors.cardBackground,
              },
            ]}
          >
            {primaryLabel(reservationStatus, actionLoading)}
          </Text>
          {xpEarnedLabel ? (
            <Text
              style={[
                styles.xpLabel,
                {
                  color: checkedIn ? colors.goldAccent : colors.cardBackground,
                },
              ]}
            >
              {xpEarnedLabel}
            </Text>
          ) : null}
        </Pressable>

        <View style={styles.secondaryRow}>
          <SecondaryAction
            icon="calendar-outline"
            label="Calendar"
            onPress={() => {
              void Linking.openURL(
                `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(nextClass.title)}`,
              ).catch(() => onOpenDetails?.());
            }}
          />
          <SecondaryAction
            icon="navigate-outline"
            label="Directions"
            onPress={() => {
              void Linking.openURL(
                `https://maps.apple.com/?q=${mapsQuery}`,
              ).catch(() => onOpenDetails?.());
            }}
          />
        </View>
      </View>
    </SurfaceCard>
  );
}

function SecondaryAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label === 'Calendar' ? 'Add to Calendar' : label}
      onPress={onPress}
      hitSlop={10}
      style={styles.secondaryAction}
    >
      <Ionicons name={icon} size={14} color={colors.goldAccent} />
      <Text style={[styles.secondaryLabel, { color: colors.secondaryText }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 268,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 24,
  },
  primaryZone: {
    gap: spacing.sm,
    marginTop: spacing.sm,
    flexGrow: 1,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    letterSpacing: 0.5,
    lineHeight: 22,
  },
  metaBlock: {
    gap: 4,
  },
  metaPrimary: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  metaSecondary: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  actionZone: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  primaryBtn: {
    minHeight: 44,
    borderRadius: w1Radii.control,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: spacing.sm,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  xpLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingVertical: spacing.xxs,
  },
  secondaryLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
