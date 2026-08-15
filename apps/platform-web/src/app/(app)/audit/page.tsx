import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='Operations'
      title='Audit Logs'
      description='Sensitive platform-admin actions.'
      reasons={[
    'platform_audit_logs — distinct from coach audit_logs.'
  ]}
    />
  );
}
