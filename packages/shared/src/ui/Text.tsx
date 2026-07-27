import {
  Text as RNText,
  TextProps as RNTextProps,
} from 'react-native';

import { useAppTheme } from '../providers/ThemeProvider';
import type { TypographyVariant } from '../theme';

export interface AppTextProps extends RNTextProps {
  variant?: TypographyVariant;
  muted?: boolean;
  gold?: boolean;
}

export function Text({
  variant = 'body',
  muted = false,
  gold = false,
  style,
  ...rest
}: AppTextProps) {
  const { typography, colors } = useAppTheme();

  return (
    <RNText
      style={[
        typography[variant],
        muted && { color: colors.secondaryText },
        gold && { color: colors.goldAccent },
        style,
      ]}
      {...rest}
    />
  );
}
