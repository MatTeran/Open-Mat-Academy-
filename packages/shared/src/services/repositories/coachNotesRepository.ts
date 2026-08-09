import type {
  CoachNote,
  CreateCoachNoteInput,
} from '../../types';
import { getSupabaseClient, isSupabaseConfigured } from '../supabase/client';

export interface CoachNotesRepository {
  listByMember(
    memberId: string,
    query?: string,
    academyId?: string,
  ): Promise<CoachNote[]>;
  create(
    input: CreateCoachNoteInput,
    author: { id: string; name: string; academyId: string },
  ): Promise<CoachNote>;
  update(id: string, body: string): Promise<CoachNote | null>;
  remove(id: string): Promise<boolean>;
}

export function createMemoryCoachNotesRepository(
  seed: CoachNote[] = [],
): CoachNotesRepository {
  let notes = [...seed];

  return {
    async listByMember(memberId, query, academyId) {
      const needle = query?.trim().toLowerCase() ?? '';
      return notes
        .filter((note) => {
          if (note.memberId !== memberId) {
            return false;
          }
          if (academyId && note.academyId !== academyId) {
            return false;
          }
          if (!needle) {
            return true;
          }
          return (
            note.body.toLowerCase().includes(needle) ||
            note.authorName.toLowerCase().includes(needle)
          );
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async create(input, author) {
      const now = new Date().toISOString();
      const created: CoachNote = {
        id: `note-${Date.now()}`,
        memberId: input.memberId,
        authorId: author.id,
        authorName: author.name,
        body: input.body.trim(),
        isPrivate: true,
        academyId: input.academyId ?? author.academyId,
        createdAt: now,
        updatedAt: now,
      };
      notes = [created, ...notes];
      return created;
    },
    async update(id, body) {
      const index = notes.findIndex((note) => note.id === id);
      if (index < 0) {
        return null;
      }
      const updated: CoachNote = {
        ...notes[index],
        body: body.trim(),
        updatedAt: new Date().toISOString(),
      };
      notes = [
        ...notes.slice(0, index),
        updated,
        ...notes.slice(index + 1),
      ];
      return updated;
    },
    async remove(id) {
      const before = notes.length;
      notes = notes.filter((note) => note.id !== id);
      return notes.length < before;
    },
  };
}

function mapRow(row: Record<string, unknown>): CoachNote {
  return {
    id: String(row.id),
    memberId: String(row.member_id),
    authorId: String(row.author_id),
    authorName: String(row.author_name),
    body: String(row.body),
    isPrivate: true,
    academyId: String(row.academy_id),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function createSupabaseCoachNotesRepository(): CoachNotesRepository {
  return {
    async listByMember(memberId, query, academyId) {
      const client = getSupabaseClient();
      if (!client) {
        return [];
      }
      let request = client
        .from('coach_notes')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false });
      if (academyId) {
        request = request.eq('academy_id', academyId);
      }
      const needle = query?.trim();
      if (needle) {
        request = request.or(
          `body.ilike.%${needle}%,author_name.ilike.%${needle}%`,
        );
      }
      const { data, error } = await request;
      if (error) {
        throw error;
      }
      return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
    },
    async create(input, author) {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Supabase is not configured.');
      }
      const { data, error } = await client
        .from('coach_notes')
        .insert({
          member_id: input.memberId,
          author_id: author.id,
          author_name: author.name,
          body: input.body.trim(),
          is_private: true,
          academy_id: input.academyId ?? author.academyId,
        })
        .select('*')
        .single();
      if (error) {
        throw error;
      }
      return mapRow(data as Record<string, unknown>);
    },
    async update(id, body) {
      const client = getSupabaseClient();
      if (!client) {
        return null;
      }
      const { data, error } = await client
        .from('coach_notes')
        .update({
          body: body.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .maybeSingle();
      if (error) {
        throw error;
      }
      return data ? mapRow(data as Record<string, unknown>) : null;
    },
    async remove(id) {
      const client = getSupabaseClient();
      if (!client) {
        return false;
      }
      const { error } = await client.from('coach_notes').delete().eq('id', id);
      if (error) {
        throw error;
      }
      return true;
    },
  };
}

export function createCoachNotesRepository(
  seed?: CoachNote[],
): CoachNotesRepository {
  if (isSupabaseConfigured()) {
    return createSupabaseCoachNotesRepository();
  }
  return createMemoryCoachNotesRepository(seed);
}
