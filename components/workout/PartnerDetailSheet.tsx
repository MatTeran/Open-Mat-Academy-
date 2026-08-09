import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type { PartnerInsight } from '../../types/trainingInsights';
import { formatIntensityScore } from '../../utils/trainingInsights';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface PartnerDetailSheetProps {
  partner: PartnerInsight | null;
  visible: boolean;
  onClose: () => void;
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricRow}>
      <Text variant="caption" muted>
        {label}
      </Text>
      <Text variant="subtitle">{value}</Text>
    </View>
  );
}

export function PartnerDetailSheet({
  partner,
  visible,
  onClose,
}: PartnerDetailSheetProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  if (!partner) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: colors.cardBackground,
              paddingBottom: Math.max(insets.bottom, spacing.lg),
            },
          ]}
          onPress={(event) => event.stopPropagation()}
        >
          <View
            style={[styles.handle, { backgroundColor: colors.border }]}
          />
          <Text variant="subtitle">{partner.name}</Text>
          <Spacer size="xs" />
          <Text variant="caption" muted>
            Your logged rounds with this partner
          </Text>
          <Spacer size="lg" />
          <MetricRow
            label="Rounds Together"
            value={`${partner.rounds}`}
          />
          <Spacer size="md" />
          <MetricRow
            label="Sessions Together"
            value={`${partner.sessions}`}
          />
          {partner.averageIntensity != null ? (
            <>
              <Spacer size="md" />
              <MetricRow
                label="Average Intensity"
                value={`${formatIntensityScore(partner.averageIntensity)} / 10`}
              />
            </>
          ) : null}
          {partner.mostLoggedTechniqueLabel ? (
            <>
              <Spacer size="md" />
              <MetricRow
                label="Most Logged Technique"
                value={partner.mostLoggedTechniqueLabel}
              />
            </>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(20, 18, 14, 0.35)',
  },
  sheet: {
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  metricRow: {
    gap: 4,
  },
});
