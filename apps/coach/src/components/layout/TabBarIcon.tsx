import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { useAppTheme } from '@openmat/shared';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface TabBarIconProps {
  name: IconName;
  focused: boolean;
  size?: number;
}

export function TabBarIcon({ name, focused, size = 22 }: TabBarIconProps) {
  const { colors } = useAppTheme();
  return (
    <Ionicons
      name={name}
      size={size}
      color={focused ? colors.goldAccent : colors.secondaryText}
    />
  );
}
