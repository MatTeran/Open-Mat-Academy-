import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ACADEMY } from '../../lib/constants';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { fontFamilies, spacing } from '../../lib/theme';
import type { ScheduleClass } from '../../types/schedule';
import { formatClock } from '../../utils/schedule';
import { Text } from '../ui/Text';

export interface MyClassItem {
  item: ScheduleClass;
  startsAt: Date;
}

interface MyClassesStripProps {
  classes: MyClassItem[];
  onPressClass: (entry: MyClassItem) => void;
  onCancel: (classId: string) => void;
  onSeeAll: () => void;
}

function whenLabel(startsAt: Date): string {
  const today = new Date();
  const start = new Date(startsAt);
  const sameDay =
    today.toDateString() === start.toDateString();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow = tomorrow.toDateString() === start.toDateString();

  const time = formatClock(
    `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`,
  );

  if (sameDay) {
    return `Today · ${time}`;
  }
  if (isTomorrow) {
    return `Tomorrow · ${time}`;
  }
  return `${start.toLocaleDateString(undefined, { weekday: 'short' })} · ${time}`;
}

export function MyClassesStrip({
  classes,
  onPressClass,
  onCancel,
  onSeeAll,
}: MyClassesStripProps) {
  const { colors } = useAppTheme();

  if (classes.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Text style={[styles.title, { color: colors.goldAccent }]}>
          My classes
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`See all ${classes.length} upcoming reservations`}
          onPress={onSeeAll}
          hitSlop={8}
        >
          <Text variant="caption" style={{ color: colors.secondaryText }}>
            {classes.length} upcoming
          </Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {classes.map((entry) => (
          <Pressable
            key={entry.item.id}
            accessibilityRole="button"
            accessibilityLabel={`${entry.item.title}, reserved`}
            onPress={() => onPressClass(entry)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: colors.goldTintSurface,
                borderColor: 'rgba(154,103,53,0.22)',
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text
              variant="caption"
              style={{
                color: colors.goldAccent,
                fontFamily: fontFamilies.semibold,
              }}
            >
              {whenLabel(entry.startsAt)}
            </Text>
            <Text style={[styles.name, { color: colors.text }]}>
              {entry.item.title}
            </Text>
            <Text variant="caption" style={{ color: colors.secondaryText }}>
              {entry.item.instructor} · {ACADEMY.city.replace(', CA', '')}
            </Text>
            <View style={styles.actions}>
              <View
                style={[styles.badge, { backgroundColor: colors.goldMuted }]}
              >
                <Text
                  variant="caption"
                  style={{
                    color: colors.goldAccent,
                    fontFamily: fontFamilies.semibold,
                    letterSpacing: 0.4,
                    textTransform: 'uppercase',
                    fontSize: 10,
                  }}
                >
                  Reserved
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Cancel ${entry.item.title}`}
                onPress={(event) => {
                  event.stopPropagation?.();
                  onCancel(entry.item.id);
                }}
                hitSlop={8}
              >
                <Text
                  variant="caption"
                  style={{
                    color: colors.goldAccent,
                    fontFamily: fontFamilies.semibold,
                  }}
                >
                  Cancel
                </Text>
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fontFamilies.semibold,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  scroll: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  card: {
    width: 248,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: 2,
  },
  name: {
    fontFamily: fontFamilies.semibold,
    fontSize: 15,
    letterSpacing: -0.2,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
});
