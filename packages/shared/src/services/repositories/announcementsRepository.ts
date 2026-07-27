import type {
  CoachAnnouncement,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from '../../types';
import { getSupabaseClient, isSupabaseConfigured } from '../supabase/client';

export interface AnnouncementsRepository {
  list(academyId?: string): Promise<CoachAnnouncement[]>;
  getById(id: string): Promise<CoachAnnouncement | null>;
  create(
    input: CreateAnnouncementInput,
    author: { id: string; name: string; academyId: string },
  ): Promise<CoachAnnouncement>;
  update(
    id: string,
    input: UpdateAnnouncementInput,
  ): Promise<CoachAnnouncement | null>;
  publish(id: string): Promise<CoachAnnouncement | null>;
}

export function createMemoryAnnouncementsRepository(
  seed: CoachAnnouncement[] = [],
): AnnouncementsRepository {
  let items = [...seed];

  return {
    async list() {
      return [...items].sort((a, b) =>
        (b.publishedAt ?? b.createdAt).localeCompare(
          a.publishedAt ?? a.createdAt,
        ),
      );
    },
    async getById(id) {
      return items.find((item) => item.id === id) ?? null;
    },
    async create(input, author) {
      const now = new Date().toISOString();
      const publish = Boolean(input.publish);
      const created: CoachAnnouncement = {
        id: `ann-${Date.now()}`,
        title: input.title.trim(),
        body: input.body.trim(),
        category: input.category,
        audience: input.audience,
        status: publish
          ? 'published'
          : input.scheduledAt
            ? 'scheduled'
            : 'draft',
        authorId: author.id,
        authorName: author.name,
        academyId: author.academyId,
        scheduledAt: input.scheduledAt ?? null,
        publishedAt: publish ? now : null,
        createdAt: now,
        updatedAt: now,
        pushEnabled: input.pushEnabled ?? false,
      };
      items = [created, ...items];
      return created;
    },
    async update(id, input) {
      const index = items.findIndex((item) => item.id === id);
      if (index < 0) {
        return null;
      }
      const now = new Date().toISOString();
      const current = items[index];
      const updated: CoachAnnouncement = {
        ...current,
        ...input,
        title: input.title?.trim() ?? current.title,
        body: input.body?.trim() ?? current.body,
        updatedAt: now,
        publishedAt:
          input.publish || input.status === 'published'
            ? current.publishedAt ?? now
            : current.publishedAt,
        status:
          input.status ??
          (input.publish
            ? 'published'
            : input.scheduledAt
              ? 'scheduled'
              : current.status),
      };
      items = [
        ...items.slice(0, index),
        updated,
        ...items.slice(index + 1),
      ];
      return updated;
    },
    async publish(id) {
      return this.update(id, { publish: true, status: 'published' });
    },
  };
}

function mapRow(row: Record<string, unknown>): CoachAnnouncement {
  return {
    id: String(row.id),
    title: String(row.title),
    body: String(row.body),
    category: row.category as CoachAnnouncement['category'],
    audience: row.audience as CoachAnnouncement['audience'],
    status: row.status as CoachAnnouncement['status'],
    authorId: String(row.author_id),
    authorName: String(row.author_name),
    academyId: String(row.academy_id),
    scheduledAt: (row.scheduled_at as string | null) ?? null,
    publishedAt: (row.published_at as string | null) ?? null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    pushEnabled: Boolean(row.push_enabled),
  };
}

export function createSupabaseAnnouncementsRepository(): AnnouncementsRepository {
  return {
    async list(academyId) {
      const client = getSupabaseClient();
      if (!client) {
        return [];
      }
      let query = client
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (academyId) {
        query = query.eq('academy_id', academyId);
      }
      const { data, error } = await query;
      if (error) {
        throw error;
      }
      return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
    },
    async getById(id) {
      const client = getSupabaseClient();
      if (!client) {
        return null;
      }
      const { data, error } = await client
        .from('announcements')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) {
        throw error;
      }
      return data ? mapRow(data as Record<string, unknown>) : null;
    },
    async create(input, author) {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Supabase is not configured.');
      }
      const now = new Date().toISOString();
      const publish = Boolean(input.publish);
      const { data, error } = await client
        .from('announcements')
        .insert({
          title: input.title.trim(),
          body: input.body.trim(),
          category: input.category,
          audience: input.audience,
          status: publish
            ? 'published'
            : input.scheduledAt
              ? 'scheduled'
              : 'draft',
          author_id: author.id,
          author_name: author.name,
          academy_id: author.academyId,
          scheduled_at: input.scheduledAt ?? null,
          published_at: publish ? now : null,
          push_enabled: input.pushEnabled ?? false,
        })
        .select('*')
        .single();
      if (error) {
        throw error;
      }
      return mapRow(data as Record<string, unknown>);
    },
    async update(id, input) {
      const client = getSupabaseClient();
      if (!client) {
        return null;
      }
      const now = new Date().toISOString();
      const payload: Record<string, unknown> = {
        updated_at: now,
      };
      if (input.title !== undefined) payload.title = input.title.trim();
      if (input.body !== undefined) payload.body = input.body.trim();
      if (input.category !== undefined) payload.category = input.category;
      if (input.audience !== undefined) payload.audience = input.audience;
      if (input.scheduledAt !== undefined) {
        payload.scheduled_at = input.scheduledAt;
      }
      if (input.pushEnabled !== undefined) {
        payload.push_enabled = input.pushEnabled;
      }
      if (input.publish || input.status === 'published') {
        payload.status = 'published';
        payload.published_at = now;
      } else if (input.status) {
        payload.status = input.status;
      }
      const { data, error } = await client
        .from('announcements')
        .update(payload)
        .eq('id', id)
        .select('*')
        .maybeSingle();
      if (error) {
        throw error;
      }
      return data ? mapRow(data as Record<string, unknown>) : null;
    },
    async publish(id) {
      return this.update(id, { publish: true, status: 'published' });
    },
  };
}

export function createAnnouncementsRepository(
  seed?: CoachAnnouncement[],
): AnnouncementsRepository {
  if (isSupabaseConfigured()) {
    return createSupabaseAnnouncementsRepository();
  }
  return createMemoryAnnouncementsRepository(seed);
}
