import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Banner,
  Button,
  Card,
  Input,
  Screen,
  Spacer,
  Text,
} from '../../components';
import { useAuth } from '../../hooks';
import { useCommunity } from '../../lib/providers/CommunityProvider';
import { spacing } from '../../lib/theme';
import type { CommunityStackParamList } from '../../types/navigation';
import { formatShortDate } from '../../utils';

type Props = NativeStackScreenProps<
  CommunityStackParamList,
  'AnnouncementDetail'
>;

export function AnnouncementDetailScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const { getAnnouncement, addComment } = useCommunity();
  const announcement = getAnnouncement(route.params.announcementId);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!announcement) {
    return (
      <Screen>
        <Text variant="hero">Announcement</Text>
        <Spacer size="md" />
        <Banner message="This announcement could not be found." />
        <Spacer size="lg" />
        <Button label="Back" variant="secondary" onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  const handlePost = () => {
    setError(null);
    if (!comment.trim()) {
      setError('Write a comment first.');
      return;
    }
    addComment(
      announcement.id,
      comment,
      user?.fullName || user?.email || 'My Gi Athlete',
    );
    setComment('');
  };

  return (
    <Screen scroll keyboard contentStyle={styles.content}>
      <Button label="Back" variant="ghost" onPress={() => navigation.goBack()} />
      <Spacer size="sm" />
      <Text variant="caption" gold>
        {formatShortDate(announcement.createdAt)} · {announcement.authorName}
      </Text>
      <Spacer size="xs" />
      <Text variant="hero">{announcement.title}</Text>
      <Spacer size="md" />
      <Text variant="bodyMuted" style={styles.body}>
        {announcement.body}
      </Text>

      <Spacer size="xl" />
      <Text variant="subtitle">
        Comments ({announcement.comments.length})
      </Text>
      <Spacer size="md" />

      {announcement.comments.length === 0 ? (
        <Text variant="bodyMuted">Be the first to comment.</Text>
      ) : (
        <View style={styles.comments}>
          {announcement.comments.map((item) => (
            <Card key={item.id}>
              <Text variant="caption" gold>
                {item.authorName} · {formatShortDate(item.createdAt)}
              </Text>
              <Spacer size="xs" />
              <Text variant="body">{item.body}</Text>
            </Card>
          ))}
        </View>
      )}

      <Spacer size="xl" />
      <Text variant="subtitle">Add a comment</Text>
      <Spacer size="md" />
      {error ? (
        <>
          <Banner message={error} />
          <Spacer size="md" />
        </>
      ) : null}
      <Input
        placeholder="Share a note with the academy..."
        value={comment}
        onChangeText={setComment}
        multiline
        style={styles.input}
      />
      <Spacer size="md" />
      <Button label="Post Comment" onPress={handlePost} />
      <View style={styles.bottomSpace} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {},
  body: {
    lineHeight: 24,
  },
  comments: {
    gap: spacing.md,
  },
  input: {
    minHeight: 96,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  bottomSpace: {
    height: spacing.xl,
  },
});
