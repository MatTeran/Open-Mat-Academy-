'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requirePlatformSession } from '@/lib/auth/session';
import { isDemoMode } from '@/lib/auth/permissions';
import { getTenantDirectory } from '@/lib/data/tenantDirectory';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function provisionAcademyAction(formData: FormData) {
  const session = await requirePlatformSession();
  if (!session.canMutateTenants) {
    throw new Error('Support role cannot provision academies.');
  }

  const createOrg = String(formData.get('createOrg') ?? 'true') === 'true';
  const organizationName = String(formData.get('organizationName') ?? '').trim();
  const organizationSlug =
    String(formData.get('organizationSlug') ?? '').trim() ||
    slugify(organizationName);
  const existingOrgId = String(formData.get('organizationId') ?? '').trim();
  const academyName = String(formData.get('academyName') ?? '').trim();
  const academySlug =
    String(formData.get('academySlug') ?? '').trim() || slugify(academyName);
  const locationName = String(formData.get('locationName') ?? '').trim();
  const address = String(formData.get('addressLine1') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  const state = String(formData.get('state') ?? '').trim();
  const postal = String(formData.get('postalCode') ?? '').trim();
  const country = String(formData.get('country') ?? 'United States').trim();
  const timezone = String(formData.get('timezone') ?? 'America/Los_Angeles').trim();
  const ownerUserId = String(formData.get('ownerUserId') ?? '').trim();
  const ownerEmail = String(formData.get('ownerEmail') ?? '').trim();
  const planId = String(formData.get('planId') ?? 'trial').trim() || 'trial';

  if (!academyName || !locationName) {
    throw new Error('Academy and location names are required.');
  }
  if (createOrg && !organizationName) {
    throw new Error('Organization name is required.');
  }
  if (!createOrg && !existingOrgId) {
    throw new Error('Select an existing organization.');
  }

  const orgId = createOrg ? `org-${organizationSlug}` : existingOrgId;
  const academyId = `academy-${academySlug}`;
  const locationId = `location-${academySlug}-main`;

  if (isDemoMode()) {
    const directory = await getTenantDirectory();
    if (createOrg) {
      await directory.createOrganization({
        id: orgId,
        name: organizationName,
        slug: organizationSlug,
      });
    }
    await directory.createAcademy({
      id: academyId,
      name: academyName,
      organizationId: orgId,
      slug: academySlug,
    });
    // Demo memory location write via assign path — extend memory for location create
    const mem = directory as unknown as {
      createLocation?: (input: Record<string, unknown>) => Promise<unknown>;
    };
    if (typeof mem.createLocation === 'function') {
      await mem.createLocation({
        id: locationId,
        academyId,
        name: locationName,
        addressLine1: address,
        city,
        state,
        postalCode: postal,
        country,
        timezone,
      });
    }
    if (ownerUserId) {
      await directory.assignAcademyOwner({ academyId, userId: ownerUserId });
    }
    revalidatePath('/overview');
    revalidatePath('/academies');
    revalidatePath('/onboarding');
    redirect(`/academies/${academyId}?provisioned=1`);
  }

  const client = await createSupabaseServerClient();

  // Resolve owner by email if UUID not provided
  let ownerId = ownerUserId;
  if (!ownerId && ownerEmail) {
    // Platform cannot list auth users with anon key; require UUID for live until invite service exists
    throw new Error(
      'Live provisioning currently requires an existing auth user UUID for the owner. Invite-by-email lands next.',
    );
  }
  if (!ownerId) {
    throw new Error('Owner user id is required for live provisioning.');
  }

  const { data, error } = await client.rpc('provision_academy', {
    p_create_org: createOrg,
    p_organization_id: orgId,
    p_organization_name: organizationName || null,
    p_organization_slug: organizationSlug || null,
    p_academy_id: academyId,
    p_academy_name: academyName,
    p_academy_slug: academySlug,
    p_location_id: locationId,
    p_location_name: locationName,
    p_address_line_1: address || null,
    p_city: city || null,
    p_state: state || null,
    p_postal_code: postal || null,
    p_country: country,
    p_timezone: timezone,
    p_owner_user_id: ownerId,
    p_plan_id: planId,
  });

  if (error) {
    throw new Error(error.message);
  }

  const result = data as { academy_id?: string } | null;
  revalidatePath('/overview');
  revalidatePath('/academies');
  revalidatePath('/onboarding');
  redirect(`/academies/${result?.academy_id ?? academyId}?provisioned=1`);
}
