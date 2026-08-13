/** My Gi Command Center platform operator roles (not academy roles). */
export type PlatformAdminRole = 'superadmin' | 'ops' | 'support';

export interface PlatformAdmin {
  userId: string;
  role: PlatformAdminRole;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformSessionContext {
  userId: string;
  email: string;
  fullName: string;
  platformRole: PlatformAdminRole;
}
