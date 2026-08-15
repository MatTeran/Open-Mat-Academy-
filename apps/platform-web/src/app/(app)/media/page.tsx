import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='Platform'
      title='Media'
      description='Academy branding and media assets.'
      reasons={[
    'Uses media_assets + academy-branding / academy-media storage buckets.'
  ]}
    />
  );
}
