'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import type { AttendanceStatus } from '@openmat/shared/types';

import { requireCoachSession } from '@/lib/auth/session';
import { permissions } from '@/lib/auth/permissions';
import { getCoachWebData } from '@/lib/data';
import { recordAudit } from '@/lib/audit';

export async function checkInAction(formData: FormData) {
  const session = await requireCoachSession();
  if (!permissions.canManageClasses(session.user)) {
    throw new Error('Not authorized for check-in.');
  }

  const classId = String(formData.get('classId') ?? '');
  const memberId = String(formData.get('memberId') ?? '') || null;
  const memberName = String(formData.get('memberName') ?? '');
  const status = String(formData.get('status') ?? 'present') as Extract<
    AttendanceStatus,
    'present' | 'late' | 'visitor' | 'walk_in'
  >;
  const isFirstVisit = formData.get('isFirstVisit') === 'on';

  const data = getCoachWebData();
  const existing = await data.attendance.listByClass(classId);
  const duplicate = existing.find(
    (item) =>
      (memberId && item.memberId === memberId && (item.status === 'present' || item.status === 'late')) ||
      (!memberId &&
        item.memberName.toLowerCase() === memberName.toLowerCase() &&
        (item.status === 'present' || item.status === 'late')),
  );
  if (duplicate) {
    throw new Error('Duplicate check-in prevented.');
  }

  await data.attendance.checkIn({
    classId,
    memberId,
    memberName,
    status,
    isFirstVisit,
  });

  revalidatePath(`/schedule/${classId}`);
  revalidatePath('/check-in');
}

export async function updateAttendanceStatusAction(formData: FormData) {
  const session = await requireCoachSession();
  if (!permissions.canManageClasses(session.user)) {
    throw new Error('Not authorized.');
  }
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status')) as AttendanceStatus;
  const classId = String(formData.get('classId') ?? '');
  const data = getCoachWebData();
  await data.attendance.updateStatus(id, status);
  revalidatePath(`/schedule/${classId}`);
  revalidatePath('/check-in');
}

export async function cancelClassAction(formData: FormData) {
  const session = await requireCoachSession();
  if (!permissions.canManageClasses(session.user)) {
    throw new Error('Not authorized.');
  }
  const classId = String(formData.get('classId') ?? '');
  const data = getCoachWebData();
  await data.classes.cancel(classId);
  await recordAudit({
    academyId: session.academyId,
    actorId: session.user.id,
    actorName: session.user.fullName ?? 'Coach',
    action: 'class_cancellation',
    targetType: 'class',
    targetId: classId,
    previous: { status: 'scheduled' },
    next: { status: 'cancelled' },
  });
  redirect('/schedule');
}

export async function createClassAction(formData: FormData) {
  const session = await requireCoachSession();
  if (!permissions.canManageClasses(session.user)) {
    throw new Error('Not authorized.');
  }
  const data = getCoachWebData();
  const created = await data.classes.create(
    {
      title: String(formData.get('title') ?? ''),
      description: String(formData.get('description') ?? ''),
      date: String(formData.get('date') ?? ''),
      startTime: String(formData.get('startTime') ?? ''),
      endTime: String(formData.get('endTime') ?? ''),
      instructorName: String(formData.get('instructorName') ?? session.user.fullName ?? 'Coach'),
      giType: String(formData.get('giType') ?? 'gi') as 'gi' | 'no_gi',
      level: String(formData.get('level') ?? 'fundamentals') as
        | 'kids'
        | 'fundamentals'
        | 'advanced'
        | 'competition'
        | 'open_mat'
        | 'seminar',
      audience: String(formData.get('audience') ?? 'adults') as
        | 'kids'
        | 'adults'
        | 'all',
      capacity: Number(formData.get('capacity') ?? 20),
      recurrence: String(formData.get('recurrence') ?? 'none') as
        | 'none'
        | 'daily'
        | 'weekly'
        | 'biweekly',
      isOpenMat: formData.get('isOpenMat') === 'on',
    },
    { instructorId: session.user.id, academyId: session.academyId },
  );
  redirect(`/schedule/${created.id}`);
}
