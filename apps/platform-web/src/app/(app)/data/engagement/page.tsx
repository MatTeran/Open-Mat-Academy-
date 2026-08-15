import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='Data'
      title='Engagement'
      description='Training and coaching engagement across the platform.'
      reasons={[
    'Needs activity event instrumentation before charts can populate.'
  ]}
    />
  );
}
