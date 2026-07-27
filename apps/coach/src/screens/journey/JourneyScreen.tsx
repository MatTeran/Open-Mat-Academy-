import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import {
  Card,
  IconBadge,
  Screen,
  Spacer,
  Text,
  spacing,
  useAppTheme,
  type IconName,
  type MemberJourneySnapshot,
} from '@openmat/shared';

import { Sparkline } from '../../components/charts/Sparkline';
import {
  EmptyState,
  FadeInItem,
  SectionHeader,
  StatusPill,
} from '../../components/ui/Motion';
import { usePhase2Data } from '../../lib/providers/Phase2DataProvider';
import type { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'Journey'>;

export function JourneyScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const { journey } = usePhase2Data();

  return (
    <Screen scroll>
      <Text variant="hero">Member Journey</Text>
      <Text variant="body" muted>
        Read-only progress snapshots for XP, goals, streaks, and milestones.
      </Text>

      <Spacer size="lg" />
      <View style={styles.kpiGrid}>
        <KpiCard
          label="Active Members"
          value={String(journey.activeMembers)}
          tint="#38BDF8"
          icon="people-outline"
        />
        <KpiCard
          label="Average Streak"
          value={`${journey.averageStreak}`}
          tint="#F59E0B"
          icon="flame-outline"
        />
        <KpiCard
          label="Weekly Goals"
          value={`${journey.weeklyGoalCompletionRate}%`}
          tint="#22C55E"
          icon="flag-outline"
        />
        <KpiCard
          label="Active Challenges"
          value={String(journey.activeChallenges)}
          tint="#2DD4BF"
          icon="trophy-outline"
        />
      </View>

      <Spacer size="xl" />
      <Card elevated>
        <SectionHeader
          title="Goal Completion Trend"
          subtitle="Snapshots from current member sample"
        />
        <Sparkline
          points={journey.snapshots.map((snapshot) =>
            Math.round(
              (snapshot.weeklyGoalProgress / snapshot.weeklyGoalTarget) * 100,
            ),
          )}
          tint={colors.goldAccent}
          height={44}
        />
      </Card>

      <Spacer size="xl" />
      <SectionHeader
        title="Member Snapshots"
        subtitle={`${journey.snapshots.length} highlighted journeys`}
      />
      <View style={styles.stack}>
        {journey.snapshots.length === 0 ? (
          <EmptyState
            title="No journey data"
            subtitle="Snapshots will appear once member activity is available."
          />
        ) : (
          journey.snapshots.map((snapshot, index) => (
            <FadeInItem key={snapshot.memberId} index={index}>
              <MemberSnapshotCard
                snapshot={snapshot}
                onPress={() =>
                  navigation.navigate('JourneyMember', {
                    memberId: snapshot.memberId,
                  })
                }
              />
            </FadeInItem>
          ))
        )}
      </View>
      <Spacer size="xl" />
    </Screen>
  );
}

function KpiCard({
  label,
  value,
  tint,
  icon,
}: {
  label: string;
  value: string;
  tint: string;
  icon: IconName;
}) {
  return (
    <Card elevated style={styles.kpiCard}>
      <IconBadge name={icon} tint={tint} />
      <Spacer size="sm" />
      <Text variant="caption" muted>
        {label}
      </Text>
      <Text variant="title">{value}</Text>
    </Card>
  );
}

function MemberSnapshotCard({
  snapshot,
  onPress,
}: {
  snapshot: MemberJourneySnapshot;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  const goalPercent = Math.round(
    (snapshot.weeklyGoalProgress / snapshot.weeklyGoalTarget) * 100,
  );
  const levelPercent = Math.round(
    (snapshot.currentLevelXP / snapshot.nextLevelXP) * 100,
  );

  return (
    <Card elevated onPress={onPress}>
      <View style={styles.row}>
        <IconBadge name={'person-circle-outline' as IconName} tint="#2DD4BF" />
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text variant="subtitle" style={styles.flex}>
              {snapshot.memberName}
            </Text>
            <StatusPill label={`Level ${snapshot.level}`} color="#2DD4BF" />
          </View>
          <Text variant="caption" muted>
            {snapshot.totalXP.toLocaleString()} XP · {snapshot.currentStreak}
            -day streak
          </Text>
        </View>
      </View>
      <Spacer size="md" />
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.min(levelPercent, 100)}%`,
              backgroundColor: colors.goldAccent,
            },
          ]}
        />
      </View>
      <Spacer size="sm" />
      <Text variant="caption" muted>
        Weekly goal {snapshot.weeklyGoalProgress}/{snapshot.weeklyGoalTarget} ·{' '}
        {goalPercent}% complete
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  kpiCard: {
    width: '47%',
    minWidth: 148,
    flexGrow: 1,
  },
  stack: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
  track: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
