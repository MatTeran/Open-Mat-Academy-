import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { spacing } from '../../lib/theme';
import { Text } from '../ui/Text';

interface ProfileAvatarProps {
  uri: string | null;
  initials: string;
  onPress: () => void;
  size?: number;
  /** Gold ring treatment for the profile hero. */
  ring?: boolean;
}

export function ProfileAvatar({
  uri,
  initials,
  onPress,
  size = 76,
  ring = false,
}: ProfileAvatarProps) {
  const { colors } = useAppTheme();
  const ringWidth = ring ? 3 : 0;
  const inner = size - ringWidth * 2 - (ring ? 8 : 0);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Change profile photo"
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrap,
        ring && {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: ringWidth,
          borderColor: colors.goldAccent,
          padding: 4,
          backgroundColor: colors.primaryBackground,
        },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.inner,
          {
            width: ring ? inner : size,
            height: ring ? inner : size,
            borderRadius: (ring ? inner : size) / 2,
            backgroundColor: colors.goldMuted,
            borderColor: ring ? 'transparent' : colors.border,
            borderWidth: ring ? 0 : 1,
          },
        ]}
      >
        {uri ? (
          <Image source={{ uri }} style={styles.image} />
        ) : (
          <View style={styles.fallback}>
            <Text
              variant="title"
              gold
              style={{ fontSize: Math.round(size * 0.28) }}
            >
              {initials}
            </Text>
          </View>
        )}
      </View>

      <View
        style={[
          styles.badge,
          {
            backgroundColor: colors.goldAccent,
            borderColor: colors.primaryBackground,
          },
        ]}
      >
        <Ionicons name="camera" size={13} color={colors.primaryBackground} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  inner: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: spacing.xxs,
    bottom: spacing.xxs,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
