import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type { OpenMatSession } from '../../types/community';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface OpenMatCardProps {
  session: OpenMatSession;
}

export function OpenMatCard({ session }: OpenMatCardProps) {
  const { colors } = useAppTheme();

  return (
    <Card>
      <View style={styles.header}>
        <Text variant="subtitle">{session.title}</Text>
        <View style={[styles.badge, { backgroundColor: colors.goldMuted }]}>
          <Text variant="caption" style={{ color: colors.goldAccent }}>
            {session.giType}
          </Text>
        </View>
      </View>
      <Spacer size="xs" />
      <Text variant="bodyMuted">
        {session.dayLabel} · {session.timeLabel}
      </Text>
      {session.notes ? (
        <>
          <Spacer size="xs" />
          <Text variant="caption">{session.notes}</Text>
        </>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  badge: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
});
