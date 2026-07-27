import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import type { QuickAction, QuickActionId } from '../../types/home';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface QuickActionsProps {
  actions: QuickAction[];
  onAction: (id: QuickActionId) => void;
}

function chunkActions(actions: QuickAction[], size: number) {
  const rows: QuickAction[][] = [];
  for (let i = 0; i < actions.length; i += size) {
    rows.push(actions.slice(i, i + size));
  }
  return rows;
}

export function QuickActions({ actions, onAction }: QuickActionsProps) {
  const { colors } = useAppTheme();
  const rows = chunkActions(actions.slice(0, 4), 2);

  return (
    <View>
      <Text variant="subtitle">Quick Actions</Text>
      <Spacer size="sm" />
      <View style={styles.stack}>
        {rows.map((row) => (
          <View key={row.map((item) => item.id).join('-')} style={styles.row}>
            {row.map((action) => (
              <View key={action.id} style={styles.tile}>
                <Card
                  onPress={() => onAction(action.id)}
                  padded={false}
                  style={{
                    width: '100%',
                    backgroundColor: colors.elevatedSurface,
                  }}
                >
                  <View
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={`${action.label}. ${action.subtitle}`}
                    style={styles.tileInner}
                  >
                    <View
                      style={[
                        styles.iconWrap,
                        { backgroundColor: colors.goldMuted },
                      ]}
                    >
                      <Ionicons
                        name={action.icon}
                        size={18}
                        color={colors.goldAccent}
                      />
                    </View>
                    <Spacer size="sm" />
                    <Text variant="body" style={styles.label} numberOfLines={1}>
                      {action.label}
                    </Text>
                    <Text variant="caption" numberOfLines={2}>
                      {action.subtitle}
                    </Text>
                  </View>
                </Card>
              </View>
            ))}
            {row.length === 1 ? <View style={styles.tile} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tile: {
    flex: 1,
    minWidth: 0,
  },
  tileInner: {
    padding: spacing.md,
    minHeight: 124,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
  },
});
