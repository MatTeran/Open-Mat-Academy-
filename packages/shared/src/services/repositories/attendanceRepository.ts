import type {
  AttendanceRecord,
  CheckInInput,
  ClassRosterSummary,
} from '../../types';
import { getSupabaseClient, isSupabaseConfigured } from '../supabase/client';

export interface AttendanceRepository {
  listByClass(classId: string): Promise<AttendanceRecord[]>;
  getRoster(classId: string): Promise<ClassRosterSummary>;
  checkIn(input: CheckInInput): Promise<AttendanceRecord>;
  markAbsent(classId: string, memberId: string): Promise<AttendanceRecord | null>;
  updateStatus(
    id: string,
    status: AttendanceRecord['status'],
  ): Promise<AttendanceRecord | null>;
}

function attendancePercent(records: AttendanceRecord[]): number {
  const roster = records.filter(
    (item) =>
      item.status === 'present' ||
      item.status === 'late' ||
      item.status === 'absent' ||
      item.status === 'reserved' ||
      item.status === 'visitor' ||
      item.status === 'walk_in',
  );
  if (roster.length === 0) {
    return 0;
  }
  const present = roster.filter(
    (item) =>
      item.status === 'present' ||
      item.status === 'late' ||
      item.status === 'visitor' ||
      item.status === 'walk_in',
  ).length;
  return Math.round((present / roster.length) * 100);
}

function toRoster(classId: string, records: AttendanceRecord[]): ClassRosterSummary {
  return {
    classId,
    reserved: records.filter((item) => item.status === 'reserved'),
    waitlist: records.filter((item) => item.status === 'waitlist'),
    checkedIn: records.filter(
      (item) =>
        item.status === 'present' ||
        item.status === 'late' ||
        item.status === 'visitor' ||
        item.status === 'walk_in',
    ),
    absent: records.filter((item) => item.status === 'absent'),
    attendancePercent: attendancePercent(records),
  };
}

export function createMemoryAttendanceRepository(
  seed: AttendanceRecord[] = [],
): AttendanceRepository {
  let records = [...seed];

  return {
    async listByClass(classId) {
      return records.filter((item) => item.classId === classId);
    },
    async getRoster(classId) {
      return toRoster(
        classId,
        records.filter((item) => item.classId === classId),
      );
    },
    async checkIn(input) {
      const now = new Date().toISOString();
      const existingIndex = records.findIndex(
        (item) =>
          item.classId === input.classId &&
          ((input.memberId && item.memberId === input.memberId) ||
            item.memberName.toLowerCase() === input.memberName.toLowerCase()),
      );

      if (existingIndex >= 0) {
        const updated: AttendanceRecord = {
          ...records[existingIndex],
          status: input.status,
          checkedInAt: now,
          notes: input.notes ?? records[existingIndex].notes,
          isFirstVisit: input.isFirstVisit ?? records[existingIndex].isFirstVisit,
          updatedAt: now,
        };
        records = [
          ...records.slice(0, existingIndex),
          updated,
          ...records.slice(existingIndex + 1),
        ];
        return updated;
      }

      const created: AttendanceRecord = {
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        classId: input.classId,
        memberId: input.memberId ?? null,
        memberName: input.memberName,
        memberEmail: input.memberEmail ?? null,
        status: input.status,
        checkedInAt: now,
        notes: input.notes ?? null,
        isFirstVisit: input.isFirstVisit ?? false,
        createdAt: now,
        updatedAt: now,
      };
      records = [...records, created];
      return created;
    },
    async markAbsent(classId, memberId) {
      const index = records.findIndex(
        (item) => item.classId === classId && item.memberId === memberId,
      );
      if (index < 0) {
        return null;
      }
      const updated: AttendanceRecord = {
        ...records[index],
        status: 'absent',
        checkedInAt: null,
        updatedAt: new Date().toISOString(),
      };
      records = [
        ...records.slice(0, index),
        updated,
        ...records.slice(index + 1),
      ];
      return updated;
    },
    async updateStatus(id, status) {
      const index = records.findIndex((item) => item.id === id);
      if (index < 0) {
        return null;
      }
      const now = new Date().toISOString();
      const updated: AttendanceRecord = {
        ...records[index],
        status,
        checkedInAt:
          status === 'present' ||
          status === 'late' ||
          status === 'visitor' ||
          status === 'walk_in'
            ? now
            : null,
        updatedAt: now,
      };
      records = [
        ...records.slice(0, index),
        updated,
        ...records.slice(index + 1),
      ];
      return updated;
    },
  };
}

function mapRow(row: Record<string, unknown>): AttendanceRecord {
  return {
    id: String(row.id),
    classId: String(row.class_id),
    memberId: (row.member_id as string | null) ?? null,
    memberName: String(row.member_name),
    memberEmail: (row.member_email as string | null) ?? null,
    status: row.status as AttendanceRecord['status'],
    checkedInAt: (row.checked_in_at as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    isFirstVisit: Boolean(row.is_first_visit),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function createSupabaseAttendanceRepository(): AttendanceRepository {
  return {
    async listByClass(classId) {
      const client = getSupabaseClient();
      if (!client) {
        return [];
      }
      const { data, error } = await client
        .from('attendance')
        .select('*')
        .eq('class_id', classId)
        .order('created_at', { ascending: true });
      if (error) {
        throw error;
      }
      return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
    },
    async getRoster(classId) {
      const records = await this.listByClass(classId);
      return toRoster(classId, records);
    },
    async checkIn(input) {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Supabase is not configured.');
      }
      const now = new Date().toISOString();
      const payload = {
        class_id: input.classId,
        member_id: input.memberId ?? null,
        member_name: input.memberName,
        member_email: input.memberEmail ?? null,
        status: input.status,
        checked_in_at: now,
        notes: input.notes ?? null,
        is_first_visit: input.isFirstVisit ?? false,
        updated_at: now,
      };
      const { data, error } = await client
        .from('attendance')
        .insert(payload)
        .select('*')
        .single();
      if (error) {
        throw error;
      }
      return mapRow(data as Record<string, unknown>);
    },
    async markAbsent(classId, memberId) {
      const client = getSupabaseClient();
      if (!client) {
        return null;
      }
      const { data, error } = await client
        .from('attendance')
        .update({
          status: 'absent',
          checked_in_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('class_id', classId)
        .eq('member_id', memberId)
        .select('*')
        .maybeSingle();
      if (error) {
        throw error;
      }
      return data ? mapRow(data as Record<string, unknown>) : null;
    },
    async updateStatus(id, status) {
      const client = getSupabaseClient();
      if (!client) {
        return null;
      }
      const now = new Date().toISOString();
      const { data, error } = await client
        .from('attendance')
        .update({
          status,
          checked_in_at:
            status === 'present' ||
            status === 'late' ||
            status === 'visitor' ||
            status === 'walk_in'
              ? now
              : null,
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
  };
}

export function createAttendanceRepository(
  seed?: AttendanceRecord[],
): AttendanceRepository {
  if (isSupabaseConfigured()) {
    return createSupabaseAttendanceRepository();
  }
  return createMemoryAttendanceRepository(seed);
}
