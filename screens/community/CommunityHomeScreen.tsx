import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import {
  AcademyEventCard,
  AcademyGroupCard,
  AnnouncementCarousel,
  BirthdayCard,
  CommunityDetailSheet,
  CommunityFeedSection,
  CommunityHeader,
  CommunityPostCard,
  CompetitionCard,
  FadeIn,
  LocalEventsDiscoveryCard,
  OpenMatCard,
  Screen,
  SectionHeader,
  SeminarCard,
  Spacer,
  Text,
} from '../../components';
import { Card } from '../../components/ui/Card';
import {
  COMMUNITY_ACADEMY_EVENTS,
  COMMUNITY_ACADEMY_GROUPS,
  COMMUNITY_ANNOUNCEMENTS,
  COMMUNITY_COMPETITIONS,
  COMMUNITY_FEED_POSTS,
  COMMUNITY_MEMBERS,
} from '../../lib/mocks/communityHub';
import { useCommunity } from '../../lib/providers/CommunityProvider';
import { useProfile } from '../../lib/providers/ProfileProvider';
import { spacing } from '../../lib/theme';
import { useThemedStyles } from '../../lib/theme/useThemedStyles';
import type { CommunityCompetition } from '../../types/communityHub';
import type { CommunityStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<CommunityStackParamList, 'CommunityHome'>;

type SheetState =
  | { kind: 'none' }
  | { kind: 'announcement'; title: string; body: string; subtitle: string }
  | { kind: 'composer' }
  | { kind: 'competition'; title: string; body: string }
  | { kind: 'event'; title: string; body: string }
  | { kind: 'group'; title: string; body: string }
  | { kind: 'post'; title: string; body: string };

export function CommunityHomeScreen({ navigation }: Props) {
  const {
    announcements,
    birthdays,
    seminars,
    openMats,
    chatMessages,
    toggleSeminarRegistration,
  } = useCommunity();
  const { hub } = useProfile();

  const [competitions, setCompetitions] = useState(COMMUNITY_COMPETITIONS);
  const [sheet, setSheet] = useState<SheetState>({ kind: 'none' });

  const styles = useThemedStyles((colors) => ({
    content: {},
    hScroll: {
      gap: spacing.md,
      paddingRight: spacing.md,
    },
    stack: {
      gap: spacing.md,
    },
    chatMeta: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
    },
    chatPill: {
      borderRadius: 999,
      backgroundColor: colors.goldMuted,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
    },
    chatPillText: {
      color: colors.goldAccent,
    },
    groupsSubtitle: {
      marginTop: -spacing.sm,
      marginBottom: spacing.md,
    },
    bottomSpace: {
      height: spacing.xl,
    },
  }));

  const latestChat = chatMessages[chatMessages.length - 1];
  const academyName = hub.membership.academyName ?? 'My Gi';

  const sheetVisible = sheet.kind !== 'none';
  const sheetCopy = useMemo(() => {
    switch (sheet.kind) {
      case 'announcement':
        return {
          title: sheet.title,
          subtitle: sheet.subtitle,
          body: sheet.body,
          primaryLabel: 'Got it',
        };
      case 'composer':
        return {
          title: 'Create a post',
          subtitle: 'COMMUNITY',
          body: 'Posting goes live in a later build. For now this is a placeholder composer.',
          primaryLabel: 'Close',
        };
      case 'competition':
        return {
          title: sheet.title,
          subtitle: 'COMPETITION',
          body: sheet.body,
          primaryLabel: 'Close',
        };
      case 'event':
        return {
          title: sheet.title,
          subtitle: 'ACADEMY EVENT',
          body: sheet.body,
          primaryLabel: 'Close',
        };
      case 'group':
        return {
          title: sheet.title,
          subtitle: 'ACADEMY GROUP',
          body: sheet.body,
          primaryLabel: 'Close',
        };
      case 'post':
        return {
          title: sheet.title,
          subtitle: 'COMMUNITY POST',
          body: sheet.body,
          primaryLabel: 'Close',
        };
      default:
        return {
          title: '',
          subtitle: undefined as string | undefined,
          body: undefined as string | undefined,
          primaryLabel: 'Done',
        };
    }
  }, [sheet]);

  const toggleCompeting = useCallback((id: string) => {
    setCompetitions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompeting: !item.isCompeting } : item,
      ),
    );
  }, []);

  const openLocalEvents = () => {
    navigation.getParent()?.navigate('Home', { screen: 'LocalEvents' });
  };

  const openCompetition = (competition: CommunityCompetition) => {
    setSheet({
      kind: 'competition',
      title: competition.name,
      body: `${competition.location}\n\n${competition.academyAttendeeCount} academy members are going. "I'm Competing" is mock-only for this phase.`,
    });
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <FadeIn>
        <CommunityHeader
          academyName={academyName}
          unreadCount={2}
          onPressNotifications={() =>
            navigation.getParent()?.navigate('Profile', {
              screen: 'Notifications',
            })
          }
        />
      </FadeIn>

      <Spacer size="xl" />

      <FadeIn delay={40}>
        <AnnouncementCarousel
          announcements={COMMUNITY_ANNOUNCEMENTS}
          onPressAnnouncement={(item) =>
            setSheet({
              kind: 'announcement',
              title: item.title,
              subtitle: item.category,
              body: `${item.description}\n\n— ${item.authorName}`,
            })
          }
        />
      </FadeIn>

      <Spacer size="xl" />

      <FadeIn delay={80}>
        <CommunityFeedSection
          members={COMMUNITY_MEMBERS}
          onPressViewAll={() =>
            Alert.alert('Community', 'Full feed arrives in a later build.')
          }
          onPressComposer={() => setSheet({ kind: 'composer' })}
        >
          {COMMUNITY_FEED_POSTS.map((post) => (
            <CommunityPostCard
              key={post.id}
              post={post}
              onPress={() =>
                setSheet({
                  kind: 'post',
                  title: post.authorName,
                  body: post.content,
                })
              }
              onPressMenu={() =>
                Alert.alert('Post options', 'Report / mute arrive later.')
              }
            />
          ))}
        </CommunityFeedSection>
      </FadeIn>

      <Spacer size="xl" />

      <FadeIn delay={120}>
        <SectionHeader title="🏆 Upcoming Competitions" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {competitions.map((competition) => (
            <CompetitionCard
              key={competition.id}
              competition={competition}
              onPressDetails={() => openCompetition(competition)}
              onToggleCompeting={() => toggleCompeting(competition.id)}
            />
          ))}
        </ScrollView>
      </FadeIn>

      <Spacer size="xl" />

      <FadeIn delay={160}>
        <SectionHeader title="Events" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {COMMUNITY_ACADEMY_EVENTS.map((event) => (
            <AcademyEventCard
              key={event.id}
              event={event}
              onPress={() =>
                setSheet({
                  kind: 'event',
                  title: event.title,
                  body: `${event.dateLabel}\n${event.description}${
                    event.coach ? `\n${event.coach}` : ''
                  }${event.audience ? `\n${event.audience}` : ''}`,
                })
              }
            />
          ))}
        </ScrollView>
      </FadeIn>

      <Spacer size="lg" />

      <FadeIn delay={180}>
        <LocalEventsDiscoveryCard onPress={openLocalEvents} />
      </FadeIn>

      <Spacer size="xl" />

      <FadeIn delay={200}>
        <SectionHeader title="Academy Groups" />
        <Text variant="bodyMuted" style={styles.groupsSubtitle}>
          Your teams and training circles.
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {COMMUNITY_ACADEMY_GROUPS.map((group) => (
            <AcademyGroupCard
              key={group.id}
              group={group}
              onPress={() =>
                setSheet({
                  kind: 'group',
                  title: group.name,
                  body: `${group.memberCount} members. Group chat and announcements arrive in a later build.`,
                })
              }
            />
          ))}
        </ScrollView>
      </FadeIn>

      <Spacer size="xl" />

      <FadeIn delay={220}>
        <SectionHeader title="Academy Bulletin" />
        <View style={styles.stack}>
          {announcements.slice(0, 2).map((item) => (
            <Card
              key={item.id}
              onPress={() =>
                navigation.navigate('AnnouncementDetail', {
                  announcementId: item.id,
                })
              }
            >
              <Text variant="caption" gold>
                {item.pinned ? 'Pinned' : 'Announcement'}
              </Text>
              <Spacer size="xs" />
              <Text variant="body" numberOfLines={2}>
                {item.title}
              </Text>
            </Card>
          ))}
        </View>
      </FadeIn>

      <Spacer size="xl" />

      <FadeIn delay={240}>
        <SectionHeader title="Member Birthdays" />
        <BirthdayCard birthdays={birthdays} />
      </FadeIn>

      <Spacer size="xl" />

      <FadeIn delay={260}>
        <SectionHeader title="Seminar Registration" />
        <View style={styles.stack}>
          {seminars.map((seminar) => (
            <SeminarCard
              key={seminar.id}
              seminar={seminar}
              onToggleRegister={() => toggleSeminarRegistration(seminar.id)}
            />
          ))}
        </View>
      </FadeIn>

      <Spacer size="xl" />

      <FadeIn delay={280}>
        <SectionHeader title="Open Mats" />
        <View style={styles.stack}>
          {openMats.map((session) => (
            <OpenMatCard key={session.id} session={session} />
          ))}
        </View>
      </FadeIn>

      <Spacer size="xl" />

      <FadeIn delay={300}>
        <SectionHeader
          title="Team Chat"
          actionLabel="Open"
          onAction={() => navigation.navigate('TeamChat')}
        />
        <Card onPress={() => navigation.navigate('TeamChat')}>
          <Text variant="caption" gold>
            My Gi Team
          </Text>
          <Spacer size="xs" />
          <Text variant="body" numberOfLines={2}>
            {latestChat
              ? `${latestChat.authorName}: ${latestChat.body}`
              : 'Start the conversation.'}
          </Text>
          <Spacer size="sm" />
          <View style={styles.chatMeta}>
            <Text variant="caption">
              {chatMessages.length} message{chatMessages.length === 1 ? '' : 's'}
            </Text>
            <View style={styles.chatPill}>
              <Text variant="caption" style={styles.chatPillText}>
                Join
              </Text>
            </View>
          </View>
        </Card>
      </FadeIn>

      <View style={styles.bottomSpace} />

      <CommunityDetailSheet
        visible={sheetVisible}
        title={sheetCopy.title}
        subtitle={sheetCopy.subtitle}
        body={sheetCopy.body}
        primaryLabel={sheetCopy.primaryLabel}
        onClose={() => setSheet({ kind: 'none' })}
      />
    </Screen>
  );
}
