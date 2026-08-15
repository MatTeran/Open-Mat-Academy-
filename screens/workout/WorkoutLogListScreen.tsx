import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AchievementsBarCard,
  Button,
  FadeIn,
  FloatingActionButton,
  LogSegmentControl,
  ProgressInsightCard,
  Screen,
  Spacer,
  StreaksMiniCard,
  Text,
  TrainingInsightsSection,
  TrainingLogMiniCard,
  WorkoutCard,
  WorkoutProgressCard,
} from '../../components';
import { useJourney } from '../../lib/providers/JourneyProvider';
import { useTechniques } from '../../lib/providers/TechniqueProvider';
import { useWorkouts } from '../../lib/providers/WorkoutProvider';
import { spacing } from '../../lib/theme';
import type { MainTabParamList, WorkoutStackParamList } from '../../types';
import type {
  LogTabSegment,
  WorkoutMetricFilter,
} from '../../types/workoutMetrics';
import { buildTrainingInsights } from '../../utils/trainingInsights';
import { buildWorkoutProgressMetrics } from '../../utils/workoutMetrics';

type Props = NativeStackScreenProps<WorkoutStackParamList, 'WorkoutList'>;
type LogNavigation = CompositeNavigationProp<
  Props['navigation'],
  BottomTabNavigationProp<MainTabParamList>
>;

export function WorkoutLogListScreen({ navigation }: Props) {
  const tabNavigation = navigation as LogNavigation;
  const { workouts } = useWorkouts();
  const { getLabel, getCategory, getTechnique } = useTechniques();
  const { badges } = useJourney();
  const [segment, setSegment] = useState<LogTabSegment>('progress');
  const [filter, setFilter] = useState<WorkoutMetricFilter>('all');

  const metrics = useMemo(
    () => buildWorkoutProgressMetrics(workouts, filter),
    [workouts, filter],
  );

  const insights = useMemo(
    () =>
      buildTrainingInsights(workouts, filter, new Date(), {
        getLabel,
        getCategory,
        getTechnique,
      }),
    [filter, getCategory, getLabel, getTechnique, workouts],
  );

  const openJourney = () => {
    tabNavigation.navigate('Home', { screen: 'Journey' });
  };

  const openAchievements = () => {
    tabNavigation.navigate('Home', { screen: 'AchievementGallery' });
  };

  const openSessions = () => {
    setSegment('sessions');
  };

  const createNewLog = () => {
    navigation.navigate('WorkoutDetails', {});
  };

  return (
    <View style={styles.root}>
      <Screen scroll contentStyle={styles.content}>
        <FadeIn>
          <View style={styles.headerRow}>
            <View style={styles.headerCopy}>
              <Text variant="hero">Workout Log</Text>
              <Spacer size="sm" />
              <Text variant="bodyMuted">
                Track mat time, rounds, and every session.
              </Text>
            </View>
            <Button
              label="New Log"
              variant="primaryGold"
              fullWidth={false}
              onPress={createNewLog}
              accessibilityLabel="Create a new training log"
            />
          </View>
        </FadeIn>

        <Spacer size="lg" />
        <LogSegmentControl value={segment} onChange={setSegment} />
        <Spacer size="lg" />

        {segment === 'progress' ? (
          <FadeIn delay={40}>
            <WorkoutProgressCard
              metrics={metrics}
              filter={filter}
              onFilterChange={setFilter}
              onSeeMore={openJourney}
            />

            <Spacer size="lg" />
            <TrainingInsightsSection
              insights={insights}
              onLogTraining={createNewLog}
              onViewAllTechniques={() => navigation.navigate('YourGame')}
              onTechniquePress={(techniqueId) =>
                navigation.navigate('TechniqueDetail', { techniqueId })
              }
            />

            <Spacer size="md" />
            <AchievementsBarCard
              badges={badges}
              onPress={openAchievements}
            />

            <Spacer size="md" />
            <View style={styles.miniRow}>
              <View style={styles.miniCol}>
                <StreaksMiniCard
                  weeklyStreak={metrics.weeklyStreak}
                  onPress={openJourney}
                />
              </View>
              <View style={styles.miniCol}>
                <TrainingLogMiniCard
                  thisWeekDays={metrics.thisWeekDays}
                  lastWeekDays={metrics.lastWeekDays}
                  onPress={openSessions}
                />
              </View>
            </View>

            <Spacer size="md" />
            <ProgressInsightCard
              sessionsToInsight={metrics.sessionsToInsight}
            />
          </FadeIn>
        ) : workouts.length === 0 ? (
          <FadeIn delay={80}>
            <View style={styles.empty}>
              <Text variant="subtitle" gold>
                No sessions yet
              </Text>
              <Spacer size="xs" />
              <Text variant="bodyMuted" style={styles.center}>
                Tap New Log to record your first training session.
              </Text>
              <Spacer size="md" />
              <Button
                label="Create New Log"
                variant="outlineGold"
                onPress={createNewLog}
                accessibilityLabel="Create a new training log"
              />
            </View>
          </FadeIn>
        ) : (
          <View style={styles.list}>
            {workouts.map((workout, index) => (
              <FadeIn key={workout.id} delay={60 + index * 50}>
                <WorkoutCard
                  workout={workout}
                  onPress={() =>
                    navigation.navigate('WorkoutDetails', {
                      workoutId: workout.id,
                    })
                  }
                />
              </FadeIn>
            ))}
          </View>
        )}

        <View style={styles.bottomSpace} />
      </Screen>

      <FloatingActionButton onPress={createNewLog} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  headerCopy: {
    flex: 1,
  },
  miniRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  miniCol: {
    flex: 1,
  },
  list: {
    gap: spacing.md,
  },
  empty: {
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  center: {
    textAlign: 'center',
  },
  bottomSpace: {
    height: 120,
  },
});
