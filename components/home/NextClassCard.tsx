import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import type {
  NextClassReservationStatus,
  NextClassSummary,
} from '../../types/home';
import { formatClassTime, formatShortDate } from '../../utils';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';
import { NextClassActionButton } from './NextClassActionButton';

interface NextClassCardProps {
  nextClass: NextClassSummary;
  reservationStatus: NextClassReservationStatus;
  actionLoading?: boolean;
  xpEarnedLabel?: string | null;
  onPrimaryAction: () => void;
  onOpenDetails?: () => void;
}

function buildClassMetadata(nextClass: NextClassSummary): string {
  const location =
    nextClass.location && nextClass.location !== nextClass.format
      ? nextClass.location
      : nextClass.room &&
          !nextClass.room.toLowerCase().includes((nextClass.format || '').toLowerCase())
        ? nextClass.room
        : 'Tracy';

  const parts = [
    nextClass.coach,
    nextClass.format,
    location,
    `${nextClass.durationMinutes} min`,
  ].filter((value, index, list) => {
    if (!value) {
      return false;
    }
    return list.findIndex((item) => item === value) === index;
  });

  return parts.join(' · ');
}

export function NextClassCard({
  nextClass,
  reservationStatus,
  actionLoading = false,
  xpEarnedLabel,
  onPrimaryAction,
  onOpenDetails,
}: NextClassCardProps) {
  const { colors } = useAppTheme();
  const accent = useRef(new Animated.Value(0.35)).current;
  const xpOpacity = useRef(new Animated.Value(0)).current;
  const xpTranslate = useRef(new Animated.Value(8)).current;
  const metadata = useMemo(() => buildClassMetadata(nextClass), [nextClass]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(accent, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(accent, {
          toValue: 0.35,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [accent]);

  useEffect(() => {
    if (!xpEarnedLabel) {
      xpOpacity.setValue(0);
      xpTranslate.setValue(8);
      return;
    }

    AccessibilityInfo.announceForAccessibility?.(
      `Checked in. ${xpEarnedLabel}`,
    );

    Animated.parallel([
      Animated.timing(xpOpacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(xpTranslate, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [xpEarnedLabel, xpOpacity, xpTranslate]);

  const handleCalendar = async () => {
    const start = encodeURIComponent(nextClass.startsAt);
    const title = encodeURIComponent(nextClass.title);
    const stamp = start.replace(/[-:]/g, '').split('.')[0];
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${stamp}Z/${stamp}Z`;
    try {
      await Linking.openURL(url);
    } catch {
      // Placeholder until native calendar integration.
    }
  };

  const handleDirections = async () => {
    const query = encodeURIComponent(
      `${nextClass.location || 'Tracy'}, Tracy CA`,
    );
    try {
      await Linking.openURL(`https://maps.apple.com/?q=${query}`);
    } catch {
      // Placeholder until maps deep-link preferences land.
    }
  };

  return (
    <Card
      style={{ overflow: 'hidden', backgroundColor: colors.elevatedSurface }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Next class ${nextClass.title}`}
        onPress={onOpenDetails}
        disabled={!onOpenDetails}
      >
        <View style={styles.row}>
          <View style={styles.copy}>
            <Text variant="label" gold>
              Next Class
            </Text>
            <Spacer size="xs" />
            <Text variant="subtitle">{nextClass.title}</Text>
            <Spacer size="xxs" />
            <Text variant="bodyMuted">
              {formatShortDate(nextClass.startsAt)} ·{' '}
              {formatClassTime(nextClass.startsAt)}
            </Text>
            <Spacer size="xs" />
            <Text variant="caption">{metadata}</Text>
          </View>
          <Animated.View
            style={[
              styles.badge,
              { backgroundColor: colors.goldMuted, opacity: accent },
            ]}
          >
            <Text variant="caption" gold style={styles.badgeText}>
              {nextClass.status === 'live' ? 'Live' : 'Soon'}
            </Text>
          </Animated.View>
        </View>
      </Pressable>

      <View style={styles.actionBlock}>
        <NextClassActionButton
          status={reservationStatus}
          classTitle={nextClass.title}
          loading={actionLoading}
          onPress={onPrimaryAction}
        />
      </View>

      {xpEarnedLabel ? (
        <Animated.View
          style={[
            styles.xpRow,
            {
              opacity: xpOpacity,
              transform: [{ translateY: xpTranslate }],
            },
          ]}
        >
          <Text variant="caption" gold>
            {xpEarnedLabel}
          </Text>
        </Animated.View>
      ) : null}

      <View style={styles.secondaryRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add to calendar"
          hitSlop={8}
          onPress={() => {
            void handleCalendar();
          }}
          style={({ pressed }) => [
            styles.secondaryAction,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="calendar-outline"
            size={16}
            color={colors.secondaryText}
          />
          <Text variant="caption">Add to Calendar</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Get directions"
          hitSlop={8}
          onPress={() => {
            void handleDirections();
          }}
          style={({ pressed }) => [
            styles.secondaryAction,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="navigate-outline"
            size={16}
            color={colors.secondaryText}
          />
          <Text variant="caption">Directions</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  badge: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  badgeText: {
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  actionBlock: {
    marginTop: spacing.lg,
    width: '100%',
  },
  xpRow: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.xxs,
  },
  pressed: {
    opacity: 0.75,
  },
});
