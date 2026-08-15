import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Input, Text } from '../../components';
import { useAuth } from '../../hooks';
import { useCommunity } from '../../lib/providers/CommunityProvider';
import { radii, spacing } from '../../lib/theme';
import { useThemedStyles } from '../../lib/theme/useThemedStyles';
import type { CommunityStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<CommunityStackParamList, 'TeamChat'>;

export function TeamChatScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { chatMessages, sendChatMessage } = useCommunity();
  const [draft, setDraft] = useState('');

  const styles = useThemedStyles((colors) => ({
    root: {
      flex: 1,
      backgroundColor: colors.primaryBackground,
    },
    header: {
      paddingHorizontal: spacing.lg,
      gap: spacing.xxs,
      marginBottom: spacing.md,
    },
    list: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
      gap: spacing.sm,
    },
    bubble: {
      maxWidth: '86%' as const,
      borderRadius: radii.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderWidth: 1,
    },
    bubbleOther: {
      alignSelf: 'flex-start' as const,
      backgroundColor: colors.secondaryBackground,
      borderColor: colors.border,
    },
    bubbleMine: {
      alignSelf: 'flex-end' as const,
      backgroundColor: colors.goldMuted,
      borderColor: colors.goldAccent,
    },
    author: {
      marginBottom: 4,
    },
    composer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      backgroundColor: colors.primaryBackground,
    },
    inputWrap: {
      flex: 1,
    },
    send: {
      minWidth: 88,
      paddingHorizontal: spacing.md,
    },
  }));

  const handleSend = () => {
    sendChatMessage(
      draft,
      user?.fullName || user?.email || 'My Gi Athlete',
    );
    setDraft('');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <Button label="Back" variant="ghost" onPress={() => navigation.goBack()} />
        <Text variant="subtitle">Team Chat</Text>
        <Text variant="caption">My Gi athletes</Text>
      </View>

      <FlatList
        data={chatMessages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.mine ? styles.bubbleMine : styles.bubbleOther,
            ]}
          >
            {!item.mine ? (
              <Text variant="caption" gold style={styles.author}>
                {item.authorName}
              </Text>
            ) : null}
            <Text variant="body">{item.body}</Text>
          </View>
        )}
      />

      <View
        style={[
          styles.composer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        <View style={styles.inputWrap}>
          <Input
            placeholder="Message the team..."
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
        </View>
        <Button
          label="Send"
          onPress={handleSend}
          fullWidth={false}
          style={styles.send}
        />
      </View>
    </View>
  );
}
