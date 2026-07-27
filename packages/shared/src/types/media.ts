export type MediaKind = 'photo' | 'video';

export interface MediaAlbum {
  id: string;
  title: string;
  description: string;
  coverUri: string | null;
  itemCount: number;
  classId: string | null;
  eventId: string | null;
  academyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  albumId: string | null;
  kind: MediaKind;
  title: string;
  uri: string;
  thumbnailUri: string | null;
  classId: string | null;
  eventId: string | null;
  tags: string[];
  /** Future member sharing — prepared only. */
  memberShareEnabled: boolean;
  uploadedBy: string;
  academyId: string;
  createdAt: string;
}

export interface CreateMediaAlbumInput {
  title: string;
  description?: string;
  coverUri?: string | null;
  classId?: string | null;
  eventId?: string | null;
}

export interface CreateMediaItemInput {
  albumId?: string | null;
  kind: MediaKind;
  title: string;
  uri: string;
  thumbnailUri?: string | null;
  classId?: string | null;
  eventId?: string | null;
  tags?: string[];
  memberShareEnabled?: boolean;
}
