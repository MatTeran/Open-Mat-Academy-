import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type {
  TechniqueFilterId,
  TechniquesInsight,
} from '../../types/trainingInsights';
import { filterTechniquesByCategory } from '../../utils/trainingInsights';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';
import { InsightsEmptyState } from './InsightsEmptyState';
import { RankedBarList } from './RankedBarList';

const DASHBOARD_FILTERS: Array<{
  value: TechniqueFilterId;
  label: string;
}> = [
  { value: 'all', label: 'All' },
  { value: 'submission', label: 'Submissions' },
  { value: 'sweep', label: 'Sweeps' },
  { value: 'takedown', label: 'Takedowns' },
  { value: 'escape', label: 'Escapes' },
  { value: 'position', label: 'Positions' },
  { value: 'guard', label: 'Guards' },
  { value: 'guard_pass', label: 'Passes' },
];

interface YourGameCardProps {
  insight: TechniquesInsight;
  onLogTraining?: () => void;
  onViewAll?: () => void;
  onTechniquePress?: (techniqueId: string) => void;
}

const INITIAL_LIMIT = 5;

export function YourGameCard({
  insight,
  onLogTraining,
  onViewAll,
  onTechniquePress,
}: YourGameCardProps) {
  const { colors } = useAppTheme();
  const [filter, setFilter] = useState<TechniqueFilterId>('all');
  const fade = useRef(new Animated.Value(1)).current;

  const filtered = useMemo(
    () => filterTechniquesByCategory(insight.techniques, filter),
    [filter, insight.techniques],
  );

  const visible = useMemo(
    () => filtered.slice(0, INITIAL_LIMIT),
    [filtered],
  );

  const showViewAll = Boolean(onViewAll) && insight.techniques.length > 0;

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (!mounted || reduce) {
        fade.setValue(1);
        return;
      }
      fade.setValue(0.35);
      Animated.timing(fade, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    });
    return () => {
      mounted = false;
    };
  }, [fade, filter]);

  const categoryHighlights = insight.highlights.filter((item) => {
    if (filter === 'all') {
      return true;
    }
    return item.category === filter;
  });

  return (
    <Card style={styles.card}>
      <Text variant="subtitle">Your Game</Text>
      <Spacer size="xs" />
      <Text variant="caption" muted>
        Most Used Techniques · Last 30 Days
      </Text>

      <Spacer size="md" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {DASHBOARD_FILTERS.map((option) => {
          const active = filter === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => {
                setFilter(option.value as TechniqueFilterId);
              }}
              style={[
                styles.chip,
                {
                  backgroundColor: active
                    ? colors.goldAccent
                    : colors.elevatedSurface,
                  borderColor: active ? colors.goldAccent : colors.border,
                },
              ]}
            >
              <Text
                variant="caption"
                style={{
                  color: active ? colors.elevatedSurface : colors.secondaryText,
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {insight.techniques.length === 0 ? (
        <>
          <Spacer size="md" />
          <InsightsEmptyState
            message="Log techniques you practice to discover the techniques shaping your game."
            onLogTraining={onLogTraining}
          />
        </>
      ) : filtered.length === 0 ? (
        <>
          <Spacer size="md" />
          <InsightsEmptyState message="No techniques in this category for the last 30 days." />
        </>
      ) : (
        <>
          <Spacer size="md" />
          <Animated.View
            style={{ opacity: fade }}
            accessible
            accessibilityLabel={insight.accessibilitySummary}
          >
            <RankedBarList
              items={visible.map((technique) => ({
                id: technique.id,
                label: technique.label,
                value: technique.count,
                valueLabel: `${technique.count}`,
              }))}
              onItemPress={onTechniquePress}
            />
          </Animated.View>

          {showViewAll ? (
            <>
              <Spacer size="sm" />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View all techniques"
                onPress={onViewAll}
              >
                <Text
                  variant="caption"
                  style={{ color: colors.goldAccent }}
                >
                  View All Techniques →
                </Text>
              </Pressable>
            </>
          ) : null}

          {categoryHighlights.length > 0 ? (
            <>
              <Spacer size="md" />
              <View style={styles.highlights}>
                {categoryHighlights.map((item) => (
                  <View key={item.category} style={styles.highlightRow}>
                    <Text variant="caption" muted>
                      {item.label}
                    </Text>
                    <Text variant="body">{item.techniqueLabel}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
  },
  chips: {
    gap: spacing.xs,
    paddingRight: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  highlights: {
    gap: spacing.sm,
  },
  highlightRow: {
    gap: 2,
  },
});
