import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing, w1Shadow } from '../../lib/theme';
import type { CommunityAcademyGroup } from '../../types/communityHub';
import { Text } from '../ui/Text';
import { MemberAvatarStack } from './MemberAvatarStack';

const ICONS: Record<
  CommunityAcademyGroup['icon'],
  keyof typeof Ionicons.glyphMap
> = {
  trophy: 'trophy-outline',
  sunny: 'sunny-outline',
  people: 'people-outline',
  heart: 'heart-outline',
};

interface AcademyGroupCardProps {
  group: CommunityAcademyGroup;
  onPress: () => void;
}

export function AcademyGroupCard({ group, onPress }: AcademyGroupCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${group.name}, ${group.memberCount} members`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        w1Shadow.soft,
        {
          backgroundColor: colors.secondaryBackground,
          borderColor: colors.border,
          opacity: pressed ? 0.94 : 1,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.goldMuted }]}>
        <Ionicons
          name={ICONS[group.icon]}
          size={20}
          color={colors.goldAccent}
        />
      </View>
      <View style={styles.copy}>
        <Text variant="body" style={{ fontWeight: '600' }} numberOfLines={1}>
          {group.name}
        </Text>
        <Text variant="caption">{group.memberCount} members</Text>
        <MemberAvatarStack members={group.members} size={22} max={3} />
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.secondaryText}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 240,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radii.xl,
    padding: spacing.md,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
});
