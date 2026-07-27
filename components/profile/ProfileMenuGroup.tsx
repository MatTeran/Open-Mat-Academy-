import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii } from '../../lib/theme';

export function ProfileMenuGroup({ children }: PropsWithChildren) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.group,
        {
          backgroundColor: colors.secondaryBackground,
          borderColor: colors.border,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    width: '100%',
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});
