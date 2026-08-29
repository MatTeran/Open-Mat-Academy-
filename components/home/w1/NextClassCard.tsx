import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { w1Radii } from '../../../lib/theme';
import type {
  NextClassReservationStatus,
  NextClassSummary,
} from '../../../types/home';
import { SectionLabel } from './SectionLabel';
import { StatusChip } from './StatusChip';
import { SurfaceCard } from './SurfaceCard';
import { TILE, tileType } from './tileLayout';

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
      return 'Waitlist';
    default:
      return 'Reserve Spot';
  }
}

/**
 * Next Class tile — locked zones match Journey for equal height + type.
 * HEADER → TITLE → META → FOOTER
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
      padded={false}
      style={styles.card}
    >
      <View style={styles.inner}>
        <View style={tileType.header}>
          <SectionLabel style={styles.sectionLabel}>Next Class</SectionLabel>
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
            style={styles.titleSlot}
          >
            <Text
              style={[tileType.title, { color: colors.text }]}
              numberOfLines={TILE.titleMaxLines}
              adjustsFontSizeToFit
              minimumFontScale={0.82}
            >
              {nextClass.title}
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

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
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
                style={[
                  styles.checkIcon,
                  { backgroundColor: colors.goldAccent },
                ]}
              >
                <Ionicons
                  name="checkmark"
                  size={12}
                  color={colors.cardBackground}
                />
              </View>
            ) : null}
            <Text style={[tileType.cta, { color: colors.goldAccent }]}>
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
        style={[tileType.meta, styles.metaText, { color: colors.secondaryText }]}
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
      <Ionicons name={icon} size={12} color={colors.goldAccent} />
      <Text
        style={[tileType.secondary, { color: colors.secondaryText }]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: TILE.height,
    minHeight: TILE.height,
  },
  inner: {
    flex: 1,
    padding: TILE.pad,
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
  },
  body: {
    flex: 1,
    marginTop: 10,
    gap: TILE.bodyGap,
    justifyContent: 'flex-start',
  },
  titleSlot: {
    minHeight: TILE.titleLineHeight * TILE.titleMaxLines,
    justifyContent: 'center',
  },
  metaBlock: {
    gap: TILE.metaGap,
    minHeight: TILE.metaLineHeight * 2 + TILE.metaGap,
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    flex: 1,
    minWidth: 0,
  },
  footer: {
    height: TILE.footerHeight,
    justifyContent: 'flex-end',
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
  },
  primaryBtn: {
    height: TILE.btnHeight,
    borderRadius: w1Radii.control,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
  },
  checkIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpLabel: {
    fontFamily: tileType.meta.fontFamily,
    fontSize: 10,
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: TILE.secondaryHeight,
    gap: 12,
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
    minWidth: 0,
  },
});
