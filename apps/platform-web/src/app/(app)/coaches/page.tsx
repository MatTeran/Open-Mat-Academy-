import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='People'
      title='Coaches'
      description='Coach-tier memberships across the network.'
      reasons={[
    'Filters by academy and coach-tier roles from academy_memberships.'
  ]}
    />
  );
}
