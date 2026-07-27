import type {
  CreateNotificationDraftInput,
  NotificationDraft,
} from '../../types';

export interface NotificationListQuery {
  kind?: NotificationDraft['kind'];
  status?: NotificationDraft['status'];
}

export interface NotificationsRepository {
  list(query?: NotificationListQuery): Promise<NotificationDraft[]>;
  create(input: CreateNotificationDraftInput): Promise<NotificationDraft>;
  getById(id: string): Promise<NotificationDraft | null>;
}

export function createMemoryNotificationsRepository(
  seed: NotificationDraft[] = [],
): NotificationsRepository {
  let drafts = [...seed];

  return {
    async list(query) {
      let result = [...drafts];
      if (query?.kind) {
        result = result.filter((draft) => draft.kind === query.kind);
      }
      if (query?.status) {
        result = result.filter((draft) => draft.status === query.status);
      }
      return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async create(input) {
      const now = new Date().toISOString();
      const created: NotificationDraft = {
        id: `notification-${Date.now()}`,
        kind: input.kind,
        title: input.title.trim(),
        body: input.body.trim(),
        audience: input.audience,
        status: input.simulateSend
          ? 'sent_simulated'
          : input.scheduledAt
            ? 'scheduled'
            : 'draft',
        scheduledAt: input.scheduledAt ?? null,
        relatedEntityId: input.relatedEntityId ?? null,
        createdAt: now,
        updatedAt: now,
      };
      drafts = [created, ...drafts];
      return created;
    },
    async getById(id) {
      return drafts.find((draft) => draft.id === id) ?? null;
    },
  };
}

export function createNotificationsRepository(
  seed?: NotificationDraft[],
): NotificationsRepository {
  return createMemoryNotificationsRepository(seed);
}
