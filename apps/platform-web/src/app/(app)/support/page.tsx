import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='Operations'
      title='Support'
      description='Internal support cases and staff-only notes.'
      reasons={[
    'Never mix with practitioner journals.'
  ]}
    />
  );
}
