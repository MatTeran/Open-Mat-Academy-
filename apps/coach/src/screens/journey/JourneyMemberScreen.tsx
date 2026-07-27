import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import {
  Banner,
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

type Props = NativeStackScreenProps<MoreStackParamList, 'JourneyMember'>;

export function JourneyMemberScreen({ route }: Props) {
  const { colors } = useAppTheme();
  const { getJourneyMember } = usePhase2Data();
  const member = getJourneyMember(route.params.memberId);

  if (!member) {
    return (
      <Screen>
        <EmptyState
          title="Member not found"
          subtitle="This journey snapshot is not available."
        />
      </Screen>
    );
  }

  const levelPercent = Math.round(
    (member.currentLevelXP / member.nextLevelXP) * 100,
  );
  const goalPercent = Math.round(
    (member.weeklyGoalProgress / member.weeklyGoalTarget) * 100,
  );

  return (
    <Screen scroll>
      <Text variant="hero">{member.memberName}</Text>
      <Text variant="body" muted>
        Journey detail, milestones, and recent academy activity.
      </Text>
      <Spacer size="lg" />

      <Banner
        tone="info"
        message="XP is read-only in Coach. Coaches cannot edit member XP."
      />

      <Spacer size="lg" />
      <Card elevated>
        <View style={styles.row}>
          <IconBadge name={'ribbon-outline' as IconName} tint="#2DD4BF" />
          <View style={styles.copy}>
            <Text variant="subtitle">Level {member.level}</Text>
            <Text variant="title">{member.totalXP.toLocaleString()} XP</Text>
            <Text variant="caption" muted>
              {member.currentLevelXP}/{member.nextLevelXP} XP toward next level
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
      </Card>

      <Spacer size="xl" />
      <SectionHeader title="Weekly Goals" subtitle={`${goalPercent}% complete`} />
      <Card elevated>
        <View style={styles.row}>
          <IconBadge name={'flag-outline' as IconName} tint="#22C55E" />
          <View style={styles.copy}>
            <Text variant="subtitle">
              {member.weeklyGoalProgress}/{member.weeklyGoalTarget} sessions
            </Text>
            <Text variant="caption" muted>
              Current weekly training target
            </Text>
          </View>
        </View>
        <Spacer size="md" />
        <Sparkline
          points={[member.weeklyGoalProgress, member.weeklyGoalTarget]}
          tint="#22C55E"
          height={36}
        />
      </Card>

      <Spacer size="xl" />
      <SectionHeader title="Streak" subtitle="Current and best streaks" />
      <View style={styles.kpiGrid}>
        <MiniMetric
          label="Current"
          value={`${member.currentStreak} days`}
          tint="#F59E0B"
          icon="flame-outline"
        />
        <MiniMetric
          label="Best"
          value={`${member.bestStreak} days`}
          tint="#2DD4BF"
          icon="medal-outline"
        />
      </View>

      <Spacer size="xl" />
      <SectionHeader
        title="Challenges"
        subtitle={`${member.activeChallenges.length} active`}
      />
      <View style={styles.stack}>
        {member.activeChallenges.length === 0 ? (
          <EmptyState
            title="No active challenges"
            subtitle="This member is not currently in a challenge."
          />
        ) : (
          member.activeChallenges.map((challenge, index) => (
            <FadeInItem key={challenge.id} index={index}>
              <ProgressCard
                title={challenge.name}
                subtitle={`${challenge.progress}/${challenge.target}`}
                percent={Math.round((challenge.progress / challenge.target) * 100)}
                tint="#A78BFA"
                icon="trophy-outline"
              />
            </FadeInItem>
          ))
        )}
      </View>

      <Spacer size="xl" />
      <SectionHeader
        title="Achievements"
        subtitle={`${member.achievements.length} earned`}
      />
      <View style={styles.stack}>
        {member.achievements.length === 0 ? (
          <EmptyState
            title="No achievements yet"
            subtitle="Earned badges will appear here."
          />
        ) : (
          member.achievements.map((achievement, index) => (
            <FadeInItem key={achievement.id} index={index}>
              <Card elevated>
                <View style={styles.row}>
                  <IconBadge name={'star-outline' as IconName} tint="#2DD4BF" />
                  <View style={styles.copy}>
                    <Text variant="subtitle">{achievement.title}</Text>
                    <Text variant="caption" muted>
                      Earned {achievement.earnedAt}
                    </Text>
                  </View>
                  <StatusPill label="earned" color="#2DD4BF" />
                </View>
              </Card>
            </FadeInItem>
          ))
        )}
      </View>

      <Spacer size="xl" />
      <SectionHeader title="Recent Activity" />
      <View style={styles.stack}>
        {member.recentActivity.map((activity, index) => (
          <FadeInItem key={activity.id} index={index}>
            <Card elevated>
              <Text variant="subtitle">{activity.label}</Text>
              <Text variant="caption" muted>
                {activity.timestamp}
              </Text>
            </Card>
          </FadeInItem>
        ))}
      </View>
      <Spacer size="xl" />
    </Screen>
  );
}

function MiniMetric({
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
    <Card elevated style={styles.metricCard}>
      <IconBadge name={icon} tint={tint} />
      <Spacer size="sm" />
      <Text variant="caption" muted>
        {label}
      </Text>
      <Text variant="subtitle">{value}</Text>
    </Card>
  );
}

function ProgressCard({
  title,
  subtitle,
  percent,
  tint,
  icon,
}: {
  title: string;
  subtitle: string;
  percent: number;
  tint: string;
  icon: IconName;
}) {
  const { colors } = useAppTheme();

  return (
    <Card elevated>
      <View style={styles.row}>
        <IconBadge name={icon} tint={tint} />
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text variant="subtitle" style={styles.flex}>
              {title}
            </Text>
            <StatusPill label={`${percent}%`} color={tint} />
          </View>
          <Text variant="caption" muted>
            {subtitle}
          </Text>
        </View>
      </View>
      <Spacer size="md" />
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.min(percent, 100)}%`,
              backgroundColor: tint,
            },
          ]}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
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
  stack: {
    gap: spacing.md,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metricCard: {
    width: '47%',
    minWidth: 148,
    flexGrow: 1,
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
