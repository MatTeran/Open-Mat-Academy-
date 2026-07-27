import { StyleSheet, View } from 'react-native';

import {
  Text,
  beltRankLabel,
  spacing,
  useAppTheme,
  type PromotionHistoryEntry,
} from '@openmat/shared';

interface PromotionTimelineProps {
  entries: PromotionHistoryEntry[];
}

function formatMonthYear(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return date.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });
}

function entryTitle(entry: PromotionHistoryEntry): string {
  if (entry.type === 'belt') {
    return beltRankLabel(entry.belt);
  }
  if (entry.stripe === 0) {
    return beltRankLabel(entry.belt);
  }
  if (entry.stripe === 1) {
    return '1 Stripe';
  }
  return `${entry.stripe} Stripes`;
}

/** Chronological promotion timeline — newest first. */
export function PromotionTimeline({ entries }: PromotionTimelineProps) {
  const { colors } = useAppTheme();

  if (entries.length === 0) {
    return (
      <Text variant="caption" muted>
        No promotion history yet.
      </Text>
    );
  }

  return (
    <View style={styles.list}>
      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1;
        return (
          <View key={entry.id} style={styles.item}>
            <View style={styles.rail}>
              <View
                style={[styles.dot, { backgroundColor: colors.goldAccent }]}
              />
              {!isLast ? (
                <View
                  style={[styles.line, { backgroundColor: colors.border }]}
                />
              ) : null}
            </View>
            <View style={styles.copy}>
              <Text variant="subtitle">{entryTitle(entry)}</Text>
              <Text variant="caption" muted>
                {formatMonthYear(entry.date)} · {entry.coachName}
              </Text>
              {entry.notes ? (
                <Text variant="caption" muted>
                  {entry.notes}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 0,
  },
  item: {
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 64,
  },
  rail: {
    width: 16,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: 2,
  },
  copy: {
    flex: 1,
    gap: 2,
    paddingBottom: spacing.md,
  },
});
