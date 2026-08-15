import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';

import {
  AnnouncementCard,
  BirthdayCard,
  FadeIn,
  OpenMatCard,
  Screen,
  SectionHeader,
  SeminarCard,
  Spacer,
  Text,
} from '../../components';
import { Card } from '../../components/ui/Card';
import { useCommunity } from '../../lib/providers/CommunityProvider';
import { radii, spacing } from '../../lib/theme';
import { useThemedStyles } from '../../lib/theme/useThemedStyles';
import type { CommunityStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<CommunityStackParamList, 'CommunityHome'>;

export function CommunityHomeScreen({ navigation }: Props) {
  const {
    announcements,
    birthdays,
    seminars,
    openMats,
    chatMessages,
    toggleSeminarRegistration,
  } = useCommunity();

  const styles = useThemedStyles((colors) => ({
    content: {},
    stack: {
      gap: spacing.md,
    },
    chatMeta: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
    },
    chatPill: {
      borderRadius: radii.pill,
      backgroundColor: colors.goldMuted,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
    },
    chatPillText: {
      color: colors.goldAccent,
    },
    bottomSpace: {
      height: spacing.lg,
    },
  }));

  const latestChat = chatMessages[chatMessages.length - 1];

  return (
    <Screen scroll contentStyle={styles.content}>
      <FadeIn>
        <Text variant="hero">Community</Text>
        <Spacer size="sm" />
        <Text variant="bodyMuted">
          Announcements, birthdays, seminars, and team chat.
        </Text>
      </FadeIn>

      <Spacer size="xl" />

      <FadeIn delay={60}>
        <SectionHeader title="Academy Announcements" />
        <View style={styles.stack}>
          {announcements.slice(0, 3).map((item) => (
            <AnnouncementCard
              key={item.id}
              announcement={item}
              compact
              onPress={() =>
                navigation.navigate('AnnouncementDetail', {
                  announcementId: item.id,
                })
              }
            />
          ))}
        </View>
      </FadeIn>

      <Spacer size="xl" />

      <FadeIn delay={100}>
        <SectionHeader title="Member Birthdays" />
        <BirthdayCard birthdays={birthdays} />
      </FadeIn>

      <Spacer size="xl" />

      <FadeIn delay={140}>
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

      <FadeIn delay={180}>
        <SectionHeader title="Open Mats" />
        <View style={styles.stack}>
          {openMats.map((session) => (
            <OpenMatCard key={session.id} session={session} />
          ))}
        </View>
      </FadeIn>

      <Spacer size="xl" />

      <FadeIn delay={220}>
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
    </Screen>
  );
}
