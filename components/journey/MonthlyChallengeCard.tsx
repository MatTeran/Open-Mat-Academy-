import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '../../lib/theme';
import type { Challenge } from '../../types/journey';
import {
  formatDaysRemaining,
  formatXp,
  getChallengeProgress,
} from '../../utils/journey';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';
import { ProgressBar } from './ProgressBar';

interface MonthlyChallengeCardProps {
  challenge: Challenge;
  badgeName?: string | null;
}

function statusLabel(status: Challenge['status']): string {
  switch (status) {
    case 'locked':
      return 'Locked';
    case 'completed':
      return 'Completed';
    default:
      return 'Active';
  }
}

export function MonthlyChallengeCard({
  challenge,
  badgeName,
}: MonthlyChallengeCardProps) {
  const progress = getChallengeProgress(challenge);
  const locked = challenge.status === 'locked';

  return (
    <Card style={locked ? styles.lockedCard : undefined}>
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <Text variant="subtitle">{challenge.title}</Text>
          <Spacer size="xs" />
          <Text variant="caption">{challenge.description}</Text>
        </View>
        <View
          style={[
            styles.statusPill,
            challenge.status === 'completed' && styles.statusComplete,
            locked && styles.statusLocked,
          ]}
        >
          <Text
            variant="caption"
            style={
              challenge.status === 'completed'
                ? styles.statusCompleteText
                : locked
                  ? styles.statusLockedText
                  : styles.statusActiveText
            }
          >
            {statusLabel(challenge.status)}
          </Text>
        </View>
      </View>

      <Spacer size="md" />
      <ProgressBar
        progress={locked ? 0 : progress.percent}
        tone={progress.isComplete ? 'success' : 'gold'}
        accessibilityLabel={`${challenge.title} ${progress.current} of ${progress.target}`}
      />
      <Spacer size="sm" />
      <Text variant="body">
        {progress.current} / {progress.target}
      </Text>
      <Spacer size="md" />
      <View style={styles.metaGrid}>
        <Meta label="XP Reward" value={`+${formatXp(challenge.xpReward)}`} />
        <Meta
          label="Badge"
          value={badgeName || '—'}
        />
        <Meta
          label="Time"
          value={
            progress.isComplete
              ? 'Done'
              : formatDaysRemaining(challenge.endDate)
          }
        />
      </View>
    </Card>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text variant="caption">{label}</Text>
      <Text variant="caption" gold numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lockedCard: {
    opacity: 0.55,
  },
  topRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  statusPill: {
    borderRadius: radii.pill,
    backgroundColor: colors.goldMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  statusComplete: {
    backgroundColor: 'rgba(34, 197, 94, 0.16)',
  },
  statusLocked: {
    backgroundColor: colors.border,
  },
  statusActiveText: {
    color: colors.goldAccent,
  },
  statusCompleteText: {
    color: colors.success,
  },
  statusLockedText: {
    color: colors.secondaryText,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metaItem: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
});
