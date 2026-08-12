import { PropsWithChildren } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, w1Radii, w1Shadow } from '../../../lib/theme';

interface SoftActionButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  trailing?: string | null;
  style?: StyleProp<ViewStyle>;
}

/**
 * Soft gradient CTA matching the mockup Checked In / tactile buttons.
 */
export function SoftActionButton({
  label,
  onPress,
  disabled,
  loading,
  icon,
  trailing,
  style,
}: SoftActionButtonProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled || loading) }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.shadowHost,
        w1Shadow.button,
        style,
        (pressed || loading) && styles.pressed,
      ]}
    >
      <LinearGradient
        colors={
          isDark
            ? [colors.goldTintSurface, colors.elevatedSurface]
            : ['#FBF8F3', '#E8E0D4']
        }
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[
          styles.btn,
          { borderColor: isDark ? colors.border : 'rgba(28, 26, 23, 0.06)' },
        ]}
      >
        {icon ? (
          <Ionicons name={icon} size={16} color={colors.goldAccent} />
        ) : null}
        <Text
          style={[styles.label, { color: colors.text }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {label}
        </Text>
        {trailing ? (
          <Text style={[styles.trailing, { color: colors.goldAccent }]}>
            {trailing}
          </Text>
        ) : null}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadowHost: {
    borderRadius: w1Radii.button,
  },
  btn: {
    minHeight: 42,
    borderRadius: w1Radii.button,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
  },
  label: {
    fontFamily: fontFamilies.semibold,
    fontSize: 11,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  trailing: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
