import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing, w1Shadow } from '../../lib/theme';
import type { CommunityFeedPost } from '../../types/communityHub';
import { Text } from '../ui/Text';
import { MemberAvatar, MemberAvatarStack } from './MemberAvatarStack';

interface CommunityPostCardProps {
  post: CommunityFeedPost;
  onPressMenu?: () => void;
  onPress?: () => void;
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
  if (hours < 24) {
    return `${hours}h ago`;
  }
  return `${Math.round(hours / 24)}d ago`;
}

export function CommunityPostCard({
  post,
  onPressMenu,
  onPress,
}: CommunityPostCardProps) {
  const { colors } = useAppTheme();
  const overflow = Math.max(0, post.interestedCount - post.interested.length);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        w1Shadow.soft,
        {
          backgroundColor: colors.secondaryBackground,
          borderColor: colors.border,
          opacity: pressed ? 0.96 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <MemberAvatar
          initials={post.authorInitials}
          color={post.avatarColor}
          size={40}
        />
        <View style={styles.headerCopy}>
          <Text variant="body" style={{ fontWeight: '600' }}>
            {post.authorName}
          </Text>
          <Text variant="caption">{relativeTime(post.createdAt)}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Post options"
          onPress={onPressMenu}
          hitSlop={10}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={18}
            color={colors.secondaryText}
          />
        </Pressable>
      </View>
      <Text variant="body" style={styles.body}>
        {post.content}
      </Text>
      <View style={styles.footer}>
        <View style={styles.stat}>
          <Ionicons
            name="chatbubble-outline"
            size={14}
            color={colors.secondaryText}
          />
          <Text variant="caption">
            {post.commentCount} comment{post.commentCount === 1 ? '' : 's'}
          </Text>
        </View>
        <View style={styles.interested}>
          <MemberAvatarStack
            members={post.interested}
            size={24}
            max={3}
            overflowCount={overflow}
          />
          <Text variant="caption" style={{ color: colors.goldAccent }}>
            {post.interestedCount} interested
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radii.xl,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  body: {
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  interested: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
