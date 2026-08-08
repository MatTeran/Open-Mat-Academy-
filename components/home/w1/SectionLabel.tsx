import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies } from '../../../lib/theme';

interface SectionLabelProps {
  children: string;
  tone?: 'default' | 'accent';
  style?: StyleProp<TextStyle>;
}

export function SectionLabel({
  children,
  tone = 'default',
  style,
}: SectionLabelProps) {
  const { colors } = useAppTheme();

  return (
    <Text
      style={[
        styles.label,
        {
          color: tone === 'accent' ? colors.goldAccent : colors.secondaryText,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fontFamilies.semibold,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
});
