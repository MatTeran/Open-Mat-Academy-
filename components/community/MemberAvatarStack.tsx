import { Image, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { Text } from '../ui/Text';

export interface MemberAvatarStackProps {
  members: Array<{
    id: string;
    initials: string;
    avatarColor: string;
  }>;
  size?: number;
  max?: number;
  overflowCount?: number;
}

export function MemberAvatarStack({
  members,
  size = 28,
  max = 3,
  overflowCount,
}: MemberAvatarStackProps) {
  const { colors } = useAppTheme();
  const shown = members.slice(0, max);
  const extra =
    overflowCount ?? Math.max(0, members.length > max ? members.length - max : 0);

  return (
    <View style={styles.row} accessibilityRole="image">
      {shown.map((member, index) => (
        <View
          key={member.id}
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: member.avatarColor,
              borderColor: colors.secondaryBackground,
              marginLeft: index === 0 ? 0 : -size * 0.28,
              zIndex: shown.length - index,
            },
          ]}
        >
          <Text
            variant="caption"
            style={[styles.initials, { fontSize: size * 0.32, color: '#FFFCF8' }]}
          >
            {member.initials}
          </Text>
        </View>
      ))}
      {extra > 0 ? (
        <View
          style={[
            styles.avatar,
            styles.overflow,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: -size * 0.28,
              backgroundColor: colors.goldMuted,
              borderColor: colors.secondaryBackground,
            },
          ]}
        >
          <Text
            variant="caption"
            style={{ fontSize: size * 0.3, color: colors.goldAccent }}
          >
            +{extra}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/** Single circular member avatar with optional online dot. */
export function MemberAvatar({
  initials,
  color,
  size = 40,
  online,
  imageUrl,
}: {
  initials: string;
  color: string;
  size?: number;
  online?: boolean;
  imageUrl?: string;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={{ width: size, height: size }}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
          accessibilityLabel={initials}
        />
      ) : (
        <View
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
            },
          ]}
        >
          <Text
            variant="caption"
            style={{ fontSize: size * 0.32, color: '#FFFCF8', fontWeight: '700' }}
          >
            {initials}
          </Text>
        </View>
      )}
      {online ? (
        <View
          style={[
            styles.online,
            {
              borderColor: colors.secondaryBackground,
              width: size * 0.28,
              height: size * 0.28,
              borderRadius: size * 0.14,
              right: 0,
              bottom: 0,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    overflow: 'hidden',
  },
  overflow: {
    zIndex: 0,
  },
  initials: {
    fontWeight: '700',
  },
  online: {
    position: 'absolute',
    backgroundColor: '#22C55E',
    borderWidth: 2,
  },
});
