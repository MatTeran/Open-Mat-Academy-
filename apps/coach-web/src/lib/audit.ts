/**
 * In-memory audit sink for demo mode.
 * Production will insert into public.audit_logs (see migration).
 */

export type AuditAction =
  | 'belt_promotion'
  | 'stripe_promotion'
  | 'promotion_correction'
  | 'attendance_deletion'
  | 'class_cancellation'
  | 'member_role_change'
  | 'announcement_publish'
  | 'permission_change';

export interface AuditRecord {
  id: string;
  academyId: string;
  actorId: string;
  actorName: string;
  action: AuditAction;
  targetType: string;
  targetId: string;
  previous: Record<string, unknown> | null;
  next: Record<string, unknown> | null;
  createdAt: string;
}

const auditLog: AuditRecord[] = [];

export async function recordAudit(input: Omit<AuditRecord, 'id' | 'createdAt'>): Promise<AuditRecord> {
  const record: AuditRecord = {
    ...input,
    id: `audit-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  auditLog.unshift(record);
  return record;
}

export function listAuditRecords(): AuditRecord[] {
  return [...auditLog];
}
