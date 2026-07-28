import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Card,
  IconBadge,
  Screen,
  Spacer,
  Text,
  radii,
  spacing,
  useAppTheme,
  type IconName,
  type PulseInsightBeltFilter,
  type PulseInsightClassFilter,
  type PulseInsightRange,
} from '@openmat/shared';

import { BarChart, LineChart } from '../../components/charts/InsightCharts';
import { ChipRow, FilterChipRow } from '../../components/ui/Phase2Controls';
import {
  EmptyState,
  FadeInHero,
  FadeInItem,
  SectionHeader,
  StatusPill,
} from '../../components/ui/Motion';
import { usePhase2Data } from '../../lib/providers/Phase2DataProvider';
import type { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'PulseInsight'>;

const RANGES: PulseInsightRange[] = ['7d', '30d', '90d'];
const CLASS_FILTERS: Exclude<PulseInsightClassFilter, 'all'>[] = [
  'gi',
  'no_gi',
  'kids',
  'open_mat',
];
const BELT_FILTERS: Exclude<PulseInsightBeltFilter, 'all'>[] = [
  'white',
  'blue',
  'purple',
  'brown',
  'black',
];

function rangeLabel(value: PulseInsightRange) {
  switch (value) {
    case '7d':
      return '7 days';
    case '30d':
      return '30 days';
    case '90d':
      return '90 days';
  }
}

function classLabel(value: Exclude<PulseInsightClassFilter, 'all'>) {
  switch (value) {
    case 'gi':
      return 'Gi';
    case 'no_gi':
      return 'No-Gi';
    case 'kids':
      return 'Kids';
    case 'open_mat':
      return 'Open Mat';
  }
}

function beltLabel(value: Exclude<PulseInsightBeltFilter, 'all'>) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function PulseInsightScreen({ route }: Props) {
  const { colors } = useAppTheme();
  const { commandCenter } = usePhase2Data();
  const insight = commandCenter.pulseInsights.find(
    (item) => item.pulseId === route.params.pulseId,
  );

  const [range, setRange] = useState<PulseInsightRange>('7d');
  const [classFilter, setClassFilter] =
    useState<PulseInsightClassFilter>('all');
  const [beltFilter, setBeltFilter] = useState<PulseInsightBeltFilter>('all');

  const charts = insight?.charts[range];

  const filteredRows = useMemo(() => {
    if (!insight) return [];
    return insight.rows.filter((row) => {
      if (
        classFilter !== 'all' &&
        row.classType &&
        row.classType !== classFilter
      ) {
        return false;
      }
      if (classFilter !== 'all' && !row.classType) return false;
      if (beltFilter !== 'all' && row.belt && row.belt !== beltFilter) {
        return false;
      }
      if (beltFilter !== 'all' && !row.belt) return false;
      return true;
    });
  }, [beltFilter, classFilter, insight]);

  const filteredBars = useMemo(() => {
    if (!charts) return [];
    if (classFilter === 'all' || !insight?.supportsClassFilter) {
      return charts.bars;
    }
    const label = classLabel(classFilter);
    const match = charts.bars.find(
      (bar) => bar.label.toLowerCase() === label.toLowerCase(),
    );
    return match ? [match] : charts.bars;
  }, [charts, classFilter, insight?.supportsClassFilter]);

  if (!insight || !charts) {
    return (
      <Screen>
        <EmptyState
          title="Insight unavailable"
          subtitle="This Academy Pulse tile does not have a deep dive yet."
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <FadeInHero>
        <Card
          elevated
          style={{
            ...styles.hero,
            borderColor: `${insight.tint}55`,
          }}
        >
          <View style={styles.heroTop}>
            <IconBadge name={insight.icon as IconName} tint={insight.tint} />
            <StatusPill label={charts.trendLabel} color={insight.tint} />
          </View>
          <Spacer size="sm" />
          <Text variant="hero">{insight.title}</Text>
          <Text variant="body" muted>
            {insight.description}
          </Text>
          <Spacer size="md" />
          <Text variant="title" gold>
            {charts.summaryValue}
          </Text>
          <Text variant="caption" muted>
            {charts.summaryHelper}
          </Text>
        </Card>
      </FadeInHero>

      <Spacer size="lg" />
      <SectionHeader title="Time range" subtitle="Compare recent windows" />
      <ChipRow
        options={RANGES}
        value={range}
        onChange={setRange}
        labelFor={rangeLabel}
      />

      {insight.supportsClassFilter ? (
        <>
          <Spacer size="md" />
          <SectionHeader title="Class track" />
          <FilterChipRow
            options={CLASS_FILTERS}
            value={classFilter === 'all' ? null : classFilter}
            onChange={(value) => setClassFilter(value ?? 'all')}
            allLabel="All tracks"
            labelFor={classLabel}
          />
        </>
      ) : null}

      {insight.supportsBeltFilter ? (
        <>
          <Spacer size="md" />
          <SectionHeader title="Belt" />
          <FilterChipRow
            options={BELT_FILTERS}
            value={beltFilter === 'all' ? null : beltFilter}
            onChange={(value) => setBeltFilter(value ?? 'all')}
            allLabel="All belts"
            labelFor={beltLabel}
          />
        </>
      ) : null}

      <Spacer size="xl" />
      <SectionHeader title={charts.lineTitle} subtitle="Trend line" />
      <Card elevated>
        <LineChart points={charts.line} tint={insight.tint} />
      </Card>

      <Spacer size="lg" />
      <SectionHeader title={charts.barsTitle} subtitle="Distribution" />
      <Card elevated>
        <BarChart points={filteredBars} tint={insight.tint} />
      </Card>

      <Spacer size="xl" />
      <SectionHeader
        title="Detail breakdown"
        subtitle={
          filteredRows.length
            ? `${filteredRows.length} matching rows`
            : 'No rows for these filters'
        }
      />
      <View style={styles.stack}>
        {filteredRows.length === 0 ? (
          <EmptyState
            title="No matching rows"
            subtitle="Widen class or belt filters to see more detail."
          />
        ) : (
          filteredRows.map((row, index) => (
            <FadeInItem key={row.id} index={index}>
              <Card>
                <View style={styles.row}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: row.tint ?? insight.tint },
                    ]}
                  />
                  <View style={styles.copy}>
                    <Text variant="subtitle">{row.label}</Text>
                    {row.helper ? (
                      <Text variant="caption" muted>
                        {row.helper}
                      </Text>
                    ) : null}
                  </View>
                  <Text variant="caption" gold>
                    {row.value}
                  </Text>
                </View>
              </Card>
            </FadeInItem>
          ))
        )}
      </View>

      <Spacer size="xl" />
      <SectionHeader title="Coach takeaways" />
      <View style={styles.stack}>
        {insight.takeaways.map((takeaway, index) => (
          <FadeInItem key={takeaway} index={index}>
            <Pressable
              style={[
                styles.takeaway,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text variant="caption" gold>
                Insight {index + 1}
              </Text>
              <Text variant="body">{takeaway}</Text>
            </Pressable>
          </FadeInItem>
        ))}
      </View>
      <Spacer size="xl" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.xxs,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  stack: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radii.pill,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  takeaway: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
});
