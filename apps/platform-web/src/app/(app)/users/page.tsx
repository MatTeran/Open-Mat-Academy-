import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='People'
      title='Users'
      description='Search practitioners and staff across academies without exposing private journals.'
      reasons={[
    'User directory aggregates academy_memberships + auth profiles.',
    'Private coach notes and practitioner journals stay out of Command Center.'
  ]}
    />
  );
}
