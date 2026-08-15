import type { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing, w1Shadow } from '../../lib/theme';
import type { CommunityMemberPreview } from '../../types/communityHub';
import { Text } from '../ui/Text';
import { MemberAvatar } from './MemberAvatarStack';
import { SectionHeader } from './SectionHeader';

interface CommunityFeedSectionProps {
  members: CommunityMemberPreview[];
  onPressViewAll?: () => void;
  onPressComposer?: () => void;
  children: ReactNode;
}

export function CommunityFeedSection({
  members,
  onPressViewAll,
  onPressComposer,
  children,
}: CommunityFeedSectionProps) {
  const { colors } = useAppTheme();

  return (
    <View>
      <SectionHeader
        title="Community"
        actionLabel="View all >"
        onAction={onPressViewAll}
      />
      <Text variant="bodyMuted" style={styles.subtitle}>
        Connect. Ask. Share. Grow together.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.presence}
      >
        {members.map((member) => (
          <View key={member.id} style={styles.presenceItem}>
            <MemberAvatar
              initials={member.initials}
              color={member.avatarColor}
              online={member.online}
              size={44}
            />
          </View>
        ))}
      </ScrollView>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create a post"
        onPress={onPressComposer}
        style={({ pressed }) => [
          styles.composer,
          w1Shadow.soft,
          {
            backgroundColor: colors.secondaryBackground,
            borderColor: colors.border,
            opacity: pressed ? 0.92 : 1,
          },
        ]}
      >
        <Text variant="bodyMuted" style={{ flex: 1 }}>
          What&apos;s on your mind?
        </Text>
        <View
          style={[styles.plus, { backgroundColor: colors.goldMuted }]}
        >
          <Ionicons name="add" size={20} color={colors.goldAccent} />
        </View>
      </Pressable>
      <View style={styles.posts}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  presence: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  presenceItem: {
    marginRight: 2,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  plus: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posts: {
    gap: spacing.md,
  },
});
