'use server';

import { redirect } from 'next/navigation';

import type { BeltRank, BeltStripeCount } from '@openmat/shared/types';

import { requireCoachSession } from '@/lib/auth/session';
import { permissions } from '@/lib/auth/permissions';
import { getCoachWebData } from '@/lib/data';
import { recordAudit } from '@/lib/audit';

export async function addStripeAction(formData: FormData) {
  const session = await requireCoachSession();
  if (!permissions.canEditMemberDevelopment(session.user)) {
    throw new Error('Not authorized to add stripes.');
  }

  const memberId = String(formData.get('memberId') ?? '');
  const fromStripe = Number(formData.get('fromStripe')) as BeltStripeCount;
  const toStripe = Number(formData.get('toStripe')) as BeltStripeCount;
  const date = String(formData.get('date') ?? '');
  const notes = String(formData.get('notes') ?? '');

  const data = getCoachWebData();
  await data.development.addStripe(
    { memberId, fromStripe, toStripe, date, notes },
    {
      id: session.user.id,
      name: session.user.fullName ?? 'Coach',
      academyId: session.academyId,
    },
  );

  await recordAudit({
    academyId: session.academyId,
    actorId: session.user.id,
    actorName: session.user.fullName ?? 'Coach',
    action: 'stripe_promotion',
    targetType: 'member',
    targetId: memberId,
    previous: { stripes: fromStripe },
    next: { stripes: toStripe, date },
  });

  redirect(`/members/${memberId}?tab=development`);
}

export async function promoteBeltAction(formData: FormData) {
  const session = await requireCoachSession();
  if (!permissions.canEditMemberDevelopment(session.user)) {
    throw new Error('Not authorized to promote belts.');
  }

  const memberId = String(formData.get('memberId') ?? '');
  const fromBelt = String(formData.get('fromBelt')) as BeltRank;
  const toBelt = String(formData.get('toBelt')) as BeltRank;
  const date = String(formData.get('date') ?? '');
  const notes = String(formData.get('notes') ?? '');
  const notifyMember = formData.get('notifyMember') === 'on';
  const createAchievement = formData.get('createAchievement') === 'on';
  const postToCommunity = formData.get('postToCommunity') === 'on';
  const generateShareCard = formData.get('generateShareCard') === 'on';

  const data = getCoachWebData();
  await data.development.promoteBelt(
    {
      memberId,
      fromBelt,
      toBelt,
      date,
      notes,
      notifyMember,
      createAchievement,
      postToCommunity,
      generateShareCard,
    },
    {
      id: session.user.id,
      name: session.user.fullName ?? 'Coach',
      academyId: session.academyId,
    },
  );

  await recordAudit({
    academyId: session.academyId,
    actorId: session.user.id,
    actorName: session.user.fullName ?? 'Coach',
    action: 'belt_promotion',
    targetType: 'member',
    targetId: memberId,
    previous: { belt: fromBelt },
    next: { belt: toBelt, date, notifyMember, createAchievement, postToCommunity },
  });

  redirect(`/members/${memberId}?tab=development`);
}
