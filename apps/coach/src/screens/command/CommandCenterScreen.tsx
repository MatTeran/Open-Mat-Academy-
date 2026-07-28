import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
  type AttentionItem,
  type IconName,
  type QuickCommandId,
} from '@openmat/shared';

import { Sparkline } from '../../components/charts/Sparkline';
import { KpiCard } from '../../components/command/KpiCard';
import {
  FadeInHero,
  FadeInItem,
  SectionHeader,
  StatusPill,
} from '../../components/ui/Motion';
import { usePhase2Data } from '../../lib/providers/Phase2DataProvider';
import type {
  MainTabParamList,
  MoreStackParamList,
  RootStackParamList,
} from '../../navigation/types';

type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<MoreStackParamList, 'CommandCenter'>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList>,
    NativeStackNavigationProp<RootStackParamList>
  >
>;

interface Props {
  navigation: Nav;
}

function navigateRoot(
  navigation: Nav,
  screen: keyof MainTabParamList | 'CreateModal',
  params?: object,
) {
  if (screen === 'CreateModal') {
    navigation.getParent()?.navigate('CreateModal');
    return;
  }
  const parent = navigation.getParent() as
    | { navigate: (name: string, params?: object) => void }
    | undefined;
  parent?.navigate(screen, params);
}

export function CommandCenterScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const { commandCenter } = usePhase2Data();
  const {
    pulse,
    attention,
    momentum,
    liveFeed,
    upcoming,
    quickCommands,
    aiInsights,
    snapshots,
  } = commandCenter;

  const onAttention = (item: AttentionItem) => {
    switch (item.actionId) {
      case 'viewMember':
      case 'messageMember':
        if (item.entityId) {
          navigateRoot(navigation, 'Members', {
            screen: 'MemberDetail',
            params: { memberId: item.entityId },
          });
        }
        break;
      case 'manageClass':
      case 'approveWaitlist':
        if (item.entityId) {
          navigateRoot(navigation, 'Schedule', {
            screen: 'ClassDetail',
            params: { classId: item.entityId },
          });
        }
        break;
      case 'publishAnnouncement':
        navigation.navigate('Announcements');
        break;
      case 'viewEvent':
        navigation.navigate('Events');
        break;
      case 'reviewWaiver':
        if (item.entityId) {
          navigateRoot(navigation, 'Members', {
            screen: 'MemberDetail',
            params: { memberId: item.entityId },
          });
        }
        break;
      default:
        break;
    }
  };

  const onQuickCommand = (id: QuickCommandId) => {
    switch (id) {
      case 'createAnnouncement':
        navigation.navigate('AnnouncementForm', undefined);
        break;
      case 'startCheckIn':
        navigateRoot(navigation, 'Dashboard', {
          screen: 'CheckIn',
          params: undefined,
        });
        break;
      case 'createClass':
        navigateRoot(navigation, 'Schedule', {
          screen: 'ClassForm',
          params: undefined,
        });
        break;
      case 'uploadTechnique':
        navigation.navigate('TechniqueForm', undefined);
        break;
      case 'createChallenge':
        navigation.navigate('ChallengeForm', undefined);
        break;
      case 'createEvent':
        navigation.navigate('EventForm', undefined);
        break;
      case 'sendNotification':
        navigation.navigate('NotificationForm');
        break;
      case 'manageMembers':
        navigateRoot(navigation, 'Members');
        break;
      default:
        break;
    }
  };

  return (
    <Screen scroll>
      <FadeInHero>
        <LinearGradient
          colors={['#1A1A1A', '#141414', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { borderColor: colors.border }]}
        >
          <Text variant="caption" gold>
            Mission Control
          </Text>
          <Text variant="hero">Academy Pulse</Text>
          <Text variant="body" muted>
            What needs your attention right now?
          </Text>
        </LinearGradient>
      </FadeInHero>

      <Spacer size="lg" />
      <SectionHeader
        title="Academy Pulse"
        subtitle="Tap any tile for graphs and filters"
      />
      <Spacer size="sm" />
      <View style={styles.kpiGrid}>
        {pulse.map((metric, index) => (
          <KpiCard
            key={metric.id}
            index={index}
            label={metric.label}
            value={metric.value}
            icon={metric.icon as IconName}
            tint={metric.tint}
            trendLabel={metric.trendLabel}
            onPress={() =>
              navigation.navigate('PulseInsight', { pulseId: metric.id })
            }
          />
        ))}
      </View>

      <Spacer size="xl" />
      <SectionHeader
        title="Needs Attention"
        subtitle="Highest priority actions first"
      />
      <View style={styles.stack}>
        {attention.map((item, index) => (
          <FadeInItem key={item.id} index={index}>
            <Card elevated>
              <View style={styles.row}>
                <IconBadge name={item.icon as IconName} tint={item.tint} />
                <View style={styles.copy}>
                  <View style={styles.titleRow}>
                    <Text variant="subtitle" style={styles.flex}>
                      {item.title}
                    </Text>
                    <StatusPill
                      label={item.priority}
                      color={
                        item.priority === 'high'
                          ? colors.error
                          : item.priority === 'medium'
                            ? colors.warning
                            : colors.info
                      }
                    />
                  </View>
                  <Text variant="caption" muted>
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              <Spacer size="md" />
              <Button
                label={item.actionLabel}
                variant="outlineGold"
                onPress={() => onAttention(item)}
              />
            </Card>
          </FadeInItem>
        ))}
      </View>

      <Spacer size="xl" />
      <SectionHeader
        title="Member Momentum"
        subtitle="Celebrate progress before it stalls"
      />
      <View style={styles.stack}>
        {momentum.map((card, index) => (
          <FadeInItem key={card.id} index={index}>
            <Card elevated>
              <View style={styles.row}>
                <IconBadge name={card.icon as IconName} tint={card.tint} />
                <View style={styles.copy}>
                  <Text variant="subtitle">{card.memberName}</Text>
                  <Text variant="body">{card.headline}</Text>
                  <Text variant="caption" muted>
                    {card.detail}
                  </Text>
                </View>
              </View>
              <Spacer size="sm" />
              <View
                style={[styles.progressTrack, { backgroundColor: colors.border }]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${card.progressPercent}%`,
                      backgroundColor: card.tint,
                    },
                  ]}
                />
              </View>
              <Spacer size="xs" />
              <Text variant="caption" gold>
                {card.progressLabel}
              </Text>
              <Spacer size="md" />
              <View style={styles.actions}>
                <View style={styles.actionGrow}>
                  <Button
                    label="Celebrate"
                    variant="secondary"
                    onPress={() =>
                      navigation.navigate('JourneyMember', {
                        memberId: card.memberId,
                      })
                    }
                  />
                </View>
                <View style={styles.actionGrow}>
                  <Button
                    label="View Profile"
                    onPress={() =>
                      navigateRoot(navigation, 'Members', {
                        screen: 'MemberDetail',
                        params: { memberId: card.memberId },
                      })
                    }
                  />
                </View>
              </View>
            </Card>
          </FadeInItem>
        ))}
      </View>

      <Spacer size="xl" />
      <SectionHeader title="Live Activity Feed" />
      <View style={styles.stack}>
        {liveFeed.map((item, index) => (
          <FadeInItem key={item.id} index={index}>
            <Card>
              <View style={styles.row}>
                <IconBadge name={item.icon as IconName} tint={item.tint} />
                <View style={styles.copy}>
                  <Text variant="subtitle">{item.title}</Text>
                  <Text variant="caption" muted>
                    {item.subtitle} · {new Date(item.timestamp).toLocaleString()}
                  </Text>
                </View>
              </View>
            </Card>
          </FadeInItem>
        ))}
      </View>

      <Spacer size="xl" />
      <SectionHeader title="Upcoming Events" />
      <View style={styles.stack}>
        {upcoming.map((item, index) => (
          <FadeInItem key={item.id} index={index}>
            <Card elevated>
              <Text variant="subtitle">{item.title}</Text>
              <Text variant="caption" muted>
                {item.whenLabel} · {item.typeLabel}
              </Text>
              <Spacer size="md" />
              <View style={styles.actions}>
                <View style={styles.actionGrow}>
                  <Button
                    label="Manage"
                    variant="secondary"
                    onPress={() => {
                      if (item.entityKind === 'class') {
                        navigateRoot(navigation, 'Schedule', {
                          screen: 'ClassDetail',
                          params: { classId: item.entityId },
                        });
                      } else {
                        navigation.navigate('Events');
                      }
                    }}
                  />
                </View>
                <View style={styles.actionGrow}>
                  <Button
                    label="Notify"
                    onPress={() => navigation.navigate('NotificationForm')}
                  />
                </View>
              </View>
            </Card>
          </FadeInItem>
        ))}
      </View>

      <Spacer size="xl" />
      <SectionHeader title="Quick Commands" />
      <View style={styles.commandGrid}>
        {quickCommands.map((command, index) => (
          <FadeInItem key={command.id} index={index} style={styles.commandWrap}>
            <Pressable
              onPress={() => onQuickCommand(command.id)}
              style={[
                styles.command,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <IconBadge name={command.icon as IconName} tint={command.tint} />
              <Text variant="caption">{command.label}</Text>
            </Pressable>
          </FadeInItem>
        ))}
      </View>

      <Spacer size="xl" />
      <SectionHeader
        title="AI Coach Insights"
        subtitle="UI only · recommendations coming later"
      />
      <View style={styles.stack}>
        {aiInsights.map((insight, index) => (
          <FadeInItem key={insight.id} index={index}>
            <Card
              elevated
              style={{
                borderColor: 'rgba(255, 255, 255, 0.35)',
              }}
            >
              <IconBadge name="sparkles" tint="#F5F5F5" />
              <Spacer size="sm" />
              <Text variant="body">{insight.suggestion}</Text>
              <Spacer size="xs" />
              <Text variant="caption" muted>
                {insight.confidenceLabel}
              </Text>
            </Card>
          </FadeInItem>
        ))}
      </View>

      <Spacer size="xl" />
      <SectionHeader
        title="Analytics Snapshots"
        subtitle="Operational pulse · not a full dashboard"
      />
      <View style={styles.kpiGrid}>
        {snapshots.map((snap, index) => (
          <FadeInItem key={snap.id} index={index} style={styles.wrap}>
            <Card elevated>
              <Text variant="caption" muted>
                {snap.label}
              </Text>
              <Text variant="title">{snap.value}</Text>
              <Text variant="caption" muted>
                {snap.helper}
              </Text>
              <Spacer size="sm" />
              <Sparkline points={snap.points} tint={snap.tint} />
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
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
  },
  wrap: {
    width: '48.5%',
  },
  stack: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
  progressTrack: {
    height: 6,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radii.pill,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionGrow: {
    flex: 1,
  },
  commandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
  },
  commandWrap: {
    width: '48.5%',
  },
  command: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
    minHeight: 96,
  },
});
