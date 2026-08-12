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
  const day = date
    .toLocaleDateString(undefined, { weekday: 'short' })
    .toUpperCase();
  const month = date
    .toLocaleDateString(undefined, { month: 'short' })
    .toUpperCase();
  const dayNum = date.getDate();
  const time = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${day}, ${month} ${dayNum} • ${time}`;
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

  const formatChip = nextClass.format.replace(/\s*\/\s*/g, '/');

  return (
    <SurfaceCard
      accessibilityLabel={`Next class ${nextClass.title}`}
      style={styles.card}
      padded={false}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <SectionLabel style={styles.headerLabel}>Next Class</SectionLabel>
          <StatusChip label={formatChip} variant="filled" />
        </View>

        <Text
          style={[styles.title, { color: colors.text }]}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
        >
          {nextClass.title.toUpperCase()}
        </Text>

        <View style={styles.metaBlock}>
          <MetaRow
            icon="calendar-outline"
            text={formatClassWhen(nextClass.startsAt)}
          />
          <MetaRow
            icon="people-outline"
            text={`${nextClass.coach} - ${nextClass.format} - ${nextClass.location} ${nextClass.durationMinutes} MIN`.toUpperCase()}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={onPrimaryAction}
          style={({ pressed }) => [
            styles.primaryBtn,
            {
              backgroundColor: checkedIn
                ? 'rgba(32, 32, 30, 0.05)'
                : colors.goldTintSurface,
              borderColor: 'rgba(32, 32, 30, 0.06)',
              opacity: pressed || actionLoading ? 0.85 : 1,
            },
          ]}
        >
          {checkedIn ? (
            <Ionicons
              name="checkmark"
              size={16}
              color={colors.goldAccent}
            />
          ) : null}
          <Text
            style={[
              styles.primaryLabel,
              { color: checkedIn ? colors.text : colors.goldAccent },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
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
            label="Add to Calendar"
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
                'https://maps.apple.com/?q=Open+Mat+Academy+Tracy+CA',
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
      <Ionicons name={icon} size={12} color={colors.secondaryText} />
      <Text
        style={[styles.metaText, { color: colors.secondaryText }]}
        numberOfLines={2}
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
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      style={styles.secondaryAction}
    >
      <Ionicons name={icon} size={12} color={colors.secondaryText} />
      <Text
        style={[styles.secondaryLabel, { color: colors.secondaryText }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 260,
  },
  inner: {
    flex: 1,
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 8,
  },
  headerLabel: {
    flexShrink: 1,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: 20,
    marginBottom: 10,
  },
  metaBlock: {
    gap: 7,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  metaText: {
    flex: 1,
    minWidth: 0,
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    lineHeight: 15,
  },
  primaryBtn: {
    minHeight: 40,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  primaryLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: 11,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  xpLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 28,
    minWidth: 0,
  },
  secondaryLabel: {
    flexShrink: 1,
    fontFamily: fontFamilies.medium,
    fontSize: 9,
    letterSpacing: 0.35,
    textTransform: 'uppercase',
  },
});
