import { Pressable, View } from 'react-native';

import { WEEKDAYS } from '../../lib/data/schedule';
import { radii, spacing } from '../../lib/theme';
import { useThemedStyles } from '../../lib/theme/useThemedStyles';
import type { Weekday } from '../../types/schedule';
import { getWeekDates } from '../../utils/schedule';
import { Text } from '../ui/Text';

interface WeeklyCalendarProps {
  selected: Weekday;
  onSelect: (day: Weekday) => void;
  weekAnchor?: Date;
  /** Optional filtered class counts shown under each day. */
  classCounts?: Partial<Record<Weekday, number>>;
}

export function WeeklyCalendar({
  selected,
  onSelect,
  weekAnchor = new Date(),
  classCounts,
}: WeeklyCalendarProps) {
  const styles = useThemedStyles((colors) => ({
    card: {
      backgroundColor: colors.secondaryBackground,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      shadowColor: '#000000',
      shadowOpacity: 0.28,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },
    header: {
      paddingHorizontal: spacing.sm,
      marginBottom: spacing.sm,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
    },
    row: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      gap: spacing.xxs,
    },
    day: {
      flex: 1,
      minWidth: 0,
      alignItems: 'center' as const,
      paddingVertical: spacing.sm,
      borderRadius: radii.md,
      gap: 4,
    },
    dayActive: {
      backgroundColor: colors.goldMuted,
    },
    dayLabel: {
      color: colors.secondaryText,
      letterSpacing: 0.3,
    },
    dayLabelActive: {
      color: colors.goldAccent,
    },
    dateNumber: {
      fontSize: 16,
      color: colors.text,
    },
    dateNumberActive: {
      color: colors.goldAccent,
    },
    todayDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.goldAccent,
      marginTop: 2,
    },
    count: {
      color: colors.secondaryText,
      fontSize: 10,
      marginTop: 2,
    },
    countActive: {
      color: colors.goldAccent,
    },
    countEmpty: {
      opacity: 0.35,
    },
  }));

  const weekDates = getWeekDates(weekAnchor);
  const todayKey = WEEKDAYS.find(
    (day) =>
      weekDates[day.key].toDateString() === new Date().toDateString(),
  )?.key;

  const weekTotal = WEEKDAYS.reduce(
    (sum, day) => sum + (classCounts?.[day.key] ?? 0),
    0,
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text variant="label" gold>
          This Week
        </Text>
        {classCounts ? (
          <Text variant="caption">{weekTotal} classes</Text>
        ) : null}
      </View>
      <View style={styles.row}>
        {WEEKDAYS.map((day) => {
          const active = day.key === selected;
          const isToday = day.key === todayKey;
          const dateNumber = weekDates[day.key].getDate();
          const count = classCounts?.[day.key];

          return (
            <Pressable
              key={day.key}
              onPress={() => onSelect(day.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${day.label} ${dateNumber}${
                typeof count === 'number' ? `, ${count} classes` : ''
              }`}
              style={[styles.day, active && styles.dayActive]}
            >
              <Text
                variant="caption"
                style={[styles.dayLabel, active && styles.dayLabelActive]}
              >
                {day.short}
              </Text>
              <Text
                variant="subtitle"
                style={[styles.dateNumber, active && styles.dateNumberActive]}
              >
                {dateNumber}
              </Text>
              {typeof count === 'number' ? (
                <Text
                  variant="caption"
                  style={[
                    styles.count,
                    active && styles.countActive,
                    count === 0 && styles.countEmpty,
                  ]}
                >
                  {count}
                </Text>
              ) : isToday && !active ? (
                <View style={styles.todayDot} />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
