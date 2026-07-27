import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { useAppTheme } from '../providers/ThemeProvider';
import { fontFamilies, radii, spacing } from '../theme';
import { Text } from './Text';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
}

export function Input({
  label,
  error,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const { colors } = useAppTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.secondaryText}
        selectionColor={colors.goldAccent}
        style={[
          styles.input,
          {
            backgroundColor: colors.secondaryBackground,
            borderColor: error
              ? colors.error
              : focused
                ? colors.goldAccent
                : colors.border,
            color: colors.text,
          },
          style,
        ]}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        {...rest}
      />
      {error ? (
        <Text variant="caption" style={{ color: colors.error }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    marginLeft: spacing.xxs,
  },
  input: {
    minHeight: 52,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    fontFamily: fontFamilies.regular,
    fontSize: 16,
  },
});
