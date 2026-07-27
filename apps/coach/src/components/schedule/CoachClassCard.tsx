import { StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  Spacer,
  Text,
  radii,
  spacing,
  useAppTheme,
  type CoachClass,
} from '@openmat/shared';

import {
  CLASS_LEVEL_LABELS,
  formatGiType,
  formatTimeRange,
} from '../../utils/schedule';

interface CoachClassCardProps {
  item: CoachClass;
  onManage: () => void;
  onCheckIn: () => void;
}

export function CoachClassCard({
  item,
  onManage,
  onCheckIn,
}: CoachClassCardProps) {
  const { colors } = useAppTheme();
  const spotsLeft = Math.max(item.capacity - item.reservedCount, 0);
  const cancelled = item.status === 'cancelled';

  return (
    <Card>
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <Text variant="caption" gold>
            {formatTimeRange(item.startTime, item.endTime)}
          </Text>
          <Spacer size="xs" />
          <Text variant="subtitle" style={styles.title}>
            {item.title}
          </Text>
          <Spacer size="xxs" />
          <Text variant="body" muted>
            {item.instructorName}
          </Text>
        </View>
        <View style={[styles.spots, { backgroundColor: colors.goldMuted }]}>
          <Text variant="caption" style={{ color: colors.goldAccent }}>
            {cancelled ? 'Cancelled' : `${spotsLeft} left`}
          </Text>
        </View>
      </View>

      <Spacer size="md" />

      <View style={styles.metaRow}>
        <View
          style={[
            styles.metaChip,
            {
              borderColor: colors.border,
              backgroundColor: colors.primaryBackground,
            },
          ]}
        >
          <Text variant="caption" style={{ color: colors.secondaryText }}>
            {formatGiType(item.giType)}
          </Text>
        </View>
        <View
          style={[
            styles.metaChip,
            {
              borderColor: colors.border,
              backgroundColor: colors.primaryBackground,
            },
          ]}
        >
          <Text variant="caption" style={{ color: colors.secondaryText }}>
            {CLASS_LEVEL_LABELS[item.level]}
          </Text>
        </View>
        <View
          style={[
            styles.metaChip,
            {
              borderColor: colors.border,
              backgroundColor: colors.primaryBackground,
            },
          ]}
        >
          <Text variant="caption" style={{ color: colors.secondaryText }}>
            {item.reservedCount}/{item.capacity} reserved
          </Text>
        </View>
      </View>

      <Spacer size="md" />

      <View style={styles.actions}>
        <View style={styles.actionGrow}>
          <Button
            label="Manage"
            variant="secondary"
            onPress={onManage}
            disabled={cancelled}
          />
        </View>
        <View style={styles.actionGrow}>
          <Button
            label="Check-In"
            onPress={onCheckIn}
            disabled={cancelled}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 17,
  },
  spots: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  metaChip: {
    borderRadius: radii.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionGrow: {
    flex: 1,
  },
});
