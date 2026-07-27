import { Pressable, StyleSheet, View } from 'react-native';

import {
  Text,
  radii,
  spacing,
  useAppTheme,
  type Weekday,
} from '@openmat/shared';

import { WEEKDAYS, getWeekDates } from '../../utils/schedule';

interface WeeklyCalendarProps {
  selected: Weekday;
  onSelect: (day: Weekday) => void;
  weekAnchor?: Date;
}

export function WeeklyCalendar({
  selected,
  onSelect,
  weekAnchor = new Date(),
}: WeeklyCalendarProps) {
  const { colors } = useAppTheme();
  const weekDates = getWeekDates(weekAnchor);
  const todayKey = WEEKDAYS.find(
    (day) =>
      weekDates[day.key].toDateString() === new Date().toDateString(),
  )?.key;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.elevatedSurface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <Text variant="label" gold>
          This Week
        </Text>
      </View>
      <View style={styles.row}>
        {WEEKDAYS.map((day) => {
          const active = day.key === selected;
          const isToday = day.key === todayKey;
          const dateNumber = weekDates[day.key].getDate();

          return (
            <Pressable
              key={day.key}
              onPress={() => onSelect(day.key)}
              style={[
                styles.day,
                active && { backgroundColor: colors.goldMuted },
              ]}
            >
              <Text
                variant="caption"
                style={{
                  color: active ? colors.goldAccent : colors.secondaryText,
                  letterSpacing: 0.3,
                }}
              >
                {day.short}
              </Text>
              <Text
                variant="subtitle"
                style={{
                  fontSize: 16,
                  color: active ? colors.goldAccent : colors.text,
                }}
              >
                {dateNumber}
              </Text>
              {isToday && !active ? (
                <View
                  style={[styles.todayDot, { backgroundColor: colors.goldAccent }]}
                />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xxs,
  },
  day: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    gap: 4,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
