import type {
  CreateMediaAlbumInput,
  CreateMediaItemInput,
  MediaAlbum,
  MediaItem,
} from '../../types';

export interface MediaAlbumsListQuery {
  academyId?: string;
  classId?: string;
  eventId?: string;
}

export interface MediaRepository {
  listAlbums(query?: MediaAlbumsListQuery): Promise<MediaAlbum[]>;
  listItems(albumId?: string): Promise<MediaItem[]>;
  createAlbum(
    input: CreateMediaAlbumInput,
    meta: { academyId: string },
  ): Promise<MediaAlbum>;
  createItem(
    input: CreateMediaItemInput,
    uploader: { id: string; academyId: string },
  ): Promise<MediaItem>;
}

export function createMemoryMediaRepository(
  seed: { albums?: MediaAlbum[]; items?: MediaItem[] } = {},
): MediaRepository {
  let albums = [...(seed.albums ?? [])];
  let items = [...(seed.items ?? [])];

  const updateAlbumForItem = (item: MediaItem) => {
    if (!item.albumId) {
      return;
    }
    const index = albums.findIndex((album) => album.id === item.albumId);
    if (index < 0) {
      return;
    }
    const current = albums[index];
    const updated: MediaAlbum = {
      ...current,
      coverUri: current.coverUri ?? item.thumbnailUri ?? item.uri,
      itemCount: current.itemCount + 1,
      updatedAt: new Date().toISOString(),
    };
    albums = [
      ...albums.slice(0, index),
      updated,
      ...albums.slice(index + 1),
    ];
  };

  return {
    async listAlbums(query) {
      let result = [...albums];
      if (query?.academyId) {
        result = result.filter((album) => album.academyId === query.academyId);
      }
      if (query?.classId) {
        result = result.filter((album) => album.classId === query.classId);
      }
      if (query?.eventId) {
        result = result.filter((album) => album.eventId === query.eventId);
      }
      return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async listItems(albumId) {
      let result = [...items];
      if (albumId !== undefined) {
        result = result.filter((item) => item.albumId === albumId);
      }
      return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async createAlbum(input, meta) {
      const now = new Date().toISOString();
      const created: MediaAlbum = {
        id: `album-${Date.now()}`,
        title: input.title.trim(),
        description: input.description?.trim() ?? '',
        coverUri: input.coverUri ?? null,
        itemCount: 0,
        classId: input.classId ?? null,
        eventId: input.eventId ?? null,
        academyId: meta.academyId,
        createdAt: now,
        updatedAt: now,
      };
      albums = [created, ...albums];
      return created;
    },
    async createItem(input, uploader) {
      const created: MediaItem = {
        id: `media-${Date.now()}`,
        albumId: input.albumId ?? null,
        kind: input.kind,
        title: input.title.trim(),
        uri: input.uri,
        thumbnailUri: input.thumbnailUri ?? null,
        classId: input.classId ?? null,
        eventId: input.eventId ?? null,
        tags: input.tags ?? [],
        memberShareEnabled: input.memberShareEnabled ?? false,
        uploadedBy: uploader.id,
        academyId: uploader.academyId,
        createdAt: new Date().toISOString(),
      };
      items = [created, ...items];
      updateAlbumForItem(created);
      return created;
    },
  };
}

export function createMediaRepository(
  seed?: { albums?: MediaAlbum[]; items?: MediaItem[] },
): MediaRepository {
  return createMemoryMediaRepository(seed);
}
