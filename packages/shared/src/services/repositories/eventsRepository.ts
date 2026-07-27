import type {
  CoachEvent,
  CreateEventInput,
  UpdateEventInput,
} from '../../types';

export interface EventListQuery {
  academyId?: string;
  type?: CoachEvent['type'];
  status?: CoachEvent['status'];
  from?: string;
  to?: string;
}

export interface EventsRepository {
  list(query?: EventListQuery): Promise<CoachEvent[]>;
  getById(id: string): Promise<CoachEvent | null>;
  create(
    input: CreateEventInput,
    meta: { academyId: string },
  ): Promise<CoachEvent>;
  update(id: string, input: UpdateEventInput): Promise<CoachEvent | null>;
  cancel(id: string): Promise<CoachEvent | null>;
}

export function createMemoryEventsRepository(
  seed: CoachEvent[] = [],
): EventsRepository {
  let events = [...seed];

  return {
    async list(query) {
      let result = [...events];
      if (query?.academyId) {
        result = result.filter((item) => item.academyId === query.academyId);
      }
      if (query?.type) {
        result = result.filter((item) => item.type === query.type);
      }
      if (query?.status) {
        result = result.filter((item) => item.status === query.status);
      }
      if (query?.from) {
        const from = query.from;
        result = result.filter((item) => item.startAt >= from);
      }
      if (query?.to) {
        const to = query.to;
        result = result.filter((item) => item.startAt <= to);
      }
      return result.sort((a, b) => a.startAt.localeCompare(b.startAt));
    },
    async getById(id) {
      return events.find((item) => item.id === id) ?? null;
    },
    async create(input, meta) {
      const now = new Date().toISOString();
      const created: CoachEvent = {
        id: `event-${Date.now()}`,
        title: input.title.trim(),
        description: input.description.trim(),
        type: input.type,
        status: input.status ?? 'draft',
        location: input.location.trim(),
        startAt: input.startAt,
        endAt: input.endAt,
        capacity: input.capacity ?? null,
        rsvpCount: 0,
        waitlistCount: 0,
        allowRsvp: input.allowRsvp ?? true,
        academyId: meta.academyId,
        createdAt: now,
        updatedAt: now,
      };
      events = [created, ...events];
      return created;
    },
    async update(id, input) {
      const index = events.findIndex((item) => item.id === id);
      if (index < 0) {
        return null;
      }
      const current = events[index];
      const updated: CoachEvent = {
        ...current,
        ...input,
        title: input.title?.trim() ?? current.title,
        description: input.description?.trim() ?? current.description,
        location: input.location?.trim() ?? current.location,
        capacity:
          input.capacity !== undefined ? input.capacity : current.capacity,
        updatedAt: new Date().toISOString(),
      };
      events = [
        ...events.slice(0, index),
        updated,
        ...events.slice(index + 1),
      ];
      return updated;
    },
    async cancel(id) {
      return this.update(id, { status: 'cancelled' });
    },
  };
}

export function createEventsRepository(seed?: CoachEvent[]): EventsRepository {
  return createMemoryEventsRepository(seed);
}
