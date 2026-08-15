import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='Data'
      title='Onboarding Funnel'
      description='Conversion and drop-off across onboarding stages.'
      reasons={[
    'Powered by academy_onboarding + milestones after operations migration.'
  ]}
    />
  );
}
