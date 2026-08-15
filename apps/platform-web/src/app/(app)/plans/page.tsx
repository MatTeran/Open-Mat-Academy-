import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='Business'
      title='Plans'
      description='Central plan catalog for My Gi.'
      reasons={[
    'platform_plans seed: trial, starter, professional, academy_plus, enterprise.'
  ]}
    />
  );
}
