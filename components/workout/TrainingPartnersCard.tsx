import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type {
  PartnerInsight,
  PartnersInsight,
} from '../../types/trainingInsights';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';
import { InsightsEmptyState } from './InsightsEmptyState';
import { PartnerDetailSheet } from './PartnerDetailSheet';
import { RankedBarList } from './RankedBarList';

interface TrainingPartnersCardProps {
  insight: PartnersInsight;
  onLogTraining?: () => void;
}

const INITIAL_LIMIT = 5;

export function TrainingPartnersCard({
  insight,
  onLogTraining,
}: TrainingPartnersCardProps) {
  const { colors } = useAppTheme();
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<PartnerInsight | null>(null);

  const visible = useMemo(
    () =>
      showAll
        ? insight.partners
        : insight.partners.slice(0, INITIAL_LIMIT),
    [insight.partners, showAll],
  );

  const hasMore = insight.partners.length > INITIAL_LIMIT;

  return (
    <Card style={styles.card}>
      <Text variant="subtitle">Training Partners</Text>
      <Spacer size="xs" />
      <Text variant="caption" muted>
        Last 30 Days
      </Text>

      {insight.partners.length === 0 ? (
        <>
          <Spacer size="md" />
          <InsightsEmptyState
            message="Add training partners to your logs to see who you train with most."
            onLogTraining={onLogTraining}
          />
        </>
      ) : (
        <>
          <Spacer size="md" />
          <View accessible accessibilityLabel={insight.accessibilitySummary}>
            <RankedBarList
              items={visible.map((partner) => ({
                id: partner.name,
                label: partner.name,
                value: partner.rounds,
                valueLabel: `${partner.rounds} round${partner.rounds === 1 ? '' : 's'}`,
              }))}
              onItemPress={(name) => {
                const partner = insight.partners.find(
                  (item) => item.name === name,
                );
                if (partner) {
                  setSelected(partner);
                }
              }}
            />
          </View>

          {hasMore ? (
            <>
              <Spacer size="sm" />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  showAll ? 'Show fewer partners' : 'View all partners'
                }
                onPress={() => setShowAll((current) => !current)}
              >
                <Text
                  variant="caption"
                  style={{ color: colors.goldAccent }}
                >
                  {showAll ? 'Show Less' : 'View All Partners →'}
                </Text>
              </Pressable>
            </>
          ) : null}

          <Spacer size="md" />
          <Text variant="caption" muted>
            {insight.uniqueCount} unique partner
            {insight.uniqueCount === 1 ? '' : 's'}
            {' · '}
            {insight.totalRounds} total rounds
          </Text>
        </>
      )}

      <PartnerDetailSheet
        partner={selected}
        visible={selected != null}
        onClose={() => setSelected(null)}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
  },
});
