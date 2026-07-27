import { PropsWithChildren, ReactElement } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControlProps,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { spacing } from '../../lib/theme';

export interface ScreenProps extends PropsWithChildren {
  scroll?: boolean;
  padded?: boolean;
  /** Skip top safe-area padding so content (e.g. hero banners) can go edge-to-edge. */
  flushTop?: boolean;
  keyboard?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  refreshControl?: ReactElement<RefreshControlProps>;
}

/**
 * Standard screen shell with Open Mat background + safe areas.
 * Safe-area padding is applied last so callers cannot override it.
 */
export function Screen({
  children,
  scroll = false,
  padded = true,
  flushTop = false,
  keyboard = false,
  style,
  contentStyle,
  refreshControl,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const safePadding = {
    paddingTop: flushTop ? 0 : insets.top + (padded ? spacing.md : 0),
    paddingBottom: insets.bottom + (padded ? spacing.lg : 0),
    paddingHorizontal: padded ? spacing.lg : 0,
  };

  const baseStyle = [styles.base, { backgroundColor: colors.primaryBackground }];

  const body = scroll ? (
    <ScrollView
      style={baseStyle}
      contentContainerStyle={[styles.scrollContent, contentStyle, safePadding]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[baseStyle, contentStyle, style, safePadding]}>{children}</View>
  );

  if (!keyboard) {
    return body;
  }

  return (
    <KeyboardAvoidingView
      style={baseStyle}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
    >
      {body}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
