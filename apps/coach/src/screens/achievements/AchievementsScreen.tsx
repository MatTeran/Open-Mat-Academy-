import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  IconBadge,
  Screen,
  Spacer,
  Text,
  radii,
  spacing,
  useAppTheme,
  type AchievementRarity,
  type CoachAchievement,
  type IconName,
} from '@openmat/shared';

import {
  EmptyState,
  FadeInItem,
  SectionHeader,
  StatusPill,
} from '../../components/ui/Motion';
import { formatLabel } from '../../components/ui/Phase2Controls';
import { usePhase2Data } from '../../lib/providers/Phase2DataProvider';
import type { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'Achievements'>;

const RARITY_TINT: Record<AchievementRarity, string> = {
  common: '#B8B8B8',
  rare: '#38BDF8',
  elite: '#2DD4BF',
  legendary: '#A78BFA',
};

export function AchievementsScreen({ navigation }: Props) {
  const { achievements } = usePhase2Data();
  const awardedTotal = achievements.reduce(
    (total, item) => total + item.awardedCount,
    0,
  );

  return (
    <Screen scroll>
      <Text variant="hero">Achievements</Text>
      <Text variant="body" muted>
        Badge moments that celebrate consistency, competition, and culture.
      </Text>
      <Spacer size="lg" />
      <Button
        label="Create Achievement"
        onPress={() => navigation.navigate('AchievementForm', undefined)}
      />

      <Spacer size="xl" />
      <SectionHeader
        title="Badge Grid"
        subtitle={`${achievements.length} badges · ${awardedTotal} awarded`}
      />
      {achievements.length === 0 ? (
        <EmptyState
          title="No achievements yet"
          subtitle="Create a badge for member milestones."
        />
      ) : (
        <View style={styles.grid}>
          {achievements.map((achievement, index) => (
            <FadeInItem
              key={achievement.id}
              index={index}
              style={styles.gridItem}
            >
              <AchievementCard
                achievement={achievement}
                onPress={() =>
                  navigation.navigate('AchievementForm', {
                    achievementId: achievement.id,
                  })
                }
              />
            </FadeInItem>
          ))}
        </View>
      )}
      <Spacer size="xl" />
    </Screen>
  );
}

function AchievementCard({
  achievement,
  onPress,
}: {
  achievement: CoachAchievement;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  const tint = achievement.tint || RARITY_TINT[achievement.rarity];

  return (
    <Card elevated style={styles.card}>
      <View style={[styles.badgeHalo, { borderColor: `${tint}66` }]}>
        <IconBadge name={achievement.icon as IconName} tint={tint} size={24} />
      </View>
      <Spacer size="md" />
      <Text variant="subtitle">{achievement.title}</Text>
      <Text variant="caption" muted>
        {achievement.requirementLabel}
      </Text>
      <Spacer size="sm" />
      <View style={styles.metaRow}>
        <StatusPill
          label={formatLabel(achievement.rarity)}
          color={RARITY_TINT[achievement.rarity]}
        />
        <StatusPill
          label={achievement.isActive ? 'active' : 'inactive'}
          color={achievement.isActive ? colors.success : colors.secondaryText}
        />
      </View>
      <Spacer size="sm" />
      <Text variant="caption" muted>
        {achievement.awardedCount} awarded · {achievement.xpReward} XP
      </Text>
      <Spacer size="md" />
      <Button label="Edit Badge" variant="outlineGold" onPress={onPress} />
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridItem: {
    width: '47%',
    minWidth: 156,
    flexGrow: 1,
  },
  card: {
    minHeight: 252,
  },
  badgeHalo: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
