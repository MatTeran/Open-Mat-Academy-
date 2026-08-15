import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Card, Screen, Spacer, Text } from '../../components';
import { TECHNIQUE_FILTER_OPTIONS } from '../../lib/data/workoutOptions';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { useTechniques } from '../../lib/providers/TechniqueProvider';
import { useWorkouts } from '../../lib/providers/WorkoutProvider';
import { fontFamilies, radii, spacing } from '../../lib/theme';
import type { WorkoutStackParamList } from '../../types/navigation';
import type {
  TechniqueCategory,
  TechniqueListSort,
} from '../../types/technique';
import { formatShortDate } from '../../utils';
import {
  buildYourGameOverview,
  sortTechniqueList,
} from '../../utils/techniqueAnalytics';

type Props = NativeStackScreenProps<WorkoutStackParamList, 'YourGame'>;

const SORT_OPTIONS: Array<{ value: TechniqueListSort; label: string }> = [
  { value: 'most_used', label: 'Most used' },
  { value: 'recent', label: 'Recently used' },
  { value: 'least_used', label: 'Least used' },
  { value: 'alpha', label: 'A–Z' },
];

export function YourGameScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const { workouts } = useWorkouts();
  const { getLabel, getCategory, getTechnique } = useTechniques();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | TechniqueCategory>('all');
  const [sort, setSort] = useState<TechniqueListSort>('most_used');

  const overview = useMemo(
    () =>
      buildYourGameOverview(workouts, {
        getLabel,
        getCategory,
        getTechnique,
      }),
    [getCategory, getLabel, getTechnique, workouts],
  );

  const techniques = useMemo(() => {
    let list = overview.techniques;
    if (category !== 'all') {
      list = list.filter((item) => item.category === category);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((item) => item.label.toLowerCase().includes(q));
    }
    return sortTechniqueList(list, sort);
  }, [category, overview.techniques, query, sort]);

  return (
    <Screen scroll>
      <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
        <Text variant="caption" style={{ color: colors.goldAccent }}>
          ← Back
        </Text>
      </Pressable>
      <Spacer size="md" />
      <Text variant="hero">Your Game</Text>
      <Spacer size="xs" />
      <Text variant="bodyMuted">
        Explore every technique you’ve logged — no arbitrary limits.
      </Text>

      <Spacer size="lg" />
      <View style={styles.statsRow}>
        <SummaryTile
          label="Unique Techniques"
          value={`${overview.totalUnique}`}
          colors={colors}
        />
        <SummaryTile
          label="This Month"
          value={`${overview.loggedThisMonth}`}
          colors={colors}
        />
      </View>
      <Spacer size="sm" />
      <View style={styles.statsRow}>
        <SummaryTile
          label="Most Used"
          value={
            overview.mostUsed
              ? `${overview.mostUsed.label}`
              : '—'
          }
          detail={
            overview.mostUsed
              ? `${overview.mostUsed.count} uses`
              : undefined
          }
          colors={colors}
        />
        <SummaryTile
          label="Newest"
          value={overview.newest ? overview.newest.label : '—'}
          detail={
            overview.newest
              ? `First ${formatShortDate(overview.newest.firstLogged)}`
              : undefined
          }
          colors={colors}
        />
      </View>

      {overview.categoryBreakdown.length > 0 ? (
        <>
          <Spacer size="lg" />
          <Card>
            <Text variant="subtitle">Category Breakdown</Text>
            <Spacer size="md" />
            {overview.categoryBreakdown.map((item) => (
              <View key={item.category} style={styles.breakdownRow}>
                <Text variant="body">{item.label}</Text>
                <Text variant="caption" muted>
                  {item.count}
                </Text>
              </View>
            ))}
          </Card>
        </>
      ) : null}

      <Spacer size="lg" />
      <Text variant="subtitle">Full Technique List</Text>
      <Spacer size="sm" />
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search your techniques"
        placeholderTextColor={colors.secondaryText}
        style={[
          styles.search,
          {
            backgroundColor: colors.secondaryBackground,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
      />
      <Spacer size="sm" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {TECHNIQUE_FILTER_OPTIONS.map((option) => {
          const active = category === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() =>
                setCategory(option.value as 'all' | TechniqueCategory)
              }
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
                  color: active
                    ? colors.elevatedSurface
                    : colors.secondaryText,
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <Spacer size="sm" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {SORT_OPTIONS.map((option) => {
          const active = sort === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setSort(option.value)}
              style={[
                styles.chip,
                {
                  backgroundColor: active
                    ? colors.goldMuted
                    : colors.elevatedSurface,
                  borderColor: active ? colors.goldAccent : colors.border,
                },
              ]}
            >
              <Text
                variant="caption"
                style={{
                  color: active ? colors.goldAccent : colors.secondaryText,
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Spacer size="md" />
      {techniques.length === 0 ? (
        <Text variant="bodyMuted">No techniques match these filters.</Text>
      ) : (
        <Card padded={false}>
          {techniques.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() =>
                navigation.navigate('TechniqueDetail', {
                  techniqueId: item.id,
                })
              }
              style={[
                styles.listRow,
                index < techniques.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text variant="body">{item.label}</Text>
                <Text variant="caption" muted>
                  {item.sourceType === 'user' ? 'Custom · ' : ''}
                  {item.count} use{item.count === 1 ? '' : 's'}
                  {item.lastUsed
                    ? ` · Last ${formatShortDate(item.lastUsed)}`
                    : ''}
                </Text>
              </View>
              <Text variant="caption" style={{ color: colors.goldAccent }}>
                View
              </Text>
            </Pressable>
          ))}
        </Card>
      )}

      <View style={{ height: spacing.xl }} />
    </Screen>
  );
}

function SummaryTile({
  label,
  value,
  detail,
  colors,
}: {
  label: string;
  value: string;
  detail?: string;
  colors: { cardBackground: string; border: string };
}) {
  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
      ]}
    >
      <Text variant="caption" muted>
        {label}
      </Text>
      <Text variant="subtitle" numberOfLines={2}>
        {value}
      </Text>
      {detail ? (
        <Text variant="caption" muted>
          {detail}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tile: {
    flex: 1,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.md,
    gap: 4,
    minHeight: 88,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  search: {
    minHeight: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    fontFamily: fontFamilies.regular,
    fontSize: 16,
  },
  chips: {
    gap: spacing.xs,
    paddingRight: spacing.sm,
  },
  chip: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});
