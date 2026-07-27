import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, View } from 'react-native';

import {
  BeltBadge,
  Button,
  Card,
  Screen,
  Spacer,
  Text,
} from '../../components';
import { formatBeltRank, formatStripeCount } from '../../lib/mocks/profile';
import { useProfile } from '../../lib/providers/ProfileProvider';
import { radii, spacing } from '../../lib/theme';
import { useThemedStyles } from '../../lib/theme/useThemedStyles';
import type { ProfileStackParamList } from '../../types/navigation';
import type { BeltRank } from '../../types/user';
import { formatShortDate } from '../../utils';

type Props = NativeStackScreenProps<ProfileStackParamList, 'BeltRank'>;

const BELTS: BeltRank[] = ['white', 'blue', 'purple', 'brown', 'black'];
const STRIPES: Array<0 | 1 | 2 | 3 | 4> = [0, 1, 2, 3, 4];

export function BeltRankScreen({ navigation }: Props) {
  const { hub, setBeltProgress } = useProfile();
  const { belt, stripes, promotedAt, nextStripeHint } = hub.beltProgress;

  const styles = useThemedStyles((colors) => ({
    content: {},
    chipRow: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: spacing.sm,
    },
    chip: {
      borderRadius: radii.pill,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.secondaryBackground,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    chipSelected: {
      borderColor: colors.goldAccent,
      backgroundColor: colors.goldMuted,
    },
    chipTextSelected: {
      color: colors.goldAccent,
    },
  }));

  return (
    <Screen scroll contentStyle={styles.content}>
      <Button label="Back" variant="ghost" onPress={() => navigation.goBack()} />
      <Spacer size="md" />
      <Text variant="hero">Belt Rank</Text>
      <Spacer size="sm" />
      <Text variant="bodyMuted">Track rank and stripes on the mat.</Text>

      <Spacer size="xl" />

      <Card>
        <BeltBadge belt={belt} stripes={stripes} size="lg" />
        <Spacer size="md" />
        <Text variant="subtitle">
          {formatBeltRank(belt)} · {formatStripeCount(stripes)}
        </Text>
        <Spacer size="xs" />
        <Text variant="caption">
          Last promotion · {formatShortDate(promotedAt)}
        </Text>
        <Spacer size="md" />
        <Text variant="bodyMuted">{nextStripeHint}</Text>
      </Card>

      <Spacer size="xl" />

      <Text variant="subtitle">Belt</Text>
      <Spacer size="sm" />
      <View style={styles.chipRow}>
        {BELTS.map((option) => {
          const selected = option === belt;
          return (
            <Pressable
              key={option}
              onPress={() => setBeltProgress(option, stripes)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text
                variant="caption"
                style={selected ? styles.chipTextSelected : undefined}
              >
                {formatBeltRank(option)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Spacer size="xl" />

      <Text variant="subtitle">Stripes</Text>
      <Spacer size="sm" />
      <View style={styles.chipRow}>
        {STRIPES.map((option) => {
          const selected = option === stripes;
          return (
            <Pressable
              key={option}
              onPress={() => setBeltProgress(belt, option)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text
                variant="caption"
                style={selected ? styles.chipTextSelected : undefined}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Spacer size="lg" />
      <Text variant="caption">
        Coach-confirmed promotions will sync from the academy later. This mock
        editor lets you preview the hub.
      </Text>
    </Screen>
  );
}
