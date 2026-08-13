import type {
  Academy,
  AcademyMembership,
  Location,
  Organization,
} from '@openmat/shared/types';

export function mapOrganization(row: Record<string, unknown>): Organization {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    status: row.status as Organization['status'],
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function mapAcademy(row: Record<string, unknown>): Academy {
  return {
    id: String(row.id),
    name: String(row.name),
    organizationId: String(row.organization_id),
    slug: row.slug == null ? null : String(row.slug),
    status: row.status as Academy['status'],
    primaryLocationId:
      row.primary_location_id == null
        ? null
        : String(row.primary_location_id),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function mapLocation(row: Record<string, unknown>): Location {
  return {
    id: String(row.id),
    academyId: String(row.academy_id),
    name: String(row.name),
    addressLine1: row.address_line_1 == null ? null : String(row.address_line_1),
    addressLine2: row.address_line_2 == null ? null : String(row.address_line_2),
    city: row.city == null ? null : String(row.city),
    state: row.state == null ? null : String(row.state),
    postalCode: row.postal_code == null ? null : String(row.postal_code),
    country: String(row.country ?? 'United States'),
    timezone: String(row.timezone ?? 'America/Los_Angeles'),
    latitude: row.latitude == null ? null : Number(row.latitude),
    longitude: row.longitude == null ? null : Number(row.longitude),
    isActive: Boolean(row.is_active),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function mapMembership(row: Record<string, unknown>): AcademyMembership {
  return {
    id: String(row.id),
    academyId: String(row.academy_id),
    userId: String(row.user_id),
    role: row.role as AcademyMembership['role'],
    createdAt: String(row.created_at),
  };
}
