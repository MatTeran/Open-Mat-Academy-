import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Card,
  IconBadge,
  Input,
  Screen,
  Spacer,
  Text,
  radii,
  spacing,
  useAppTheme,
  type BeltRank,
  type MembershipStatus,
} from '@openmat/shared';

import {
  EmptyState,
  FadeInItem,
  StatusPill,
} from '../../components/ui/Motion';
import { FilterChipRow } from '../../components/ui/Phase2Controls';
import { useCoachData } from '../../lib/providers/CoachDataProvider';
import type { MembersStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MembersStackParamList, 'MembersHome'>;

const BELTS: BeltRank[] = ['white', 'blue', 'purple', 'brown', 'black'];
const STATUSES: MembershipStatus[] = [
  'active',
  'past_due',
  'paused',
  'canceled',
];

export function MembersScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const { members } = useCoachData();
  const [query, setQuery] = useState('');
  const [belt, setBelt] = useState<BeltRank | null>(null);
  const [status, setStatus] = useState<MembershipStatus | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return members.filter((member) => {
      if (belt && member.belt !== belt) return false;
      if (status && member.membershipStatus !== status) return false;
      if (!needle) return true;
      return (
        member.fullName.toLowerCase().includes(needle) ||
        member.email.toLowerCase().includes(needle)
      );
    });
  }, [belt, members, query, status]);

  const activeCount = members.filter((m) => m.membershipStatus === 'active').length;
  const pastDueCount = members.filter((m) => m.membershipStatus === 'past_due').length;

  return (
    <Screen scroll keyboard>
      <Text variant="hero">Member Management</Text>
      <Text variant="body" muted>
        Roster, profiles, private notes, and academy development.
      </Text>

      <Spacer size="md" />
      <View style={styles.stats}>
        <View
          style={[
            styles.stat,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <Text variant="title" gold>
            {members.length}
          </Text>
          <Text variant="caption" muted>
            Members
          </Text>
        </View>
        <View
          style={[
            styles.stat,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <Text variant="title" gold>
            {activeCount}
          </Text>
          <Text variant="caption" muted>
            Active
          </Text>
        </View>
        <View
          style={[
            styles.stat,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <Text variant="title" gold>
            {pastDueCount}
          </Text>
          <Text variant="caption" muted>
            Past due
          </Text>
        </View>
      </View>

      <Spacer size="md" />
      <Pressable
        onPress={() =>
          navigation.getParent()?.navigate('More', { screen: 'Journey' })
        }
        style={[
          styles.journeyLink,
          { backgroundColor: colors.goldMuted, borderColor: colors.goldAccent },
        ]}
      >
        <IconBadge name="map-outline" tint={colors.highlightGold} />
        <View style={styles.journeyCopy}>
          <Text variant="subtitle">Member Journey</Text>
          <Text variant="caption" muted>
            Read-only XP · streaks · achievements
          </Text>
        </View>
      </Pressable>

      <Spacer size="lg" />
      <Input
        label="Search"
        placeholder="Name or email"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
      />
      <Spacer size="sm" />
      <Text variant="label">Belt</Text>
      <Spacer size="xs" />
      <FilterChipRow
        options={BELTS}
        value={belt}
        onChange={setBelt}
        labelFor={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
      />
      <Spacer size="sm" />
      <Text variant="label">Membership</Text>
      <Spacer size="xs" />
      <FilterChipRow
        options={STATUSES}
        value={status}
        onChange={setStatus}
        labelFor={(value) => value.replace('_', ' ')}
      />
      <Spacer size="lg" />

      {filtered.length === 0 ? (
        <EmptyState title="No members" subtitle="Try a different search or filter." />
      ) : (
        <View style={styles.list}>
          {filtered.map((member, index) => (
            <FadeInItem key={member.id} index={index}>
              <Card
                onPress={() =>
                  navigation.navigate('MemberDetail', { memberId: member.id })
                }
              >
                <View style={styles.row}>
                  <View style={styles.avatar}>
                    <Text variant="subtitle" gold>
                      {member.fullName
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)}
                    </Text>
                  </View>
                  <View style={styles.copy}>
                    <Text variant="subtitle">{member.fullName}</Text>
                    <Text variant="caption" muted>
                      {member.belt} belt · {member.stripes} stripes
                    </Text>
                    <Text variant="caption" muted>
                      {member.email}
                    </Text>
                    <Text variant="caption" gold>
                      Tap for profile · development · notes
                    </Text>
                  </View>
                  <StatusPill
                    label={member.membershipStatus}
                    color={
                      member.membershipStatus === 'active'
                        ? '#22C55E'
                        : '#F59E0B'
                    }
                  />
                </View>
              </Card>
            </FadeInItem>
          ))}
        </View>
      )}
      <Spacer size="xl" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stat: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: 2,
  },
  journeyLink: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  journeyCopy: {
    flex: 1,
    gap: 2,
  },
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});
