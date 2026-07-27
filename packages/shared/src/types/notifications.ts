export type NotificationKind =
  | 'announcement'
  | 'challenge_reminder'
  | 'event_reminder'
  | 'technique_of_the_week'
  | 'competition_reminder';

export type NotificationDraftStatus = 'draft' | 'scheduled' | 'sent_simulated';

export interface NotificationDraft {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  audience: 'all' | 'adults' | 'kids' | 'competitors' | 'coaches';
  status: NotificationDraftStatus;
  scheduledAt: string | null;
  relatedEntityId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationDraftInput {
  kind: NotificationKind;
  title: string;
  body: string;
  audience: NotificationDraft['audience'];
  scheduledAt?: string | null;
  relatedEntityId?: string | null;
  /** Phase 2 prepares models/UI only — no delivery backend. */
  simulateSend?: boolean;
}
