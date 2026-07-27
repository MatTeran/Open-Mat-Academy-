export type AnnouncementCategory =
  | 'general'
  | 'schedule'
  | 'competition'
  | 'promotion'
  | 'facility'
  | 'urgent';

export type AnnouncementAudience =
  | 'all'
  | 'adults'
  | 'kids'
  | 'competitors'
  | 'coaches';

export type AnnouncementStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface CoachAnnouncement {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  audience: AnnouncementAudience;
  status: AnnouncementStatus;
  authorId: string;
  authorName: string;
  academyId: string;
  /** ISO datetime — when it should go live */
  scheduledAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  /** Push notifications — Phase 2 */
  pushEnabled: boolean;
}

export interface CreateAnnouncementInput {
  title: string;
  body: string;
  category: AnnouncementCategory;
  audience: AnnouncementAudience;
  scheduledAt?: string | null;
  publish?: boolean;
  pushEnabled?: boolean;
}

export type UpdateAnnouncementInput = Partial<CreateAnnouncementInput> & {
  status?: AnnouncementStatus;
};
