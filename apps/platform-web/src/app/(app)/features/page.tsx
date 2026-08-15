import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='Platform'
      title='Features'
      description='Global, plan-default, and academy feature entitlements.'
      reasons={[
    'Resolver must never rely on hidden UI alone.'
  ]}
    />
  );
}
