import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing } from '../../../lib/theme';
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
  status: NextClassSummary['status'],
  reservation: NextClassReservationStatus,
): string {
  if (reservation === 'checked_in') return 'Checked In';
  if (reservation === 'check_in') return 'Check In';
  if (reservation === 'reserved') return 'Reserved';
  if (status === 'live') return 'Live';
  if (status === 'soon') return 'Soon';
  return 'Upcoming';
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

/**
 * Next Class tile — shared vertical zones with Journey for equal height.
 * HEADER → TITLE → META → ACTION FOOTER
 */
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

  return (
    <SurfaceCard
      accessibilityLabel={`Next class ${nextClass.title}`}
      style={styles.card}
    >
      <View style={styles.header}>
        <SectionLabel>Next Class</SectionLabel>
        <StatusChip
          label={statusChipLabel(nextClass.status, reservationStatus)}
        />
      </View>

      <View style={styles.body}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View ${nextClass.title} on schedule`}
          onPress={onOpenDetails}
          disabled={!onOpenDetails}
        >
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {nextClass.title.toUpperCase()}
          </Text>
        </Pressable>

        <View style={styles.metaBlock}>
          <MetaRow
            icon="calendar-outline"
            text={formatClassWhen(nextClass.startsAt)}
          />
          <MetaRow
            icon="location-outline"
            text={`${nextClass.location} · ${nextClass.durationMinutes} min`}
          />
        </View>
      </View>

      <View style={styles.footer}>
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
                : colors.goldTintSurface,
              borderColor: colors.goldAccent,
              opacity: pressed || actionLoading ? 0.85 : 1,
            },
          ]}
        >
          {checkedIn ? (
            <View
              style={[styles.checkIcon, { backgroundColor: colors.goldAccent }]}
            >
              <Ionicons
                name="checkmark"
                size={14}
                color={colors.cardBackground}
              />
            </View>
          ) : null}
          <Text style={[styles.primaryLabel, { color: colors.goldAccent }]}>
            {primaryLabel(reservationStatus, actionLoading)}
          </Text>
          {xpEarnedLabel ? (
            <Text style={[styles.xpLabel, { color: colors.goldAccent }]}>
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
                `https://maps.apple.com/?q=Open+Mat+Academy+${encodeURIComponent(nextClass.location)}`,
              ).catch(() => onOpenDetails?.());
            }}
          />
        </View>
      </View>
    </SurfaceCard>
  );
}

function MetaRow({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.metaRow}>
      <Ionicons name={icon} size={14} color={colors.secondaryText} />
      <Text
        style={[styles.metaText, { color: colors.secondaryText }]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
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
      hitSlop={8}
      style={styles.secondaryAction}
    >
      <Ionicons name={icon} size={13} color={colors.goldAccent} />
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
  body: {
    flexGrow: 1,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    letterSpacing: 0.5,
    lineHeight: 22,
  },
  metaBlock: {
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  footer: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  primaryBtn: {
    minHeight: 44,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
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
    fontSize: 12,
    letterSpacing: 0.8,
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
    minHeight: 32,
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 32,
  },
  secondaryLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
