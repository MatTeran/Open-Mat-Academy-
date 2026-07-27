import type {
  CoachClass,
  CreateClassInput,
  UpdateClassInput,
} from '../../types';
import { getSupabaseClient, isSupabaseConfigured } from '../supabase/client';

export interface ClassesRepository {
  list(params?: { date?: string; from?: string; to?: string }): Promise<CoachClass[]>;
  getById(id: string): Promise<CoachClass | null>;
  create(
    input: CreateClassInput,
    meta: { instructorId: string; academyId: string },
  ): Promise<CoachClass>;
  update(id: string, input: UpdateClassInput): Promise<CoachClass | null>;
  cancel(id: string): Promise<CoachClass | null>;
  duplicate(id: string, date?: string): Promise<CoachClass | null>;
}

export function createMemoryClassesRepository(
  seed: CoachClass[] = [],
): ClassesRepository {
  let classes = [...seed];

  return {
    async list(params) {
      let result = [...classes];
      if (params?.date) {
        result = result.filter((item) => item.date === params.date);
      }
      if (params?.from) {
        result = result.filter((item) => item.date >= params.from!);
      }
      if (params?.to) {
        result = result.filter((item) => item.date <= params.to!);
      }
      return result.sort((a, b) =>
        `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
      );
    },
    async getById(id) {
      return classes.find((item) => item.id === id) ?? null;
    },
    async create(input, meta) {
      const now = new Date().toISOString();
      const created: CoachClass = {
        id: `class-${Date.now()}`,
        title: input.title.trim(),
        description: input.description?.trim(),
        date: input.date,
        startTime: input.startTime,
        endTime: input.endTime,
        instructorId: meta.instructorId,
        instructorName: input.instructorName,
        giType: input.giType,
        level: input.level,
        audience: input.audience,
        capacity: input.capacity,
        reservedCount: 0,
        checkedInCount: 0,
        waitlistCount: 0,
        firstTimeVisitorCount: 0,
        status: 'scheduled',
        isOpenMat: Boolean(input.isOpenMat),
        isSeminar: Boolean(input.isSeminar) || input.level === 'seminar',
        recurrence: input.recurrence ?? 'none',
        academyId: meta.academyId,
        createdAt: now,
        updatedAt: now,
        cancelledAt: null,
      };
      classes = [...classes, created];
      return created;
    },
    async update(id, input) {
      const index = classes.findIndex((item) => item.id === id);
      if (index < 0) {
        return null;
      }
      const current = classes[index];
      const updated: CoachClass = {
        ...current,
        ...input,
        title: input.title?.trim() ?? current.title,
        description:
          input.description !== undefined
            ? input.description?.trim()
            : current.description,
        isSeminar:
          input.isSeminar ??
          (input.level === 'seminar' ? true : current.isSeminar),
        updatedAt: new Date().toISOString(),
      };
      classes = [
        ...classes.slice(0, index),
        updated,
        ...classes.slice(index + 1),
      ];
      return updated;
    },
    async cancel(id) {
      return this.update(id, {
        status: 'cancelled',
      }).then((item) => {
        if (!item) {
          return null;
        }
        const cancelled: CoachClass = {
          ...item,
          cancelledAt: new Date().toISOString(),
          status: 'cancelled',
        };
        const index = classes.findIndex((entry) => entry.id === id);
        if (index >= 0) {
          classes = [
            ...classes.slice(0, index),
            cancelled,
            ...classes.slice(index + 1),
          ];
        }
        return cancelled;
      });
    },
    async duplicate(id, date) {
      const source = await this.getById(id);
      if (!source) {
        return null;
      }
      return this.create(
        {
          title: source.title,
          description: source.description,
          date: date ?? source.date,
          startTime: source.startTime,
          endTime: source.endTime,
          instructorName: source.instructorName,
          giType: source.giType,
          level: source.level,
          audience: source.audience,
          capacity: source.capacity,
          isOpenMat: source.isOpenMat,
          isSeminar: source.isSeminar,
          recurrence: source.recurrence,
        },
        {
          instructorId: source.instructorId,
          academyId: source.academyId,
        },
      );
    },
  };
}

function mapRow(row: Record<string, unknown>): CoachClass {
  return {
    id: String(row.id),
    title: String(row.title),
    description: (row.description as string | undefined) ?? undefined,
    date: String(row.date),
    startTime: String(row.start_time),
    endTime: String(row.end_time),
    instructorId: String(row.instructor_id),
    instructorName: String(row.instructor_name),
    giType: row.gi_type as CoachClass['giType'],
    level: row.level as CoachClass['level'],
    audience: row.audience as CoachClass['audience'],
    capacity: Number(row.capacity),
    reservedCount: Number(row.reserved_count ?? 0),
    checkedInCount: Number(row.checked_in_count ?? 0),
    waitlistCount: Number(row.waitlist_count ?? 0),
    firstTimeVisitorCount: Number(row.first_time_visitor_count ?? 0),
    status: row.status as CoachClass['status'],
    isOpenMat: Boolean(row.is_open_mat),
    isSeminar: Boolean(row.is_seminar),
    recurrence: (row.recurrence as CoachClass['recurrence']) ?? 'none',
    academyId: String(row.academy_id),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    cancelledAt: (row.cancelled_at as string | null) ?? null,
  };
}

export function createSupabaseClassesRepository(): ClassesRepository {
  return {
    async list(params) {
      const client = getSupabaseClient();
      if (!client) {
        return [];
      }
      let query = client.from('coach_classes').select('*').order('date');
      if (params?.date) {
        query = query.eq('date', params.date);
      }
      if (params?.from) {
        query = query.gte('date', params.from);
      }
      if (params?.to) {
        query = query.lte('date', params.to);
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
        .from('coach_classes')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) {
        throw error;
      }
      return data ? mapRow(data as Record<string, unknown>) : null;
    },
    async create(input, meta) {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Supabase is not configured.');
      }
      const { data, error } = await client
        .from('coach_classes')
        .insert({
          title: input.title.trim(),
          description: input.description?.trim() ?? null,
          date: input.date,
          start_time: input.startTime,
          end_time: input.endTime,
          instructor_id: meta.instructorId,
          instructor_name: input.instructorName,
          gi_type: input.giType,
          level: input.level,
          audience: input.audience,
          capacity: input.capacity,
          is_open_mat: Boolean(input.isOpenMat),
          is_seminar: Boolean(input.isSeminar) || input.level === 'seminar',
          recurrence: input.recurrence ?? 'none',
          academy_id: meta.academyId,
          status: 'scheduled',
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
      const payload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (input.title !== undefined) payload.title = input.title.trim();
      if (input.description !== undefined) {
        payload.description = input.description?.trim() ?? null;
      }
      if (input.date !== undefined) payload.date = input.date;
      if (input.startTime !== undefined) payload.start_time = input.startTime;
      if (input.endTime !== undefined) payload.end_time = input.endTime;
      if (input.instructorName !== undefined) {
        payload.instructor_name = input.instructorName;
      }
      if (input.giType !== undefined) payload.gi_type = input.giType;
      if (input.level !== undefined) payload.level = input.level;
      if (input.audience !== undefined) payload.audience = input.audience;
      if (input.capacity !== undefined) payload.capacity = input.capacity;
      if (input.isOpenMat !== undefined) payload.is_open_mat = input.isOpenMat;
      if (input.isSeminar !== undefined) payload.is_seminar = input.isSeminar;
      if (input.recurrence !== undefined) payload.recurrence = input.recurrence;
      if (input.status !== undefined) payload.status = input.status;
      const { data, error } = await client
        .from('coach_classes')
        .update(payload)
        .eq('id', id)
        .select('*')
        .maybeSingle();
      if (error) {
        throw error;
      }
      return data ? mapRow(data as Record<string, unknown>) : null;
    },
    async cancel(id) {
      const client = getSupabaseClient();
      if (!client) {
        return null;
      }
      const now = new Date().toISOString();
      const { data, error } = await client
        .from('coach_classes')
        .update({
          status: 'cancelled',
          cancelled_at: now,
          updated_at: now,
        })
        .eq('id', id)
        .select('*')
        .maybeSingle();
      if (error) {
        throw error;
      }
      return data ? mapRow(data as Record<string, unknown>) : null;
    },
    async duplicate(id, date) {
      const source = await this.getById(id);
      if (!source) {
        return null;
      }
      return this.create(
        {
          title: source.title,
          description: source.description,
          date: date ?? source.date,
          startTime: source.startTime,
          endTime: source.endTime,
          instructorName: source.instructorName,
          giType: source.giType,
          level: source.level,
          audience: source.audience,
          capacity: source.capacity,
          isOpenMat: source.isOpenMat,
          isSeminar: source.isSeminar,
          recurrence: source.recurrence,
        },
        {
          instructorId: source.instructorId,
          academyId: source.academyId,
        },
      );
    },
  };
}

export function createClassesRepository(
  seed?: CoachClass[],
): ClassesRepository {
  if (isSupabaseConfigured()) {
    return createSupabaseClassesRepository();
  }
  return createMemoryClassesRepository(seed);
}
