import { StyleSheet, View } from 'react-native';

import {
  Card,
  Text,
  Spacer,
  spacing,
  useAppTheme,
  type MemberDevelopmentSummary,
} from '@openmat/shared';

import { SectionHeader } from '../ui/Motion';

interface MemberSummaryCardProps {
  summary: MemberDevelopmentSummary;
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.stat, { borderColor: colors.border }]}>
      <Text variant="caption" muted>
        {label}
      </Text>
      <Text variant="subtitle">{value}</Text>
    </View>
  );
}

/** Quick operational summary for Member Development. */
export function MemberSummaryCard({ summary }: MemberSummaryCardProps) {
  return (
    <Card elevated>
      <SectionHeader
        title="Member Summary"
        subtitle="Academy progression at a glance"
      />
      <Spacer size="sm" />
      <View style={styles.grid}>
        <Stat
          label="Belt"
          value={`${summary.belt} · ${summary.stripes}`}
        />
        <Stat label="Classes" value={String(summary.classesAttended)} />
        <Stat label="Attendance" value={`${summary.attendancePercent}%`} />
        <Stat label="Streak" value={`${summary.currentStreakDays}d`} />
        <Stat
          label="Weekly Goal"
          value={`${summary.weeklyGoalProgress}/${summary.weeklyGoal}`}
        />
        <Stat label="Achievements" value={String(summary.achievementsCount)} />
        <Stat label="Medals" value={String(summary.competitionMedals)} />
        <Stat label="At Belt" value={summary.timeAtCurrentBeltLabel} />
        <Stat label="Joined" value={summary.academyJoinDate} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  stat: {
    width: '31%',
    minWidth: 96,
    flexGrow: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: spacing.sm,
    gap: 4,
  },
});
