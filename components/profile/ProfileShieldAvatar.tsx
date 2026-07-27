import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, {
  ClipPath,
  Defs,
  G,
  Image as SvgImage,
  Path,
  Text as SvgText,
} from 'react-native-svg';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { fontFamilies, spacing } from '../../lib/theme';

/** Athletic shield silhouette for BJJ profile identity. */
const SHIELD_PATH =
  'M50 3.5 C50 3.5 90 15 90 15 L90 48 C90 74 72 90 50 97 C28 90 10 74 10 48 L10 15 Z';

interface ProfileShieldAvatarProps {
  uri: string | null;
  initials: string;
  onPress: () => void;
  size?: number;
}

export function ProfileShieldAvatar({
  uri,
  initials,
  onPress,
  size = 118,
}: ProfileShieldAvatarProps) {
  const { colors } = useAppTheme();
  const clipId = 'profile-shield-clip';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Change profile photo"
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrap,
        { width: size, height: size },
        pressed && styles.pressed,
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <ClipPath id={clipId}>
            <Path d={SHIELD_PATH} />
          </ClipPath>
        </Defs>

        <G clipPath={`url(#${clipId})`}>
          <Path d={SHIELD_PATH} fill={colors.goldMuted} />
          {uri ? (
            <SvgImage
              href={{ uri }}
              width="100"
              height="100"
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            <SvgText
              x="50"
              y="56"
              fill={colors.goldAccent}
              fontSize="26"
              fontFamily={fontFamilies.bold}
              fontWeight="700"
              textAnchor="middle"
            >
              {initials}
            </SvgText>
          )}
        </G>

        <Path
          d={SHIELD_PATH}
          fill="none"
          stroke={colors.goldAccent}
          strokeWidth={2.4}
        />
      </Svg>

      <View
        style={[
          styles.cameraBadge,
          {
            backgroundColor: colors.goldAccent,
            borderColor: colors.primaryBackground,
          },
        ]}
      >
        <Ionicons name="camera" size={12} color={colors.primaryBackground} />
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
  cameraBadge: {
    position: 'absolute',
    right: spacing.xs,
    bottom: spacing.sm,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
