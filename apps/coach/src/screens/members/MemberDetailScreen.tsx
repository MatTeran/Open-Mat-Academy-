import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Card,
  Screen,
  Spacer,
  Text,
  spacing,
  type CoachMemberProfile,
} from '@openmat/shared';

import { MemberDevelopmentPanel } from '../../components/development/MemberDevelopmentPanel';
import { SectionHeader, StatusPill } from '../../components/ui/Motion';
import { useCoachData } from '../../lib/providers/CoachDataProvider';
import { useMemberDevelopment } from '../../lib/providers/MemberDevelopmentProvider';
import type { MembersStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MembersStackParamList, 'MemberDetail'>;

export function MemberDetailScreen({ navigation, route }: Props) {
  const { getMember, syncMemberRank } = useCoachData();
  const { getBundle, revision } = useMemberDevelopment();
  const [profile, setProfile] = useState<CoachMemberProfile | null>(null);

  useEffect(() => {
    void getMember(route.params.memberId).then(setProfile);
  }, [getMember, route.params.memberId]);

  useEffect(() => {
    void getBundle(route.params.memberId).then((bundle) => {
      if (!bundle) {
        return;
      }
      const belt = bundle.development.belt;
      const stripes = bundle.development.stripes;
      syncMemberRank(route.params.memberId, belt, stripes);
      setProfile((current) =>
        current
          ? {
              ...current,
              belt,
              stripes,
              journey: { ...current.journey, belt, stripes },
            }
          : current,
      );
    });
  }, [getBundle, revision, route.params.memberId, syncMemberRank]);

  if (!profile) {
    return (
      <Screen>
        <Text variant="title">Loading member…</Text>
      </Screen>
    );
  }

  return (
    <Screen scroll keyboard>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text variant="title" gold>
            {profile.fullName
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)}
          </Text>
        </View>
        <View style={styles.headerCopy}>
          <Text variant="hero">{profile.fullName}</Text>
          <Text variant="body" muted>
            {profile.email}
          </Text>
          <Spacer size="xs" />
          <StatusPill
            label={`${profile.belt} · ${profile.stripes} stripes`}
            color="#2DD4BF"
          />
        </View>
      </View>

      <Spacer size="lg" />
      <MemberDevelopmentPanel
        memberId={profile.id}
        onAddStripe={() =>
          navigation.navigate('AddStripe', { memberId: profile.id })
        }
        onPromoteBelt={() =>
          navigation.navigate('PromoteBelt', { memberId: profile.id })
        }
        onEditCompetition={() =>
          navigation.navigate('CompetitionProfileEdit', {
            memberId: profile.id,
          })
        }
      />

      <Spacer size="md" />
      <Card elevated>
        <Text variant="label">Membership</Text>
        <Spacer size="xs" />
        <Text variant="subtitle">
          {profile.membershipPlan} · {profile.membershipStatus}
        </Text>
        <Text variant="caption" muted>
          {profile.academyName}
        </Text>
      </Card>

      <Spacer size="md" />
      <Card>
        <SectionHeader title="Journey Summary" />
        <Text variant="body">
          {profile.journey.levelLabel} · {profile.journey.totalClasses} classes
        </Text>
        <Text variant="caption" muted>
          Member since {profile.journey.memberSince}
        </Text>
        <Text variant="caption" muted>
          Next: {profile.journey.nextMilestone}
        </Text>
        <Spacer size="xs" />
        <Text variant="caption" muted>
          Journey XP is separate from academy belt promotions.
        </Text>
      </Card>

      <Spacer size="md" />
      <Card>
        <SectionHeader title="Training Statistics" />
        <Text variant="body">
          Month {profile.trainingStats.classesThisMonth} · Year{' '}
          {profile.trainingStats.classesThisYear}
        </Text>
        <Text variant="caption" muted>
          Attendance {profile.trainingStats.attendanceRate}% · Streak{' '}
          {profile.trainingStats.currentStreakDays} days
        </Text>
        <Text variant="caption" muted>
          Favorite: {profile.trainingStats.favoriteClassType}
        </Text>
      </Card>

      <Spacer size="md" />
      <Card>
        <SectionHeader title="Achievements" />
        {profile.achievements.length === 0 ? (
          <Text variant="caption" muted>
            No achievements yet.
          </Text>
        ) : (
          profile.achievements.map((item) => (
            <Text key={item.id} variant="body">
              {item.title} · {item.earnedAt}
            </Text>
          ))
        )}
      </Card>

      <Spacer size="md" />
      <Card>
        <SectionHeader title="Emergency Contact" />
        {profile.emergencyContact ? (
          <>
            <Text variant="body">{profile.emergencyContact.name}</Text>
            <Text variant="caption" muted>
              {profile.emergencyContact.relationship} ·{' '}
              {profile.emergencyContact.phone}
            </Text>
          </>
        ) : (
          <Text variant="caption" muted>
            No emergency contact on file.
          </Text>
        )}
      </Card>

      <Spacer size="md" />
      <Card>
        <SectionHeader title="Waivers" />
        {profile.waivers.map((waiver) => (
          <View key={waiver.id} style={styles.row}>
            <Text variant="body">{waiver.title}</Text>
            <StatusPill
              label={waiver.status}
              color={waiver.status === 'valid' ? '#22C55E' : '#FF4D4D'}
            />
          </View>
        ))}
      </Card>

      <Spacer size="md" />
      <Card>
        <SectionHeader title="Competition Results" />
        {profile.competitionHistory.length === 0 ? (
          <Text variant="caption" muted>
            No competitions logged.
          </Text>
        ) : (
          profile.competitionHistory.map((item) => (
            <Text key={item.id} variant="body">
              {item.eventName} · {item.result} · {item.date}
            </Text>
          ))
        )}
      </Card>

      <Spacer size="md" />
      <Card>
        <SectionHeader title="Recent Classes" />
        {profile.recentClasses.length === 0 ? (
          <Text variant="caption" muted>
            No recent classes.
          </Text>
        ) : (
          profile.recentClasses.map((item) => (
            <Text key={`${item.id}-${item.date}`} variant="body">
              {item.title} · {item.date} · {item.status}
            </Text>
          ))
        )}
      </Card>
      <Spacer size="xl" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 212, 191, 0.16)',
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
});
