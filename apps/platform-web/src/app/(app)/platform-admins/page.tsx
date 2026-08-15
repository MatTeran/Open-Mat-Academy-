import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='People'
      title='Platform Admins'
      description='Manage My Gi platform operator allowlist (never academy roles).'
      reasons={[
    'Writes restricted to superadmin; all changes audited.'
  ]}
    />
  );
}
