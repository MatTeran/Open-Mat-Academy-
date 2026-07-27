import { View } from 'react-native';

import { spacing, SpacingToken } from '../../lib/theme';

interface SpacerProps {
  size?: SpacingToken;
  horizontal?: boolean;
}

export function Spacer({ size = 'md', horizontal = false }: SpacerProps) {
  const value = spacing[size];
  return (
    <View
      style={
        horizontal
          ? { width: value }
          : { height: value }
      }
    />
  );
}
