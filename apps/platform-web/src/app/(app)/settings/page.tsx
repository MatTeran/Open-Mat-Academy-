import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='Account'
      title='Settings'
      description='Operator preferences for Command Center.'
      reasons={[
    'Session and notification preferences.'
  ]}
    />
  );
}
