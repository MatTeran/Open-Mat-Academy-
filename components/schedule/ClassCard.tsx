import { Pressable, StyleSheet, View } from 'react-native';

import {
  CLASS_LEVEL_COLORS,
  CLASS_LEVEL_LABELS,
} from '../../lib/data/schedule';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Radii, w1Shadow } from '../../lib/theme';
import type { ScheduleClass } from '../../types/schedule';
import {
  formatGiType,
  formatTimeRange,
  getClassDurationMinutes,
} from '../../utils/schedule';
import { Text } from '../ui/Text';

interface ClassCardProps {
  item: ScheduleClass;
  reserved?: boolean;
  reserving?: boolean;
  onReserve: () => void;
  onCancel?: () => void;
}

function needsDarkLabel(levelColor: string): boolean {
  return (
    levelColor === '#38BDF8' ||
    levelColor === '#2DD4BF' ||
    levelColor === '#86EFAC' ||
    levelColor === '#FDE68A' ||
    levelColor === '#FDE047' ||
    levelColor === '#E7E5E4' ||
    levelColor === '#F472B6' ||
    levelColor === '#D6A35C' ||
    levelColor === '#14B8A6' ||
    levelColor === '#FEF3C7'
  );
}

export function ClassCard({
  item,
  reserved = false,
  reserving = false,
  onReserve,
  onCancel,
}: ClassCardProps) {
  const { colors } = useAppTheme();
  const programColor = CLASS_LEVEL_COLORS[item.level];
  const programText = needsDarkLabel(programColor) ? '#0D0D0D' : '#FFFFFF';
  const duration = getClassDurationMinutes(item.startTime, item.endTime);

  const handlePress = () => {
    if (reserved) {
      onCancel?.();
      return;
    }
    onReserve();
  };

  return (
    <View
      style={[
        styles.card,
        w1Shadow.soft,
        {
          backgroundColor: reserved ? colors.goldTintSurface : colors.elevatedSurface,
          borderColor: reserved ? 'rgba(154,103,53,0.28)' : colors.border,
        },
      ]}
    >
      <View style={[styles.colorBar, { backgroundColor: programColor }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.copy}>
            <Text
              variant="caption"
              style={{ color: colors.goldAccent, letterSpacing: 0.4 }}
            >
              {formatTimeRange(item.startTime, item.endTime)}
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              {item.title}
            </Text>
            <Text variant="caption" style={{ color: colors.secondaryText }}>
              {item.instructor} · {duration} min
            </Text>
            {item.note ? (
              <Text
                variant="caption"
                style={{ color: colors.goldAccent, marginTop: 6 }}
              >
                {item.note}
              </Text>
            ) : null}
          </View>
          {typeof item.spotsLeft === 'number' && !reserved ? (
            <View
              style={[styles.spots, { backgroundColor: colors.goldMuted }]}
            >
              <Text
                variant="caption"
                style={{ color: colors.goldAccent, fontFamily: fontFamilies.semibold }}
              >
                {item.spotsLeft} left
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.foot}>
          <View style={styles.metaRow}>
            <View
              style={[
                styles.metaChip,
                { backgroundColor: `${programColor}2E` },
              ]}
            >
              <Text
                variant="caption"
                style={{
                  color: needsDarkLabel(programColor)
                    ? programColor
                    : programText === '#FFFFFF'
                      ? programColor
                      : programText,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                {CLASS_LEVEL_LABELS[item.level]}
              </Text>
            </View>
            {item.giType !== 'none' ? (
              <View
                style={[
                  styles.metaChip,
                  { backgroundColor: colors.goldMuted },
                ]}
              >
                <Text
                  variant="caption"
                  style={{
                    color: colors.goldAccent,
                    fontFamily: fontFamilies.semibold,
                  }}
                >
                  {formatGiType(item.giType)}
                </Text>
              </View>
            ) : null}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={reserved ? 'Cancel reservation' : 'Reserve'}
            accessibilityState={{ busy: reserving, disabled: reserving }}
            disabled={reserving}
            onPress={handlePress}
            style={({ pressed }) => [
              styles.cta,
              reserved
                ? {
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(154,103,53,0.35)',
                    borderWidth: 1,
                  }
                : { backgroundColor: colors.goldAccent, borderWidth: 0 },
              { opacity: pressed || reserving ? 0.75 : 1 },
            ]}
          >
            <Text
              style={[
                styles.ctaLabel,
                { color: reserved ? colors.goldAccent : colors.cardBackground },
              ]}
            >
              {reserving ? '…' : reserved ? 'Cancel' : 'Reserve'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  colorBar: {
    width: 4,
  },
  content: {
    flex: 1,
    minWidth: 0,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontFamily: fontFamilies.semibold,
    fontSize: 16,
    letterSpacing: -0.2,
    marginTop: 2,
  },
  spots: {
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    flex: 1,
  },
  metaChip: {
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  cta: {
    borderRadius: w1Radii.chip,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  ctaLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: 12,
  },
});
