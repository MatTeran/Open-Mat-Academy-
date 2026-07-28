import { StyleSheet, View } from 'react-native';

import {
  CLASS_LEVEL_COLORS,
  CLASS_LEVEL_LABELS,
} from '../../lib/data/schedule';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type { ScheduleClass } from '../../types/schedule';
import { formatGiType, formatTimeRange } from '../../utils/schedule';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface ClassCardProps {
  item: ScheduleClass;
  reserved?: boolean;
  reserving?: boolean;
  onReserve: () => void;
}

function needsDarkLabel(levelColor: string): boolean {
  // Light flyer colors need dark chip text for contrast.
  return (
    levelColor === '#38BDF8' ||
    levelColor === '#2DD4BF' ||
    levelColor === '#86EFAC' ||
    levelColor === '#FDE68A' ||
    levelColor === '#E7E5E4' ||
    levelColor === '#F472B6' ||
    levelColor === '#D6A35C'
  );
}

export function ClassCard({
  item,
  reserved = false,
  reserving = false,
  onReserve,
}: ClassCardProps) {
  const { colors } = useAppTheme();
  const programColor = CLASS_LEVEL_COLORS[item.level];
  const programText = needsDarkLabel(programColor)
    ? '#0D0D0D'
    : '#FFFFFF';

  return (
    <Card padded={false}>
      <View style={styles.row}>
        <View
          style={[styles.colorBar, { backgroundColor: programColor }]}
        />
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.copy}>
              <Text variant="caption" gold>
                {formatTimeRange(item.startTime, item.endTime)}
              </Text>
              <Spacer size="xs" />
              <Text variant="subtitle" style={styles.title}>
                {item.title}
              </Text>
              {item.subtitle ? (
                <>
                  <Spacer size="xxs" />
                  <Text variant="bodyMuted">{item.subtitle}</Text>
                </>
              ) : null}
              {item.note ? (
                <>
                  <Spacer size="xxs" />
                  <Text variant="caption" style={{ color: colors.goldAccent }}>
                    {item.note}
                  </Text>
                </>
              ) : null}
            </View>
            {typeof item.spotsLeft === 'number' ? (
              <View
                style={[styles.spots, { backgroundColor: colors.goldMuted }]}
              >
                <Text variant="caption" style={{ color: colors.goldAccent }}>
                  {item.spotsLeft} left
                </Text>
              </View>
            ) : null}
          </View>

          <Spacer size="md" />

          <View style={styles.metaRow}>
            <View
              style={[
                styles.metaChip,
                {
                  backgroundColor: programColor,
                  borderColor: programColor,
                },
              ]}
            >
              <Text variant="caption" style={{ color: programText }}>
                {CLASS_LEVEL_LABELS[item.level]}
              </Text>
            </View>
            {item.giType !== 'none' ? (
              <View
                style={[
                  styles.metaChip,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.primaryBackground,
                  },
                ]}
              >
                <Text
                  variant="caption"
                  style={{ color: colors.secondaryText }}
                >
                  {formatGiType(item.giType)}
                </Text>
              </View>
            ) : null}
          </View>

          <Spacer size="md" />

          <Button
            label={reserved ? 'Reserved' : 'Reserve'}
            variant={reserved ? 'secondary' : 'primary'}
            loading={reserving}
            onPress={onReserve}
            disabled={reserved}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  colorBar: {
    width: 6,
  },
  content: {
    flex: 1,
    minWidth: 0,
    padding: spacing.lg,
  },
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
});
