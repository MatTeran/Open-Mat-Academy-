import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing, w1Shadow } from '../../lib/theme';
import type { CommunityCompetition } from '../../types/communityHub';
import { Text } from '../ui/Text';
import { MemberAvatarStack } from './MemberAvatarStack';

interface CompetitionCardProps {
  competition: CommunityCompetition;
  onPressDetails: () => void;
  onToggleCompeting: () => void;
}

function formatRange(start: string, end: string): string {
  const s = new Date(`${start}T12:00:00`);
  const e = new Date(`${end}T12:00:00`);
  const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  if (start === end) {
    return `${s.toLocaleDateString(undefined, opts)}, ${s.getFullYear()}`;
  }
  return `${s.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}–${e.toLocaleDateString(undefined, { day: 'numeric' })}, ${e.getFullYear()}`;
}

export function CompetitionCard({
  competition,
  onPressDetails,
  onToggleCompeting,
}: CompetitionCardProps) {
  const { colors } = useAppTheme();
  const overflow = Math.max(
    0,
    competition.academyAttendeeCount - competition.attendees.length,
  );

  return (
    <View
      style={[
        styles.card,
        w1Shadow.card,
        {
          backgroundColor: colors.secondaryBackground,
          borderColor: colors.border,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${competition.name} details`}
        onPress={onPressDetails}
      >
        <View style={styles.hero}>
          <Image
            source={{ uri: competition.imageUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(12,10,8,0.72)']}
            style={StyleSheet.absoluteFill}
          />
          <Text variant="caption" style={styles.badge}>
            TOURNAMENT
          </Text>
        </View>
        <View style={styles.body}>
          <Text variant="subtitle" style={styles.name}>
            {competition.name}
          </Text>
          <Text variant="caption">
            {formatRange(competition.startDate, competition.endDate)}
          </Text>
          <Text variant="caption">{competition.location}</Text>
          <View style={styles.attendees}>
            <MemberAvatarStack
              members={competition.attendees}
              size={26}
              max={4}
              overflowCount={overflow}
            />
            <Text variant="caption" style={{ color: colors.goldAccent }}>
              {competition.academyAttendeeCount} from your academy
            </Text>
          </View>
        </View>
      </Pressable>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View details"
          onPress={onPressDetails}
          style={[styles.detailsBtn, { backgroundColor: colors.goldMuted }]}
        >
          <Text variant="caption" style={{ color: colors.goldAccent, fontWeight: '700' }}>
            View Details
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: competition.isCompeting }}
          accessibilityLabel={
            competition.isCompeting ? 'Competing' : "I'm Competing"
          }
          onPress={onToggleCompeting}
          style={[
            styles.competeBtn,
            {
              backgroundColor: competition.isCompeting
                ? colors.goldAccent
                : colors.elevatedSurface,
              borderColor: colors.goldAccent,
            },
          ]}
        >
          {competition.isCompeting ? (
            <Ionicons name="checkmark" size={14} color="#FFFCF8" />
          ) : null}
          <Text
            variant="caption"
            style={{
              color: competition.isCompeting ? '#FFFCF8' : colors.goldAccent,
              fontWeight: '700',
            }}
          >
            {competition.isCompeting ? 'Competing' : "I'm Competing"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    borderRadius: radii.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  hero: {
    height: 132,
    justifyContent: 'flex-end',
    padding: spacing.sm,
  },
  badge: {
    color: '#FFFCF8',
    letterSpacing: 1,
    fontWeight: '700',
    fontSize: 10,
  },
  body: {
    padding: spacing.md,
    gap: 4,
  },
  name: {
    fontSize: 18,
    marginBottom: 2,
  },
  attendees: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  detailsBtn: {
    flex: 1,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  competeBtn: {
    flex: 1,
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 10,
  },
});
