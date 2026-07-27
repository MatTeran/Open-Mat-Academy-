import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  Card,
  IconBadge,
  Screen,
  Spacer,
  Text,
  fontFamilies,
  radii,
  spacing,
  useAppTheme,
  type CoachQuickActionId,
  type IconName,
} from '@openmat/shared';

import {
  FadeInHero,
  FadeInItem,
  SectionHeader,
} from '../../components/ui/Motion';
import { useCoachData } from '../../lib/providers/CoachDataProvider';
import type {
  DashboardStackParamList,
  MainTabParamList,
  RootStackParamList,
} from '../../navigation/types';

type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<DashboardStackParamList, 'DashboardHome'>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList>,
    NativeStackNavigationProp<RootStackParamList>
  >
>;

interface Props {
  navigation: Nav;
}

function navigateTab(
  navigation: Nav,
  screen: keyof MainTabParamList,
  params?: object,
) {
  const parent = navigation.getParent() as
    | { navigate: (name: string, params?: object) => void }
    | undefined;
  if (parent?.navigate) {
    parent.navigate(screen, params);
    return;
  }
  (navigation as unknown as { navigate: (name: string, params?: object) => void }).navigate(
    screen,
    params,
  );
}

const METRIC_KEYS = [
  { key: 'todaysClasses', label: 'Classes' },
  { key: 'reservations', label: 'Reserved' },
  { key: 'checkedIn', label: 'Checked In' },
  { key: 'waitlist', label: 'Waitlist' },
  { key: 'firstTimeVisitors', label: 'First Visits' },
] as const;

