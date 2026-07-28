import type { ThemeColors } from '@openmat/shared';
import { fontFamilies } from '@openmat/shared';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { HeaderBackButton } from './HeaderBackButton';

/** Shared native-stack chrome for Coach nested screens, with a visible Back control. */
export function coachStackScreenOptions(
  colors: ThemeColors,
): NativeStackNavigationOptions {
  return {
    headerStyle: { backgroundColor: colors.primaryBackground },
    headerTintColor: colors.goldAccent,
    headerTitleStyle: {
      fontFamily: fontFamilies.semibold,
      color: colors.text,
    },
    headerShadowVisible: false,
    contentStyle: { backgroundColor: colors.primaryBackground },
    headerLeft: () => <HeaderBackButton />,
  };
}
