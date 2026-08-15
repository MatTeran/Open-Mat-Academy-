import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='Platform'
      title='Content'
      description='Platform-level content operations.'
      reasons={[
    'Keep academy curriculum ownership in academy apps; this is platform ops only.'
  ]}
    />
  );
}
