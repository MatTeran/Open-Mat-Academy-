import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Text } from './Text';

export type ButtonVariant =
  | 'primary'
  | 'primaryGold'
  | 'secondary'
  | 'ghost'
  | 'reserved'
  | 'outlineGold';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
}

/**
 * Primary interaction control — gold CTA matches Dark Mat User App look.
 * Background is painted on an inner View for NativeWind Pressable safety.
 */
export function Button({
  label,
  variant = 'primary',
  loading = false,
  loadingLabel,
  fullWidth = true,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const { colors, typography } = useAppTheme();
  const isDisabled = Boolean(disabled) || loading;
  const resolvedVariant = variant === 'primary' ? 'primaryGold' : variant;
  const displayLabel = loading ? loadingLabel || label : label;

  const surfaceByVariant = {
    primaryGold: {
      backgroundColor: colors.goldAccent,
      borderColor: colors.goldAccent,
    },
    reserved: {
      backgroundColor: colors.goldTintSurface,
      borderColor: colors.goldAccent,
    },
    outlineGold: {
      backgroundColor: 'transparent',
      borderColor: colors.goldAccent,
    },
    secondary: {
      backgroundColor: colors.secondaryBackground,
      borderColor: colors.border,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
  } as const;

  const labelByVariant = {
    primaryGold: { color: colors.primaryBackground },
    reserved: { color: colors.goldAccent },
    outlineGold: { color: colors.goldAccent },
    secondary: { color: colors.text },
    ghost: { color: colors.goldAccent },
  } as const;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressScale,
        style as ViewStyle,
      ]}
      {...rest}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.surface,
            surfaceByVariant[resolvedVariant],
            pressed &&
              !isDisabled &&
              resolvedVariant === 'primaryGold' && {
                backgroundColor: colors.goldPressed,
              },
            isDisabled &&
              resolvedVariant === 'primaryGold' && {
                backgroundColor: colors.goldTintSurface,
                borderColor: 'rgba(212, 175, 55, 0.45)',
              },
          ]}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator
                color={
                  resolvedVariant === 'primaryGold'
                    ? colors.primaryBackground
                    : colors.goldAccent
                }
              />
              <Text
                style={[
                  typography.button,
                  labelByVariant[resolvedVariant],
                  isDisabled &&
                    resolvedVariant === 'primaryGold' && {
                      color: '#C4A86A',
                    },
                ]}
              >
                {displayLabel}
              </Text>
            </View>
          ) : (
            <Text
              style={[
                typography.button,
                labelByVariant[resolvedVariant],
                isDisabled &&
                  resolvedVariant === 'primaryGold' && {
                    color: '#C4A86A',
                  },
              ]}
            >
              {displayLabel}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    alignSelf: 'stretch',
    width: '100%',
  },
  pressScale: {
    transform: [{ scale: 0.985 }],
  },
  surface: {
    minHeight: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
