import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='Business'
      title='Subscriptions'
      description='Academy plan and subscription status.'
      reasons={[
    'Requires academy_subscriptions from operations migration.',
    'MRR stays unavailable until Stripe (or another provider) is connected.'
  ]}
    />
  );
}
