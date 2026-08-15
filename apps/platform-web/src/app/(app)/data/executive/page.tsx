import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='Data'
      title='Executive'
      description='Company-level KPIs and growth charts.'
      reasons={[
    'Counts come from tenant tables; WAU/MAU/MRR marked unavailable until events/billing exist.'
  ]}
    />
  );
}
