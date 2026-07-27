import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  IconBadge,
  Screen,
  Spacer,
  Text,
  spacing,
  type IconName,
  type MediaAlbum,
  type MediaItem,
} from '@openmat/shared';

import {
  EmptyState,
  FadeInItem,
  SectionHeader,
  StatusPill,
} from '../../components/ui/Motion';
import { usePhase2Data } from '../../lib/providers/Phase2DataProvider';
import type { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'MediaLibrary'>;

export function MediaLibraryScreen({ navigation }: Props) {
  const { albums, mediaItems } = usePhase2Data();

  return (
    <Screen scroll>
      <Text variant="hero">Media Library</Text>
      <Text variant="body" muted>
        Organize academy photos and videos for classes, events, and technique
        references.
      </Text>
      <Spacer size="lg" />
      <Button
        label="Upload Media"
        onPress={() => navigation.navigate('MediaUpload')}
      />

      <Spacer size="xl" />
      <SectionHeader title="Albums" subtitle={`${albums.length} collections`} />
      <View style={styles.stack}>
        {albums.length === 0 ? (
          <EmptyState
            title="No albums yet"
            subtitle="Uploaded media can be attached to an optional album."
          />
        ) : (
          albums.map((album, index) => (
            <FadeInItem key={album.id} index={index}>
              <AlbumCard album={album} />
            </FadeInItem>
          ))
        )}
      </View>

      <Spacer size="xl" />
      <SectionHeader
        title="Recent Media"
        subtitle={`${mediaItems.length} recent uploads`}
      />
      <View style={styles.stack}>
        {mediaItems.length === 0 ? (
          <EmptyState
            title="No media yet"
            subtitle="Upload a photo or video placeholder to populate this list."
          />
        ) : (
          mediaItems.map((item, index) => (
            <FadeInItem key={item.id} index={index}>
              <MediaCard item={item} />
            </FadeInItem>
          ))
        )}
      </View>
      <Spacer size="xl" />
    </Screen>
  );
}

function AlbumCard({ album }: { album: MediaAlbum }) {
  return (
    <Card elevated>
      <View style={styles.row}>
        <IconBadge name={'albums-outline' as IconName} tint="#FFFFFF" />
        <View style={styles.copy}>
          <Text variant="subtitle">{album.title}</Text>
          <Text variant="caption" muted>
            {album.description || 'No description'}
          </Text>
          <Text variant="caption" gold>
            {album.itemCount} items
          </Text>
        </View>
      </View>
      <Spacer size="sm" />
      <Text variant="caption" muted>
        {album.eventId ? `Event ${album.eventId}` : 'General academy album'}
        {album.classId ? ` · Class ${album.classId}` : ''}
      </Text>
    </Card>
  );
}

function MediaCard({ item }: { item: MediaItem }) {
  const tint = item.kind === 'photo' ? '#38BDF8' : '#FB7185';

  return (
    <Card elevated>
      <View style={styles.row}>
        <IconBadge
          name={(item.kind === 'photo' ? 'image-outline' : 'videocam-outline') as IconName}
          tint={tint}
        />
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text variant="subtitle" style={styles.flex}>
              {item.title}
            </Text>
            <StatusPill label={item.kind} color={tint} />
          </View>
          <Text variant="caption" muted numberOfLines={1}>
            {item.uri}
          </Text>
          <Text variant="caption" gold>
            {item.tags.map((tag) => `#${tag}`).join('  ') || 'No tags'}
          </Text>
        </View>
      </View>
      <Spacer size="sm" />
      <Text variant="caption" muted>
        Uploaded by {item.uploadedBy}
        {item.albumId ? ` · Album ${item.albumId}` : ''}
        {item.classId ? ` · Class ${item.classId}` : ''}
        {item.eventId ? ` · Event ${item.eventId}` : ''}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
