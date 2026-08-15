import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='Platform'
      title='Notifications'
      description='Internal operational alerts for My Gi staff.'
      reasons={[
    'platform_notifications table; prioritize actionable events only.'
  ]}
    />
  );
}
