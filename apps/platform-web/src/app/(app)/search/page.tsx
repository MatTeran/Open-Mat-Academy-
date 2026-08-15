import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='My Gi'
      title='Search'
      description='Global search across orgs, academies, locations, and users.'
      reasons={[
    'Results always require platform-admin session.'
  ]}
    />
  );
}
