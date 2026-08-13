'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requirePlatformSession } from '@/lib/auth/session';
import { getTenantDirectory } from '@/lib/data/tenantDirectory';

function requireMutate(canMutate: boolean) {
  if (!canMutate) {
    throw new Error('Support role is read-only for tenant mutations.');
  }
}

export async function createOrganizationAction(formData: FormData) {
  const session = await requirePlatformSession();
  requireMutate(session.canMutateTenants);

  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();
  if (!name || !slug) {
    throw new Error('Name and slug are required.');
  }

  const id = `org-${slug}`;
  const directory = await getTenantDirectory();
  const org = await directory.createOrganization({ id, name, slug });
  revalidatePath('/orgs');
  redirect(`/orgs/${org.id}`);
}

export async function createAcademyAction(formData: FormData) {
  const session = await requirePlatformSession();
  requireMutate(session.canMutateTenants);

  const organizationId = String(formData.get('organizationId') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();
  if (!organizationId || !name || !slug) {
    throw new Error('Organization, name, and slug are required.');
  }

  const directory = await getTenantDirectory();
  const academy = await directory.createAcademy({
    id: `academy-${slug}`,
    name,
    organizationId,
    slug,
  });
  revalidatePath(`/orgs/${organizationId}`);
  redirect(`/academies/${academy.id}`);
}

export async function assignOwnerAction(formData: FormData) {
  const session = await requirePlatformSession();
  requireMutate(session.canMutateTenants);

  const academyId = String(formData.get('academyId') ?? '').trim();
  const userId = String(formData.get('userId') ?? '').trim();
  if (!academyId || !userId) {
    throw new Error('Academy and user id are required.');
  }

  const directory = await getTenantDirectory();
  await directory.assignAcademyOwner({ academyId, userId });
  revalidatePath(`/academies/${academyId}`);
}
