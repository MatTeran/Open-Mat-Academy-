import { Pressable, StyleSheet, View } from 'react-native';

import { WEEKDAYS } from '../../lib/data/schedule';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { fontFamilies, spacing } from '../../lib/theme';
import type { Weekday } from '../../types/schedule';
import { getWeekDates } from '../../utils/schedule';
import { Text } from '../ui/Text';

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
    <View style={styles.row}>
      {WEEKDAYS.map((day) => {
        const active = day.key === selected;
        const dateNumber = weekDates[day.key].getDate();

        return (
          <Pressable
            key={day.key}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${day.label} ${dateNumber}`}
            onPress={() => onSelect(day.key)}
            style={[
              styles.day,
              active && {
                backgroundColor: colors.goldAccent,
                shadowColor: colors.goldAccent,
                shadowOpacity: 0.28,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 3,
              },
            ]}
          >
            <Text
              variant="caption"
              style={{
                color: active ? colors.cardBackground : colors.secondaryText,
                fontFamily: fontFamilies.medium,
              }}
            >
              {day.short}
            </Text>
            <Text
              style={[
                styles.number,
                {
                  color: active
                    ? colors.cardBackground
                    : day.key === todayKey
                      ? colors.goldAccent
                      : colors.text,
                },
              ]}
            >
              {dateNumber}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  day: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    gap: 4,
  },
  number: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    marginTop: 2,
  },
});
