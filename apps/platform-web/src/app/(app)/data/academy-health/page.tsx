import { OpsPlaceholderPage } from '@/components/ui/OpsPlaceholder';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function Page() {
  await requirePlatformSession();
  return (
    <OpsPlaceholderPage
      eyebrow='Data'
      title='Academy Health'
      description='Health scores and academies needing attention.'
      reasons={[
    'Health-score service weights are configurable; do not treat as scientifically validated.'
  ]}
    />
  );
}
