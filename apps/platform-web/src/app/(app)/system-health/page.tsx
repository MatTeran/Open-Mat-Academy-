import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='Operations'
      title='System Health'
      description='Connectivity and operational readiness checks.'
      reasons={[
    'Never expose credentials or service-role material.'
  ]}
    />
  );
}
