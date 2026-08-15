import type { SupabaseClient } from '@supabase/supabase-js';

import type { TenantDirectory } from './tenantDirectory';
import {
  mapAcademy,
  mapLocation,
  mapMembership,
  mapOrganization,
} from './mappers';

export function createSupabaseTenantDirectory(
  client: SupabaseClient,
): TenantDirectory {
  return {
    async listOrganizations() {
      const { data, error } = await client
        .from('organizations')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data ?? []).map((row) =>
        mapOrganization(row as Record<string, unknown>),
      );
    },
    async getOrganization(id) {
      const { data, error } = await client
        .from('organizations')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data
        ? mapOrganization(data as Record<string, unknown>)
        : null;
    },
    async listAcademiesByOrg(orgId) {
      const { data, error } = await client
        .from('academies')
        .select('*')
        .eq('organization_id', orgId)
        .order('name');
      if (error) throw error;
      return (data ?? []).map((row) =>
        mapAcademy(row as Record<string, unknown>),
      );
    },
    async getAcademy(id) {
      const { data, error } = await client
        .from('academies')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data ? mapAcademy(data as Record<string, unknown>) : null;
    },
    async listLocationsByAcademy(academyId) {
      const { data, error } = await client
        .from('locations')
        .select('*')
        .eq('academy_id', academyId)
        .order('name');
      if (error) throw error;
      return (data ?? []).map((row) =>
        mapLocation(row as Record<string, unknown>),
      );
    },
    async listMembershipsByAcademy(academyId) {
      const { data, error } = await client
        .from('academy_memberships')
        .select('*')
        .eq('academy_id', academyId)
        .order('role');
      if (error) throw error;
      return (data ?? []).map((row) =>
        mapMembership(row as Record<string, unknown>),
      );
    },
    async createOrganization(input) {
      const { data, error } = await client
        .from('organizations')
        .upsert(
          {
            id: input.id,
            name: input.name,
            slug: input.slug,
            status: input.status ?? 'active',
          },
          { onConflict: 'id' },
        )
        .select('*')
        .single();
      if (error) throw error;
      return mapOrganization(data as Record<string, unknown>);
    },
    async createAcademy(input) {
      const { data, error } = await client
        .from('academies')
        .upsert(
          {
            id: input.id,
            name: input.name,
            organization_id: input.organizationId,
            slug: input.slug,
            status: 'active',
          },
          { onConflict: 'id' },
        )
        .select('*')
        .single();
      if (error) throw error;
      return mapAcademy(data as Record<string, unknown>);
    },
    async createLocation(input) {
      const { data, error } = await client
        .from('locations')
        .upsert(
          {
            id: input.id,
            academy_id: input.academyId,
            name: input.name,
            address_line_1: input.addressLine1 ?? null,
            city: input.city ?? null,
            state: input.state ?? null,
            postal_code: input.postalCode ?? null,
            country: input.country ?? 'United States',
            timezone: input.timezone ?? 'America/Los_Angeles',
            is_active: true,
          },
          { onConflict: 'id' },
        )
        .select('*')
        .single();
      if (error) throw error;
      return mapLocation(data as Record<string, unknown>);
    },
    async assignAcademyOwner(input) {
      const { data: existing, error: readError } = await client
        .from('academy_memberships')
        .select('*')
        .eq('academy_id', input.academyId)
        .eq('user_id', input.userId)
        .maybeSingle();
      if (readError) throw readError;

      if (existing) {
        const { data, error } = await client
          .from('academy_memberships')
          .update({ role: 'owner' })
          .eq('id', existing.id)
          .select('*')
          .single();
        if (error) throw error;
        return mapMembership(data as Record<string, unknown>);
      }

      const { data, error } = await client
        .from('academy_memberships')
        .insert({
          academy_id: input.academyId,
          user_id: input.userId,
          role: 'owner',
        })
        .select('*')
        .single();
      if (error) throw error;
      return mapMembership(data as Record<string, unknown>);
    },
  };
}
