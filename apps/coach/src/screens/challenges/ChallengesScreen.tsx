import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  IconBadge,
  Screen,
  Spacer,
  Text,
  spacing,
  useAppTheme,
  type ChallengeStatus,
  type CoachChallenge,
  type IconName,
} from '@openmat/shared';

import { Sparkline } from '../../components/charts/Sparkline';
import {
  EmptyState,
  FadeInItem,
  SectionHeader,
  StatusPill,
} from '../../components/ui/Motion';
import { formatLabel } from '../../components/ui/Phase2Controls';
import { usePhase2Data } from '../../lib/providers/Phase2DataProvider';
import type { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'Challenges'>;

const STATUS_TINT: Record<ChallengeStatus, string> = {
  draft: '#B8B8B8',
  active: '#22C55E',
  completed: '#38BDF8',
  archived: '#F59E0B',
};

export function ChallengesScreen({ navigation }: Props) {
  const { challenges } = usePhase2Data();
  const activeCount = challenges.filter((item) => item.status === 'active').length;

  return (
    <Screen scroll>
      <Text variant="hero">Challenges</Text>
      <Text variant="body" muted>
        Motivate members with short-term goals, XP, and badges.
      </Text>
      <Spacer size="lg" />
      <Button
        label="Create Challenge"
        onPress={() => navigation.navigate('ChallengeForm', undefined)}
      />

      <Spacer size="xl" />
      <SectionHeader
        title="Challenge Board"
        subtitle={`${activeCount} active / ${challenges.length} total`}
      />
      <View style={styles.stack}>
        {challenges.length === 0 ? (
          <EmptyState
            title="No challenges yet"
            subtitle="Create a weekly or monthly challenge to get started."
          />
        ) : (
          challenges.map((challenge, index) => (
            <FadeInItem key={challenge.id} index={index}>
              <ChallengeCard
                challenge={challenge}
                onPress={() =>
                  navigation.navigate('ChallengeForm', {
                    challengeId: challenge.id,
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

function ChallengeCard({
  challenge,
  onPress,
}: {
  challenge: CoachChallenge;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  const completion = challenge.participantCount
    ? Math.round((challenge.completionCount / challenge.participantCount) * 100)
    : 0;
  const tint = STATUS_TINT[challenge.status];

  return (
    <Card elevated>
      <View style={styles.row}>
        <IconBadge name={'trophy-outline' as IconName} tint={tint} />
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text variant="subtitle" style={styles.flex}>
              {challenge.name}
            </Text>
            <StatusPill label={challenge.status} color={tint} />
          </View>
          <Text variant="caption" muted>
            {challenge.description}
          </Text>
        </View>
      </View>
      <Spacer size="md" />
      <View style={styles.metaRow}>
        <Text variant="caption" gold>
          {formatLabel(challenge.kind)}
        </Text>
        <Text variant="caption" muted>
          {challenge.period}
        </Text>
        <Text variant="caption" muted>
          {challenge.xpReward} XP
        </Text>
        <Text variant="caption" muted>
          {challenge.completionCount}/{challenge.participantCount} complete
        </Text>
      </View>
      <Spacer size="sm" />
      <Sparkline
        points={[
          Math.max(challenge.participantCount - challenge.completionCount, 0),
          challenge.completionCount,
          completion,
        ]}
        tint={tint}
        height={34}
      />
      <Spacer size="sm" />
      <Text variant="caption" style={{ color: colors.secondaryText }}>
        {challenge.startDate} - {challenge.endDate}
        {challenge.badgeName ? ` · Badge: ${challenge.badgeName}` : ''}
      </Text>
      <Spacer size="md" />
      <Button label="Edit Challenge" variant="outlineGold" onPress={onPress} />
    </Card>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
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
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