export function DashboardScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const {
    overview,
    quickCards,
    quickActions,
    activity,
    classes,
    refresh,
  } = useCoachData();
  const [refreshing, setRefreshing] = useState(false);

  const todaysClasses = useMemo(
    () =>
      classes.filter(
        (item) =>
          item.date === new Date().toISOString().slice(0, 10) &&
          item.status !== 'cancelled',
      ),
    [classes],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  const handleQuickAction = (id: CoachQuickActionId) => {
    switch (id) {
      case 'openCommandCenter':
        navigateTab(navigation, 'More', { screen: 'CommandCenter' });
        break;
      case 'manageCheckIn':
        navigation.navigate('CheckIn', {
          classId: todaysClasses[0]?.id,
        });
        break;
      case 'createAnnouncement':
        navigation.navigate('AnnouncementForm', undefined);
        break;
      case 'addClass':
        navigation.navigate('ClassForm', undefined);
        break;
      case 'manageMembers':
        navigateTab(navigation, 'Members');
        break;
      case 'uploadTechnique':
        navigation.getParent()?.navigate('CreateModal');
        break;
      default:
        break;
    }
  };

  return (
    <Screen
      scroll
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.goldAccent}
        />
      }
    >
      <FadeInHero>
        <LinearGradient
          colors={['#1A1A1A', '#141414', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { borderColor: colors.border }]}
        >
          <Text variant="caption" gold>
            Today&apos;s Overview
          </Text>
          <Text variant="hero">{overview.greeting}</Text>
          <Text variant="body" muted>
            What needs your attention today?
          </Text>
          <Text variant="caption" muted>
            {overview.dateLabel}
          </Text>

          <View style={styles.metrics}>
            {METRIC_KEYS.map((metric) => (
              <View key={metric.key} style={styles.metric}>
                <Text variant="title" gold>
                  {overview[metric.key]}
                </Text>
                <Text variant="caption" muted>
                  {metric.label}
                </Text>
              </View>
            ))}
          </View>

          <Spacer size="md" />
          <Pressable
            onPress={() =>
              navigateTab(navigation, 'More', { screen: 'CommandCenter' })
            }
            style={[
              styles.commandCta,
              {
                backgroundColor: colors.goldMuted,
                borderColor: colors.goldAccent,
              },
            ]}
          >
            <IconBadge name="pulse" tint={colors.highlightGold} />
            <View style={styles.commandCopy}>
              <Text variant="subtitle">Open Command Center</Text>
              <Text variant="caption" muted>
                Mission control · what needs attention now
              </Text>
            </View>
          </Pressable>
        </LinearGradient>
      </FadeInHero>

      <Spacer size="lg" />

      <SectionHeader title="Focus" subtitle="Quick pulse on the floor" />
      <View style={styles.cardGrid}>
        {quickCards.map((card, index) => (
          <FadeInItem key={card.id} index={index} style={styles.quickCardWrap}>
            <Card
              elevated
              style={styles.quickCard}
              onPress={() => {
                if (card.id === 'todaysClasses') {
                  navigateTab(navigation, 'Schedule');
                } else if (card.id === 'attendance') {
                  navigation.navigate('CheckIn', {
                    classId: todaysClasses[0]?.id,
                  });
                } else if (card.id === 'announcements') {
                  navigateTab(navigation, 'More', {
                    screen: 'Announcements',
                  });
                }
              }}
            >
              <IconBadge name={card.icon as IconName} tint={card.tint} />
              <Spacer size="sm" />
              <Text variant="title">{card.value}</Text>
              <Text variant="body" style={styles.quickCardTitle}>
                {card.title}
              </Text>
              <Text variant="caption" muted style={styles.quickCardSubtitle}>
                {card.subtitle}
              </Text>
            </Card>
          </FadeInItem>
        ))}
      </View>

      <Spacer size="lg" />

      <SectionHeader
        title="Today's Classes"
        actionLabel="View all"
        onAction={() => navigateTab(navigation, 'Schedule')}
      />
      <View style={styles.list}>
        {todaysClasses.map((item, index) => (
          <FadeInItem key={item.id} index={index}>
            <Card
              onPress={() =>
                navigateTab(navigation, 'Schedule', {
                  screen: 'ClassDetail',
                  params: { classId: item.id },
                })
              }
            >
              <View style={styles.classRow}>
                <View style={styles.classCopy}>
                  <Text variant="subtitle">{item.title}</Text>
                  <Text variant="caption" muted>
                    {item.startTime}–{item.endTime} · {item.instructorName}
                  </Text>
                </View>
                <Text variant="caption" gold>
                  {item.checkedInCount}/{item.reservedCount}
                </Text>
              </View>
            </Card>
          </FadeInItem>
        ))}
      </View>

      <Spacer size="lg" />

      <SectionHeader title="Quick Actions" />
      <View style={styles.actions}>
        {quickActions.map((action, index) => (
          <FadeInItem key={action.id} index={index}>
            <Pressable
              onPress={() => handleQuickAction(action.id)}
              style={[
                styles.actionRow,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <IconBadge name={action.icon as IconName} tint={action.tint} />
              <Text variant="body" style={styles.actionLabel}>
                {action.label}
              </Text>
            </Pressable>
          </FadeInItem>
        ))}
      </View>

      <Spacer size="lg" />

      <SectionHeader title="Academy Activity" subtitle="Recent movement" />
      <View style={styles.list}>
        {activity.map((item, index) => (
          <FadeInItem key={item.id} index={index}>
            <Card elevated>
              <Text variant="subtitle">{item.title}</Text>
              <Text variant="caption" muted>
                {item.subtitle}
              </Text>
            </Card>
          </FadeInItem>
        ))}
      </View>
      <Spacer size="xl" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  metric: {
    minWidth: '28%',
    gap: 2,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
  },
  quickCardWrap: {
    width: '48.5%',
  },
  quickCard: {
    width: '100%',
    minHeight: 148,
  },
  quickCardTitle: {
    fontFamily: fontFamilies.semibold,
    marginTop: 2,
  },
  quickCardSubtitle: {
    marginTop: 2,
  },
  list: {
    gap: spacing.sm,
  },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  classCopy: {
    flex: 1,
    gap: 4,
  },
  actions: {
    gap: spacing.sm,
  },
  actionRow: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionLabel: {
    flex: 1,
  },
  commandCta: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  commandCopy: {
    flex: 1,
    gap: 2,
  },
});
