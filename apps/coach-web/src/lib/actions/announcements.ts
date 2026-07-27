'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import type {
  AnnouncementAudience,
  AnnouncementCategory,
} from '@openmat/shared/types';

import { requireCoachSession } from '@/lib/auth/session';
import { permissions } from '@/lib/auth/permissions';
import { getCoachWebData } from '@/lib/data';
import { recordAudit } from '@/lib/audit';

export async function createAnnouncementAction(formData: FormData) {
  const session = await requireCoachSession();
  if (!permissions.canPublishAnnouncements(session.user)) {
    throw new Error('Not authorized.');
  }
  const data = getCoachWebData();
  const publish = formData.get('publish') === 'on';
  const created = await data.announcements.create(
    {
      title: String(formData.get('title') ?? ''),
      body: String(formData.get('body') ?? ''),
      category: String(formData.get('category') ?? 'general') as AnnouncementCategory,
      audience: String(formData.get('audience') ?? 'all') as AnnouncementAudience,
      scheduledAt: String(formData.get('scheduledAt') ?? '') || null,
      publish,
      pushEnabled: formData.get('pushEnabled') === 'on',
    },
    {
      id: session.user.id,
      name: session.user.fullName ?? 'Coach',
      academyId: session.academyId,
    },
  );
  if (publish) {
    await recordAudit({
      academyId: session.academyId,
      actorId: session.user.id,
      actorName: session.user.fullName ?? 'Coach',
      action: 'announcement_publish',
      targetType: 'announcement',
      targetId: created.id,
      previous: { status: 'draft' },
      next: { status: 'published' },
    });
  }
  redirect('/announcements');
}

export async function publishAnnouncementAction(formData: FormData) {
  const session = await requireCoachSession();
  if (!permissions.canPublishAnnouncements(session.user)) {
    throw new Error('Not authorized.');
  }
  const id = String(formData.get('id') ?? '');
  const data = getCoachWebData();
  await data.announcements.publish(id);
  await recordAudit({
    academyId: session.academyId,
    actorId: session.user.id,
    actorName: session.user.fullName ?? 'Coach',
    action: 'announcement_publish',
    targetType: 'announcement',
    targetId: id,
    previous: { status: 'draft' },
    next: { status: 'published' },
  });
  revalidatePath('/announcements');
}

export async function archiveAnnouncementAction(formData: FormData) {
  const session = await requireCoachSession();
  if (!permissions.canPublishAnnouncements(session.user)) {
    throw new Error('Not authorized.');
  }
  const id = String(formData.get('id') ?? '');
  const data = getCoachWebData();
  await data.announcements.update(id, { status: 'archived' });
  revalidatePath('/announcements');
}
