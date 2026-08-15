import { isDemoMode } from '@/lib/auth/permissions';
import { createMemoryTenantDirectory, getTenantDirectory } from '@/lib/data/tenantDirectory';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isSupabasePublicConfigured } from '@/lib/supabase/env';

export type MetricValue =
  | { available: true; value: number }
  | { available: false; reason: string };

export interface OverviewMetrics {
  organizations: MetricValue;
  academies: MetricValue;
  locations: MetricValue;
  practitioners: MetricValue;
  coaches: MetricValue;
  activeAcademies: MetricValue;
  trialAcademies: MetricValue;
  weeklyActiveUsers: MetricValue;
  monthlyActiveUsers: MetricValue;
  mrr: MetricValue;
  arr: MetricValue;
}

const UNAVAILABLE_ENGAGEMENT =
  'Engagement events are not instrumented yet. WAU/MAU will appear once activity events are recorded.';
const UNAVAILABLE_BILLING =
  'Billing provider is not connected. MRR/ARR stay unavailable until real subscription charges exist.';

function num(n: number): MetricValue {
  return { available: true, value: n };
}

function unavailable(reason: string): MetricValue {
  return { available: false, reason };
}

async function demoOverviewMetrics(): Promise<OverviewMetrics> {
  const directory = createMemoryTenantDirectory();
  const orgs = await directory.listOrganizations();
  const academies = (
    await Promise.all(orgs.map((org) => directory.listAcademiesByOrg(org.id)))
  ).flat();
  const locations = (
    await Promise.all(
      academies.map((academy) => directory.listLocationsByAcademy(academy.id)),
    )
  ).flat();
  const memberships = (
    await Promise.all(
      academies.map((academy) => directory.listMembershipsByAcademy(academy.id)),
    )
  ).flat();

  const practitioners = memberships.filter((m) => m.role === 'member').length;
  const coaches = memberships.filter((m) =>
    ['coach', 'manager', 'owner', 'admin', 'staff'].includes(m.role),
  ).length;
  const activeAcademies = academies.filter((a) => a.status === 'active').length;

  return {
    organizations: num(orgs.length),
    academies: num(academies.length),
    locations: num(locations.length),
    practitioners: num(practitioners),
    coaches: num(coaches),
    activeAcademies: num(activeAcademies),
    trialAcademies: unavailable(
      'Subscription rows not loaded in demo memory. Apply operations migration for trial counts.',
    ),
    weeklyActiveUsers: unavailable(UNAVAILABLE_ENGAGEMENT),
    monthlyActiveUsers: unavailable(UNAVAILABLE_ENGAGEMENT),
    mrr: unavailable(UNAVAILABLE_BILLING),
    arr: unavailable(UNAVAILABLE_BILLING),
  };
}

async function liveOverviewMetrics(): Promise<OverviewMetrics> {
  const client = await createSupabaseServerClient();

  const [
    orgs,
    academies,
    locations,
    members,
    coaches,
    activeAcademies,
    trials,
  ] = await Promise.all([
    client.from('organizations').select('id', { count: 'exact', head: true }),
    client.from('academies').select('id', { count: 'exact', head: true }),
    client.from('locations').select('id', { count: 'exact', head: true }),
    client
      .from('academy_memberships')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'member'),
    client
      .from('academy_memberships')
      .select('id', { count: 'exact', head: true })
      .in('role', ['coach', 'manager', 'owner', 'admin', 'staff']),
    client
      .from('academies')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active'),
    client
      .from('academy_subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'trial'),
  ]);

  const trialMetric = trials.error
    ? unavailable(
        'academy_subscriptions not available yet. Apply scripts/apply-command-center-operations.sql.',
      )
    : num(trials.count ?? 0);

  return {
    organizations: num(orgs.count ?? 0),
    academies: num(academies.count ?? 0),
    locations: num(locations.count ?? 0),
    practitioners: num(members.count ?? 0),
    coaches: num(coaches.count ?? 0),
    activeAcademies: num(activeAcademies.count ?? 0),
    trialAcademies: trialMetric,
    weeklyActiveUsers: unavailable(UNAVAILABLE_ENGAGEMENT),
    monthlyActiveUsers: unavailable(UNAVAILABLE_ENGAGEMENT),
    mrr: unavailable(UNAVAILABLE_BILLING),
    arr: unavailable(UNAVAILABLE_BILLING),
  };
}

export async function getOverviewMetrics(): Promise<OverviewMetrics> {
  if (isDemoMode() || !isSupabasePublicConfigured()) {
    return demoOverviewMetrics();
  }
  return liveOverviewMetrics();
}

export async function listAcademiesSummary() {
  if (isDemoMode()) {
    const directory = await getTenantDirectory();
    const orgs = await directory.listOrganizations();
    const rows = [];
    for (const org of orgs) {
      const academies = await directory.listAcademiesByOrg(org.id);
      for (const academy of academies) {
        rows.push({
          id: academy.id,
          name: academy.name,
          organizationId: org.id,
          organizationName: org.name,
          status: academy.status,
          slug: academy.slug,
        });
      }
    }
    return rows;
  }

  const client = await createSupabaseServerClient();
  const { data, error } = await client
    .from('academies')
    .select('id, name, organization_id, status, slug, organizations(name)')
    .order('name');
  if (error) throw error;
  return (data ?? []).map((row) => {
    const org = row.organizations as { name?: string } | null;
    return {
      id: String(row.id),
      name: String(row.name),
      organizationId: String(row.organization_id),
      organizationName: org?.name ?? String(row.organization_id),
      status: String(row.status),
      slug: row.slug == null ? null : String(row.slug),
    };
  });
}
